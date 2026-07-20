import { useEntityPage } from "hooks";
import AddModal from "./add";
import ShipmentDetailModal from "./detail";
import ShipmentList from "./list";

const Shipments = () => {
  const {
    selectedId,
    openModal,
    forceReload,
    onRowSelect,
    openAddModal,
    closeAddModal,
    closeDetail,
    triggerReload,
    resetReload,
  } = useEntityPage();

  return (
    <>
      <ShipmentList
        onRowSelect={onRowSelect}
        selectedId={selectedId}
        onClickAdd={openAddModal}
        forceReload={forceReload}
        forceReloadCb={resetReload}
      />
      <ShipmentDetailModal
        id={selectedId}
        onClose={closeDetail}
        forceReloadCb={triggerReload}
      />
      <AddModal
        openModal={openModal}
        closeModal={closeAddModal}
        forceReloadCb={triggerReload}
      />
    </>
  );
};

export default Shipments;
