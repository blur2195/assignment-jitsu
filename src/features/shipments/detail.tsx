import { Box, Button, List, ListItem, Menu, MenuItem, Modal, Stack, TextField } from "@mui/material";
import { DateTimePicker } from "@mui/x-date-pickers";
import dayjs from "dayjs";
import L from "leaflet";
import { useEffect, useState } from "react";
import { MapContainer, Marker, TileLayer, useMap } from "react-leaflet";
import { CustomListItem } from "components";
import { SHIPMENT_STATUS, SHIPMENT_STATUS_OPTIONS } from "config";
import { shipmentServices } from "services";
import { compactModalStyle, modalStyle } from "styles/modal";
import { Shipment } from "types";
import AssignModal from "./assign";

interface ShipmentDetailModalProps {
  id: string | null;
  onClose?: () => void;
  forceReloadCb?: () => void;
  readOnly?: boolean;
  shipmentCords?: [number, number][];
}

interface RecenterMapProps {
  lat: number;
  lng: number;
  shipmentCords?: [number, number][];
}

const icon = L.icon({ iconUrl: "/images/marker.svg", iconSize: [30, 30] });

const RecenterAutomatically = ({ lat, lng, shipmentCords }: RecenterMapProps) => {
  const map = useMap();

  useEffect(() => {
    if (!shipmentCords?.length) {
      map.setView([lat, lng], map.getZoom());
      return;
    }
    shipmentCords?.map((cord) => {
      L.marker(cord, { icon }).addTo(map);
    });
    const polyline = L.polyline(shipmentCords, { color: "lime" }).addTo(map);
    map.fitBounds(polyline.getBounds(), {
      padding: [50, 50],
    });
  }, [map, lat, lng, shipmentCords]);

  return null;
};

const ShipmentDetailModal = ({ id, onClose, forceReloadCb, readOnly, shipmentCords }: ShipmentDetailModalProps) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [data, setData] = useState<Shipment | null>(null);
  const statusMenuOpen = Boolean(anchorEl);
  const isReadOnly = Boolean(readOnly);
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
    successCb?: () => void,
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
      <Modal open={!!id} onClose={() => onClose && onClose()} keepMounted={false}>
        <Box sx={modalStyle}>
          <Stack direction={"column"} spacing={2} sx={{ width: "100%", height: "100%" }}>
            <Stack direction={"row"}>
              <Box component={"h2"} sx={{ m: 0, flex: 1 }}>Shipment detail</Box>
              {!isReadOnly && (
                <Button variant="contained" loading={loading} onClick={handleSave}>Save</Button>
              )}
            </Stack>
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
                        <Button variant="outlined" onClick={handleClickStatusField} disabled={isReadOnly}>
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
                          disabled={isReadOnly}
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
                          disabled={isReadOnly}
                          size="small"
                          value={editableData?.lat}
                          onChange={(e) => handleChangeInput("lat", e.target.value)}
                        />
                      </CustomListItem>
                    </ListItem>
                    <ListItem disablePadding sx={{ mb: 1 }}>
                      <CustomListItem title={"Longitude"}>
                        <TextField
                          disabled={isReadOnly}
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
                        <RecenterAutomatically lat={editableData?.lat} lng={editableData?.lng} shipmentCords={shipmentCords} />
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
        style={compactModalStyle}
        successCb={() => {
          refetchData();
          setAssignOpen(false);
        }}
      />
    </>
  );
};

export default ShipmentDetailModal;