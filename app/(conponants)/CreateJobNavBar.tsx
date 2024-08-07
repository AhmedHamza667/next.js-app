"use client";
import React from "react";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import { useRouter } from "next/navigation";
import { parseCookies } from "nookies";
import { GET_CURRENT_USER } from "../(queries)/queries";
import { useQuery } from "@apollo/client";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { IconButton } from "@mui/material";

export default function CreateJobNavBar() {
  const cookies = parseCookies();
  const token = cookies.accessToken;

  const router = useRouter();
  const { loading, error, data } = useQuery(GET_CURRENT_USER, {
    context: {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  });
  if (loading) {
    console.log(loading);
  }
  if (error) console.log(error.message);

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar
        position="static"
        sx={{
          backgroundColor: "#0D1A3B",
          height: "84px",
          justifyContent: "center",
        }}
      >
        <Toolbar
          sx={{
            display: "flex",
            alignItems: "center",
          }}
        >
        <IconButton
            edge="start"
            color="inherit"
            aria-label="back"
            onClick={() => router.back()}
            sx={{ marginRight: "6px" }}
          >
            <ArrowBackIcon />
          </IconButton>
          <Typography sx={{fontSize: '22px'}}>Create Job</Typography>
        </Toolbar>
      </AppBar>
    </Box>
  );
}
