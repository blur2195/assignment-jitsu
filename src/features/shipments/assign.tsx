import { yupResolver } from "@hookform/resolvers/yup";
import { ModalHeader } from "components";
import { Box, Button, Modal, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TablePagination, TableRow, Typography } from "@mui/material";
import { SxProps, Theme } from "@mui/material/styles";
import { useCallback, useState } from "react";
import { useForm } from "react-hook-form";
import { ASSIGNMENT_STATUS, SHIPMENT_STATUS } from "config";
import { useFilter } from "hooks";
import { assignmentServices, shipmentServices } from "services";
import { Assignment, SearchParams } from "types";
import { buildPaginatedSearchParams } from "utils";
import { assignShipmentSchema, AssignShipmentFormValues } from "validation";

interface AssignModalProps {
  id: string | null;
  open: boolean;
  onClose: () => void;
  style: SxProps<Theme>;
  successCb?: () => void;
}

const AssignModal = ({ id, open, onClose, style, successCb }: AssignModalProps) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [total, setTotal] = useState<number>(0);
  const defaultFilter = {
    status: ASSIGNMENT_STATUS.OPEN,
    search: null,
  };

  const {
    setValue,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm<AssignShipmentFormValues>({
    resolver: yupResolver(assignShipmentSchema),
    defaultValues: {
      assignmentId: "",
    },
  });

  const assignmentId = watch("assignmentId");

  const fetchAssignments = useCallback(async (params: SearchParams) => {
    try {
      setLoading(true);
      const res = await assignmentServices.getAll(buildPaginatedSearchParams(params, "label"));
      setAssignments(res.data);
      setTotal(res.total);
    } catch {
      setAssignments([]);
      setTotal(0);
    } finally {
      setLoading(false);
    }
  }, []);

  const {
    filterParams,
    handlePageChange,
    handlePageSizeChange,
  } = useFilter({
    defaultValue: defaultFilter,
    fetchData: fetchAssignments,
    paging: true,
  });

  const onSubmit = async ({ assignmentId }: AssignShipmentFormValues) => {
    if (!id) return;

    try {
      setLoading(true);
      const updateObj = {
        status: SHIPMENT_STATUS.IN_TRANSIT,
        assignment_id: assignmentId,
      };
      const status = await shipmentServices.updateById(id, updateObj);
      if (status === 200) successCb?.();
    } catch {
      // assignment failed; loading state is cleared below
    } finally {
      setLoading(false);
    }
  };

  const handleCloseModal = () => {
    reset({ assignmentId: "" });
    onClose();
  };

  return (
    <Modal open={open} onClose={handleCloseModal}>
      <Box
        component="form"
        onSubmit={handleSubmit(onSubmit)}
        sx={style}
      >
        <Stack direction={"column"} spacing={2} sx={{ width: "100%", height: "100%" }}>
          <ModalHeader
            title="Select Assignment"
            onClose={handleCloseModal}
            actions={
              <Button type="submit" variant="contained" loading={loading}>
                Save
              </Button>
            }
          />
          {errors.assignmentId && (
            <Typography color="error" variant="body2">
              {errors.assignmentId.message}
            </Typography>
          )}
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
                  {assignments.map((row) => (
                    <TableRow
                      hover
                      key={row.id}
                      sx={{ "&:last-child td, &:last-child th": { border: 0 }, cursor: "pointer" }}
                      selected={row.id === assignmentId}
                      onClick={() => setValue("assignmentId", row.id, { shouldValidate: true })}
                    >
                      <TableCell>{row.id}</TableCell>
                      <TableCell>{row.label}</TableCell>
                      <TableCell>{row.status}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
          <Box sx={{ px: 2, py: 1 }}>
            <TablePagination
              rowsPerPageOptions={[25, 100]}
              component={"div"}
              count={total}
              rowsPerPage={Number(filterParams.pageSize)}
              page={Number(filterParams.page)}
              onPageChange={handlePageChange}
              onRowsPerPageChange={handlePageSizeChange}
            />
          </Box>
        </Stack>
      </Box>
    </Modal>
  );
};

export default AssignModal;
