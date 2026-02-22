import { ReactNode } from "react";
import { Card } from "../ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";

export default function DataTable({
  header,
  data,
  isLoading,
}: {
  header: string[];
  data: (string | ReactNode)[][];
  isLoading?: boolean;
}) {
  return (
    <div className="w-full flex flex-col gap-4">
      <Card className="p-0">
        <Table className="w-full rounded-lg overflow-hidden">
          <TableHeader className="bg-muted sticky top-0 z-10">
            <TableRow>
              {header.map((item) => (
                <TableHead key={`th-${item}`} className="px-6 py-3">
                  {item}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {data?.map((row, rowIndex) => (
              <TableRow key={`tr-${rowIndex}`}>
                {row.map((collumn, collumnIndex) => (
                  <TableCell
                    key={`td-${rowIndex}-${collumnIndex}`}
                    className="px-6 py-3"
                  >
                    {collumn}
                  </TableCell>
                ))}
              </TableRow>
            ))}

            {data?.length === 0 && !isLoading && (
              <TableRow>
                <TableCell colSpan={header.length} className="h-24 text-center">
                  No results data.
                </TableCell>
              </TableRow>
            )}

            {isLoading && (
              <TableRow>
                <TableCell colSpan={header.length} className="h-24 text-center">
                  Loading...
                </TableCell>
              </TableRow>
            )}

          </TableBody>
        </Table>
      </Card>
    </div>
  );
}
