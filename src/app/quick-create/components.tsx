"use client";

import { quickCreate } from "@/actions/quick-create-actions";
import { useRef, useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { createUsageHistory, getAccountByName, getComputerByName } from "@/actions/usage-history-actions";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";


export function CreateAccountAndCustomer(): JSX.Element {
  const [successData, setSuccessData] = useState<{
    customer: {
      fullName: string;
      email: string;
    };
    account: {
      username: string;
    };
  } | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false); // Trạng thái dialog
  const formRef = useRef<HTMLFormElement>(null); // Ref để tham chiếu đến form

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    try {
      const result = await quickCreate(formData);
      setSuccessData(result);
      setIsDialogOpen(true); // Mở dialog khi thành công
    } catch (error) {
      console.error("Failed to create customer and account:", error);
    }
  };

  const handleDialogClose = () => {
    setIsDialogOpen(false); // Đóng dialog
    setSuccessData(null); // Reset dữ liệu thông báo
    formRef.current?.reset(); // Reset form
  };

  return (
    <div className="w-full max-w-md mx-auto">
      {/* Hiển thị form */}
      <form
        ref={formRef} // Gắn ref để có thể reset
        onSubmit={handleSubmit}
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
        <Button
          type="submit"
          className="w-full"
        >
          Tạo
        </Button>
      </form>

      {/* Hiển thị dialog thông báo thành công */}
      <Dialog
        open={isDialogOpen}
        onOpenChange={handleDialogClose}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Tạo thành công!</DialogTitle>
          </DialogHeader>
          <div className="space-y-2">
            <p>
              <strong>Khách hàng:</strong> {successData?.customer.fullName}
            </p>
            <p>
              <strong>Email:</strong> {successData?.customer.email}
            </p>
            <p>
              <strong>Tài khoản:</strong> {successData?.account.username}
            </p>
          </div>
          <DialogFooter>
            <Button onClick={handleDialogClose}>Đóng</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}


export function CreateUsageHistory(): JSX.Element {
  const [customerUsername, setCustomerUsername] = useState<string>(""); // Tên tài khoản khách hàng
  const [customers, setCustomers] = useState<string[]>([]); // Danh sách tài khoản khách hàng
  const [selectedCustomer, setSelectedCustomer] = useState<string | null>(null); // Tài khoản khách hàng được chọn
  const [isCustomerSearchDone, setIsCustomerSearchDone] = useState<boolean>(false); // Trạng thái tìm kiếm khách hàng

  const [computerName, setComputerName] = useState<string>(""); // Tên máy tính
  const [computers, setComputers] = useState<string[]>([]); // Danh sách máy tính
  const [selectedComputer, setSelectedComputer] = useState<string | null>(null); // Máy tính được chọn
  const [isComputerSearchDone, setIsComputerSearchDone] = useState<boolean>(false); // Trạng thái tìm kiếm máy tính

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
    <div className="flex items-center justify-center w-full">
      {/* Form tạo phiên sử dụng */}
      <form
        ref={formRef} // Gắn ref để có thể reset
        onSubmit={handleSubmit}
        className="w-3/4 space-y-8"
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
                <strong>Tên tài khoản:</strong> {usageDetails.customerUsername}
              </p>
              <p>
                <strong>Tên người dùng:</strong> {usageDetails.customerName}
              </p>
              <p>
                <strong>Tên máy tính:</strong> {usageDetails.computerName}
              </p>
              <p>
                <strong>Thời gian bắt đầu:</strong> {new Date(usageDetails.startTime).toLocaleDateString("vi-VN")}
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
    </div>
  );
}

