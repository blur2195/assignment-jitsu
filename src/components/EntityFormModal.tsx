import { Box, Button, Modal, Stack } from "@mui/material";
import { FormEventHandler, ReactNode } from "react";
import { modalStyle } from "styles/modal";
import ModalHeader from "./ModalHeader";

interface EntityFormModalProps {
  title: string;
  open: boolean;
  onClose: () => void;
  onSubmit: FormEventHandler<HTMLFormElement>;
  loading?: boolean;
  children: ReactNode;
}

const EntityFormModal = ({
  title,
  open,
  onClose,
  onSubmit,
  loading = false,
  children,
}: EntityFormModalProps) => (
  <Modal open={open} onClose={onClose}>
    <Box component="form" onSubmit={onSubmit} sx={modalStyle}>
      <Stack direction="column" spacing={2} sx={{ width: "100%", height: "100%" }}>
        <ModalHeader
          title={title}
          onClose={onClose}
          actions={
            <Button type="submit" variant="contained" loading={loading}>
              Save
            </Button>
          }
        />
        <Box sx={{ flex: 1, overflow: "auto" }}>
          {children}
        </Box>
      </Stack>
    </Box>
  </Modal>
);

export default EntityFormModal;
