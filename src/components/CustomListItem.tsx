import { Grid } from "@mui/material";
import { ReactNode } from "react";

interface CustomListItemProps {
  title: string;
  children: ReactNode;
}

const CustomListItem = ({ title, children }: CustomListItemProps) => (
  <Grid container sx={{ width: "100%" }} spacing={{ xs: 0.5, sm: 0 }}>
    <Grid
      size={{ xs: 12, sm: 3 }}
      sx={{
        display: "flex",
        alignItems: { xs: "flex-start", sm: "center" },
      }}
    >
      {title}
    </Grid>
    <Grid size={{ xs: 12, sm: 9 }}>{children}</Grid>
  </Grid>
);

export default CustomListItem;
