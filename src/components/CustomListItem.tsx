import { Grid } from "@mui/material";
import { ReactNode } from "react";

interface CustomListItemProps {
  title: string;
  children: ReactNode;
}

const CustomListItem = ({ title, children }: CustomListItemProps) => (
  <Grid container sx={{ width: "100%" }}>
    <Grid size={3} sx={{ display: "flex", alignItems: "center" }}>{title}</Grid>
    <Grid size={9}>{children}</Grid>
  </Grid>
);

export default CustomListItem;
