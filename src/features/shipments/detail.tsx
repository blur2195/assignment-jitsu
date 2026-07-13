import { Box, Button, Grid, List, ListItem, MenuItem, Stack, TextField } from "@mui/material";
import { DateTimePicker } from "@mui/x-date-pickers";
import dayjs from "dayjs";
import L from "leaflet";
import { useEffect, useState } from "react";
import { MapContainer, Marker, TileLayer, useMap } from "react-leaflet";
import { SHIPMENT_STATUS } from "../../constants";
import { shipmentServices } from "../../services/shipments";
import { Shipment } from "../../store/models";

interface ShipmentDetailProps {
  id: string | null;
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

const ShipmentDetail = ({ id }: ShipmentDetailProps) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [data, setData] = useState<Shipment | null>(null);
  const [editableData, setEditableData] = useState<any>({
    lat: null,
    lng: null,
    delivery_by_date: null,
  });

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

  const handleSave = async () => {
    if (id) {
      try {
        setLoading(true);
        const status = await shipmentServices.updateById(id, { ...data, ...editableData });
        if (status === 200) {
        }
        setLoading(false);
      } catch (error) {
        setLoading(false);
      }
    }
  }

  return (
    <>
      {id && data && (
        <>
          <Stack direction={"column"} sx={{ width: "100%", height: "100%" }}>
            <Grid container sx={{ p: 2, height: 88 }}>
              <Grid size={6} sx={{ display: "flex", alignItems: "center" }}>
                <Box component={"h2"} sx={{ m: 0 }}>Shipment detail</Box>
              </Grid>
              <Grid size={6} sx={{ display: "flex", alignItems: "center", justifyContent: "flex-end" }}>
                <Button variant="contained" loading={loading} onClick={handleSave}>Save</Button>
              </Grid>
            </Grid>
            <List>
              <ListItem>
                <CustomListItem title={"Client"}>
                  <TextField disabled size="small" value={data?.client_name} />
                </CustomListItem>
              </ListItem>
              {data?.status && (
                <ListItem>
                  <CustomListItem title={"Status"}>
                    <TextField
                      select
                      sx={{ minWidth: 120 }}
                      value={data?.status ?? SHIPMENT_STATUS.OPEN}
                      onChange={(event: React.ChangeEvent<HTMLInputElement>) => {

                      }}
                    >
                      <MenuItem key={SHIPMENT_STATUS.OPEN} value={SHIPMENT_STATUS.OPEN}>Open</MenuItem>
                      <MenuItem key={SHIPMENT_STATUS.IN_TRANSIT} value={SHIPMENT_STATUS.IN_TRANSIT}>In transit</MenuItem>
                      <MenuItem key={SHIPMENT_STATUS.DELIVERED} value={SHIPMENT_STATUS.DELIVERED}>Delivered</MenuItem>
                    </TextField>
                  </CustomListItem>
                </ListItem>
              )}
              <ListItem>
                <CustomListItem title={"Arrival date"}>
                  <DateTimePicker disabled value={dayjs(data?.arrival_date)} />
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
                  <TextField disabled size="small" value={data?.warehouse_id} />
                </CustomListItem>
              </ListItem>
              <ListItem>
                <CustomListItem title={"Assignment ID"}>
                  <TextField disabled size="small" value={data?.assignment_id} />
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
              <ListItem>
                <MapContainer center={[editableData?.lat, editableData?.lng]} zoom={13} scrollWheelZoom={false} style={{ width: "600px", height: "300px" }}>
                  <TileLayer
                    attribution='&copy; <a href="https://openstreetmap.org">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  />
                  <Marker position={[editableData?.lat, editableData?.lng]} icon={icon} />
                  <RecenterAutomatically lat={editableData?.lat} lng={editableData?.lng} />
                </MapContainer>
              </ListItem>
            </List>
          </Stack>
        </>
      )}
    </>
  );
};

export default ShipmentDetail;