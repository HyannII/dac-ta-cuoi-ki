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

export async function ViewAllCustomers() {
  const customers = await prisma.customer.findMany({
    include: {
      Account: {
        select: {
          username: true, // Chỉ lấy trường username từ bảng account
        },
      },
    },
  });
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Tên tài khoản</TableHead>
          <TableHead>Tên khách hàng</TableHead>
          <TableHead>Mã CCCD</TableHead>
          <TableHead>Số điện thoại</TableHead>
          <TableHead>Email</TableHead>
          <TableHead>Mức thành viên</TableHead>
          <TableHead>Số dư</TableHead>
          <TableHead>Hành động</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {customers.map((customer) => (
          <TableRow key={customer.id}>
            <TableCell>{customer.Account?.username || "N/A"}</TableCell>
            <TableCell>{customer.fullName}</TableCell>
            <TableCell>{customer.citizenId}</TableCell>
            <TableCell>{customer.phoneNumber}</TableCell>
            <TableCell>{customer.email}</TableCell>
            <TableCell>{customer.membershipLevel}</TableCell>
            <TableCell>{customer.balance.toLocaleString("vi-VN", {style: "currency", currency: "VND"})}</TableCell>
            <TableCell className="flex items-center">
              <EditButton id={customer.id} />
              <Separator
                orientation="vertical"
                className="mx-2 h-6 "
              />
              <DeleteButton id={customer.id} />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
