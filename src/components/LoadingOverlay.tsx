import { Box, CircularProgress } from "@mui/material";

const LoadingOverlay = () => (
  <Box sx={{
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    zIndex: 999,
    bgcolor: "gray",
    opacity: 0.5,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  }}>
    <CircularProgress />
  </Box>
);

export default LoadingOverlay;
