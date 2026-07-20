import { useCallback, useEffect, useState } from "react";
import { DEFAULT_FIRST_PAGE, DEFAULT_PAGE_SIZE } from "config";
import { SearchParams } from "types";

interface UseFilterProps {
  defaultValue: SearchParams;
  fetchData: (params: SearchParams) => void | Promise<void>;
  paging?: boolean;
}

const useFilter = ({
  defaultValue,
  fetchData,
  paging = false,
}: UseFilterProps) => {
  const [filterParams, setFilterParams] = useState<SearchParams>({
    ...(paging ? {
      page: DEFAULT_FIRST_PAGE,
      pageSize: DEFAULT_PAGE_SIZE,
    } : {}),
    ...defaultValue,
    immediate: false,
  });
  const [firstLoad, setFirstLoad] = useState(true);

  const handleChangeParams = useCallback((values: { name: string, value: unknown }[]) => {
    const haveImmediate = values.some(item => item.name === "immediate");
    setFilterParams((prev) => ({
      ...prev,
      ...values.reduce<SearchParams>(
        (obj, item) => ({
          ...obj,
          [item.name]: item.value,
        }), {}
      ),
      ...(haveImmediate ? {} : { immediate: false }),
    }));
  }, []);

  const handleChangeInput = useCallback((name: string, value: unknown, immediate: boolean = false) => {
    handleChangeParams([
      ...(paging ? [
        { name: "page", value: DEFAULT_FIRST_PAGE }
      ] : []),
      { name, value },
      { name: "immediate", value: immediate },
    ]);
  }, [handleChangeParams, paging]);

  const handlePageChange = (_: React.MouseEvent<HTMLButtonElement> | null, newPage: number) => {
    handleChangeParams([
      { name: "page", value: newPage },
      { name: "immediate", value: true },
    ]);
  };

  const handlePageSizeChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    handleChangeParams([
      { name: "page", value: DEFAULT_FIRST_PAGE },
      { name: "pageSize", value: parseInt(event.target.value, 10) },
      { name: "immediate", value: true },
    ]);
  };

  useEffect(() => {
    const { immediate, ...filters } = filterParams;
    const timeOut = setTimeout(() => {
      fetchData(filters);
      firstLoad && setFirstLoad(false);
    }, immediate ? 0 : 500);

    return () => {
      clearTimeout(timeOut);
    };
  }, [filterParams]);

  return {
    filterParams,
    firstLoad,
    handleChangeInput,
    handlePageChange,
    handlePageSizeChange,
  };
};

export default useFilter;
