import { Box, List, ListItem, ListItemButton, ListItemText, Paper, Stack } from "@mui/material";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { NAV_ITEMS } from "config";

const MainLayout = () => {
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <Stack direction={"row"} sx={{ width: "100vw", height: "100vh", margin: 0, borderRadius: 0 }}>
      <Stack sx={{ minWidth: 200, width: 200, height: "100%" }}>
        <Box sx={{ height: 50, alignItems: "center", justifyContent: "center", display: "flex", fontStyle: "italic" }}>
          Logo
        </Box>
        <List disablePadding component={Paper} sx={{ height: "100%" }}>
          {NAV_ITEMS.map(({ label, path }) => (
            <ListItem key={path} disablePadding>
              <ListItemButton
                selected={location.pathname === path}
                onClick={() => navigate(path)}
              >
                <ListItemText primary={label} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Stack>
      <Stack sx={{ flex: 1, height: "100%" }}>
        <Box sx={{ height: 50, alignItems: "center", display: "flex", fontStyle: "italic", px: 2, textTransform: "uppercase", m: 0 }} component={"h3"}>
          {location.pathname.slice(1)}
        </Box>
        <Box sx={{ flex: 1, overflow: "hidden" }}>
          <Outlet />
        </Box>
      </Stack>
    </Stack>
  );
};

export default MainLayout;
