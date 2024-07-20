"use client";
import React from "react";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import Image from "next/image";
import { Tooltip } from "@mui/material";
import { useRouter } from "next/navigation";

export default function Navbar() {
  const router = useRouter();
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
              sx={{ color: "white" }}
              onClick={() => router.push("/jobs")}
            >
              Jobs
            </Button>
            <Button
              color="inherit"
              sx={{ color: "white" }}
              onClick={() => router.push("/users")}
            >
              Users
            </Button>
            <Avatar
              alt="User Avatar"
              src="/static/images/avatar/1.jpg"
              sx={{ marginLeft: 2 }}
            />
          </Box>
        </Toolbar>
      </AppBar>
    </Box>
  );
}