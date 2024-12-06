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
import { Card, CardHeader, CardContent } from "@/components/ui/card";

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
      const customerId = await getCustomerByAccountName(accountName);
      if (!customerId) {
        alert("Không tìm thấy khách hàng với Account ID này.");
        return;
      }
      setIsCustomerLoaded(true);
      const histories = await getUsageHistoriesByCustomerId(customerId);
      const filteredHistories = histories.filter(
        (history) =>
          history.customerId === customerId &&
          history.endTime !== null &&
          !history.invoiceId
      );
      const historiesWithValidTotalCost = filteredHistories.map((history) => ({
        ...history,
        totalCost: history.totalCost ?? 0,
      }));
      setUsageHistory(historiesWithValidTotalCost);
    } catch (error) {
      console.error("Error fetching usage history:", error);
      alert("Có lỗi xảy ra khi tìm Usage History.");
    }
  };

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const services = await getAllServices();
        setAllServices(services);
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
      return exists
        ? prev.filter((s) => s.id !== service.id)
        : [...prev, { ...service, quantity: 1 }];
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
    setSelectedUsageIds((prev) =>
      prev.includes(id)
        ? prev.filter((usageId) => usageId !== id)
        : [...prev, id]
    );
  };

  const handleSubmit = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    if (selectedUsageIds.length === 0 && selectedServices.length === 0) {
      alert("Vui lòng chọn ít nhất một loại (phiên sử dụng hoặc dịch vụ).");
      return;
    }

    const formData = new FormData();
    formData.append("accountName", accountName);

    // Chỉ gửi selectedUsageIds nếu có
    selectedUsageIds.forEach((id) => formData.append("selectedUsageIds[]", id));

    // Chỉ gửi dịch vụ nếu có
    selectedServices.forEach((service, index) => {
      formData.append(`services[${index}][name]`, service.name);
      formData.append(`services[${index}][price]`, service.price.toString());
      formData.append(
        `services[${index}][quantity]`,
        service.quantity.toString()
      );
    });

    try {
      const result = await createInvoice(formData);
      if (result.error) {
        alert(result.error);
      } else {
        alert("Hóa đơn đã được tạo thành công.");
      }
    } catch (error) {
      console.error(error);
    }
  };


  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          className="flex items-center gap-2"
        >
          <Plus className="h-4 w-4" />
          Tạo Hóa Đơn
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-lg p-4 space-y-4">
        <DialogHeader>
          <DialogTitle className="text-lg font-bold">Tạo Hóa Đơn</DialogTitle>
        </DialogHeader>

        <div className="flex flex-col gap-2">
          <Label className="font-medium">Nhập tên tài khoản</Label>
          <div className="flex gap-2">
            <Input
              type="text"
              placeholder="Nhập tên tài khoản"
              value={accountName}
              onChange={(e) => setAccountName(e.target.value)}
            />
            <Button
              onClick={handleSearchUsageHistory}
              className=""
            >
              Tìm
            </Button>
          </div>
        </div>

        {usageHistory.length > 0 ? (
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
                    Máy {history.computerId} - Chi phí:{" "}
                    {history.totalCost.toLocaleString("vi-VN", {
                      style: "currency",
                      currency: "VND",
                    })}
                  </label>
                </div>
              ))}
            </div>
          </div>
        ) : (
          isCustomerLoaded && (
            <p className="text-sm text-gray-500">Không có phiên sử dụng nào.</p>
          )
        )}

        {isCustomerLoaded && allServices.length > 0 ? (
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
                    {service.name} -{" "}
                    {service.price.toLocaleString("vi-VN", {
                      style: "currency",
                      currency: "VND",
                    })}
                  </label>
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
                      className="ml-2 p-1 border w-16"
                    />
                  )}
                </div>
              ))}
            </div>
          </div>
        ) : (
          isCustomerLoaded && (
            <p className="text-sm text-gray-500">Không có dịch vụ nào.</p>
          )
        )}

        <DialogFooter>
          <Button
            onClick={handleSubmit}
            className="w-full"
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

  const [isPaid, setIsPaid] = useState(false);

  useEffect(() => {
    const fetchInvoice = async () => {
      try {
        const fetchedInvoice = await getInvoiceById(id);
        if (fetchedInvoice === null) {
          throw new Error("Invoice not found.");
        }
        setInvoice(fetchedInvoice);
        setIsPaid(fetchedInvoice.status === "Đã thanh toán");
      } catch (error) {
        console.error("Error fetching invoice:", error);
        alert("Lỗi khi lấy hóa đơn.");
      }
    };

    fetchInvoice();
  }, [id]);

  const handleSave = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!invoice) return;

    const formData = new FormData(e.currentTarget);
    formData.set("status", isPaid ? "Đã thanh toán" : "Chưa thanh toán");

    try {
      await editInvoice(formData, id);
      alert("Hóa đơn đã được cập nhật thành công!");
    } catch (error) {
      console.error("Error updating invoice:", error);
      alert("Cập nhật hóa đơn thất bại.");
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">
          <Pencil className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-[min(90vw,1200px)] max-h-[90vh] overflow-auto space-y-4">
        <DialogHeader className="items-center">
          <DialogTitle className="text-lg font-bold">
            Sửa thông tin hóa đơn
          </DialogTitle>
        </DialogHeader>
        {invoice ? (
          <form
            onSubmit={handleSave}
            className="space-y-4"
          >
            {/* Ngày lập hóa đơn */}
            <div>
              <Label className="font-semibold">Ngày lập hóa đơn</Label>
              <Input
                type="text"
                value={invoice.invoiceDate.toLocaleDateString("vi-VN")}
                readOnly
                className="w-full bg-muted/10"
              />
            </div>

            {/* Tổng tiền */}
            <div>
              <Label className="font-semibold">Tổng tiền</Label>
              <Input
                type="text"
                value={`${invoice.totalAmount.toLocaleString("vi-VN", {
                  style: "currency",
                  currency: "VND",
                })}`}
                readOnly
                className="w-full bg-muted/10"
              />
            </div>

            {/* Trạng thái thanh toán */}
            <div className="flex items-center gap-4">
              <Checkbox
                id="status"
                checked={isPaid}
                onCheckedChange={(checked) => setIsPaid(!!checked)}
                disabled={invoice.status === "Đã thanh toán"}
              />
              <Label htmlFor="status">Đã thanh toán</Label>
            </div>

            {/* Lịch sử sử dụng */}
            <div>
              <Label className="font-semibold">Phiên sử dụng</Label>
              {invoice.usageHistories.length > 0 ? (
                <div className="grid grid-cols-3 gap-4">
                  {invoice.usageHistories.map((history) => (
                    <Card key={history.id}>
                      <CardHeader>
                        <p className="text-sm font-medium text-muted-foreground">
                          Máy: {history.computerId}
                        </p>
                      </CardHeader>
                      <CardContent>
                        <p>
                          <strong>Bắt đầu:</strong>{" "}
                          {history.startTime.toLocaleString("vi-VN")}
                        </p>
                        <p>
                          <strong>Kết thúc:</strong>{" "}
                          {history.endTime
                            ? history.endTime.toLocaleString("vi-VN")
                            : "Chưa kết thúc"}
                        </p>
                        <p>
                          <strong>Tổng giờ:</strong>{" "}
                          {history.totalHours
                            ? `${Math.floor(
                                history.totalHours
                              )} giờ ${Math.round(
                                (history.totalHours % 1) * 60
                              )} phút`
                            : "N/A"}
                        </p>
                        <p>
                          <strong>Tổng tiền:</strong>{" "}
                          {history.totalCost?.toLocaleString("vi-VN", {
                            style: "currency",
                            currency: "VND",
                          }) || "N/A"}
                        </p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground italic">
                  Không có phiên sử dụng.
                </p>
              )}
            </div>

            {/* Dịch vụ đã sử dụng */}
            <div>
              <Label className="font-semibold">Dịch vụ đã sử dụng</Label>
              {invoice.services.length > 0 ? (
                <div className="grid grid-cols-3 gap-4">
                  {invoice.services.map((service) => (
                    <Card key={service.id}>
                      <CardHeader>
                        <p className="text-sm font-medium text-muted-foreground">
                          {service.name}
                        </p>
                      </CardHeader>
                      <CardContent>
                        <p>
                          <strong>Số lượng:</strong> {service.quantity}
                        </p>
                        <p>
                          <strong>Đơn giá:</strong>{" "}
                          {service.price.toLocaleString("vi-VN", {
                            style: "currency",
                            currency: "VND",
                          })}
                        </p>
                        <p>
                          <strong>Thành tiền:</strong>{" "}
                          {(service.quantity * service.price).toLocaleString(
                            "vi-VN",
                            {
                              style: "currency",
                              currency: "VND",
                            }
                          )}
                        </p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground italic">
                  Không có dịch vụ nào.
                </p>
              )}
            </div>

            {/* Nút lưu */}
            <div className="flex justify-end">
              <Button
                type="submit"
                className="w-full"
              >
                Lưu
              </Button>
            </div>
          </form>
        ) : (
          <p className="text-center text-muted-foreground italic">
            Đang tải thông tin hóa đơn...
          </p>
        )}
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
