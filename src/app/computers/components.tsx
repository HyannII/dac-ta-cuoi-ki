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
        <form
          action={createComputer}
          className="space-y-4"
        >
          <div className="flex flex-col">
            <Label>Tên máy tính</Label>
            <Input
              type="text"
              name="name"
              placeholder="Tên máy tính"
              required
            />
          </div>
          <div className="flex flex-col">
            <Label>Trạng thái</Label>
            <Input
              type="text"
              name="status"
              placeholder="Tên máy tính"
              required
            />
          </div>
          <div className="flex flex-col">
            <Label>Vị trí</Label>
            <Input
              type="text"
              name="location"
              placeholder="Tên máy tính"
              required
            />
          </div>
          <div className="flex flex-col">
            <Label>Cấu hình</Label>
            <Input
              type="text"
              name="specs"
              placeholder="Tên máy tính"
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
          className="space-y-4"
        >
          <div className="flex flex-col">
            <Label>Tên máy tính</Label>
            <Input
              type="text"
              name="name"
              defaultValue={computer?.name}
              required
            />
          </div>
          <div className="flex flex-col">
            <Label>Trạng thái</Label>
            <Input
              type="text"
              name="status"
              defaultValue={computer?.status}
              required
            />
          </div>
          <div className="flex flex-col">
            <Label>Vị trí</Label>
            <Input
              type="text"
              name="location"
              defaultValue={computer?.location}
              required
            />
          </div>
          <div className="flex flex-col">
            <Label>Cấu hình</Label>
            <Input
              type="text"
              name="specs"
              defaultValue={computer?.specs}
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
      onClick={async () => await deleteComputer(id)}
    >
      <Trash2 className="h-4 w-4" />
    </Button>
  );
}
