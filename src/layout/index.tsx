import MenuIcon from "@mui/icons-material/Menu";
import {
  AppBar,
  Box,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Paper,
  Stack,
  Toolbar,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { useState } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { NAV_ITEMS } from "config";

const DRAWER_WIDTH = 200;

const MainLayout = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const pageTitle = location.pathname.slice(1);

  const handleNavigate = (path: string) => {
    navigate(path);
    if (isMobile) setMobileOpen(false);
  };

  const drawerContent = (
    <>
      <Box
        sx={{
          height: 50,
          alignItems: "center",
          justifyContent: "center",
          display: "flex",
          fontStyle: "italic",
        }}
      >
        Logo
      </Box>
      <List disablePadding component={Paper} sx={{ height: "100%" }}>
        {NAV_ITEMS.map(({ label, path }) => (
          <ListItem key={path} disablePadding>
            <ListItemButton
              selected={location.pathname === path}
              onClick={() => handleNavigate(path)}
            >
              <ListItemText primary={label} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </>
  );

  return (
    <Stack direction="row" sx={{ width: "100%", height: "100vh", margin: 0, borderRadius: 0 }}>
      {isMobile ? (
        <>
          <AppBar position="fixed" sx={{ zIndex: theme.zIndex.drawer + 1 }}>
            <Toolbar variant="dense">
              <IconButton
                color="inherit"
                edge="start"
                onClick={() => setMobileOpen(true)}
                aria-label="open navigation menu"
              >
                <MenuIcon />
              </IconButton>
              <Typography variant="h6" noWrap sx={{ flex: 1, textTransform: "uppercase", fontSize: "1rem" }}>
                {pageTitle}
              </Typography>
            </Toolbar>
          </AppBar>
          <Drawer
            variant="temporary"
            open={mobileOpen}
            onClose={() => setMobileOpen(false)}
            ModalProps={{ keepMounted: true }}
            sx={{
              "& .MuiDrawer-paper": {
                width: DRAWER_WIDTH,
                boxSizing: "border-box",
              },
            }}
          >
            {drawerContent}
          </Drawer>
        </>
      ) : (
        <Stack sx={{ minWidth: DRAWER_WIDTH, width: DRAWER_WIDTH, height: "100%", flexShrink: 0 }}>
          {drawerContent}
        </Stack>
      )}
      <Stack
        sx={{
          flex: 1,
          height: "100%",
          minWidth: 0,
          ...(isMobile && { pt: "48px" }),
        }}
      >
        {!isMobile && (
          <Box
            sx={{
              height: 50,
              alignItems: "center",
              display: "flex",
              fontStyle: "italic",
              px: 2,
              textTransform: "uppercase",
              m: 0,
              flexShrink: 0,
            }}
            component="h3"
          >
            {pageTitle}
          </Box>
        )}
        <Box sx={{ flex: 1, overflow: "hidden", minHeight: 0 }}>
          <Outlet />
        </Box>
      </Stack>
    </Stack>
  );
};

export default MainLayout;
