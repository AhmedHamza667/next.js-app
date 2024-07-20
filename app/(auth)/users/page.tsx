'use client'
import Navbar from '@/app/(conponants)/NavBar'
import React from 'react'
import { GET_ALL_USER } from '@/app/(queries)/queries'
import { useQuery } from '@apollo/client';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import Paper from '@mui/material/Paper';


function Users() {

  const { loading, error, data } = useQuery(GET_ALL_USER, {
    variables: {
      search: null,
      filter: {},
      sort: {
        _id: -1
      },
      limit: 10,
      offset: 0,
      getAllUserCountSearch2: null,
      getAllUserCountFilter2: {}
    },
    context: {
      headers: {
        Authorization: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2NjhkMzBlYjY0NDg5NTEyNzZjYzQ1OTgiLCJyb2xlIjoiQURNSU4iLCJkZXZpY2VEb2NJZCI6IjY2OWE2YjE4MWFlMTExM2U3NzlmMTBmNCIsImlhdCI6MTcyMTQ5NDAwOSwiZXhwIjoxNzIxNDk3NjA5fQ.xioArZsiQPTwdYSF4vZNccZGs8Maugswd8i8jvG5YjQ'
      }
    }
  });


  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  const { getAllUser, getAllUserCount } = data;
  return (
    <div>
      <Navbar />
      {/* <ul>
        {getAllUser.map(user => (
          <li key={user._id}>
            <p>{user.firstName} {user.lastName}</p>
            <p>{user.email}</p>
            <p>{user.role}</p>
          </li>
        ))}
      </ul>*/}
      <p>Total: {getAllUserCount}</p> 
          <TableContainer component={Paper} sx={{width: "90%", }}>
      <Table sx={{ minWidth: 650, }} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell>First Name</TableCell>
            <TableCell>Last Name</TableCell>
            <TableCell>Email</TableCell>
            <TableCell>Role</TableCell>
            <TableCell align="right">Action</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {getAllUser.map(user => (
            <TableRow
              key={user._id}
              sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
            >
              <TableCell component="th" scope="row">{user.firstName} </TableCell>
              <TableCell align="left">{user.lastName}</TableCell>
              <TableCell>{user.email}</TableCell>
              <TableCell>{user.role}</TableCell>
              <TableCell sx={{fontWeight: 'bold'}} align="right">...</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
    </div>
  )
}

export default Users