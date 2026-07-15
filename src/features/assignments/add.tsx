import { Box, Button, Grid, List, ListItem, MenuItem, Modal, Stack, TextField } from "@mui/material";
import { useState } from "react";
import { ASSIGNMENT_STATUS } from "../../constants";
import { assignmentServices } from "../../services";

const modalStyle = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 600,
  maxHeight: "80%",
  overflowY: "auto",
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

const CustomListItem = ({ title, children }: any) => {
  return (
    <Grid container sx={{ width: "100%" }}>
      <Grid size={3} sx={{ display: "flex", alignItems: "center" }}>{title}</Grid>
      <Grid size={9}>{children}</Grid>
    </Grid>
  )
};

const AddModal = ({ openModal, closeModal, forceReloadCb }: any) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [editableData, setEditableData] = useState<any>({
    label: null,
    status: ASSIGNMENT_STATUS.OPEN,
    shipment_count: 0,
    clients: [],
  });

  const handleChangeInput = (field: string, value: any) => {
    setEditableData((prev: any) => ({
      ...prev,
      [field]: value,
    }))
  };

  const handleSaveData = async () => {
    try {
      setLoading(true);
      const status = await assignmentServices.create({ ...editableData });
      if (status === 201) {
        closeModal();
        forceReloadCb();
      }
      setLoading(false);
    } catch (error) {
      setLoading(false);
    }
  };

  return (
    <>
      <Modal open={openModal} onClose={closeModal}>
        <Box sx={modalStyle}>
          <Stack direction={"column"} spacing={2} sx={{ width: "100%", height: "100%" }}>
            <Stack direction={"row"}>
              <Box component={"h2"} sx={{ m: 0, flex: 1 }}>Add new shipment</Box>
              <Button
                variant="contained"
                loading={loading}
                onClick={handleSaveData}
              >
                Save
              </Button>
            </Stack>
            <Box sx={{ flex: 1, overflow: "auto" }}>
              <List disablePadding>
                <ListItem disablePadding sx={{ mb: 1 }}>
                  <CustomListItem title={"Label"}>
                    <TextField
                      size="small"
                      value={editableData?.label || ""}
                      onChange={(e) => handleChangeInput("label", e.target.value)}
                    />
                  </CustomListItem>
                </ListItem>
                <ListItem disablePadding sx={{ mb: 1 }}>
                  <CustomListItem title={"Status"}>
                    <TextField
                      select
                      sx={{ minWidth: 120 }}
                      value={editableData?.status ?? ASSIGNMENT_STATUS.OPEN}
                      disabled
                    >
                      <MenuItem key={ASSIGNMENT_STATUS.OPEN} value={ASSIGNMENT_STATUS.OPEN}>Open</MenuItem>
                    </TextField>
                  </CustomListItem>
                </ListItem>
              </List>
            </Box>
          </Stack>
        </Box>
      </Modal>
    </>
  );
};

export default AddModal;