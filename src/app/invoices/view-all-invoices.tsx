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

export async function ViewAllInvoices() {
  const invoices = await prisma.invoice.findMany();
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Ngày tạo hoá đơn</TableHead>
          <TableHead>Tên khách hàng</TableHead>
          <TableHead>Thành tiền</TableHead>
          <TableHead>Trạng thái</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {invoices.map((invoice) => (
          <TableRow key={invoice.id}>
            <TableCell>
              {invoice.invoiceDate.toLocaleDateString("vi-VN")}
            </TableCell>
            <TableCell>{invoice.customerId}</TableCell>
            <TableCell>{invoice.totalAmount.toLocaleString("vi-VN")}</TableCell>
            <TableCell>{invoice.status}</TableCell>
            <TableCell className="flex items-center">
              <EditButton id={invoice.id} />
              <Separator
                orientation="vertical"
                className="mx-2 h-6"
              />
              <DeleteButton id={invoice.id} />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
