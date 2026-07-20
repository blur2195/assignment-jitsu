import { Box, Button, List, ListItem, MenuItem, Modal, Stack, TextField } from "@mui/material";
import { DateTimePicker } from "@mui/x-date-pickers";
import dayjs from "dayjs";
import { useState } from "react";
import { CustomListItem } from "components";
import { SHIPMENT_STATUS } from "config";
import { shipmentServices } from "services";
import { modalStyle } from "styles/modal";

interface AddModalProps {
  openModal: boolean;
  closeModal: () => void;
  forceReloadCb: () => void;
}

const AddModal = ({ openModal, closeModal, forceReloadCb }: AddModalProps) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [editableData, setEditableData] = useState<Record<string, unknown>>({
    label: null,
    client_name: null,
    status: SHIPMENT_STATUS.OPEN,
    lat: null,
    lng: null,
    arrival_date: dayjs().toISOString(),
    delivery_by_date: dayjs().toISOString(),
  });

  const handleChangeInput = (field: string, value: unknown) => {
    setEditableData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSaveData = async () => {
    try {
      setLoading(true);
      const status = await shipmentServices.createShipment({ ...editableData });
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
                <CustomListItem title={"Client"}>
                  <TextField
                    size="small"
                    value={editableData?.client_name || ""}
                    onChange={(e) => handleChangeInput("client_name", e.target.value)}
                  />
                </CustomListItem>
              </ListItem>
              <ListItem disablePadding sx={{ mb: 1 }}>
                <CustomListItem title={"Status"}>
                  <TextField
                    select
                    sx={{ minWidth: 120 }}
                    value={editableData?.status ?? SHIPMENT_STATUS.OPEN}
                    disabled
                  >
                    <MenuItem key={SHIPMENT_STATUS.OPEN} value={SHIPMENT_STATUS.OPEN}>Open</MenuItem>
                  </TextField>
                </CustomListItem>
              </ListItem>
              <ListItem disablePadding sx={{ mb: 1 }}>
                <CustomListItem title={"Arrival date"}>
                  <DateTimePicker
                    value={dayjs(editableData?.arrival_date as string)}
                    onChange={(value) => handleChangeInput("arrival_date", dayjs(value).toISOString())}
                  />
                </CustomListItem>
              </ListItem>
              <ListItem disablePadding sx={{ mb: 1 }}>
                <CustomListItem title={"Delivery by date"}>
                  <DateTimePicker
                    value={dayjs(editableData?.delivery_by_date as string)}
                    onChange={(value) => handleChangeInput("delivery_by_date", dayjs(value).toISOString())}
                  />
                </CustomListItem>
              </ListItem>
              <ListItem disablePadding sx={{ mb: 1 }}>
                <CustomListItem title={"Warehouse ID"}>
                  <TextField
                    size="small"
                    value={editableData?.warehouse_id || ""}
                    onChange={(e) => handleChangeInput("warehouse_id", e.target.value)}
                  />
                </CustomListItem>
              </ListItem>
              <ListItem disablePadding sx={{ mb: 1 }}>
                <CustomListItem title={"Latitude"}>
                  <TextField
                    size="small"
                    value={editableData?.lat || ""}
                    onChange={(e) => handleChangeInput("lat", e.target.value)}
                  />
                </CustomListItem>
              </ListItem>
              <ListItem disablePadding>
                <CustomListItem title={"Longitude"}>
                  <TextField
                    size="small"
                    value={editableData?.lng || ""}
                    onChange={(e) => handleChangeInput("lng", e.target.value)}
                  />
                </CustomListItem>
              </ListItem>
            </List>
          </Box>
        </Stack>
      </Box>
    </Modal>
  );
};

export default AddModal;
