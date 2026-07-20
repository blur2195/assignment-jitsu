import CloseIcon from "@mui/icons-material/Close";
import { Box, IconButton, Stack } from "@mui/material";
import { ReactNode } from "react";

interface ModalHeaderProps {
  title: string;
  onClose: () => void;
  actions?: ReactNode;
}

const ModalHeader = ({ title, onClose, actions }: ModalHeaderProps) => (
  <Stack direction="row" useFlexGap sx={{ flexWrap: "wrap", gap: 1, alignItems: "center" }}>
    <Box component="h2" sx={{ m: 0, flex: 1, minWidth: 0 }}>{title}</Box>
    <Stack direction="row" spacing={1} sx={{ alignItems: "center", flexShrink: 0 }}>
      {actions}
      <IconButton onClick={onClose} aria-label="close" size="small">
        <CloseIcon />
      </IconButton>
    </Stack>
  </Stack>
);

export default ModalHeader;
