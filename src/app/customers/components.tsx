"use client";

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
  createCustomer,
  deleteCustomer,
  editCustomer,
  getCustomerById,
} from "@/actions/customer-actions";

export function CreateButton(): JSX.Element {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">
          <Plus className="h-4 w-4" /> Thêm khách hàng
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Tạo khách hàng</DialogTitle>
        </DialogHeader>
        <form action={createCustomer}>
          <Label>Tên khách hàng</Label>
          <Input
            type="text"
            name="fullName"
            placeholder="Tên khách hàng"
            required
          />
          <Label>Mã căn cước công dân</Label>
          <Input
            type="text"
            name="citizenId"
            placeholder="Mã căn cước công dân"
            required
          />
          <Label>Tên tài khoản</Label>
          <Input
            type="text"
            name="accountName"
            placeholder="Tên tài khoản"
            required
          />
          <Label>Số điện thoại</Label>
          <Input
            type="text"
            name="phoneNumber"
            placeholder="Số điện thoại"
            required
          />
          <Label>Email</Label>
          <Input
            type="email"
            name="email"
            placeholder="Email"
            required
          />
          <Label>Mức thành viên</Label>
          <Input
            type="text"
            name="membershipLevel"
            placeholder="Mức thành viên"
            required
          />
          <Label>Số dư tài khoản</Label>
          <Input
            type="number"
            name="balance"
            placeholder="Số dư tài khoản"
            required
          />
          <Button type="submit">Tạo</Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export function EditButton({ id }: { id: string }): JSX.Element {
  const [customer, setCustomer] = useState<{
    fullName: string;
    citizenId: string;
    account: { username: string };
    phoneNumber: string;
    email: string;
    membershipLevel: string;
    balance: number;
  } | null>(null);

  useEffect(() => {
    getCustomerById(id).then(setCustomer).catch(console.error);
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
          <DialogTitle>Sửa thông tin khách hàng</DialogTitle>
        </DialogHeader>
        <form
          action={async (formData: FormData) =>
            await editCustomer(formData, id)
          }
        >
          <Label>Tên khách hàng</Label>
          <Input
            type="text"
            name="fullName"
            defaultValue={customer?.fullName}
            required
          />
          <Label>Mã căn cước công dân</Label>
          <Input
            type="text"
            name="citizenId"
            defaultValue={customer?.citizenId}
            required
          />
          <Label>Tên tài khoản</Label>
          <Input
            type="text"
            name="accountName"
            defaultValue={customer?.account.username}
            required
          />
          <Label>Số điện thoại</Label>
          <Input
            type="text"
            name="phoneNumber"
            defaultValue={customer?.phoneNumber}
            required
          />
          <Label>Email</Label>
          <Input
            type="email"
            name="email"
            defaultValue={customer?.email}
            required
          />
          <Label>Mức thành viên</Label>
          <Input
            type="text"
            name="membershipLevel"
            defaultValue={customer?.membershipLevel}
            required
          />
          <Label>Số dư tài khoản</Label>
          <Input
            type="number"
            name="balance"
            defaultValue={customer?.balance}
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
      onClick={async () => await deleteCustomer(id)}
    >
      <Trash2 className="h-4 w-4" />
    </Button>
  );
}
