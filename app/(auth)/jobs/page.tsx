"use client";
import React, { useEffect, useState } from "react";
import { GET_ALL_HIRING_MANAGER, GET_ALL_HR_USER, GET_ALL_JOB, GET_ALL_JOB_CATEGORY } from "@/app/(queries)/queries";
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
  Grid,
} from "@mui/material";
import { parseCookies } from "nookies";
import { useRouter, useSearchParams } from "next/navigation";
import { FilterList, Search } from "@mui/icons-material";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
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
  const [categories, setCategories] = useState([]);
  const [hiringManagers, setHiringManagers] = useState([]);
  const [hiringManagerOffset, setHiringManagerOffset] = useState(0);
  const [categoryOffset, setCategoryOffset] = useState(0);
  const [hrUsers, setHrUsers] = useState([]);
  const [hrOffset, setHrOffset] = useState(0);
  const limit = 10;


 
  const handleSearchChange = (event) => {
    setSearch(event.target.value);
    router.push(`/jobs?search=${event.target.value}&page=${page}`);
  };

  const { loading, error, data, refetch } = useQuery(GET_ALL_JOB, {
    variables: {
        filter: {},
        limit,
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

  const { data: categoryData, loading: categoryLoading, fetchMore: categoryFetchMore } = useQuery(GET_ALL_JOB_CATEGORY, {
    variables: { limit, offset: categoryOffset, sort: { categoryName: 1 } },
    onCompleted: (categoryData) => {
      setCategories(categoryData.getAllJobCategory);
    },
    context: {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  });

  const { data: hiringManagerData, loading: hiringManagerLoading, fetchMore: hiringManagerFetchMore } = useQuery(GET_ALL_HIRING_MANAGER, {
    variables: { limit, offset: hiringManagerOffset, filter: {role: "HIRING_MANAGER"}, sort: { firstName: 1 } },
    onCompleted: (data) => {
      setHiringManagers(hiringManagerData.getAllUser);
    },
    context: {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  });

  const { data: hrData, loading: hrLoading, fetchMore: hrFetchMore } = useQuery(GET_ALL_HR_USER, {
    variables: { limit, offset: hrOffset, filter: {role: "HR"}, sort: { firstName: 1 }  },
    onCompleted: (data) => {
      setHrUsers(hrData.getAllUser);
    },
    context: {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  });


  const handleScrollCategory = (e) => {
    const bottom = e.target.scrollHeight - e.target.scrollTop === e.target.clientHeight;
    if (bottom && !loading) {
      categoryFetchMore({
        variables: {
          categoryOffset: categories.length,
        },
        updateQuery: (previousResult, { fetchMoreResult }) => {
          if (!fetchMoreResult) return previousResult;
          const updatedCategories = [
            ...previousResult.getAllJobCategory,
            ...fetchMoreResult.getAllJobCategory,
          ];
          setCategories(updatedCategories);
          return {
            ...previousResult,
            getAllJobCategory: updatedCategories,
          };
        },
      });
    }
  };

  const handleScrollHiringManager = (e) => {
    const bottom = e.target.scrollHeight - e.target.scrollTop === e.target.clientHeight;
    if (bottom && !loading) {
      hiringManagerFetchMore({
        variables: {
          offset: hiringManagers.length,
        },
        updateQuery: (previousResult, { fetchMoreResult }) => {
          if (!fetchMoreResult) return previousResult;
          const updatedManagers = [
            ...previousResult.getAllUser,
            ...fetchMoreResult.getAllUser,
          ];
          setHiringManagers(updatedManagers);
          return {
            ...previousResult,
            getAllUser: updatedManagers,
          };
        },
      });
    }
  };
  const handleScrollHR = (e) => {
    const bottom = e.target.scrollHeight - e.target.scrollTop === e.target.clientHeight;
    if (bottom && !loading) {
      hrFetchMore({
        variables: {
          offset: hrUsers.length,
        },
        updateQuery: (previousResult, { fetchMoreResult }) => {
          if (!fetchMoreResult) return previousResult;
          const updatedHrUsers = [
            ...previousResult.getAllUser,
            ...fetchMoreResult.getAllUser,
          ];
          setHrUsers(updatedHrUsers);
          return {
            ...previousResult,
            getAllUser: updatedHrUsers,
          };
        },
      });
    }
  };

  
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
    control
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
      <Modal
      open={filterModal}
      onClose={handleFilterClose}
      aria-labelledby="modal-title"
      aria-describedby="modal-description"
    >
      <Box
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 600,
          bgcolor: 'background.paper',
          borderRadius: '8px',
          boxShadow: 24,
          p: 4,
        }}
      >
        <Typography
          id="modal-title"
          variant="h5"
          component="h2"
          sx={{ mb: 2, color: 'black' }}
        >
          Filter
        </Typography>
        <Box
          component="form"
          sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}
          noValidate
          autoComplete="off"
        >
          <Grid container spacing={2}>
          <Grid item xs={6}>
              <Controller
                name="category"
                control={control}
                defaultValue=""
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Category"
                    select
                    fullWidth
                    onScroll={handleScrollCategory}
                    error={!!errors.category}
                    SelectProps={{
                      MenuProps: {
                        PaperProps: {
                          style: {
                            maxHeight: '330px', // Approximately 9 items
                            overflowY: 'auto',
                          },
                          onScroll: handleScrollCategory,
                        },
                      },
                    }}
                  >
                    {categories.map((category) => (
                      <MenuItem key={category._id} value={category._id}>
                        {category.categoryName}
                      </MenuItem>
                    ))}
                  </TextField>
                )}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                required
                id="status"
                label="Status"
                select
                fullWidth
                {...register('status')}
                error={!!errors.status}
              >
                <MenuItem value="OPEN">Open</MenuItem>
                <MenuItem value="CLOSED">Closed</MenuItem>
                <MenuItem value="DRAFT">Draft</MenuItem>
              </TextField>
            </Grid>
            <Grid item xs={6}>
            <TextField
      id="hiring-manager"
      label="Hiring Manager"
      select
      fullWidth
      onScroll={handleScrollHiringManager}
      SelectProps={{
        MenuProps: {
          PaperProps: {
            style: {
              maxHeight: '330px', // Adjust the height as needed
            },
            onScroll: handleScrollHiringManager,
          },
        },
      }}
    >
      {hiringManagers.map((manager) => (
        <MenuItem key={manager._id} value={manager._id}>
          {manager.firstName} {manager.lastName}
        </MenuItem>
      ))}
    </TextField>
            </Grid>
            <Grid item xs={6}>
            <TextField
          id="hr-user"
          label="HR"
          select
          fullWidth
          onScroll={handleScrollHR}
          SelectProps={{
            MenuProps: {
              PaperProps: {
                style: {
                  maxHeight: '330px', // Adjust the height as needed
                },
                onScroll: handleScrollHR,
              },
            },
          }}
        >
          {hrUsers.map((user) => (
            <MenuItem key={user._id} value={user._id}>
              {user.firstName} {user.lastName}
            </MenuItem>
          ))}
        </TextField>
            </Grid>
          </Grid>

          <Box
            sx={{
              display: 'flex',
              pt: 2,
              borderTop: '1px solid rgb(236, 236, 236)',
            }}
          >
            <Box sx={{ display: 'flex', justifyContent: 'center' }}>
              <Button
                variant="text"
                sx={{
                  textTransform: 'none',
                  textDecoration: 'underline',
                  color: '#000',
                  fontWeight: 'light',
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
                width: '33%',
                borderRadius: '10px',
                color: 'black',
                borderColor: 'black',
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
                width: '33%',
                borderRadius: '10px',
                backgroundColor: '#0060D1',
              }}
              onClick={() => {
                // handle apply logic here
              }}
            >
              Apply
            </Button>
          </Box>
        </Box>
      </Box>
    </Modal>    </div>
  );
}

export default Jobs;
