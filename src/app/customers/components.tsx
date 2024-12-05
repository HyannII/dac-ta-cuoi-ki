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
        <form
          action={createCustomer}
          className="space-y-4"
        >
          <div className="flex flex-col">
            <Label>Tên khách hàng</Label>
            <Input
              type="text"
              name="fullName"
              placeholder="Tên khách hàng"
              required
            />
          </div>
          <div className="flex flex-col">
            <Label>Mã căn cước công dân</Label>
            <Input
              type="text"
              name="citizenId"
              placeholder="Mã căn cước công dân"
              required
            />
          </div>
          <div className="flex flex-col">
            <Label>Tên tài khoản</Label>
            <Input
              type="text"
              name="accountName"
              placeholder="Tên tài khoản"
              required
            />
          </div>
          <div className="flex flex-col">
            <Label>Số điện thoại</Label>
            <Input
              type="text"
              name="phoneNumber"
              placeholder="Số điện thoại"
              required
            />
          </div>
          <div className="flex flex-col">
            <Label>Email</Label>
            <Input
              type="email"
              name="email"
              placeholder="Email"
              required
            />
          </div>
          <div className="flex flex-col">
            <Label>Mức thành viên</Label>
            <Input
              type="text"
              name="membershipLevel"
              placeholder="Mức thành viên"
              required
            />
          </div>
          <div className="flex flex-col">
            <Label>Số dư tài khoản</Label>
            <Input
              type="number"
              name="balance"
              placeholder="Số dư tài khoản"
              required
            />
          </div>
          <Button
            type="submit"
            className="w-full"
          >
            Tạo
          </Button>
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
          className="space-y-4"
        >
          <div className="flex flex-col">
            <Label>Tên khách hàng</Label>
            <Input
              type="text"
              name="fullName"
              defaultValue={customer?.fullName}
              required
            />
          </div>
          <div className="flex flex-col">
            <Label>Mã căn cước công dân</Label>
            <Input
              type="text"
              name="citizenId"
              defaultValue={customer?.citizenId}
              required
            />
          </div>
          <div className="flex flex-col">
            <Label>Tên tài khoản</Label>
            <Input
              type="text"
              name="accountName"
              defaultValue={customer?.account.username}
              required
            />
          </div>
          <div className="flex flex-col">
            <Label>Số điện thoại</Label>
            <Input
              type="text"
              name="phoneNumber"
              defaultValue={customer?.phoneNumber}
              required
            />
          </div>
          <div className="flex flex-col">
            <Label>Email</Label>
            <Input
              type="email"
              name="email"
              defaultValue={customer?.email}
              required
            />
          </div>
          <div className="flex flex-col">
            <Label>Mức thành viên</Label>
            <Input
              type="text"
              name="membershipLevel"
              defaultValue={customer?.membershipLevel}
              required
            />
          </div>
          <div className="flex flex-col">
            <Label>Số dư tài khoản</Label>
            <Input
              type="number"
              name="balance"
              defaultValue={customer?.balance}
              required
            />
          </div>
          <Button
            type="submit"
            className="w-full"
          >
            Sửa
          </Button>
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
