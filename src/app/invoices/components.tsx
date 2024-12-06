"use client";

import prisma from "@/lib/db";
import {
  deleteInvoice,
  editInvoice,
  getAllServices,
  getCustomerByAccountName,
  getInvoiceById,
  getUsageHistoriesByCustomerId,
} from "@/actions/invoice-actions";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@radix-ui/react-label";
import { Pencil, Plus, Trash2 } from "lucide-react";
import { Input } from "@/components/ui/input";

import React, { useEffect, useState } from "react";
import { createInvoice } from "@/actions/invoice-handler";
import { Checkbox } from "@/components/ui/checkbox";
import { revalidatePath } from "next/cache";

export function CreateButton(): JSX.Element {
  const [accountName, setAccountName] = useState<string>("");
  const [usageHistory, setUsageHistory] = useState<
    {
      id: string;
      computerId: string;
      totalCost: number;
      startTime: Date;
      endTime: Date | null;
    }[]
  >([]);

  const [allServices, setAllServices] = useState<
    { id: string; name: string; price: number }[]
  >([]);

  const [selectedUsageIds, setSelectedUsageIds] = useState<string[]>([]);
  const [selectedServices, setSelectedServices] = useState<
    { id: string; name: string; price: number; quantity: number }[]
  >([]);
  const [isCustomerLoaded, setIsCustomerLoaded] = useState<boolean>(false);

  const handleSearchUsageHistory = async () => {
    if (!accountName) {
      alert("Vui lòng nhập Account ID.");
      return;
    }

    try {
      // Gọi API để lấy customerId từ accountName
      const customerId = await getCustomerByAccountName(accountName);

      if (!customerId) {
        // Kiểm tra nếu customerId là null
        alert("Không tìm thấy khách hàng với Account ID này.");
        return; // Ngừng thực hiện nếu không tìm thấy customer
      }
      setIsCustomerLoaded(true);

      // Gọi API để lấy usageHistory dựa trên customerId
      const histories = await getUsageHistoriesByCustomerId(customerId);

      if (histories.length === 0) {
        alert("Không có Usage History nào được tìm thấy.");
      }

      // Lọc các usageHistory với customerId và endTime không phải null
      const filteredHistories = histories.filter(
        (history) =>
          history.customerId === customerId &&
          history.endTime !== null &&
          !history.invoiceId
      );

      // Nếu totalCost có thể là null, bạn có thể thay đổi nó thành một giá trị mặc định như 0
      const historiesWithValidTotalCost = filteredHistories.map((history) => ({
        ...history,
        totalCost: history.totalCost ?? 0, // Nếu totalCost là null, gán nó bằng 0
      }));

      setUsageHistory(historiesWithValidTotalCost); // Cập nhật state với giá trị totalCost đã thay đổi
    } catch (error) {
      console.error("Error fetching usage history:", error);
      alert("Có lỗi xảy ra khi tìm Usage History.");
    }
  };

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const services = await getAllServices(); // Gọi hàm getAllServices
        setAllServices(services); // Cập nhật state với danh sách dịch vụ
      } catch (error) {
        console.error("Error fetching services:", error);
        alert("Không thể lấy danh sách dịch vụ.");
      }
    };

    fetchServices();
  }, []);

  const handleServiceChange = (service: {
    id: string;
    name: string;
    price: number;
  }) => {
    setSelectedServices((prev) => {
      const exists = prev.find((s) => s.id === service.id);

      if (exists) {
        return prev.filter((s) => s.id !== service.id);
      } else {
        return [...prev, { ...service, quantity: 1 }]; // Mặc định số lượng là 1 khi thêm dịch vụ
      }
    });
  };
  const handleQuantityChange = (serviceId: string, quantity: number) => {
    setSelectedServices((prev) =>
      prev.map((service) =>
        service.id === serviceId ? { ...service, quantity } : service
      )
    );
  };

  const handleUsageChange = (id: string) => {
    setSelectedUsageIds((prev) => {
      if (prev.includes(id)) {
        // Nếu usageHistory đã được chọn, loại bỏ khỏi danh sách
        return prev.filter((usageId) => usageId !== id);
      } else {
        // Nếu usageHistory chưa được chọn, thêm vào danh sách
        return [...prev, id];
      }
    });
  };

  const handleSubmit = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("accountName", accountName); // Thêm accountName vào formData

    // Thêm từng `selectedUsageId` vào formData
    selectedUsageIds.forEach((id) => {
      formData.append("selectedUsageIds[]", id); // Truyền từng `id` dưới dạng một mục riêng
    });

    // Thêm dịch vụ vào formData
    selectedServices.forEach((service, index) => {
      formData.append(`services[${index}][name]`, service.name);
      formData.append(`services[${index}][price]`, service.price.toString());
      formData.append(
        `services[${index}][quantity]`,
        service.quantity.toString()
      );
    });

    try {
      const result = await createInvoice(formData); // Gọi hàm tạo hóa đơn
      if (result.error) {
        alert(result.error);
      } else {
        alert("Hóa đơn đã được tạo thành công.");
      }
    } catch (error) {
      console.error(error);
    }
    // revalidatePath("/invoices");
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">
          <Plus className="h-4 w-4" />
          Tạo Hóa Đơn
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Tạo Hóa Đơn</DialogTitle>
        </DialogHeader>

        {/* Nhập Account ID */}
        <div className="flex flex-col gap-2">
          <Label>Nhập Account ID</Label>
          <div className="flex gap-2">
            <Input
              type="text"
              name="accountName"
              placeholder="Nhập Account ID"
              value={accountName}
              onChange={(e) => setAccountName(e.target.value)}
            />
            <Button
              onClick={handleSearchUsageHistory}
              className="bg-blue-500 text-white px-4 py-2 rounded"
            >
              Tìm
            </Button>
          </div>
        </div>

        {/* Hiển thị Usage History */}
        {usageHistory.length > 0 && (
          <div>
            <h3 className="font-bold text-lg mb-2">Chọn phiên sử dụng:</h3>
            <div className="space-y-2">
              {usageHistory.map((history) => (
                <div
                  key={history.id}
                  className="flex items-center gap-2"
                >
                  <Checkbox
                    checked={selectedUsageIds.includes(history.id)}
                    onCheckedChange={() => handleUsageChange(history.id)}
                  />
                  <label>
                    Máy {history.computerId} - Chi phí: {history.totalCost} VND
                  </label>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Hiển thị danh sách Services */}
        {isCustomerLoaded && allServices.length > 0 && (
          <div>
            <h3 className="font-bold text-lg mb-2">Chọn dịch vụ:</h3>
            <div className="space-y-2">
              {allServices.map((service) => (
                <div
                  key={service.id}
                  className="flex items-center gap-2"
                >
                  <Checkbox
                    onCheckedChange={() => handleServiceChange(service)}
                  />
                  <label>
                    {service.name} - {service.price} VND
                  </label>
                  {/* Chỉ hiển thị ô nhập số lượng khi dịch vụ được chọn */}
                  {selectedServices.some((s) => s.id === service.id) && (
                    <Input
                      type="number"
                      value={
                        selectedServices.find((s) => s.id === service.id)
                          ?.quantity || 1
                      }
                      min="1"
                      onChange={(e) =>
                        handleQuantityChange(
                          service.id,
                          parseInt(e.target.value)
                        )
                      }
                      className="ml-2 p-1 border"
                    />
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Nút tạo hóa đơn */}
        <DialogFooter>
          <Button
            onClick={handleSubmit}
            className="bg-green-500 text-white px-4 py-2 rounded w-full"
          >
            Tạo hóa đơn
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export function EditButton({ id }: { id: string }): JSX.Element {
  const [invoice, setInvoice] = useState<{
    invoiceDate: Date;
    totalAmount: number;
    status: string;
    usageHistories: {
      id: string;
      computerId: string;
      startTime: Date;
      endTime: Date | null;
      totalHours: number | null;
      totalCost: number | null;
    }[];
    services: {
      id: string;
      name: string;
      price: number;
      quantity: number;
    }[];
    customer?: { citizenId: string };
  } | null>(null);

  useEffect(() => {
    getInvoiceById(id).then(setInvoice).catch(console.error);
  }, [id]);

  const [isPaid, setIsPaid] = useState(false);

  useEffect(() => {
    if (invoice) {
      setIsPaid(invoice.status === "Đã thanh toán");
    }
  }, [invoice]);

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">
          <Pencil className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Sửa thông tin hóa đơn</DialogTitle>
        </DialogHeader>
        <form
          onSubmit={async (e) => {
            e.preventDefault();
            const formData = new FormData(e.currentTarget);

            if (!invoice) return;
            formData.set(
              "status",
              isPaid ? "Đã thanh toán" : "Chưa thanh toán"
            );
            await editInvoice(formData, id);
          }}
        >
          <Label>Ngày lập hóa đơn</Label>
          <Input
            type="text"
            value={invoice?.invoiceDate.toLocaleDateString("vi-VN") || ""}
            readOnly
          />

          <Label>Tổng tiền</Label>
          <Input
            type="number"
            value={invoice?.totalAmount || ""}
            readOnly
          />

          <Label>Trạng thái</Label>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="status"
              checked={isPaid}
              onCheckedChange={(checked) => setIsPaid(!!checked)}
              disabled={invoice?.status === "Đã thanh toán"} // Không thể sửa nếu đã thanh toán
            />
            <Label htmlFor="status">
              {isPaid ? "Đã thanh toán" : "Chưa thanh toán"}
            </Label>
          </div>

          <Label>Lịch sử sử dụng</Label>
          <ul>
            {invoice?.usageHistories.map((history) => (
              <li key={history.id}>
                Máy tính: {history.computerId}, Bắt đầu:{" "}
                {history.startTime.toLocaleString("vi-VN")}, Kết thúc:{" "}
                {history.endTime
                  ? history.endTime.toLocaleString("vi-VN")
                  : "Chưa kết thúc"}
                , Tổng giờ: {history.totalHours}, Tổng tiền:{" "}
                {history.totalCost?.toLocaleString("vi-VN")} VNĐ
              </li>
            ))}
          </ul>

          <Label>Dịch vụ đã sử dụng</Label>
          <ul>
            {invoice?.services.map((service) => (
              <li key={service.id}>
                {service.name}: {service.quantity} x{" "}
                {service.price.toLocaleString("vi-VN")} VNĐ ={" "}
                {(service.quantity * service.price).toLocaleString("vi-VN")} VNĐ
              </li>
            ))}
          </ul>

          <Button type="submit">Lưu</Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export function DeleteButton({ id }: { id: string }): JSX.Element {
  return (
    <Button
      variant="outline"
      onClick={async () => await deleteInvoice(id)}
    >
      <Trash2 className="h-4 w-4" />
    </Button>
  );
}
