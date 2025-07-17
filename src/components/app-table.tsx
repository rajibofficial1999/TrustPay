import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

type THead = string;

interface AppTableProps {
  theads: THead[];
  children?: React.ReactNode;
}

const AppTable = ({ theads, children }: AppTableProps) => {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          {theads.map((thead) => (
            <TableHead key={thead}>{thead}</TableHead>
          ))}
        </TableRow>
      </TableHeader>
      <TableBody>{children}</TableBody>
    </Table>
  );
};

export default AppTable;
