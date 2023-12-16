import React from "react";
import { IOption } from "../utils";

interface DataTableProps {
  data: Array<{
    name: string;
    ourPrice: number | null;
    marketMin: number | null;
  }>;
  columns: Array<{
    title: string;
    key: string;
    width: number; // in %
  }>;
}

const DataTable: React.FC<DataTableProps> = ({ data, columns }) => {
  return (
    <table className="w-full bg-white overflow-y-scroll">
      <tbody>
        {data.map((row, rowIndex) => (
          <tr
            key={rowIndex}
            className={`${
              !row.ourPrice ? "border" : rowIndex % 2 === 0 ? "bg-accent" : "e"
            } cursor-pointer `}
          >
            {columns.map((column, columnIndex) => (
              <td
                key={columnIndex}
                style={{ width: `${column.width}%` }}
                className={`text-sm text-gray-900 py-1`}
              >
                {/* @ts-ignore */}
                {row[column.key]}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default DataTable;
