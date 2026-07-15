import { useState } from "react";
import AddModal from "./add";
import AssignmentDetail from "./detail";
import AssignmentList from "./list";

const Assignments = () => {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [openModal, setOpenModal] = useState<boolean>(false);
  const [forceReload, setForceReload] = useState<boolean>(false);

  const onRowSelect = (id: string | null) => {
    setSelectedId(id);
  };

  return (
    <>
      <AssignmentList
        onRowSelect={onRowSelect}
        selectedId={selectedId}
        onClickAdd={() => setOpenModal(true)}
        forceReload={forceReload}
        forceReloadCb={() => setForceReload(false)}
      />
      <AssignmentDetail
        id={selectedId}
        onClose={() => setSelectedId(null)}
        forceReloadCb={() => setForceReload(true)}
      />
      <AddModal
        openModal={openModal}
        closeModal={() => setOpenModal(false)}
        forceReloadCb={() => setForceReload(true)}
      />
    </>
  );
};

export default Assignments;