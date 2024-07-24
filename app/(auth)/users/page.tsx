"use client";
import Navbar from "@/app/(conponants)/NavBar";
import React, { useEffect, useState } from "react";
import { GET_ALL_USER } from "@/app/(queries)/queries";
import { useQuery } from "@apollo/client";

import {
  Box,
  Pagination,
  PaginationItem,
  Skeleton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import Paper from "@mui/material/Paper";
import { parseCookies } from "nookies";
import { useRouter, useSearchParams } from "next/navigation";
function Users() {
  const router = useRouter();
  const cookies = parseCookies();
  const token = cookies.accessToken;
  const searchParams = useSearchParams();

  const pageNum = searchParams.get("page");

  const page = pageNum || 1;

  const [offset, setOffset] = useState((page - 1) * 10);
  const { loading, error, data, refetch } = useQuery(GET_ALL_USER, {
    variables: {
      search: null,
      filter: {},
      sort: {
        _id: -1,
      },
      limit: 10,
      offset,
      getAllUserCountSearch2: null,
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

  if (loading) {
    return (
      <>
        <Navbar />
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
      </>
    );
  }
  if (error) return <p>Error: {error.message}</p>;


  const { getAllUser, getAllUserCount } = data;
  const handleChange = (event: React.ChangeEvent<unknown>, value: number) => {
    const newOffset = (value - 1) * 10;
    setOffset(newOffset);
    router.push(`/users?page=${value}`);
  };
  return (
    <div>
      <Navbar />
      <Box
        sx={{ display: "flex", justifyContent: "space-between", mt: 4, mx: 12 }}
      >
        <p>Total: {getAllUserCount}</p>
        <Box sx={{ display: "flex", gap: 2 }}>
          <input
            type="text"
            placeholder="Search"
            style={{
              padding: "0.5em",
              borderRadius: "4px",
              border: "1px solid #ccc",
            }}
          />
          <button
            style={{
              backgroundColor: "#0060D1",
              color: "white",
              padding: "0.5em 1em",
              borderRadius: "10px",
            }}
          >
            Add User
          </button>
        </Box>
      </Box>
      <Box sx={{ display: "flex", justifyContent: "center", mt: 3 }}>
        <TableContainer
          component={Paper}
          sx={{ width: "90%", borderRadius: 4, pr: 2, mx: 12 }}
        >
          <Table aria-label="simple table">
            <TableHead>
              <TableRow sx={{ borderBottom: "2px solid #e0e0e0" }}>
                <TableCell sx={{ width: "20%" }}>First Name</TableCell>
                <TableCell sx={{ width: "20%" }}>Last Name</TableCell>
                <TableCell sx={{ width: "30%" }}>Email</TableCell>
                <TableCell sx={{ width: "20%" }}>Role</TableCell>
                <TableCell sx={{ width: "10%" }} align="right">
                  Action
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {getAllUser.map((user) => (
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
                    sx={{ fontWeight: "bold", color: "rgb(112, 112, 112)" }}
                    align="right"
                  >
                    ...
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
      <Box sx={{ display: "flex", justifyContent: "center", my: 2 }}>
        <Pagination
          count={Math.ceil(getAllUserCount / 10)}
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
    </div>
  );
}

export default Users;
