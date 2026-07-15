import { Box, Button, Grid, List, ListItem, ListItemButton, ListItemText, Menu, MenuItem, Modal, Stack, TextField } from "@mui/material";
import { DateTimePicker } from "@mui/x-date-pickers";
import dayjs from "dayjs";
import L from "leaflet";
import { useEffect, useState } from "react";
import { MapContainer, Marker, TileLayer, useMap } from "react-leaflet";
import { SHIPMENT_STATUS, SHIPMENT_STATUS_OPTIONS } from "../../constants";
import { shipmentServices } from "../../services/shipments";
import { Shipment } from "../../store/models";
import AssignModal from "./assign";

const modalStyle = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 600,
  maxHeight: "80%",
  height: "80%",
  overflowY: "auto",
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

const assignModalStyle = {
  ...modalStyle,
  width: 400,
  height: 400,
  p: 2,
};

interface ShipmentDetailModalProps {
  id: string | null;
  onClose?: Function;
  forceReloadCb?: Function;
}

const icon = L.icon({ iconUrl: "/images/marker.svg", iconSize: [30, 30] });

const CustomListItem = ({ title, children }: any) => {
  return (
    <Grid container sx={{ width: "100%" }}>
      <Grid size={3} sx={{ display: "flex", alignItems: "center" }}>{title}</Grid>
      <Grid size={9}>{children}</Grid>
    </Grid>
  )
};

const RecenterAutomatically = ({ lat, lng }: any) => {
  const map = useMap();
  useEffect(() => {
    map.setView([lat, lng]);
  }, [lat, lng]);
  return null;
};

