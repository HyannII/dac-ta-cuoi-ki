"use client";

import {
  createAccount,
  deleteAccount,
  editAccount,
  getAccountById,
} from "@/actions/account-actions";
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
          <Plus className="h-4 w-4" /> Thêm tài khoản
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Tạo tài khoản</DialogTitle>
        </DialogHeader>
        <form
          action={createAccount}
          className="space-y-4"
        >
          <div className="flex flex-col">
            <Label>Tên tài khoản</Label>
            <Input
              type="text"
              name="username"
              placeholder="Tên tài khoản"
              required
            />
          </div>
          <div className="flex flex-col">
            <Label>Mật khẩu</Label>
            <Input
              type="password"
              name="password"
              placeholder="Mật khẩu"
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
  const [account, setAccount] = useState<{
    username: string;
    role: string;
    password: string;
  } | null>(null);

  useEffect(() => {
    getAccountById(id).then(setAccount).catch(console.error);
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
          <DialogTitle>Sửa thông tin tài khoản</DialogTitle>
        </DialogHeader>
        <form
          action={async (formData: FormData) => await editAccount(formData, id)}
        >
          <div className="flex flex-col">
            <Label>Tên tài khoản</Label>
            <Input
              type="text"
              name="username"
              defaultValue={account?.username}
              required
            />
          </div>
          <div className="flex flex-col">
            <Label>Mật khẩu</Label>
            <Input
              type="password"
              name="password"
              defaultValue={account?.password}
              required
            />
          </div>
          <div className="flex flex-col">
            <Label>Vai trò</Label>
            <Input
              type="text"
              name="role"
              defaultValue={account?.role}
              required
            />
          </div>
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
      onClick={async () => await deleteAccount(id)}
    >
      <Trash2 className="h-4 w-4" />
    </Button>
  );
}
