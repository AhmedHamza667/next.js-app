"use client";
import React, { useEffect, useRef, useState } from "react";
import { GET_ALL_USER } from "@/app/(queries)/queries";
import { useMutation, useQuery } from "@apollo/client";
import { ADD_USER, UPDATE_USER, GET_SIGNED_URL } from "@/app/(queries)/queries";
import {
  Box,
  Button,
  IconButton,
  InputBase,
  MenuItem,
  Modal,
  TextField,
  Typography,
  Avatar,
  Skeleton,
} from "@mui/material";
import { parseCookies } from "nookies";
import { useRouter, useSearchParams } from "next/navigation";
import { CameraAlt, FilterList, Search } from "@mui/icons-material";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import UserTable from "@/app/(conponants)/UserTable";
import { useAWSUpload } from "@/app/(lib)/AWSUpload";
function Users() {
  const router = useRouter();
  const cookies = parseCookies();
  const token = cookies.accessToken;
  const searchParams = useSearchParams();
  const searchParam = searchParams.get("search");
  const pageNum = searchParams.get("page");
  const roleParam = searchParams.get("role");
  const roleRef = useRef(null);

  const page = pageNum || 1;
  const { uploadToS3 } = useAWSUpload(); 
  const [offset, setOffset] = useState((page - 1) * 10);
  const [search, setSearch] = useState(searchParam);
  const [open, setOpen] = useState(false);
  const [filterModal, setFilterModal] = useState(false);
  const [editMode, setEditMode] = useState(false); // Track if the modal is in edit mode
  const [selectedUser, setSelectedUser] = useState(null); // Track the user being edited
  const [roleFilter, setRoleFilter] = useState(roleParam);
  const [createUser] = useMutation(ADD_USER);
  const [updateUser] = useMutation(UPDATE_USER); // Mutation for updating user
  const [newUser, setNewUser] = useState({
    firstName: "",
    lastName: "",
    email: "",
    role: "",
    profileImage: "",
  });

  const handleSearchChange = (event) => {
    setSearch(event.target.value);
    router.push(`/users?search=${event.target.value}&page=${page}`);
  };

  const { loading, error, data, refetch } = useQuery(GET_ALL_USER, {
    variables: {
      search,
      filter: roleFilter ? { role: roleFilter } : null,
      sort: {
        _id: -1,
      },
      limit: 10,
      offset,
      getAllUserCountSearch2: search || null,
      getAllUserCountFilter2: roleFilter ? { role: roleFilter } : null,
    },
    context: {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  });
  const addSchema = z.object({
    firstName: z.string().min(1, { message: "First Name is required" }),
    lastName: z.string().min(1, { message: "Last Name is required" }),
    email: z.string().email({ message: "Enter a valid email address" }),
    role: z.string().min(1, { message: "Role is required" }),
  });

  const editSchema = z.object({
    firstName: z.string().min(1, { message: "First Name is required" }),
    lastName: z.string().min(1, { message: "Last Name is required" }),
    email: z.string().email({ message: "Enter a valid email address" }),
    role: z.string().optional(),
  });

  const schema = editMode ? editSchema : addSchema;
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      role: newUser.role,
    },
  });

  useEffect(() => {
    refetch();
  }, [offset, roleFilter, refetch]);

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
    setEditMode(false); // Reset edit mode on close
    setSelectedUser(null); // Clear selected user on close
    reset(); // Reset form fields
  };
  const handleFilterOpen = () => {
    setFilterModal(true);
  };

  const handleFilterClose = () => {
    setFilterModal(false);
    reset(); // Reset form fields
  };

  const handleAddUser = async (data) => {
    try {
      const { firstName, lastName, email, role } = data;
      await createUser({
        variables: {
          input: {
            firstName,
            lastName,
            email,
            role,
            profileImage: newUser.profileImage, 
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

  const handleEditUser = async (data) => {
    try {
      const { firstName, lastName, email, role } = data;
      await updateUser({
        variables: {
          input: {
            _id: selectedUser._id,
            firstName,
            lastName,
            email,
            profileImage: newUser.profileImage, 
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
      console.error("Error updating user:", error);
    }
  };

  const handleOpenEditModal = (user) => {
    setSelectedUser(user);
    setNewUser({
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      role: user.role,
      profileImage: user.profileImage,
    });
    setEditMode(true);
    setOpen(true);
  };
  const handleModalSubmit = () => {
    const formData = {
      role: roleRef.current.value,
    };
    setRoleFilter(formData.role);
    router.push(`/users?search=${search||''}&page=${page}&role=${formData.role}`);
    setFilterModal(false);
  };
  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    if (file) {
      const fileName = await uploadToS3(file, "PROFILE");
      setNewUser((prevUser) => ({
        ...prevUser,
        profileImage: fileName,
      }));
    }
  };


  if (error) return <p>Error: {error.message}</p>;

  const { getAllUser = [], getAllUserCount = 0 } = data || {};

  const handleChange = (event: React.ChangeEvent<unknown>, value: number) => {
    const newOffset = (value - 1) * 10;
    setOffset(newOffset);
    router.push(`/users?page=${value}&search=${search||''}&role=${roleFilter||''}`);
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
            <IconButton
              sx={{ color: "white", mr: 1 }}
              onClick={handleFilterOpen}
            >
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
      {loading ? (
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
      ) : (
        <UserTable
          users={getAllUser}
          userCount={getAllUserCount}
          page={page}
          handleChange={handleChange}
          onEditUser={handleOpenEditModal} // Pass the function to open the edit modal
        />
      )}
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
              {editMode ? "Edit User" : "Add User"}
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
         
          <Box
            component="form"
            sx={{
              display: "flex",
              flexDirection: "column",
              px: 4,
            }}
            noValidate
            autoComplete="off"
          >
             <Box sx={{ pt: 4 }}>
            {editMode && newUser.profileImage ? (
              <img
                src={newUser.profileImage}
                alt="Profile Image"
                style={{
                  width: 156,
                  height: 156,
                  borderRadius: "50%", // add this to make it a circle
                }}
              />
            ) : (
              <Avatar sx={{ width: 156, height: 156 }} />
            )}

<IconButton
  sx={{
    position: "relative",
    bottom: "50px",
    left: "120px",
    backgroundColor: "#0060D1",
    border: "1px solid #ccc",
  }}
  component="label"
>
  <CameraAlt sx={{ color: "white" }} />
  <input
    type="file"
    hidden
    onChange={handleFileChange}
  />
</IconButton>

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
                id="firstName"
                label="First Name"
                {...register("firstName")}
                defaultValue={editMode ? newUser.firstName : ""}
                error={!!errors.firstName}
                helperText={errors.firstName ? errors.firstName.message : ""}
                sx={{ width: "48%" }}
              />
              <TextField
                required
                id="lastName"
                label="Last Name"
                {...register("lastName")}
                defaultValue={editMode ? newUser.lastName : ""}
                error={!!errors.lastName}
                helperText={errors.lastName ? errors.lastName.message : ""}
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
                required={!editMode}
                id="email"
                label="Email"
                {...register("email")}
                defaultValue={editMode ? newUser.email : ""}
                error={!!errors.email}
                helperText={errors.email ? errors.email.message : ""}
                sx={{ width: "48%" }}
              />
              <TextField
                required
                id="role"
                label="Role"
                select
                {...register("role")}
                defaultValue={editMode ? newUser.role : ""}
                disabled={editMode}
                error={!!errors.role}
                helperText={errors.role ? errors.role.message : ""}
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
                pr: 5,
                alignContent: "flex-end",
                width: "100%",
                borderTop: "1px solid rgb(236, 236, 236)",
                position: "absolute",
                bottom: 0,
              }}
            >
              <Button
                onClick={handleClose}
                variant="outlined"
                sx={{
                  m: 1,
                  py: 1,
                  width: "23%",
                  borderRadius: "10px",
                  color: "black",
                  borderColor: "black",
                }}
              >
                Cancel
              </Button>
              <Button
                onClick={handleSubmit(
                  editMode ? handleEditUser : handleAddUser
                )}
                variant="contained"
                sx={{
                  m: 1,
                  py: 1,
                  width: "23%",
                  borderRadius: "10px",
                  backgroundColor: "#0060D1",
                }}
              >
                Save
              </Button>
            </Box>
          </Box>
        </Box>
      </Modal>

      {/* filter modal */}
      {/* filter modal */}
      <Modal
        open={filterModal}
        onClose={handleFilterClose}
        aria-labelledby="modal-title"
        aria-describedby="modal-description"
      >
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 600,
            bgcolor: "background.paper",
            borderRadius: "8px",
            boxShadow: 24,
            p: 4,
          }}
        >
          <Typography
            id="modal-title"
            variant="h5"
            component="h2"
            sx={{ mb: 2, color: "black" }}
          >
            Filter
          </Typography>
          <Box
            component="form"
            onSubmit={handleSubmit(handleModalSubmit)}
            sx={{ display: "flex", flexDirection: "column", gap: 2 }}
            noValidate
            autoComplete="off"
          >
            <TextField
              required
              id="role"
              label="Role"
              inputRef={roleRef}
              select
              fullWidth
              {...register("role")}
              error={!!errors.role}
              helperText={errors.role ? errors.role.message : ""}
            >
              <MenuItem value="ADMIN">Admin</MenuItem>
              <MenuItem value="HR">HR Personnel</MenuItem>
              <MenuItem value="HIRING_MANAGER">Hiring Manager</MenuItem>
            </TextField>

            <Box
              sx={{
                display: "flex",
                pt: 2,
                borderTop: "1px solid rgb(236, 236, 236)",
              }}
            >
              <Box sx={{ display: "flex", justifyContent: "center" }}>
                <Button
                  variant="text"
                  sx={{
                    textTransform: "none",
                    textDecoration: "underline",
                    color: "#000",
                    fontWeight: "light",
                  }}
                  onClick={() => {
                    setRoleFilter(null);
                    setFilterModal(false);
                  }}
                >
                  Reset Filter
                </Button>
              </Box>
              <Button
                variant="outlined"
                sx={{
                  m: 1,
                  py: 1,
                  width: "33%",
                  borderRadius: "10px",
                  color: "black",
                  borderColor: "black",
                }}
                onClick={handleFilterClose}
              >
                Cancel
              </Button>
              <Button
                onClick={(handleModalSubmit)}
                variant="contained"
                sx={{
                  m: 1,
                  py: 1,
                  width: "33%",
                  borderRadius: "10px",
                  backgroundColor: "#0060D1",
                }}
              >
                Apply
              </Button>
            </Box>
          </Box>
        </Box>
      </Modal>
    </div>
  );
}

export default Users;
