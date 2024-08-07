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


  const handleScroll = (e, fetchMoreFunction, items, setItems, itemKey) => {
    const bottom = e.target.scrollHeight - e.target.scrollTop === e.target.clientHeight;
    if (bottom && !loading) {
      fetchMoreFunction({
        variables: { offset: items.length },
        updateQuery: (previousResult, { fetchMoreResult }) => {
          if (!fetchMoreResult) return previousResult;
          const updatedItems = [...previousResult[itemKey], ...fetchMoreResult[itemKey]];
          setItems(updatedItems);
          return { ...previousResult, [itemKey]: updatedItems };
        },
      });
    }
  };

  const handleScrollCategory = (e) => handleScroll(e, categoryFetchMore, categories, setCategories, 'getAllJobCategory');
  const handleScrollHiringManager = (e) => handleScroll(e, hiringManagerFetchMore, hiringManagers, setHiringManagers, 'getAllUser');
  const handleScrollHR = (e) => handleScroll(e, hrFetchMore, hrUsers, setHrUsers, 'getAllUser');

  const schema = z.object({
    category: z.string().optional(),
    status: z.string().optional(),
    "hiring-manager": z.string().optional(),
    "hr-user": z.string().optional(),
  });

  const { control, handleSubmit, formState: { errors }, reset } = useForm({
    resolver: zodResolver(schema),
  });

  const onSubmit = (data) => {
    const filters = {};
    if (data.category) filters.categoryId = data.category;
    if (data.status) filters.status = data.status;
    if (data['hiring-manager']) {
      filters.$or = [
        {
          createdById: {
            $in: [data['hiring-manager']],
          },
        },
        {
          lastAssignedToIds: {
            $in: [data['hiring-manager']],
          },
        },
      ];
    }
    if (data['hr-user']) {
      filters.$or = [
        {
          createdById: {
            $in: [data['hr-user']],
          },
        },
        {
          lastAssignedToIds: {
            $in: [data['hr-user']],
          },
        },
      ];
    }
      console.log("Filters:", filters);
    refetch({ filter: filters });
    router.push(`/jobs?page=1&search=${search||''}`);
    setFilterModal(false);
  };

  useEffect(() => {
    refetch();
  }, [offset, search, refetch]);

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
  const handleFilterReset = () => {
    setFilterModal(false);
    reset(); // Reset form fields
    router.push(`/jobs?page=${page}&search=${search || ''}`);
  };
  


  if (error) return <p>Error: {error.message}</p>;

  const { getAllJob = [], getAllJobCount = 0 } = data || {};
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
            onClick={()=> router.push('/jobs/CreateJob')}
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
    <Box component="form" onSubmit={handleSubmit(onSubmit)} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }} noValidate autoComplete="off">

      <Grid container spacing={2}>
        <Grid item xs={6}>
          <Controller
            name="category"
            control={control}
            defaultValue={''}
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
                <MenuItem value="">Select a category</MenuItem>
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
          <Controller
            name="status"
            control={control}
            defaultValue={''}
            render={({ field }) => (
              <TextField
                {...field}
                label="Status"
                select
                fullWidth
                error={!!errors.status}
              >
                <MenuItem value="">Select a status</MenuItem>
                <MenuItem value="OPEN">Open</MenuItem>
                <MenuItem value="CLOSED">Closed</MenuItem>
                <MenuItem value="DRAFT">Draft</MenuItem>
              </TextField>
            )}
          />
        </Grid>
        <Grid item xs={6}>
          <Controller
            name="hiring-manager"
            control={control}
            defaultValue={''}
            render={({ field }) => (
              <TextField
                {...field}
                label="Hiring Manager"
                select
                fullWidth
                onScroll={handleScrollHiringManager}
                error={!!errors['hiring-manager']}
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
                <MenuItem value="">Select a hiring manager</MenuItem>
                {hiringManagers.map((manager) => (
                  <MenuItem key={manager._id} value={manager._id}>
                    {manager.firstName} {manager.lastName}
                  </MenuItem>
                ))}
              </TextField>
            )}
          />
        </Grid>
        <Grid item xs={6}>
          <Controller
            name="hr-user"
            control={control}
            defaultValue={''}
            render={({ field }) => (
              <TextField
                {...field}
                label="HR"
                select
                fullWidth
                onScroll={handleScrollHR}
                error={!!errors['hr-user']}
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
                <MenuItem value="">Select an HR user</MenuItem>
                {hrUsers.map((user) => (
                  <MenuItem key={user._id} value={user._id}>
                    {user.firstName} {user.lastName}
                  </MenuItem>
                ))}
              </TextField>
            )}
          />
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
            onClick={handleFilterReset}
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
          type="submit"
          variant="contained"
          sx={{
            m: 1,
            py: 1,
            width: '33%',
            borderRadius: '10px',
            backgroundColor: '#0060D1',
          }}
        >
          Apply
        </Button>
      </Box>
    </Box>
  </Box>
</Modal>    

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
     
</div>
  );
}

export default Jobs;
