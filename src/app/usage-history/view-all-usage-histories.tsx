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

export async function ViewAllUsageHistories() {
  const usageHistories = await prisma.usageHistory.findMany({
    include: {
      Customer: {
        select: {
          fullName: true,
          Account: {
            select: {
              username: true, // Lấy thông tin username từ bảng Account
            },
          },
        },
      },
      Computer: {
        select: {
          name: true,
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
          <TableHead>Tên máy tính</TableHead>
          <TableHead>Trạng thái</TableHead>
          <TableHead>Thời gian bắt đầu phiên</TableHead>
          <TableHead>Thời gian kết thúc phiên</TableHead>
          <TableHead>Thời gian sử dụng</TableHead>
          <TableHead>Thành tiền</TableHead>
          <TableHead>Hành động</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {usageHistories.map((usageHistory) => (
          <TableRow key={usageHistory.id}>
            <TableCell>{usageHistory.Customer.Account.username}</TableCell>
            <TableCell>{usageHistory.Customer.fullName}</TableCell>
            <TableCell>{usageHistory.Computer.name}</TableCell>
            <TableCell>
              {usageHistory.endTime ? "Đã kết thúc" : "Đang sử dụng"}
            </TableCell>
            <TableCell>
              {usageHistory.startTime.toLocaleString("vi-VN", {
                day: "2-digit",
                month: "2-digit",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit",
                hour12: false, // Hiển thị giờ theo định dạng 24 giờ
              })}
            </TableCell>
            <TableCell>
              {usageHistory.endTime
                ? usageHistory.endTime.toLocaleDateString("vi-VN", {
                    day: "2-digit",
                    month: "2-digit",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                    hour12: false, // Hiển thị giờ theo định dạng 24 giờ
                  })
                : "N/A"}
            </TableCell>
            <TableCell>
              {usageHistory?.totalHours
                ? `${Math.floor(usageHistory.totalHours)} giờ ${Math.round(
                    (usageHistory.totalHours % 1) * 60
                  )} phút`
                : "N/A"}
            </TableCell>
            <TableCell>
              {usageHistory.totalCost
                ? usageHistory.totalCost.toFixed(0)
                : "N/A"}
            </TableCell>
            <TableCell className="flex items-center">
              <EditButton id={usageHistory.id} />
              <Separator
                orientation="vertical"
                className="mx-2 h-6"
              />
              <DeleteButton id={usageHistory.id} />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
