import { useCallback, useEffect, useState } from "react";
import { DEFAULT_FIRST_PAGE, DEFAULT_PAGE_SIZE } from "../constants";
import { SearchParams } from "../store/models";

interface UseFilterProps {
  defaultValue: SearchParams;
  fetchData: Function;
  paging?: boolean;
}

const useFilter = (props: UseFilterProps = {
  defaultValue: {},
  fetchData: () => { },
  paging: false,
}) => {
  const [filterParams, setFilterParams] = useState<any>({
    ...(props.paging ? {
      page: DEFAULT_FIRST_PAGE,
      pageSize: DEFAULT_PAGE_SIZE,
    } : {}),
    ...props.defaultValue,
    immediate: false,
  });
  const [firstLoad, setFirstLoad] = useState(true);

  const handleChangeInput = useCallback((name: string, value: any, immediate: boolean = false) => {
    handleChangeParams([
      ...(props.paging ? [
        { name: 'page', value: DEFAULT_FIRST_PAGE }
      ] : []),
      { name, value },
      { name: 'immediate', value: immediate },
    ])
  }, [props.paging]);

  const handlePageChange = (_: React.MouseEvent<HTMLButtonElement> | null, newPage: number) => {
    handleChangeParams([
      { name: 'page', value: newPage },
      { name: 'immediate', value: true },
    ]);
  };

  const handlePageSizeChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    handleChangeParams([
      { name: 'page', value: DEFAULT_FIRST_PAGE },
      { name: 'pageSize', value: parseInt(event.target.value, 10) },
      { name: 'immediate', value: true },
    ])
  }

  const handleChangeParams = (values: { name: string, value: any }[]) => {
    const haveImmediate = values.some(item => item.name === 'immediate');
    setFilterParams((prev: any) => ({
      ...prev,
      ...values.reduce(
        (obj, item) => ({
          ...obj,
          [item.name]: item.value,
        }), {}
      ),
      ...(haveImmediate ? {} : { immediate: false }),
    }));
  };

  useEffect(() => {
    const { immediate, ...filters } = filterParams;
    const timeOut = setTimeout(() => {
      props.fetchData(filters);
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
    handlePageSizeChange
  };
}

export default useFilter;