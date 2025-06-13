/* eslint-disable react-hooks/exhaustive-deps */
import {
  cn,
  Pagination,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableProps,
  TableRow,
} from "@nextui-org/react";
import React, { Key, useMemo } from "react";

export interface Column {
  header?: string;
  accessor: string;
  template?: (item: any) => React.ReactNode;
  type?: "icon" | "text" | "price";
  align?: "start" | "center" | "end";
  width?: number;
}

interface Props extends TableProps {
  columns: Column[];
  data: any[];
  footerComponent?: React.ReactNode;
  emptyMessage?: string;
  hasPagination?: boolean;
  paginationProps?: {
    currentPage: number;
    totalPages: number;
    handlePageChange: (page: number) => void;
  }
}

export const CustomTable: React.FC<Props> = ({
  columns,
  data,
  footerComponent,
  emptyMessage = "No hay datos disponibles",
  hasPagination = false,
  paginationProps: { currentPage, totalPages, handlePageChange } = {
    currentPage: 1,
    totalPages: 1,
    handlePageChange: () => {},
  },
  ...props
}) => {
  const renderRow = (item: any, columnKey: Key) => {
    const column = columns.find((c) => c.accessor === columnKey);
    if (!column) return null;
    if (column.template) {
      return <div key={column.accessor}>{column.template(item)}</div>;
    }
    // Solo retorna el valor simple, sin lógica de imagen ni precio
    return item[column.accessor];
  };

  const items = useMemo(() => {
    return data.map((d, id) => ({ ...d, id }));
  }, [data, columns]);

  return (
    <div>
      <Table
        isStriped 
        bottomContent={footerComponent}
        aria-label="Custom table"
        {...props}
      >
        <TableHeader columns={columns}>
          {(column) => (
            <TableColumn
              align={column.align}
              className="bg-dark text-white"
              width={column.width}
              key={column.accessor}
            >
              {column.header}
            </TableColumn>
          )}
        </TableHeader>
        <TableBody emptyContent={emptyMessage} items={items}>
          {(item) => (
            <TableRow>
              {(columnKey) => (
                <TableCell>{renderRow(item, columnKey)}</TableCell>
              )}
            </TableRow>
          )}
        </TableBody>
      </Table>
      {/* Paginación */}
      {hasPagination && items.length ? (
        <div className="mt-2">
          <Pagination
            isCompact
            showControls
            total={totalPages}
            page={currentPage}
            onChange={handlePageChange}
            classNames={{
              cursor: "bg-dark",
            }}
          />
        </div>
      ) : null}
    </div>
  );
};
