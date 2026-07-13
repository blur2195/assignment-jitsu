import { Grid, Paper } from "@mui/material";
import { useState } from "react";
import ShipmentDetail from "./detail";
import ShipmentList from "./list";
import AddModal from "./add";

const Shipments = () => {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [openModal, setOpenModal] = useState<boolean>(false);
  const [forceReload, setForceReload] = useState<boolean>(false);

  const onRowSelect = (id: string | null) => {
    setSelectedId(id);
  }
  return (
    <>
      <Paper sx={{ width: "100vw", height: "100vh", margin: 0, borderRadius: 0 }}>
        <Grid container sx={{ height: "100%", width: "100%" }}>
          <Grid size={6} sx={{ height: "100%" }}>
            <ShipmentList
              onRowSelect={onRowSelect}
              selectedId={selectedId}
              onClickAdd={() => setOpenModal(true)}
              forceReload={forceReload}
              forceReloadCb={() => setForceReload(false)}
            />
          </Grid>
          <Grid size={6} sx={{ height: "100%" }}>
            <ShipmentDetail id={selectedId} />
          </Grid>
        </Grid>
        <AddModal
          openModal={openModal}
          closeModal={() => setOpenModal(false)}
          forceReloadCb={() => setForceReload(true)}
        />
      </Paper>
    </>
  );
};

export default Shipments;