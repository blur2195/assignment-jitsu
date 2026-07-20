import { useEntityPage } from "hooks";
import AddModal from "./add";
import AssignmentDetail from "./detail";
import AssignmentList from "./list";

const Assignments = () => {
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
      <AssignmentList
        onRowSelect={onRowSelect}
        selectedId={selectedId}
        onClickAdd={openAddModal}
        forceReload={forceReload}
        forceReloadCb={resetReload}
      />
      <AssignmentDetail
        id={selectedId}
        onClose={closeDetail}
      />
      <AddModal
        openModal={openModal}
        closeModal={closeAddModal}
        forceReloadCb={triggerReload}
      />
    </>
  );
};

export default Assignments;
