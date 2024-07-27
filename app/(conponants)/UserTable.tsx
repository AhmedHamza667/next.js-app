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


const UserTable = ({ users, userCount, page, handleChange, onEditUser }) => {
  const router = useRouter();
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);

  const handleMenuOpen = (event, user) => {
    setAnchorEl(event.currentTarget);
    setSelectedUser(user);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedUser(null);
  };

  const handleEditClick = () => {
    if (selectedUser) {
      onEditUser(selectedUser);
    }
    handleMenuClose();
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
              <TableCell sx={{ width: "20%" }}>First Name</TableCell>
              <TableCell sx={{ width: "20%" }}>Last Name</TableCell>
              <TableCell sx={{ width: "30%" }}>Email</TableCell>
              <TableCell sx={{ width: "20%" }}>Role</TableCell>
              <TableCell sx={{ width: "10%", pr:10  }} align="right">
                Action
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users.map((user) => (
              <TableRow
                key={user._id}
                sx={{ ":hover": { backgroundColor: "rgb(236, 236, 236)" } }}
              >
                <TableCell
                  sx={{ color: "rgb(112, 112, 112)", padding: "26px" }}
                >
                  {user.firstName}
                </TableCell>
                <TableCell sx={{ color: "rgb(112, 112, 112)" }}>
                  {user.lastName}
                </TableCell>
                <TableCell sx={{ color: "rgb(112, 112, 112)" }}>
                  {user.email}
                </TableCell>
                <TableCell sx={{ color: "rgb(112, 112, 112)" }}>
                  {user.role}
                </TableCell>
                <TableCell
                  sx={{ fontWeight: "bold", color: "rgb(112, 112, 112)", pr: 10 }}
                  align="right"
                >
                  <IconButton
                    onClick={(event) => handleMenuOpen(event, user)}
                    size="small"
                  >
                    <MoreVertIcon />
                  </IconButton>
                  <Menu
                    anchorEl={anchorEl}
                    open={Boolean(anchorEl)}
                    onClose={handleMenuClose}
                  >
                    <MenuItem onClick={handleEditClick}>Edit</MenuItem>
                  </Menu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Box sx={{ display: "flex", justifyContent: "center", my: 2 }}>
      <Pagination
          count={Math.ceil(userCount / 10)}
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

export default UserTable;
