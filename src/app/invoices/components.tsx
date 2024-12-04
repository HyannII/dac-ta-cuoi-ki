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
        <form action={createInvoice}>
          <Label>Mã CCCD khách hàng</Label>
          <Input
            type="text"
            name="customerCitizenId"
            placeholder="Mã CCCD khách hàng"
            required
          />
          <Label>Trạng thái</Label>
          <Input
            type="text"
            name="status"
            placeholder="Trạng thái"
            required
          />
          <Label>Thành tiền</Label>
          <Input
            type="number"
            name="totalAmount"
            placeholder="Thành tiền"
            required
          />
          <Button type="submit">Tạo</Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
export function EditButton({ id }: { id: string }): JSX.Element {
  const [invoice, setInvoice] = useState<{
    customer: { citizenId: string };
    invoiceDate: Date;
    totalAmount: number;
    status: string;
  } | null>(null);

  useEffect(() => {
    getInvoiceById(id).then(setInvoice).catch(console.error);
  }, [id]);
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
          action={async (formData: FormData) => await editInvoice(formData, id)}
        >
          <Label>Mã CCCD khách hàng</Label>
          <Input
            type="text"
            name="customerCitizenId"
            defaultValue={invoice?.customer.citizenId}
            required
          />
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
