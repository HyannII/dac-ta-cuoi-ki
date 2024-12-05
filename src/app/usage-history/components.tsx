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
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@radix-ui/react-label";
import { Pencil, Plus, Trash2 } from "lucide-react";
import { Input } from "@/components/ui/input";

import React, { useEffect, useRef, useState } from "react";
import {
  createUsageHistory,
  deleteUsageHistory,
  editUsageHistory,
  getAccountByName,
  getComputerByName,
  getUsageHistoryById,
} from "@/actions/usage-history-actions";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";


export function CreateButton(): JSX.Element {
  const [customerUsername, setCustomerUsername] = useState<string>(""); // Tên tài khoản khách hàng
  const [customers, setCustomers] = useState<string[]>([]); // Danh sách tài khoản khách hàng
  const [selectedCustomer, setSelectedCustomer] = useState<string | null>(null); // Tài khoản khách hàng được chọn
  const [isCustomerSearchDone, setIsCustomerSearchDone] =
    useState<boolean>(false); // Trạng thái tìm kiếm khách hàng

  const [computerName, setComputerName] = useState<string>(""); // Tên máy tính
  const [computers, setComputers] = useState<string[]>([]); // Danh sách máy tính
  const [selectedComputer, setSelectedComputer] = useState<string | null>(null); // Máy tính được chọn
  const [isComputerSearchDone, setIsComputerSearchDone] =
    useState<boolean>(false); // Trạng thái tìm kiếm máy tính

  const [showDialog, setShowDialog] = useState<boolean>(false); // Hiển thị dialog thành công
  const [showErrorDialog, setShowErrorDialog] = useState<boolean>(false); // Hiển thị dialog lỗi
  const [usageDetails, setUsageDetails] = useState<UsageDetails | null>(null); // Chi tiết của phiên sử dụng
  const [errorMessage, setErrorMessage] = useState<string | null>(null); // Lỗi khi không thể tạo phiên sử dụng

  const formRef = useRef<HTMLFormElement>(null); // Ref để tham chiếu đến form

  // Usage details type
  interface UsageDetails {
    customerUsername: string;
    customerName: string;
    computerName: string;
    startTime: string;
    error?: string;
  }

  // Tìm kiếm khách hàng theo tên tài khoản
  const handleSearchCustomer = async (): Promise<void> => {
    try {
      const accounts: string[] = await getAccountByName(customerUsername);
      setCustomers(accounts);
      setIsCustomerSearchDone(true); // Đánh dấu đã hoàn tất tìm kiếm khách hàng
    } catch (error) {
      console.error("Error fetching accounts:", error);
    }
  };

  // Tìm kiếm máy tính theo tên
  const handleSearchComputer = async (): Promise<void> => {
    try {
      const computerList: string[] = await getComputerByName(computerName);
      setComputers(computerList);
      setIsComputerSearchDone(true); // Đánh dấu đã hoàn tất tìm kiếm máy tính
    } catch (error) {
      console.error("Error fetching computers:", error);
    }
  };

  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>
  ): Promise<void> => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("customerUsername", selectedCustomer || "");
    formData.append("computerName", selectedComputer || "");

    // Kiểm tra nếu không chọn khách hàng hoặc máy tính
    if (!selectedCustomer || !selectedComputer) {
      alert("Vui lòng chọn khách hàng và máy tính.");
      return;
    }

    try {
      // Gửi dữ liệu tạo phiên sử dụng
      const result = await createUsageHistory(formData);

      // Kiểm tra nếu có lỗi
      if (result.error) {
        setErrorMessage(result.error);
        setShowErrorDialog(true);
        return;
      }

      // Kiểm tra nếu không có lỗi và có usageDetails
      if (result.usageDetails) {
        // Lưu lại thông tin phiên sử dụng
        setUsageDetails(result.usageDetails);
        setShowDialog(true); // Hiển thị dialog thành công
      } else {
        console.error("Unexpected response format: missing usageDetails");
      }
    } catch (error) {
      console.error("Error creating usage history:", error);
    }
  };

  const handleDialogClose = (): void => {
    setShowDialog(false); // Đóng dialog
    setUsageDetails(null); // Reset dữ liệu thông báo
    formRef.current?.reset(); // Reset form
  };

  const handleErrorDialogClose = (): void => {
    setShowErrorDialog(false); // Đóng dialog lỗi
    setErrorMessage(null); // Reset thông báo lỗi
  };

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
        <form
          ref={formRef}
          onSubmit={handleSubmit}
          className="space-y-4"
        >
          {/* Tìm kiếm khách hàng */}
          <div className="flex flex-col gap-2">
            <Label>Tìm kiếm khách hàng theo tên tài khoản</Label>
            <div className="flex gap-2">
              <Input
                type="text"
                placeholder="Nhập tên tài khoản khách hàng"
                value={customerUsername}
                onChange={(e) => setCustomerUsername(e.target.value)}
                className="w-full"
              />
              <Button
                type="button"
                onClick={handleSearchCustomer}
                className="whitespace-nowrap"
              >
                Tìm
              </Button>
            </div>
          </div>

          {isCustomerSearchDone && customers.length > 0 && (
            <div className="flex flex-col gap-2">
              <Label>Chọn tài khoản khách hàng</Label>
              <Select onValueChange={(value) => setSelectedCustomer(value)}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="-- Chọn tài khoản khách hàng --" />
                </SelectTrigger>
                <SelectContent>
                  {customers.map((username) => (
                    <SelectItem
                      key={username}
                      value={username}
                    >
                      {username}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          {/* Tìm kiếm máy tính */}
          <div className="flex flex-col gap-2">
            <Label>Tìm kiếm máy tính theo tên</Label>
            <div className="flex gap-2">
              <Input
                type="text"
                placeholder="Nhập tên máy tính"
                value={computerName}
                onChange={(e) => setComputerName(e.target.value)}
                className="w-full"
              />
              <Button
                type="button"
                onClick={handleSearchComputer}
                className="whitespace-nowrap"
              >
                Tìm
              </Button>
            </div>
          </div>

          {isComputerSearchDone && computers.length > 0 && (
            <div className="flex flex-col gap-2">
              <Label>Chọn máy tính</Label>
              <Select onValueChange={(value) => setSelectedComputer(value)}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="-- Chọn máy tính --" />
                </SelectTrigger>
                <SelectContent>
                  {computers.map((name) => (
                    <SelectItem
                      key={name}
                      value={name}
                    >
                      {name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          {/* Nút tạo */}
          <Button
            type="submit"
            className="w-full"
          >
            Tạo
          </Button>
        </form>

        {/* Dialog thành công */}
        {showDialog && usageDetails && (
          <Dialog
            open={showDialog}
            onOpenChange={handleDialogClose}
          >
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Phiên sử dụng đã được tạo thành công!</DialogTitle>
              </DialogHeader>
              <div>
                <p>
                  <strong>Tên tài khoản:</strong>{" "}
                  {usageDetails.customerUsername}
                </p>
                <p>
                  <strong>Tên người dùng:</strong> {usageDetails.customerName}
                </p>
                <p>
                  <strong>Tên máy tính:</strong> {usageDetails.computerName}
                </p>
                <p>
                  <strong>Thời gian bắt đầu:</strong>{" "}
                  {new Date(usageDetails.startTime).toLocaleDateString("vi-VN")}
                </p>
              </div>
              <DialogFooter>
                <Button onClick={handleDialogClose}>Đóng</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        )}

        {/* Dialog lỗi */}
        {showErrorDialog && errorMessage && (
          <Dialog
            open={showErrorDialog}
            onOpenChange={handleErrorDialogClose}
          >
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Lỗi</DialogTitle>
              </DialogHeader>
              <div>
                <p>{errorMessage}</p>
              </div>
              <DialogFooter>
                <Button onClick={handleErrorDialogClose}>Đóng</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        )}
      </DialogContent>
    </Dialog>
  );
}




export function EditButton({ id }: { id: string }): JSX.Element {
  const [usageHistory, setUsageHistory] = useState<{
    customer: { username: string };
    computer: { name: string };
    startTime: Date;
    endTime: Date | null;
    totalHours: number | null;
    totalCost: number | null;
  } | null>(null);

  const [complete, setComplete] = useState(false);

  useEffect(() => {
    getUsageHistoryById(id).then(setUsageHistory).catch(console.error);
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
          <DialogTitle>Sửa thông tin phiên sử dụng</DialogTitle>
        </DialogHeader>
        <form
          onSubmit={async (e) => {
            e.preventDefault();
            const formData = new FormData(e.currentTarget);
            await editUsageHistory(formData, id, complete);
          }}
          className="space-y-4" // Khoảng cách dọc giữa các thành phần
        >
          {/* Tài khoản khách hàng */}
          <div className="flex flex-col">
            <Label htmlFor="customerUsername">Tài khoản khách hàng</Label>
            <Input
              type="text"
              name="customerUsername"
              defaultValue={usageHistory?.customer.username || ""}
              required
              readOnly
            />
          </div>

          {/* Tên máy tính */}
          <div className="flex flex-col">
            <Label htmlFor="computerName">Tên máy tính</Label>
            <Input
              type="text"
              name="computerName"
              defaultValue={usageHistory?.computer.name || ""}
              required
              readOnly
            />
          </div>

          {/* Thời gian bắt đầu phiên */}
          <div className="flex flex-col">
            <Label htmlFor="startTime">Thời gian bắt đầu phiên</Label>
            <Input
              type="text"
              name="startTime"
              defaultValue={
                usageHistory?.startTime
                  ? usageHistory.startTime.toLocaleString("vi-VN")
                  : ""
              }
              readOnly
            />
          </div>

          {/* Đánh dấu hoàn thành */}
          <div className="flex items-center space-x-2">
            <Checkbox
              id="complete"
              checked={complete}
              onCheckedChange={(checked) => setComplete(!!checked)}
            />
            <Label htmlFor="complete">Kết thúc phiên</Label>
          </div>

          {/* Nút submit */}
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
      onClick={async () => await deleteUsageHistory(id)}
    >
      <Trash2 className="h-4 w-4" />
    </Button>
  );
}
