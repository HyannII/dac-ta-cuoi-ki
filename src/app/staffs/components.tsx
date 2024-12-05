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
  createStaff,
  deleteStaff,
  editStaff,
  getStaffById,
} from "@/actions/staff-actions";

export function CreateButton(): JSX.Element {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">
          <Plus className="h-4 w-4" /> Thêm nhân viên
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Tạo nhân viên</DialogTitle>
        </DialogHeader>
        <form
          action={createStaff}
          className="space-y-4"
        >
          <div className="flex flex-col">
            <Label>Tên nhân viên</Label>
            <Input
              type="text"
              name="fullName"
              placeholder="Tên nhân viên"
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
            <Label>Vai trò</Label>
            <Input
              type="text"
              name="role"
              placeholder="Vai trò"
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
  const [staff, setStaff] = useState<{
    fullName: string;
    account: { username: string };
    phoneNumber: string;
      email: string;
      role: string;
  } | null>(null);

  useEffect(() => {
    getStaffById(id).then(setStaff).catch(console.error);
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
          <DialogTitle>Sửa thông tin nhân viên</DialogTitle>
        </DialogHeader>
        <form
          action={async (formData: FormData) =>
            await editStaff(formData, id)
          }
          className="space-y-4"
        >
          <div className="flex flex-col">
            <Label>Tên nhân viên</Label>
            <Input
              type="text"
              name="fullName"
              defaultValue={staff?.fullName}
              required
            />
          </div>
          <div className="flex flex-col">
            <Label>Tên tài khoản</Label>
            <Input
              type="text"
              name="accountName"
              defaultValue={staff?.account.username}
              required
            />
          </div>
          <div className="flex flex-col">
            <Label>Số điện thoại</Label>
            <Input
              type="text"
              name="phoneNumber"
              defaultValue={staff?.phoneNumber}
              required
            />
          </div>
          <div className="flex flex-col">
            <Label>Email</Label>
            <Input
              type="email"
              name="email"
              defaultValue={staff?.email}
              required
            />
          </div>
          <div className="flex flex-col">
            <Label>Vai trò</Label>
            <Input
              type="text"
              name="role"
              defaultValue={staff?.role}
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
      onClick={async () => await deleteStaff(id)}
    >
      <Trash2 className="h-4 w-4" />
    </Button>
  );
}
