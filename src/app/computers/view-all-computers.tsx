import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import prisma from "@/lib/db";
import { EditButton, DeleteButton } from "./components";
import { Separator } from "@/components/ui/separator";

export async function ViewAllComputers() {
  const computers = await prisma.computer.findMany();
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Tên</TableHead>
          <TableHead>Trạng thái</TableHead>
          <TableHead>Vị trí</TableHead>
          <TableHead>Cấu hình</TableHead>
          <TableHead>Hành động</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {computers.map((computer) => (
          <TableRow key={computer.id}>
            <TableCell>{computer.name}</TableCell>
            <TableCell>{computer.status}</TableCell>
            <TableCell>{computer.location}</TableCell>
            <TableCell>{computer.specs}</TableCell>
            <TableCell className="flex items-center">
              <EditButton id={computer.id} />
              <Separator
                orientation="vertical"
                className="mx-2 h-6"
              />
              <DeleteButton id={computer.id} />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
