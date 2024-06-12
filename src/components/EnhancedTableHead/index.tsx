import { TableCell, TableHead, TableRow, TableSortLabel, Checkbox } from "@mui/material";

interface HeaderCell<T extends string> {
  id: T;
  label: string;
  canOrder?: boolean;
}

interface EnhancedTableProps<T extends string> {
  order: "asc" | "desc";
  orderBy: string;
  onRequestSort: (e: any, property: T) => void;
  headCells: HeaderCell<T>[];
  onSelectAll?: (isSelectAll: boolean) => void;
  selectAll?: boolean;
}

export default function EnhancedTableHead<T extends string = string>(props: EnhancedTableProps<T>) {
  const { order, orderBy, onRequestSort, headCells, onSelectAll, selectAll } =
    props;
  const showCheckBox = typeof onSelectAll === "function";
  const createSortHandler =
    (property: T) => (event: React.MouseEvent<unknown>) => {
      onRequestSort(event, property);
    };

  return (
    <TableHead>
      <TableRow>
        {showCheckBox && (
          <TableCell padding="checkbox">
            <Checkbox onChange={(_, checked) => onSelectAll(checked)} value={selectAll} />
          </TableCell>
        )}
        {headCells.map((headCell) => {
          return !!headCell.canOrder ? (<TableCell
            key={headCell.id}
            sortDirection={orderBy === headCell.id ? order : false}
            onClick={createSortHandler(headCell.id)}
          >
            <TableSortLabel
              active={orderBy === headCell.id}
              direction={orderBy === headCell.id ? order : 'asc'}
              style={{
                margin: "0",
                fontSize: "14px",
                fontFamily: "Roboto,sans-serif",
                lineHeight: "1.5",
                marginBottom: "4px",
                fontWeight: "700",
              }}
            >
              {headCell.label}
            </TableSortLabel>
          </TableCell>) : (
            <TableCell key={headCell.id}>
              {headCell.label}
            </TableCell>
          )
        })}
        <TableCell></TableCell>
      </TableRow>
    </TableHead>
  );
}