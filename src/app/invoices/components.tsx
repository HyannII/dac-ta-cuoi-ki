"use client";

import {
  createInvoice,
  deleteInvoice,
  editInvoice,
  getCustomersByName,
  getInvoiceById,
  getUsageHistoriesByCustomerId,
} from "@/actions/invoice-actions";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@radix-ui/react-label";
import { Pencil, Plus, Trash2 } from "lucide-react";
import { Input } from "@/components/ui/input";

import React, { useEffect, useState } from "react";

export function CreateButton(): JSX.Element {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">
          <Plus className="h-4 w-4" /> Thêm hoá đơn
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Tạo hoá đơn</DialogTitle>
        </DialogHeader>
        <form
          action={createInvoice}
          className="space-y-4"
        >
          <div className="flex flex-col">
            <Label>Mã CCCD khách hàng</Label>
            <Input
              type="text"
              name="customerCitizenId"
              placeholder="Mã CCCD khách hàng"
              required
            />
          </div>
          <div className="flex flex-col">
            <Label>Trạng thái</Label>
            <Input
              type="text"
              name="status"
              placeholder="Trạng thái"
              required
            />
          </div>
          <div className="flex flex-col">
            <Label>Thành tiền</Label>
            <Input
              type="number"
              name="totalAmount"
              placeholder="Thành tiền"
              required
            />
          </div>
          <Button type="submit" className="w-full">Tạo</Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export function EditButton({ id }: { id: string }): JSX.Element {
  const [invoice, setInvoice] = useState<{
    invoiceDate: Date;
    totalAmount: number;
    status: string;
  } | null>(null);

  const [customerName, setCustomerName] = useState<string>("");
  const [customers, setCustomers] = useState<
    { id: string; fullName: string; citizenId: string }[]
  >([]);
  const [selectedCustomer, setSelectedCustomer] = useState<string | null>(null);

  const [usageHistories, setUsageHistories] = useState<
    { id: string; computerId: string; startTime: Date; endTime: Date | null }[]
  >([]);
  const [selectedHistories, setSelectedHistories] = useState<string[]>([]);

  useEffect(() => {
    getInvoiceById(id)
      .then((data) => {
        setInvoice(data);
        setSelectedHistories(data?.usageHistories.map((h) => h.id) || []);
      })
      .catch(console.error);
  }, [id]);

  useEffect(() => {
    if (selectedCustomer) {
      getUsageHistoriesByCustomerId(selectedCustomer)
        .then(setUsageHistories)
        .catch(console.error);
    }
  }, [selectedCustomer]);

  const handleSearchCustomer = async () => {
    const customers = await getCustomersByName(customerName);
    setCustomers(customers);
    setSelectedCustomer(null); // Reset selected customer
  };

  const handleAddUsageHistory = (historyId: string) => {
    if (!selectedHistories.includes(historyId)) {
      setSelectedHistories([...selectedHistories, historyId]);
    }
  };

  const handleRemoveUsageHistory = (historyId: string) => {
    setSelectedHistories(selectedHistories.filter((id) => id !== historyId));
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">
          <Pencil className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Sửa thông tin hoá đơn</DialogTitle>
        </DialogHeader>
        <form
          action={async (formData: FormData) => {
            formData.append(
              "usageHistories",
              JSON.stringify(selectedHistories)
            );
            formData.append("customerCitizenId", selectedCustomer || "");
            console.log("Submitting formData:", Array.from(formData.entries()));
            await editInvoice(formData, id);
          }}
        >
          <Label>Tìm kiếm khách hàng theo tên</Label>
          <div style={{ display: "flex", gap: "8px" }}>
            <Input
              type="text"
              placeholder="Nhập tên khách hàng"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
            />
            <Button
              type="button"
              onClick={handleSearchCustomer}
            >
              Tìm
            </Button>
          </div>

          {customers.length > 0 && (
            <>
              <Label>Chọn khách hàng</Label>
              <select
                onChange={(e) => setSelectedCustomer(e.target.value)}
                defaultValue=""
              >
                <option
                  value=""
                  disabled
                >
                  -- Chọn khách hàng --
                </option>
                {customers.map((customer) => (
                  <option
                    key={customer.id}
                    value={customer.id}
                  >
                    {customer.fullName} - {customer.citizenId}
                  </option>
                ))}
              </select>
            </>
          )}

          <Label>Trạng thái</Label>
          <Input
            type="text"
            name="status"
            defaultValue={invoice?.status}
            required
          />
          <Label>Thành tiền</Label>
          <Input
            type="number"
            name="totalAmount"
            defaultValue={invoice?.totalAmount}
            required
          />

          <Label>Lịch sử sử dụng đã chọn</Label>
          <ul>
            {selectedHistories.map((historyId) => {
              const history = usageHistories.find((h) => h.id === historyId);
              return (
                <li key={historyId}>
                  {history?.computerId} (
                  {history?.startTime.toLocaleDateString("vi-VN")}){" "}
                  <Button
                    type="button"
                    variant="destructive"
                    onClick={() => handleRemoveUsageHistory(historyId)}
                  >
                    Hủy
                  </Button>
                </li>
              );
            })}
          </ul>

          <Label>Thêm lịch sử sử dụng</Label>
          <select onChange={(e) => handleAddUsageHistory(e.target.value)}>
            <option value="">Chọn lịch sử sử dụng</option>
            {usageHistories
              .filter((h) => !selectedHistories.includes(h.id))
              .map((history) => (
                <option
                  key={history.id}
                  value={history.id}
                >
                  {history.computerId} (
                  {history.startTime.toLocaleDateString("vi-VN")})
                </option>
              ))}
          </select>

          <Button type="submit">Sửa</Button>
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
