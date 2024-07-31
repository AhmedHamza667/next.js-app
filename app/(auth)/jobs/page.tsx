"use client";
import React, { useEffect, useState } from "react";
import { GET_ALL_JOB } from "@/app/(queries)/queries";
import { useQuery } from "@apollo/client";
import {
  Box,
  Button,
  IconButton,
  InputBase,
  MenuItem,
  Modal,
  TextField,
  Typography,
  Skeleton,
} from "@mui/material";
import { parseCookies } from "nookies";
import { useRouter, useSearchParams } from "next/navigation";
import { FilterList, Search } from "@mui/icons-material";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import JobTable from "@/app/(conponants)/JobTable";
function Jobs() {
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
  const [filterModal, setFilterModal] = useState(false);
 
  const handleSearchChange = (event) => {
    setSearch(event.target.value);
    router.push(`/jobs?search=${event.target.value}&page=${page}`);
  };

  const { loading, error, data, refetch } = useQuery(GET_ALL_JOB, {
    variables: {
        filter: {},
        limit: 10,
        offset,
        search,
        sort: {
          _id: -1
        },
        getAllJobCountSearch2: search || null,
        getAllJobCountFilter2: null
    },
    context: {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  });
  const schema = z.object({
    firstName: z.string().min(1, { message: "First Name is required" }),
    lastName: z.string().min(1, { message: "Last Name is required" }),
    email: z.string().email({ message: "Enter a valid email address" }),
    role: z.string().min(1, { message: "Role is required" }),
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: zodResolver(schema),
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

 
  const handleFilterOpen = () => {
    setFilterModal(true);
  };

  const handleFilterClose = () => {
    setFilterModal(false);
    reset(); // Reset form fields
  };



  if (error) return <p>Error: {error.message}</p>;

  const { getAllJob = [], getAllJobCount = 0 } = data || {};
console.log(getAllJob)
  const handleChange = (event: React.ChangeEvent<unknown>, value: number) => {
    const newOffset = (value - 1) * 10;
    setOffset(newOffset);
    router.push(`/jobs?page=${value}&search=${search||''}`);
  };

  return (
    <div>
      <Box
        sx={{ display: "flex", justifyContent: "space-between", mt: 4, mx: 12 }}
      >
        <p>Total: {getAllJobCount}</p>
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
            sx={{
              backgroundColor: "#0060D1",
              color: "white",
              padding: "0.5em 1em",
              borderRadius: "10px",
              textTransform: "none",
              "&:hover": { backgroundColor: "#004BB5" },
            }}
          >
            + Create Job
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
        <JobTable
          jobs={getAllJob}
          jobCount={getAllJobCount}
          page={page}
          handleChange={handleChange}
        />
      )}
     

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
            
            sx={{ display: "flex", flexDirection: "column", gap: 2 }}
            noValidate
            autoComplete="off"
          >
            <TextField
              required
              id="role"
              label="Role"
              select
              fullWidth
              {...register("role")}
              error={!!errors.role}
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

export default Jobs;
