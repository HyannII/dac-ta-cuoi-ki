import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import prisma from "@/lib/db";
import { DeleteButton } from "./components";
import { Separator } from "@/components/ui/separator";

export async function ViewAllInvoices() {
  const invoices = await prisma.invoice.findMany({
    include: {
      Customer: {
        select: {
          fullName: true,
        },
      },
      InvoiceService: {
        include: {
          Service: {
            select: {
              name: true,
              price: true,
            },
          },
        },
      },
      UsageHistory: {
        select: {
          computerId: true,
          totalHours: true,
          totalCost: true,
        },
      },
    },
  });

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Ngày tạo hoá đơn</TableHead>
          <TableHead>Tên khách hàng</TableHead>
          <TableHead>Thành tiền</TableHead>
          <TableHead>Trạng thái</TableHead>
          <TableHead>Dịch vụ</TableHead>
          <TableHead>Lịch sử sử dụng</TableHead>
          <TableHead>Hành động</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {invoices.map((invoice) => (
          <TableRow key={invoice.id}>
            <TableCell>
              {new Date(invoice.invoiceDate).toLocaleDateString("vi-VN")}
            </TableCell>
            <TableCell>{invoice.Customer?.fullName || "N/A"}</TableCell>
            <TableCell>
              {invoice.totalAmount.toLocaleString("vi-VN", {
                style: "currency",
                currency: "VND",
              })}
            </TableCell>
            <TableCell>{invoice.status}</TableCell>
            <TableCell>
              {invoice.InvoiceService?.length > 0 ? (
                <ul>
                  {invoice.InvoiceService.map((service) => (
                    <li key={service.id}>
                      {service.Service.name} -{" "}
                      {service.Service.price.toLocaleString("vi-VN", {
                        style: "currency",
                        currency: "VND",
                      })}
                    </li>
                  ))}
                </ul>
              ) : (
                "Không có dịch vụ"
              )}
            </TableCell>
            <TableCell>
              {invoice.UsageHistory?.length > 0 ? (
                <ul>
                  {invoice.UsageHistory.map((history, index) => (
                    <li key={index}>
                      Máy: {history.computerId}, Thời gian:{" "}
                      {history.totalHours
                        ? `${Math.floor(history.totalHours)} giờ ${Math.round(
                            (history.totalHours % 1) * 60
                          )} phút`
                        : "N/A"}
                      , Chi phí:{" "}
                      {history.totalCost?.toLocaleString("vi-VN", {
                        style: "currency",
                        currency: "VND",
                      }) || "N/A"}
                    </li>
                  ))}
                </ul>
              ) : (
                "Không có lịch sử sử dụng"
              )}
            </TableCell>
            <TableCell className="flex items-center">
              {/* <EditButton id={invoice.id} /> */}
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
