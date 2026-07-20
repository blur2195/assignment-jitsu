import { useState } from "react";

export const useEntityPage = () => {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [openModal, setOpenModal] = useState(false);
  const [forceReload, setForceReload] = useState(false);

  return {
    selectedId,
    openModal,
    forceReload,
    onRowSelect: setSelectedId,
    openAddModal: () => setOpenModal(true),
    closeAddModal: () => setOpenModal(false),
    closeDetail: () => setSelectedId(null),
    triggerReload: () => setForceReload(true),
    resetReload: () => setForceReload(false),
  };
};