const ShipmentDetailModal = ({ id, onClose, forceReloadCb }: ShipmentDetailModalProps) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [data, setData] = useState<Shipment | null>(null);
  const statusMenuOpen = Boolean(anchorEl);
  const [assignOpen, setAssignOpen] = useState<boolean>(false);
  const [editableData, setEditableData] = useState<any>({
    lat: null,
    lng: null,
    delivery_by_date: null,
  });

  const handleClickStatusField = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleCloseStatusMenu = () => {
    setAnchorEl(null);
  };

  const fetchData = async (id: string | null) => {
    if (id) {
      try {
        setLoading(true);
        const res = await shipmentServices.getById(id);
        if (res) {
          setData(res);
          setEditableData({
            lat: res.lat,
            lng: res.lng,
            delivery_by_date: res.delivery_by_date,
            status: res.status,
          })
        }
        setLoading(false);
      } catch (error) {
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    const timeOut = setTimeout(() => {
      setSelectedId(id);
    }, 500);

    return () => {
      clearTimeout(timeOut);
    };
  }, [id]);

  useEffect(() => {
    if (selectedId !== null) fetchData(selectedId);
    else setData(null);
  }, [selectedId]);

  const handleChangeInput = (field: string, value: any) => {
    setEditableData((prev: any) => ({
      ...prev,
      [field]: value,
    }))
  };

  const handleChangeStatus = (newStatus: keyof typeof SHIPMENT_STATUS) => {
    if (data?.status !== newStatus) {
      switch (newStatus) {
        case SHIPMENT_STATUS.IN_TRANSIT:
          setAssignOpen(true);
          break;
        case SHIPMENT_STATUS.OPEN:
          handleSaveNewStatus(newStatus, true);
          break;
        default:
          handleSaveNewStatus(newStatus);
          break;
      }
    }
    handleCloseStatusMenu();
  };

  const handleSaveNewStatus = async (
    newStatus: keyof typeof SHIPMENT_STATUS,
    shouldRemoveAssignment: boolean = false,
    successCb?: Function,
  ) => {
    if (id) {
      try {
        setLoading(true);
        const updateObj = {
          status: newStatus,
          ...(shouldRemoveAssignment ? { assignment_id: null } : {}),
        }
        const status = await shipmentServices.updateById(id, updateObj);
        if (status === 200) {
          await fetchData(id);
          successCb && successCb();
        }
        setLoading(false);
      } catch (error) {
        console.log(error);
        setLoading(false);
      }
    }
  };

  const handleSave = async () => {
    if (id) {
      try {
        setLoading(true);
        const { status, ...res } = editableData;
        const updateStatus = await shipmentServices.updateById(id, { ...res });
        if (updateStatus === 200) {
          onClose && onClose();
          forceReloadCb && forceReloadCb();
        };
        setLoading(false);
      } catch (error) {
        console.log(error);
        setLoading(false);
      }
    }
  };

  const refetchData = async () => {
    await fetchData(id);
  }

  return (
    <>
      <Modal open={!!id} onClose={() => onClose && onClose()}>
        <Box sx={modalStyle}>
          <Stack direction={"column"} spacing={2} sx={{ width: "100%", height: "100%" }}>
            <Grid container>
              <Grid size={6} sx={{ display: "flex", alignItems: "center" }}>
                <Box component={"h2"} sx={{ m: 0 }}>Shipment detail</Box>
              </Grid>
              <Grid size={6} sx={{ display: "flex", alignItems: "center", justifyContent: "flex-end" }}>
                <Button variant="contained" loading={loading} onClick={handleSave}>Save</Button>
              </Grid>
            </Grid>
            <Box sx={{ flex: 1, overflow: "auto" }}>
              {data && (
                <>
                  <List disablePadding>
                    <ListItem disablePadding sx={{ mb: 1 }}>
                      <CustomListItem title={"Client"}>
                        <TextField disabled size="small" value={data?.client_name} />
                      </CustomListItem>
                    </ListItem>
                    <ListItem disablePadding sx={{ mb: 1 }}>
                      <CustomListItem title={"Status"}>
                        <Button variant="outlined" onClick={handleClickStatusField}>
                          {SHIPMENT_STATUS_OPTIONS
                            .find((option) => option.value === (data?.status || SHIPMENT_STATUS.OPEN))
                            ?.label
                          }
                        </Button>
                        <Menu
                          open={statusMenuOpen}
                          anchorEl={anchorEl}
                          onClose={handleCloseStatusMenu}
                        >
                          {SHIPMENT_STATUS_OPTIONS.map(({ label, value, disabledStatuses }) => (
                            <MenuItem
                              key={value}
                              selected={data?.status === value}
                              disabled={disabledStatuses.includes(data?.status)}
                              onClick={() => handleChangeStatus(value)}
                            >
                              {label}
                            </MenuItem>
                          ))}
                        </Menu>
                      </CustomListItem>
                    </ListItem>
                    <ListItem disablePadding sx={{ mb: 1 }}>
                      <CustomListItem title={"Arrival date"}>
                        <DateTimePicker disabled value={dayjs(data?.arrival_date)} />
                      </CustomListItem>
                    </ListItem>
                    <ListItem disablePadding sx={{ mb: 1 }}>
                      <CustomListItem title={"Delivery by date"}>
                        <DateTimePicker
                          value={dayjs(editableData?.delivery_by_date)}
                          onChange={(value) => handleChangeInput("delivery_by_date", dayjs(value).toISOString())}
                        />
                      </CustomListItem>
                    </ListItem>
                    <ListItem disablePadding sx={{ mb: 1 }}>
                      <CustomListItem title={"Warehouse ID"}>
                        <TextField disabled size="small" value={data?.warehouse_id || ""} />
                      </CustomListItem>
                    </ListItem>
                    <ListItem disablePadding sx={{ mb: 1 }}>
                      <CustomListItem title={"Assignment ID"}>
                        <TextField disabled size="small" value={data?.assignment_id || ""} />
                      </CustomListItem>
                    </ListItem>
                    <ListItem disablePadding sx={{ mb: 1 }}>
                      <CustomListItem title={"Latitude"}>
                        <TextField
                          size="small"
                          value={editableData?.lat}
                          onChange={(e) => handleChangeInput("lat", e.target.value)}
                        />
                      </CustomListItem>
                    </ListItem>
                    <ListItem disablePadding sx={{ mb: 1 }}>
                      <CustomListItem title={"Longitude"}>
                        <TextField
                          size="small"
                          value={editableData?.lng}
                          onChange={(e) => handleChangeInput("lng", e.target.value)}
                        />
                      </CustomListItem>
                    </ListItem>
                    <ListItem disablePadding sx={{ mb: 1 }}>
                      <MapContainer center={[editableData?.lat, editableData?.lng]} zoom={13} scrollWheelZoom={false} style={{ width: "600px", height: "300px" }}>
                        <TileLayer
                          attribution="&copy; <a href='https://openstreetmap.org'>OpenStreetMap</a> contributors"
                          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        />
                        <Marker position={[editableData?.lat, editableData?.lng]} icon={icon} />
                        <RecenterAutomatically lat={editableData?.lat} lng={editableData?.lng} />
                      </MapContainer>
                    </ListItem>
                  </List>
                </>
              )}
            </Box>
          </Stack>
        </Box >
      </Modal>
      <AssignModal
        open={assignOpen}
        id={id}
        onClose={() => setAssignOpen(false)}
        style={assignModalStyle}
        successCb={() => {
          refetchData();
          setAssignOpen(false);
        }}
      />
    </>
  );
};

export default ShipmentDetailModal;