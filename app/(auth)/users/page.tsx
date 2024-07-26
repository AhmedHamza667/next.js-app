"use client";
import Navbar from "@/app/(conponants)/NavBar";
import React, { useEffect, useState } from "react";
import { GET_ALL_USER } from "@/app/(queries)/queries";
import { useMutation, useQuery } from "@apollo/client";
import { ADD_USER } from "@/app/(queries)/queries";
import {
  Box,
  Button,
  IconButton,
  InputBase,
  MenuItem,
  Pagination,
  PaginationItem,
  Skeleton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Modal,
  Typography,
  Avatar,
} from "@mui/material";
import Paper from "@mui/material/Paper";
import { parseCookies } from "nookies";
import { useRouter, useSearchParams } from "next/navigation";
import { CameraAlt, FilterList, Search } from "@mui/icons-material";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import UserTable from "@/app/(conponants)/UserTable";
function Users() {
  const router = useRouter();
  const cookies = parseCookies();
  const token = cookies.accessToken;
  const searchParams = useSearchParams();
  const searchParam = searchParams.get("search");
  const pageNum = searchParams.get("page");

  const page = pageNum || 1;

  const [offset, setOffset] = useState((page - 1) * 10);
  const [search, setSearch] = useState(searchParam);
  const [open, setOpen] = useState(false);
  const [createUser] = useMutation(ADD_USER);
  const [newUser, setNewUser] = useState({
    firstName: "",
    lastName: "",
    email: "",
    role: "",
  });

  const schema = z.object({
    firstName: z.string().nonempty({ message: "First Name is required" }),
    lastName: z.string().nonempty({ message: "Last Name is required" }),
    email: z.string().email({ message: "Enter a valid email address" }),
    role: z.string().nonempty({ message: "Role is required" }),
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
    getValues,
  } = useForm({
    resolver: zodResolver(schema),
  });

  const handleSearchChange = (event) => {
    setSearch(event.target.value);
    router.push(`/users?search=${event.target.value}&page=${page}`);
  };

  const { loading, error, data, refetch } = useQuery(GET_ALL_USER, {
    variables: {
      search,
      filter: {},
      sort: {
        _id: -1,
      },
      limit: 10,
      offset,
      getAllUserCountSearch2: search || null,
      getAllUserCountFilter2: {},
    },
    context: {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  });
  useEffect(() => {
    refetch();
  }, [offset, refetch]);

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      refetch();
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [search, refetch]);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };
  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setNewUser({ ...newUser, [name]: value });
  };
  const handleAddUser = async(data) => {
    try {
      const { firstName, lastName, email, role } = data;
      await createUser({
        variables: {
          input: {
            firstName,
            lastName,
            email,
            role,
          },
        },
        context: {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      });
      handleClose();
    } catch (error) {
      console.error("Error creating user:", error);
    }
  };

  if (error) return <p>Error: {error.message}</p>;

  const { getAllUser = [], getAllUserCount = 0 } = data || {};
  const handleChange = (event: React.ChangeEvent<unknown>, value: number) => {
    const newOffset = (value - 1) * 10;
    setOffset(newOffset);
    router.push(`/users?page=${value}`);
  };
  return (
    <div>
      <Box
        sx={{ display: "flex", justifyContent: "space-between", mt: 4, mx: 12 }}
      >
        <p>Total: {getAllUserCount}</p>
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              backgroundColor: "#2C3757",
              borderRadius: "20px",
              py: "2px",
              px: 2,
              color: "white",
              width: "55vh",
            }}
          >
            <Search sx={{ ml: 1 }} />
            <InputBase
              onChange={handleSearchChange}
              placeholder="Search"
              value={search}
              sx={{
                mx: 1,
                flex: 1,
                color: "white",
                "&::placeholder": { color: "white" },
              }}
            />
            <IconButton sx={{ color: "white", mr: 1 }}>
              <FilterList />
            </IconButton>
          </Box>
          <Button
            variant="contained"
            onClick={handleOpen}
            sx={{
              backgroundColor: "#0060D1",
              color: "white",
              padding: "0.5em 1em",
              borderRadius: "10px",
              textTransform: "none",
              "&:hover": { backgroundColor: "#004BB5" },
            }}
          >
            + Add User
          </Button>
        </Box>
      </Box>
      {loading ?  
      <>
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh", // Adjust the height as needed
        }}
      >
        <Skeleton
          variant="rectangular"
          sx={{
            width: "80%",
            height: "90%",
            backgroundColor: "#0D1A3B",
            mt: 10,
          }}
        />
      </Box>
    </> :
    <UserTable
        users={getAllUser}
        userCount={getAllUserCount}
        page={page}
        handleChange={handleChange}
      />}
     
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-title"
        aria-describedby="modal-description"
      >
        <Box
          sx={{
            position: "absolute",
            right: 0,
            top: 0,
            width: "50%",
            height: "100%",
            bgcolor: "background.paper",
            boxShadow: 24,
            display: "flex",
            flexDirection: "column",
          }}
        >
          <Box
            sx={{
              backgroundColor: "#0D1A3B",
              height: "84px",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              px: 4,
            }}
          >
            <Typography
              id="modal-title"
              variant="h6"
              component="h2"
              sx={{ color: "white" }}
            >
              Add User
            </Typography>
            <Typography
              id="modal-title"
              variant="h6"
              component="h2"
              sx={{ color: "white", cursor: "pointer" }}
              onClick={handleClose}
            >
              X
            </Typography>
          </Box>
          <Box sx={{p:4}}>
            <Avatar
              sx={{
                width: 156,
                height: 156,
              }}
            />
            <IconButton
              sx={{
                position: "relative",
                bottom: "50px",
                left: "120px",
                backgroundColor: "#0060D1",
                border: "1px solid #ccc",
              }}
            >
              <CameraAlt sx={{ color: "white" }} />
            </IconButton>

            </Box>
          <Box
            component="form"
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              px: 4,
            }}
            noValidate
            autoComplete="off"
          >
           
            <Box
              sx={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-between",
                width: "100%",
                mb: 2,
              }}
            >
              <TextField
                required
                id="firstName"
                label="First Name"
                name="firstName"
                {...register("firstName")}
                error={!!errors.firstName}
                helperText={errors.firstName?.message}
                sx={{ width: "48%" }}
              />
              <TextField
                required
                id="lastName"
                label="Last Name"
                name="lastName"
                {...register("lastName")}
                error={!!errors.lastName}
                helperText={errors.lastName?.message}
                sx={{ width: "48%" }}
              />
            </Box>
            <Box
              sx={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-between",
                width: "100%",
                mb: 2,
              }}
            >
              <TextField
                required
                id="email"
                label="Email"
                name="email"
                {...register("email")}
                error={!!errors.email}
                helperText={errors.email?.message}
                sx={{ width: "48%" }}
              />
              <TextField
                required
                id="role"
                label="Role"
                name="role"
                select
                {...register("role")}
                error={!!errors.role}
                helperText={errors.role?.message}
                sx={{ width: "48%" }}
              >
                <MenuItem value="ADMIN">Admin</MenuItem>
                <MenuItem value="HR">HR Personnel</MenuItem>
                <MenuItem value="HIRING_MANAGER">Hiring Manager</MenuItem>
              </TextField>
            </Box>
            <Box
              sx={{
                display: "flex",
                justifyContent: "flex-end",
                mt: 3,
                alignContent: "flex-end",
                width: "100%",
                borderTop: "1px solid rgb(236, 236, 236)",
                position: "absolute",
                bottom: 0,
              }}
            >
              <Button onClick={handleClose} variant="outlined" sx={{m:1, py:1, width:'23%', borderRadius: '10px', color:'black', borderColor:'black'}}>
                Cancel
              </Button>
              <Button onClick={handleSubmit(handleAddUser)} variant="contained" sx={{m:1, py:1, width:'23%', borderRadius: '10px', backgroundColor: "#0060D1",}}>
                Save
              </Button>
            </Box>
          </Box>
        </Box>
      </Modal>
    </div>
  );
}

export default Users;
