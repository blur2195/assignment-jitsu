import { AddCircle, Delete, Info } from "@mui/icons-material";
import { Box, Grid, IconButton, MenuItem, Snackbar, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TablePagination, TableRow, TextField } from "@mui/material";
import dayjs from "dayjs";
import { useConfirm } from "material-ui-confirm";
import { useCallback, useEffect, useState } from "react";
import { LoadingOverlay } from "components";
import { SHIPMENT_FILTER_TYPE, SHIPMENT_STATUS } from "config";
import { useFilter } from "hooks";
import { shipmentServices } from "services";
import { SearchParams, Shipment } from "types";

interface ShipmentListProps {
  onRowSelect: (id: string | null) => void;
  onClickAdd: () => void;
  selectedId: string | null;
  forceReload: boolean;
  forceReloadCb: () => void;
}

const ShipmentList = ({ onRowSelect, selectedId, onClickAdd, forceReload, forceReloadCb }: ShipmentListProps) => {
  const [rows, setRows] = useState<Shipment[]>([]);
  const [totalRow, setTotalRow] = useState<number | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [open, setOpen] = useState<boolean>(false);
  const confirm = useConfirm();
  const defaultFilter = {
    status: SHIPMENT_STATUS.OPEN,
    search: null,
    searchType: SHIPMENT_FILTER_TYPE.LABEL,
  };

  const fetchData = useCallback(async (params: SearchParams) => {
    try {
      setLoading(true);
      const searchParams = {
        "_page": Number(params.page) + 1,
        "_limit": params.pageSize,
        [params.searchType + "_like"]: params.search,
        "status": params.status,
      };
      const res = await shipmentServices.getAll(searchParams);
      if (res) {
        setRows(res.data);
        setTotalRow(res.total);
      }
      setLoading(false);
    } catch (error) {
      setLoading(false);
    }
  }, []);

  const {
    filterParams,
    handleChangeInput,
    handlePageChange,
    handlePageSizeChange,
  } = useFilter({
    defaultValue: defaultFilter,
    fetchData,
    paging: true,
  });

  const onRowDetailClick = (id: string) => {
    if (id === selectedId) onRowSelect(null);
    else onRowSelect(id);
  };

  const onRowDeleteClick = async (id: string) => {
    const { confirmed } = await confirm({
      description: "This action is permanent!",
    });

    if (confirmed) {
      try {
        setLoading(true);
        const status = await shipmentServices.deleteById(id);
        if (status === 200) {
          handlePageChange(null, Number(filterParams.page));
          setOpen(true);
        }
        setLoading(false);
      } catch (error) {
        setLoading(false);
      }
    };
  };

  const handleForceReload = async () => {
    handlePageChange(null, Number(filterParams.page));
    forceReloadCb();
  };

  useEffect(() => {
    if (forceReload) handleForceReload();
  }, [forceReload]);

  return (
    <>
      <Stack direction={"column"} sx={{ width: "100%", height: "100%" }}>
        <Grid container sx={{ px: 2, py: 1 }}>
          <Grid size={6}>
            <Stack direction={"row"} spacing={2}>
              <TextField
                select
                label="Status"
                sx={{ minWidth: 120 }}
                value={filterParams.status}
                onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                  handleChangeInput("status", event.target.value);
                }}
              >
                <MenuItem key={SHIPMENT_STATUS.OPEN} value={SHIPMENT_STATUS.OPEN}>Open</MenuItem>
                <MenuItem key={SHIPMENT_STATUS.IN_TRANSIT} value={SHIPMENT_STATUS.IN_TRANSIT}>In transit</MenuItem>
                <MenuItem key={SHIPMENT_STATUS.DELIVERED} value={SHIPMENT_STATUS.DELIVERED}>Delivered</MenuItem>
              </TextField>
              <IconButton onClick={onClickAdd}><AddCircle /></IconButton>
            </Stack>
          </Grid>
          <Grid size={6}>
            <Stack direction={"row"} spacing={1}>
              <TextField
                select
                label="Search by"
                sx={{ minWidth: 120 }}
                value={filterParams.searchType}
                onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                  handleChangeInput("searchType", event.target.value);
                }}
              >
                <MenuItem key={SHIPMENT_FILTER_TYPE.LABEL} value={SHIPMENT_FILTER_TYPE.LABEL}>Label</MenuItem>
                <MenuItem key={SHIPMENT_FILTER_TYPE.CLIENT_NAME} value={SHIPMENT_FILTER_TYPE.CLIENT_NAME}>Client</MenuItem>
              </TextField>
              <TextField
                fullWidth
                label="Search"
                variant="outlined"
                onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                  handleChangeInput("search", event.target.value);
                }}
              />
            </Stack>
          </Grid>
        </Grid>
        <Box sx={{ flex: 1, minHeight: 0, overflow: "hidden", position: "relative" }}>
          {loading && <LoadingOverlay />}
          <TableContainer sx={{ height: "100%" }}>
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
        <Box sx={{ px: 2, py: 1 }}>
          <TablePagination
            rowsPerPageOptions={[25, 100]}
            component={"div"}
            count={totalRow || 0}
            rowsPerPage={Number(filterParams.pageSize)}
            page={Number(filterParams.page)}
            onPageChange={handlePageChange}
            onRowsPerPageChange={handlePageSizeChange}
          />
        </Box>
      </Stack>
      <Snackbar
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
        open={open}
        onClose={() => setOpen(false)}
        message="Deleted!"
      />
    </>
  );
};

export default ShipmentList;
