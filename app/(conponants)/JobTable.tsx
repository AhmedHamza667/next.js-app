import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Box,
  Pagination,
  PaginationItem,
  IconButton,
  Menu,
  MenuItem,
} from "@mui/material";
import { useRouter } from "next/navigation";
import MoreVertIcon from "@mui/icons-material/MoreVert";


const JobTable = ({ jobs, jobCount, page, handleChange }) => {
  const router = useRouter();
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedJob, setSelectedJob] = useState(null);

  const handleMenuOpen = (event, job) => {
    setAnchorEl(event.currentTarget);
    // setSelectedJob(job);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    // setSelectedJob(null);
  };



  return (
    <Box sx={{ display: "flex", flexDirection:'column', justifyContent: "center", mt: 3 }}>
      <TableContainer
        component={Paper}
        sx={{ width: "90%", borderRadius: 4, mx: 12 }}
      >
        <Table aria-label="simple table">
          <TableHead>
            <TableRow sx={{ borderBottom: "2px solid #e0e0e0" }}>
              <TableCell sx={{ width: "10%" }}>Job ID</TableCell>
              <TableCell sx={{ width: "15%" }}>Job Name</TableCell>
              <TableCell sx={{ width: "15%" }}>Category</TableCell>
              <TableCell sx={{ width: "10%" }}>Applications</TableCell>
              <TableCell sx={{ width: "10%" }}>Interviews</TableCell>
              <TableCell sx={{ width: "10%" }}>Start Date</TableCell>
              <TableCell sx={{ width: "10%" }}>End Date</TableCell>
              <TableCell sx={{ width: "10%" }}>Status</TableCell>
              <TableCell sx={{ width: "10%", pr:10  }} align="right">
                Action
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {jobs.map((job) => (
              <TableRow
                key={job._id}
                sx={{ ":hover": { backgroundColor: "rgb(236, 236, 236)" } }}
              >
                <TableCell sx={{ color: "rgb(112, 112, 112)" }}>
                  {job.jobCode}
                </TableCell>
                <TableCell
                  sx={{ color: "rgb(112, 112, 112)", padding: "26px" }}
                >
                  {job.jobTitle}
                </TableCell>
                <TableCell sx={{ color: "rgb(112, 112, 112)" }}>
                  {job.jobCategory.categoryName}
                </TableCell>
                <TableCell sx={{ color: "rgb(112, 112, 112)" }}>
                  {job.applicationsCount}
                </TableCell>
                <TableCell sx={{ color: "rgb(112, 112, 112)" }}>
                  {job.interviewsCount}
                </TableCell>
                <TableCell sx={{ color: "rgb(112, 112, 112)" }}>
                  {job.startDate}
                </TableCell>
                <TableCell sx={{ color: "rgb(112, 112, 112)" }}>
                  {job.endDate}
                </TableCell>
                <TableCell sx={{ color: "rgb(112, 112, 112)" }}>
                  {job.status}
                </TableCell>
                <TableCell
                  sx={{ fontWeight: "bold", color: "rgb(112, 112, 112)", pr: 10 }}
                  align="right"
                >
                  <IconButton
                    onClick={(event) => handleMenuOpen(event, job)}
                    size="small"
                  >
                    <MoreVertIcon />
                  </IconButton>
                  <Menu
                    anchorEl={anchorEl}
                    open={Boolean(anchorEl)}
                    onClose={handleMenuClose}
                    MenuListProps={{
                        sx: {
                          padding: 0, // Remove padding from the MenuList
                        },
                      }}
                  >
                    <MenuItem sx={{bgcolor: '#0D1A3B', color: '#6A7186', '&:hover': {
                    backgroundColor: '#0D1A3B', // Same as normal background color to disable hover effect
                  },}}>Edit</MenuItem>
                    <MenuItem sx={{bgcolor: '#0D1A3B', color: '#6A7186', '&:hover': {
                    backgroundColor: '#0D1A3B', // Same as normal background color to disable hover effect
                  },}}>Delete</MenuItem>
                  </Menu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Box sx={{ display: "flex", justifyContent: "center", my: 2 }}>
      <Pagination
          count={Math.ceil(jobCount / 10)}
          shape="rounded"
          color="primary"
          page={parseInt(page)}
          onChange={handleChange}
          renderItem={(item) => (
            <PaginationItem
              components={{
                previous: () => <span>{"< "}Previous</span>,
                next: () => <span>Next {">"}</span>,
              }}
              {...item}
              sx={{
                "&.MuiPaginationItem-root": {
                  color: "#e0e0e0", // Text color for the pagination items
                },
                "&.Mui-selected": {
                  backgroundColor: "#0060D1", // Background color for the selected pagination item
                },
              }}
            />
          )}
          sx={{
            "& .MuiPaginationItem-root": {
              color: "#e0e0e0", // Text color for the pagination items
            },
            "& .Mui-selected": {
              backgroundColor: "#0060D1", // Background color for the selected pagination item
            },
          }}
        />
      </Box>
    </Box>
  );
};

export default JobTable;
