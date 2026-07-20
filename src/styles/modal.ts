import { SxProps, Theme } from "@mui/material/styles";

export const modalStyle: SxProps<Theme> = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: { xs: "calc(100% - 32px)", sm: 500, md: 600 },
  maxWidth: "100%",
  maxHeight: { xs: "90vh", sm: "80%" },
  height: { xs: "auto", sm: "80%" },
  overflowY: "auto",
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: { xs: 2, sm: 4 },
};

export const compactModalStyle: SxProps<Theme> = {
  ...modalStyle,
  width: { xs: "calc(100% - 32px)", sm: 400 },
  height: { xs: "auto", sm: 400 },
  maxHeight: { xs: "85vh", sm: 400 },
  p: 2,
};
