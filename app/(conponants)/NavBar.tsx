"use client";
import React from "react";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { parseCookies } from "nookies";
import { GET_CURRENT_USER } from "../(queries)/queries";
import { useQuery } from "@apollo/client";
import UserProfile from "./userProfile";

export default function Navbar() {
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
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Box>
            {" "}
            <Typography variant="h5">HubSpire</Typography>
            <div className="flex">
              <Typography
                sx={{
                  fontSize: "10px",
                  fontWeight: "light",
                  marginRight: "3px",
                }}
              >
                Powered By
              </Typography>
              <Image
                src="/intilihire.svg"
                alt="Powered by Logo"
                width={51}
                height={14}
              />
            </div>
          </Box>
          <Box sx={{ display: "flex" }}>
            {" "}
            <Button
              color="inherit"
              sx={{ color: "white", fontSize: 13  }}
              onClick={() => router.push("/jobs")}
            >
              Jobs
            </Button>
            <Button
              color="inherit"
              sx={{ color: "white", fontSize: 13  }}
              onClick={() => router.push("/users")}
            >
              Users
            </Button>
            {data ? <UserProfile name={data.me.firstName}/>
             : <Button sx={{ color: "white" }}>user</Button>}
            
          </Box>
        </Toolbar>
      </AppBar>
    </Box>
  );
}
