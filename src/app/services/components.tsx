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
  createService,
  deleteService,
  editService,
  getServiceById,
} from "@/actions/service-actions";

export function CreateButton(): JSX.Element {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">
          <Plus className="h-4 w-4" /> Thêm dịch vụ
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Tạo dịch vụ</DialogTitle>
        </DialogHeader>
        <form
          action={createService}
          className="space-y-4"
        >
          <div className="flex flex-col">
            <Label>Tên dịch vụ</Label>
            <Input
              type="text"
              name="name"
              placeholder="Tên dịch vụ"
              required
            />
          </div>
          <div className="flex flex-col">
            <Label>Giá tiền</Label>
            <Input
              type="text"
              name="price"
              placeholder="Giá tiền"
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
  const [service, setService] = useState<{
      name: string;
      price: number;
  } | null>(null);

  useEffect(() => {
    getServiceById(id).then(setService).catch(console.error);
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
          <DialogTitle>Sửa thông tin dịch vụ</DialogTitle>
        </DialogHeader>
        <form
          action={async (formData: FormData) =>
            await editService(formData, id)
          }
          className="space-y-4"
        >
          <div className="flex flex-col">
            <Label>Tên dịch vụ</Label>
            <Input
              type="text"
              name="name"
              defaultValue={service?.name}
              required
            />
          </div>
          <div className="flex flex-col">
            <Label>Giá tiền</Label>
            <Input
              type="text"
              name="price"
              defaultValue={service?.price}
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
      onClick={async () => await deleteService(id)}
    >
      <Trash2 className="h-4 w-4" />
    </Button>
  );
}
