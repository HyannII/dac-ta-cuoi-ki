"use client";

import {
  createInvoice,
  deleteInvoice,
  editInvoice,
  getInvoiceById,
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
import {
  createUsageHistory,
  deleteUsageHistory,
  editUsageHistory,
  getUsageHistoryById,
} from "@/actions/usage-history-actions";
import { Checkbox } from "@/components/ui/checkbox";

export function CreateButton(): JSX.Element {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">
          <Plus className="h-4 w-4" /> Thêm phiên sử dụng
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Tạo phiên sử dụng</DialogTitle>
        </DialogHeader>
        <form action={createUsageHistory}>
          <Label>Mã CCCD khách hàng</Label>
          <Input
            type="text"
            name="customerCitizenId"
            placeholder="Mã CCCD khách hàng"
            required
          />
          <Label>Tên máy tính</Label>
          <Input
            type="text"
            name="computerName"
            placeholder="Tên máy tính"
            required
          />
          <Button type="submit">Tạo</Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
export function EditButton({ id }: { id: string }): JSX.Element {
  const [usageHistory, setUsageHistory] = useState<{
    customer: { citizenId: string };
    computer: { name: string };
    startTime: Date;
    endTime: Date | null;
    totalHours: number | null;
    totalCost: number | null;
  } | null>(null);

  useEffect(() => {
    getUsageHistoryById(id).then(setUsageHistory).catch(console.error);
  }, [id]);

  const [complete, setComplete] = useState(false);
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">
          <Pencil className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Sửa thông tin phiên sử dụng</DialogTitle>
        </DialogHeader>
        <form
          action={async (formData: FormData) =>
            await editUsageHistory(formData, id, complete)
          }
        >
          <Label>Mã CCCD khách hàng</Label>
          <Input
            type="text"
            name="customerCitizenId"
            defaultValue={usageHistory?.customer.citizenId}
            required
          />
          <Label>Tên máy tính</Label>
          <Input
            type="text"
            name="computerName"
            defaultValue={usageHistory?.computer.name}
            required
          />
          <Label>Thời gian bắt đầu phiên</Label>
          <Input
            type="text"
            name="startTime"
            defaultValue={usageHistory?.startTime.toLocaleDateString("vi-VN")}
            disabled
          />
          <Label>Kết thúc phiên</Label>
          <Checkbox
            checked={complete}
            onCheckedChange={(checked) => setComplete(!!checked)}
          />
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
      onClick={async () => await deleteUsageHistory(id)}
    >
      <Trash2 className="h-4 w-4" />
    </Button>
  );
}
