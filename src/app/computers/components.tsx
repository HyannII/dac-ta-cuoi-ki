"use client";

import {
  createAccount,
  deleteAccount,
  editAccount,
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
import {
  createComputer,
  deleteComputer,
  editComputer,
  getComputerById,
} from "@/actions/computer-actions";

export function CreateButton(): JSX.Element {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">
          <Plus className="h-4 w-4" /> Thêm máy tính
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Tạo máy tính</DialogTitle>
        </DialogHeader>
        <form action={createComputer}>
          <Label>Tên máy tính</Label>
          <Input
            type="text"
            name="name"
            placeholder="Tên máy tính"
            required
          />
          <Label>Trạng thái</Label>
          <Input
            type="text"
            name="status"
            placeholder="Tên máy tính"
            required
          />
          <Label>Vị trí</Label>
          <Input
            type="text"
            name="location"
            placeholder="Tên máy tính"
            required
          />
          <Label>Cấu hình</Label>
          <Input
            type="text"
            name="specs"
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
  const [computer, setComputer] = useState<{
    name: string;
    status: string;
    location: string;
    specs: string;
  } | null>(null);

  useEffect(() => {
    getComputerById(id).then(setComputer).catch(console.error);
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
          <DialogTitle>Sửa thông tin máy tính</DialogTitle>
        </DialogHeader>
        <form
          action={async (formData: FormData) =>
            await editComputer(formData, id)
          }
        >
          <Label>Tên máy tính</Label>
          <Input
            type="text"
            name="name"
            defaultValue={computer?.name}
            required
          />
          <Label>Trạng thái</Label>
          <Input
            type="text"
            name="status"
            defaultValue={computer?.status}
            required
          />
          <Label>Vị trí</Label>
          <Input
            type="text"
            name="location"
            defaultValue={computer?.location}
            required
          />
          <Label>Cấu hình</Label>
          <Input
            type="text"
            name="specs"
            defaultValue={computer?.specs}
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
      onClick={async () => await deleteComputer(id)}
    >
      <Trash2 className="h-4 w-4" />
    </Button>
  );
}
