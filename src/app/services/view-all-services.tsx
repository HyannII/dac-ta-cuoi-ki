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

export async function ViewAllServices() {
  const services = await prisma.service.findMany();
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Tên dịch vụ</TableHead>
          <TableHead>Giá tiền</TableHead>
          <TableHead>Hành động</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {services.map((service) => (
          <TableRow key={service.id}>
            <TableCell>{service.name}</TableCell>
            <TableCell>{service.price.toFixed(0)}</TableCell>
            <TableCell className="flex items-center">
              <EditButton id={service.id} />
              <Separator
                orientation="vertical"
                className="mx-2 h-6"
              />
              <DeleteButton id={service.id} />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
