import { useConfirm } from "material-ui-confirm";
import { useCallback, useEffect, useState } from "react";
import { SearchParams, ServiceResponse } from "types";
import useFilter from "./useFilter";

interface UseEntityListOptions<T> {
  defaultFilter: SearchParams;
  buildSearchParams: (params: SearchParams) => Record<string, unknown>;
  getAll: (searchParams: Record<string, unknown>) => Promise<ServiceResponse<T>>;
  deleteById: (id: string) => Promise<number>;
  forceReload?: boolean;
  forceReloadCb?: () => void;
}

export const useEntityList = <T extends { id: string }>({
  defaultFilter,
  buildSearchParams,
  getAll,
  deleteById,
  forceReload = false,
  forceReloadCb,
}: UseEntityListOptions<T>) => {
  const [rows, setRows] = useState<T[]>([]);
  const [totalRow, setTotalRow] = useState(0);
  const [loading, setLoading] = useState(false);
  const [deletedSnackbarOpen, setDeletedSnackbarOpen] = useState(false);
  const confirm = useConfirm();

  const fetchData = useCallback(async (params: SearchParams) => {
    try {
      setLoading(true);
      const res = await getAll(buildSearchParams(params));
      setRows(res.data);
      setTotalRow(res.total);
    } catch {
      setRows([]);
      setTotalRow(0);
    } finally {
      setLoading(false);
    }
  }, [buildSearchParams, getAll]);

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

  const refetch = useCallback(() => {
    handlePageChange(null, Number(filterParams.page));
  }, [filterParams.page, handlePageChange]);

  useEffect(() => {
    if (forceReload) {
      refetch();
      forceReloadCb?.();
    }
  }, [forceReload, forceReloadCb, refetch]);

  const onRowDeleteClick = async (id: string) => {
    const { confirmed } = await confirm({
      description: "This action is permanent!",
    });

    if (!confirmed) return;

    try {
      setLoading(true);
      const status = await deleteById(id);
      if (status === 200) {
        refetch();
        setDeletedSnackbarOpen(true);
      }
    } catch {
      // deletion failed silently; loading state is cleared below
    } finally {
      setLoading(false);
    }
  };

  return {
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
    refetch,
  };
};
