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

export async function ViewAllStaffs() {
  const staffs = await prisma.staff.findMany({
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
          <TableHead>Tên nhân viên</TableHead>
          <TableHead>Số điện thoại</TableHead>
          <TableHead>Email</TableHead>
          <TableHead>Vai trò</TableHead>
          <TableHead>Hành động</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {staffs.map((staff) => (
          <TableRow key={staff.id}>
            <TableCell>{staff.Account?.username || "N/A"}</TableCell>
            <TableCell>{staff.fullName}</TableCell>
            <TableCell>{staff.phoneNumber}</TableCell>
            <TableCell>{staff.email}</TableCell>
            <TableCell>{staff.role}</TableCell>
            <TableCell className="flex items-center">
              <EditButton id={staff.id} />
              <Separator
                orientation="vertical"
                className="mx-2 h-6 "
              />
              <DeleteButton id={staff.id} />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
