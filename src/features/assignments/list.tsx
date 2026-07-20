import { AddCircle, Delete, Info } from "@mui/icons-material";
import { Box, IconButton, MenuItem, Snackbar, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TablePagination, TableRow, TextField } from "@mui/material";
import { ChangeEvent } from "react";
import { LoadingOverlay } from "components";
import { ASSIGNMENT_STATUS } from "config";
import { useEntityList } from "hooks";
import { assignmentServices } from "services";
import { Assignment } from "types";
import { buildPaginatedSearchParams } from "utils";

interface AssignmentListProps {
  onRowSelect: (id: string | null) => void;
  onClickAdd: () => void;
  selectedId: string | null;
  forceReload: boolean;
  forceReloadCb: () => void;
}

const defaultFilter = {
  status: ASSIGNMENT_STATUS.OPEN,
  search: null,
};

const AssignmentList = ({ onRowSelect, selectedId, onClickAdd, forceReload, forceReloadCb }: AssignmentListProps) => {
  const {
    rows,
    totalRow,
    loading,
    deletedSnackbarOpen,
    setDeletedSnackbarOpen,
    filterParams,
    handleChangeInput,
    handlePageChange,
    handlePageSizeChange,
    onRowDeleteClick,
  } = useEntityList<Assignment>({
    defaultFilter,
    buildSearchParams: (params) => buildPaginatedSearchParams(params, "label"),
    getAll: assignmentServices.getAll,
    deleteById: assignmentServices.deleteById,
    forceReload,
    forceReloadCb,
  });

  const onRowDetailClick = (id: string) => {
    if (id === selectedId) onRowSelect(null);
    else onRowSelect(id);
  };

  return (
    <>
      <Stack direction={"column"} sx={{ width: "100%", height: "100%" }}>
        <Stack
          direction="row"
          spacing={1}
          sx={{ px: 2, py: 1, flexWrap: "nowrap", overflowX: "auto", alignItems: "center" }}
        >
          <TextField
            select
            size="small"
            label="Status"
            sx={{ md: { minWidth: 120 }, flexShrink: 0 }}
            value={filterParams.status}
            onChange={(event: ChangeEvent<HTMLInputElement>) => {
              handleChangeInput("status", event.target.value);
            }}
          >
            <MenuItem key={ASSIGNMENT_STATUS.OPEN} value={ASSIGNMENT_STATUS.OPEN}>Open</MenuItem>
            <MenuItem key={ASSIGNMENT_STATUS.COMPLETED} value={ASSIGNMENT_STATUS.COMPLETED}>Completed</MenuItem>
          </TextField>
          <IconButton onClick={onClickAdd} sx={{ flexShrink: 0 }}><AddCircle /></IconButton>
          <TextField
            size="small"
            label="Search"
            variant="outlined"
            sx={{ flex: 1, md: { minWidth: 120 } }}
            onChange={(event: ChangeEvent<HTMLInputElement>) => {
              handleChangeInput("search", event.target.value);
            }}
          />
        </Stack>
        <Box sx={{ flex: 1, minHeight: 0, overflow: "hidden", position: "relative" }}>
          {loading && <LoadingOverlay />}
          <TableContainer sx={{ height: "100%", overflowX: "auto" }}>
            <Table stickyHeader sx={{ maxHeight: "100%", overflow: "auto" }}>
              <TableHead>
                <TableRow>
                  <TableCell align="center">Label</TableCell>
                  <TableCell align="center">Client name</TableCell>
                  <TableCell align="center">Shipment count</TableCell>
                  <TableCell align="center">Action</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {rows.map((row) => (
                  <TableRow
                    hover
                    key={row.id}
                    sx={{ "&:last-child td, &:last-child th": { border: 0 }, cursor: "pointer" }}
                    selected={row.id === selectedId}
                  >
                    <TableCell>{row.label}</TableCell>
                    <TableCell align="center">{row.clients?.join(", ")}</TableCell>
                    <TableCell align="center">{row.shipment_count}</TableCell>
                    <TableCell align="center">
                      <IconButton onClick={() => onRowDetailClick(row.id)}>
                        <Info />
                      </IconButton>
                      <IconButton onClick={() => onRowDeleteClick(row.id)}>
                        <Delete />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
        <Box sx={{ px: { xs: 1, sm: 2 }, py: 1 }}>
          <TablePagination
            rowsPerPageOptions={[25, 100]}
            component={"div"}
            count={totalRow}
            rowsPerPage={Number(filterParams.pageSize)}
            page={Number(filterParams.page)}
            onPageChange={handlePageChange}
            onRowsPerPageChange={handlePageSizeChange}
            sx={{
              ".MuiTablePagination-toolbar": {
                flexWrap: "wrap",
                justifyContent: { xs: "center", sm: "flex-end" },
                gap: 1,
              },
            }}
          />
        </Box>
      </Stack>
      <Snackbar
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
        open={deletedSnackbarOpen}
        onClose={() => setDeletedSnackbarOpen(false)}
        message="Deleted!"
      />
    </>
  );
};

export default AssignmentList;
