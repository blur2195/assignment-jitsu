import { Box, List, ListItem, Modal, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField } from "@mui/material";
import { useEffect, useMemo, useState } from "react";
import { CustomListItem } from "components";
import { assignmentServices, shipmentServices } from "services";
import { modalStyle } from "styles/modal";
import { Assignment, Shipment } from "types";
import ShipmentDetailModal from "../shipments/detail";

interface AssignmentDetailModalProps {
  id: string | null;
  onClose?: () => void;
  forceReloadCb?: () => void;
}

const AssignmentDetailModal = ({ id, onClose }: AssignmentDetailModalProps) => {
  const [data, setData] = useState<Assignment | null>(null);
  const [assignedList, setAssignedList] = useState<Shipment[]>([]);
  const [totalAssigned, setTotalAssigned] = useState<number>(0);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const fetchData = async (id: string | null) => {
    if (id) {
      try {
        const res = await assignmentServices.getById(id);
        if (res) setData(res);
        const assignedListRes = await shipmentServices.getByAssignmentId(id);
        if (assignedListRes) {
          setAssignedList(assignedListRes);
          setTotalAssigned(assignedListRes.length);
        };
      } catch (error) {
      }
    }
  };

  const allShipmentCords = useMemo<[number, number][]>(() => {
    return assignedList.map(shipment => ([shipment.lat, shipment.lng]));
  }, [assignedList]);

  useEffect(() => {
    if (id !== null) fetchData(id);
    else setData(null);
  }, [id]);

  return (
    <>
      <Modal open={!!id} onClose={() => onClose && onClose()}>
        <Box sx={modalStyle}>
          <Stack direction={"column"} spacing={2} sx={{ width: "100%", height: "100%" }}>
            <Box component={"h2"} sx={{ m: 0 }}>Assignment detail</Box>
            <Box sx={{ flex: 1, overflow: "auto" }}>
              {data && (
                <>
                  <List disablePadding>
                    <ListItem disablePadding sx={{ mb: 1 }}>
                      <CustomListItem title={"Label"}>
                        <TextField disabled size="small" value={data?.label} />
                      </CustomListItem>
                    </ListItem>
                    <ListItem disablePadding>
                      {!!totalAssigned && (
                        <TableContainer sx={{ height: "100%" }}>
                          <Table stickyHeader sx={{ maxHeight: "100%", overflow: "auto" }}>
                            <TableHead>
                              <TableRow>
                                <TableCell align="center">Label</TableCell>
                                <TableCell align="center">Status</TableCell>
                              </TableRow>
                            </TableHead>
                            <TableBody>
                              {assignedList.map((row) => (
                                <TableRow
                                  hover
                                  key={row.id}
                                  sx={{ "&:last-child td, &:last-child th": { border: 0 }, cursor: "pointer" }}
                                  onClick={() => setSelectedId(row.id)}
                                >
                                  <TableCell>{row.label}</TableCell>
                                  <TableCell>{row.status}</TableCell>
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>
                        </TableContainer>
                      )}
                    </ListItem>
                  </List>
                </>
              )}
            </Box>
          </Stack>
        </Box >
      </Modal>
      <ShipmentDetailModal
        id={selectedId}
        onClose={() => setSelectedId(null)}
        forceReloadCb={() => {}}
        readOnly={true}
        shipmentCords={allShipmentCords}
      />
    </>
  );
};

export default AssignmentDetailModal;
