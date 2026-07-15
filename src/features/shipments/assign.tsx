import { Box, Button, Modal, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TablePagination, TableRow } from "@mui/material";
import { useState } from "react";
import { ASSIGNMENT_STATUS, SHIPMENT_STATUS } from "../../constants";
import { shipmentServices } from "../../services/shipments";
import { Assignment, SearchParams } from "../../store/models";
import useFilter from "../../hooks/filter.hook";
import { assignmentServices } from "../../services";

const mockAssignment: Assignment[] = [
  {
    id: "assi_001",
    label: "Assignment 1",
    status: ASSIGNMENT_STATUS.OPEN,
    clients: [],
    shipment_count: 0,
  },
  {
    id: "assi_002",
    label: "Assignment 2",
    status: ASSIGNMENT_STATUS.OPEN,
    clients: [],
    shipment_count: 0,
  },
  {
    id: "assi_003",
    label: "Assignment 3",
    status: ASSIGNMENT_STATUS.OPEN,
    clients: [],
    shipment_count: 0,
  },
  {
    id: "assi_004",
    label: "Assignment 4",
    status: ASSIGNMENT_STATUS.OPEN,
    clients: [],
    shipment_count: 0,
  },
]

const AssignModal = ({ id, open, onClose, style, successCb }: any) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [assignmentId, setAssignmentId] = useState<any>(null);
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [total, setTotal] = useState<number>(0);
  const defaultFilter = {
    status: ASSIGNMENT_STATUS.OPEN,
    search: null,
  };

  const fetchAssignments = async (params: SearchParams) => {
    try {
      setLoading(true);
      const searchParams = {
        "_page": Number(params.page) + 1,
        "_limit": params.pageSize,
        "label_like": params.search,
        "status": params.status,
      }
      const res = await assignmentServices.getAll(searchParams);
      if (res) {
        setAssignments(res.data);
        setTotal(res.total);
      }
      setLoading(false);
    } catch (error) {
      setLoading(false);
    }
  }

  const {
    filterParams,
    handlePageChange,
    handlePageSizeChange,
  } = useFilter({
    defaultValue: defaultFilter,
    fetchData: fetchAssignments,
    paging: true,
  });

  const handleSaveAssignment = async () => {
    try {
      const updateObj = {
        status: SHIPMENT_STATUS.IN_TRANSIT,
        assignment_id: assignmentId,
      }
      const status = await shipmentServices.updateById(id, updateObj);
      if (status === 200) successCb && successCb();
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  const handleCloseModal = () => {
    setAssignmentId(null);
    onClose && onClose();
  }

  return (
    <Modal open={open} onClose={handleCloseModal}>
      <Box sx={style}>
        <Stack direction={"column"} spacing={2} sx={{ width: "100%", height: "100%" }}>
          <Stack direction={"row"}>
            <Box component={"h2"} sx={{ m: 0, flex: 1 }}>Select Assignment</Box>
            <Button
              variant="contained"
              loading={loading}
              onClick={handleSaveAssignment}
              disabled={!assignmentId}
            >
              Save
            </Button>
          </Stack>
          <Box sx={{ flex: 1, overflow: "auto" }}>
            <TableContainer sx={{ height: "100%" }}>
              <Table stickyHeader sx={{ maxHeight: "100%", overflow: "auto" }}>
                <TableHead>
                  <TableRow>
                    <TableCell align="center">ID</TableCell>
                    <TableCell align="center">Label</TableCell>
                    <TableCell align="center">Status</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  <>
                    {assignments.map((row) => (
                      <TableRow
                        hover
                        key={row.id}
                        sx={{ "&:last-child td, &:last-child th": { border: 0 }, cursor: "pointer" }}
                        selected={row.id === assignmentId}
                        onClick={() => setAssignmentId(row.id)}
                      >
                        <TableCell>{row.id}</TableCell>
                        <TableCell>{row.label}</TableCell>
                        <TableCell>{row.status}</TableCell>
                      </TableRow>
                    ))}
                  </>
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
          <Box sx={{ px: 2, py: 1 }}>
            <TablePagination
              rowsPerPageOptions={[25, 100]}
              component={"div"}
              count={total || 0}
              rowsPerPage={filterParams.pageSize}
              page={filterParams.page}
              onPageChange={handlePageChange}
              onRowsPerPageChange={handlePageSizeChange}
            />
          </Box>
        </Stack>
      </Box>
    </Modal>
  )
}

export default AssignModal;