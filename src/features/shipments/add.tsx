import { Box, Button, Grid, ListItem, MenuItem, Modal, Paper, TextField, Typography } from "@mui/material";
import { useState } from "react";
import { SHIPMENT_STATUS } from "../../constants";
import { DateTimePicker } from "@mui/x-date-pickers";
import dayjs from "dayjs";
import { shipmentServices } from "../../services/shipments";

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
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
    client_name: null,
    status: SHIPMENT_STATUS.OPEN,
    lat: null,
    lng: null,
    arrival_date: dayjs().toISOString(),
    delivery_by_date: dayjs().toISOString(),
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
    <>
      <Modal open={openModal} onClose={closeModal}>
        <Box sx={style}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            Add new shipment
          </Typography>
          <ListItem>
            <CustomListItem title={"Label"}>
              <TextField
                size="small"
                value={editableData?.label}
                onChange={(e) => handleChangeInput("label", e.target.value)}
              />
            </CustomListItem>
          </ListItem>
          <ListItem>
            <CustomListItem title={"Client"}>
              <TextField
                size="small"
                value={editableData?.client_name}
                onChange={(e) => handleChangeInput("client_name", e.target.value)}
              />
            </CustomListItem>
          </ListItem>
          <ListItem>
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
          <ListItem>
            <CustomListItem title={"Arrival date"}>
              <DateTimePicker
                value={dayjs(editableData?.arrival_date)}
                onChange={(value) => handleChangeInput("arrival_date", dayjs(value).toISOString())}
              />
            </CustomListItem>
          </ListItem>
          <ListItem>
            <CustomListItem title={"Delivery by date"}>
              <DateTimePicker
                value={dayjs(editableData?.delivery_by_date)}
                onChange={(value) => handleChangeInput("delivery_by_date", dayjs(value).toISOString())}
              />
            </CustomListItem>
          </ListItem>
          <ListItem>
            <CustomListItem title={"Warehouse ID"}>
              <TextField
                size="small"
                value={editableData?.warehouse_id}
                onChange={(e) => handleChangeInput("warehouse_id", e.target.value)}
              />
            </CustomListItem>
          </ListItem>
          <ListItem>
            <CustomListItem title={"Latitude"}>
              <TextField
                size="small"
                value={editableData?.lat}
                onChange={(e) => handleChangeInput('lat', e.target.value)}
              />
            </CustomListItem>
          </ListItem>
          <ListItem>
            <CustomListItem title={"Longitude"}>
              <TextField
                size="small"
                value={editableData?.lng}
                onChange={(e) => handleChangeInput('lng', e.target.value)}
              />
            </CustomListItem>
          </ListItem>
          <Button variant="contained" loading={loading} onClick={handleSaveData}>Save</Button>
        </Box>
      </Modal>
    </>
  );
};

export default AddModal;