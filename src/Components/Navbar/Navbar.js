import "./Navbar.css";
import React, { useEffect, useState } from "react";
import {
  Grid,
  Button,
  AppBar,
  Toolbar,
  Typography,
  MenuItem,
  Menu,
  Avatar,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import useAuth from "../../Hooks/useAuth";
import { useDispatch } from "react-redux";
import { handleUserLogout } from "../../Store/Slices/Auth";
// import { Grid } from "@mui/material";

export const Navbar = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [isSenderAvailable, setIsSenderAvailable] = useState(false);
  const [isLogin, setIsLogin] = useState(false);
  const dispatch = useDispatch();
  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const navigate = useNavigate();

  useEffect(() => {
    const isSender = localStorage.getItem("sender");
    setIsSenderAvailable(isSender);
    const is_login = localStorage.getItem("token");
    {
      is_login ? setIsLogin(true) : setIsLogin(false);
    }
  });

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleClick = () => {
    setAnchorEl(null);
    navigate("/add_Sender");
  };

  const handleLogin = () => {
    if (isLogin) {
      dispatch(handleUserLogout(false));
      localStorage.removeItem("token");
      localStorage.removeItem("sender");
      navigate("/");
    }
  };

  return (
    <div>
      <AppBar className="AppBar">
        <Grid item sm={12} xs={12} className="container">
          <Toolbar>
            <Grid className="grow">
              <Button className="mainLogo">
                <Avatar
                  src="https://uploads.codesandbox.io/uploads/user/3e41a372-fc65-4387-bca0-70a050914db8/VIR9-logo.jpg"
                  className="avatar"
                />
              </Button>
            </Grid>
            <Button
              color="inherit"
              onClick={handleMenu}
              className="buttonFontSize"
            >
              Sender
            </Button>
            <Menu
              id="menu-appbar"
              anchorEl={anchorEl}
              anchorOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
              transformOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
              open={Boolean(anchorEl)}
              onClose={handleClose}
            >
              {!isSenderAvailable ? (
                <MenuItem onClick={handleClick}>Add Sender</MenuItem>
              ) : (
                <MenuItem onClick={handleClick}>Edit Sender</MenuItem>
              )}
            </Menu>
            <Button
              color="inherit"
              className="buttonFontSize"
              onClick={() => navigate("/clients")}
            >
              Clients
            </Button>
            <Button
              color="inherit"
              className="buttonFontSize"
              onClick={() => navigate("/invoices")}
            >
              Invoice
            </Button>
            <Button
              color="inherit"
              className="buttonFontSize"
              onClick={handleLogin}
            >
              {!isLogin ? "Login" : "Logout"}
            </Button>
          </Toolbar>
        </Grid>
      </AppBar>
    </div>
  );
};
