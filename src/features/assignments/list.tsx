import { AddCircle, Delete, Info } from "@mui/icons-material";
import { Box, CircularProgress, Grid, IconButton, MenuItem, Snackbar, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TablePagination, TableRow, TextField } from "@mui/material";
import { useConfirm } from "material-ui-confirm";
import { useEffect, useState } from "react";
import { ASSIGNMENT_STATUS } from "../../constants";
import useFilter from "../../hooks/filter.hook";
import { assignmentServices } from "../../services";
import { Assignment, SearchParams } from "../../store/models";

interface AssignmentListProps {
  onRowSelect: Function;
  onClickAdd: Function;
  selectedId: string | null;
  forceReload: boolean;
  forceReloadCb: Function;
}

const AssignmentList = ({ onRowSelect, selectedId, onClickAdd, forceReload, forceReloadCb }: AssignmentListProps) => {
  const [rows, setRows] = useState<Assignment[]>([]);
  const [totalRow, setTotalRow] = useState<number | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [open, setOpen] = useState<boolean>(false);
  const confirm = useConfirm();
  const defaultFilter = {
    status: ASSIGNMENT_STATUS.OPEN,
    search: null,
  }

  const fetchData = async (params: SearchParams) => {
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
        setRows(res.data);
        setTotalRow(res.total);
      }
      setLoading(false);
    } catch (error) {
      setLoading(false);
    }
  };

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
        const status = await assignmentServices.deleteById(id);
        if (status === 200) {
          handlePageChange(null, filterParams.page);
          setOpen(true);
        }
        setLoading(false);
      } catch (error) {
        setLoading(false);
      }
    };
  };

  const handleForceReload = async () => {
    handlePageChange(null, filterParams.page);
    forceReloadCb();
  };

  useEffect(() => {
    if (forceReload) handleForceReload();
  }, [forceReload])

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
                <MenuItem key={ASSIGNMENT_STATUS.OPEN} value={ASSIGNMENT_STATUS.OPEN}>Open</MenuItem>
                <MenuItem key={ASSIGNMENT_STATUS.COMPLETED} value={ASSIGNMENT_STATUS.COMPLETED}>Completed</MenuItem>
              </TextField>
              <IconButton onClick={() => onClickAdd()}><AddCircle /></IconButton>
            </Stack>
          </Grid>
          <Grid size={6}>
            <TextField
              fullWidth
              label="Search"
              variant="outlined"
              onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                handleChangeInput("search", event.target.value);
              }}
            />
          </Grid>
        </Grid>
        <Box sx={{ flex: 1, minHeight: 0, overflow: "hidden", position: "relative" }}>
          {loading && (
            <Box sx={{
              position: "absolute",
              left: 0,
              right: 0,
              top: 0,
              bottom: 0,
              zIndex: 999,
              bgcolor: "gray",
              opacity: 0.5,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}>
              <CircularProgress />
            </Box>
          )}
          <TableContainer sx={{ height: "100%" }}>
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
                <>
                  {rows?.map((row) => (
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
                </>
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
        <Box sx={{ px: 2, py: 1 }}>
          <TablePagination
            rowsPerPageOptions={[25, 100]}
            component={"div"}
            count={totalRow || 0}
            rowsPerPage={filterParams.pageSize}
            page={filterParams.page}
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

export default AssignmentList;
