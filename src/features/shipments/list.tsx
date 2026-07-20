import { AddCircle, Delete, Info } from "@mui/icons-material";
import { Box, IconButton, MenuItem, Snackbar, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TablePagination, TableRow, TextField } from "@mui/material";
import dayjs from "dayjs";
import { ChangeEvent } from "react";
import { LoadingOverlay } from "components";
import { SHIPMENT_FILTER_TYPE, SHIPMENT_STATUS } from "config";
import { useEntityList } from "hooks";
import { shipmentServices } from "services";
import { Shipment } from "types";
import { buildPaginatedSearchParams } from "utils";

interface ShipmentListProps {
  onRowSelect: (id: string | null) => void;
  onClickAdd: () => void;
  selectedId: string | null;
  forceReload: boolean;
  forceReloadCb: () => void;
}

const defaultFilter = {
  status: SHIPMENT_STATUS.OPEN,
  search: null,
  searchType: SHIPMENT_FILTER_TYPE.LABEL,
};

const ShipmentList = ({ onRowSelect, selectedId, onClickAdd, forceReload, forceReloadCb }: ShipmentListProps) => {
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
  } = useEntityList<Shipment>({
    defaultFilter,
    buildSearchParams: (params) => buildPaginatedSearchParams(
      params,
      String(params.searchType ?? SHIPMENT_FILTER_TYPE.LABEL),
    ),
    getAll: shipmentServices.getAll,
    deleteById: shipmentServices.deleteById,
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
            <MenuItem key={SHIPMENT_STATUS.OPEN} value={SHIPMENT_STATUS.OPEN}>Open</MenuItem>
            <MenuItem key={SHIPMENT_STATUS.IN_TRANSIT} value={SHIPMENT_STATUS.IN_TRANSIT}>In transit</MenuItem>
            <MenuItem key={SHIPMENT_STATUS.DELIVERED} value={SHIPMENT_STATUS.DELIVERED}>Delivered</MenuItem>
          </TextField>
          <IconButton onClick={onClickAdd} sx={{ flexShrink: 0 }}><AddCircle /></IconButton>
          <TextField
            select
            size="small"
            label="Search by"
            sx={{ md: { minWidth: 120 }, flexShrink: 0 }}
            value={filterParams.searchType}
            onChange={(event: ChangeEvent<HTMLInputElement>) => {
              handleChangeInput("searchType", event.target.value);
            }}
          >
            <MenuItem key={SHIPMENT_FILTER_TYPE.LABEL} value={SHIPMENT_FILTER_TYPE.LABEL}>Label</MenuItem>
            <MenuItem key={SHIPMENT_FILTER_TYPE.CLIENT_NAME} value={SHIPMENT_FILTER_TYPE.CLIENT_NAME}>Client</MenuItem>
          </TextField>
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
                  <TableCell align="center">Arrival Date</TableCell>
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
                    <TableCell align="center">{row.client_name}</TableCell>
                    <TableCell align="center">{dayjs(row.arrival_date).format("DD/MM/YYYY-HH:mm:ss")}</TableCell>
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

export default ShipmentList;
