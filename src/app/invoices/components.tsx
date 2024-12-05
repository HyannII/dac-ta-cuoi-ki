"use client";

import prisma from "@/lib/db";
import {
  deleteInvoice,
  editInvoice,
  getAllServices,
  getCustomerByAccountName,
  getUsageHistoriesByCustomerId,
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

import React, { useEffect, useState } from "react";
import { createInvoice } from "@/actions/invoice-handler";
import { Checkbox } from "@/components/ui/checkbox";
import { revalidatePath } from "next/cache";

export function CreateButton(): JSX.Element {
  const [accountName, setAccountName] = useState<string>("");
  const [usageHistory, setUsageHistory] = useState<
    {
      id: string;
      computerId: string;
      totalCost: number;
      startTime: Date;
      endTime: Date | null;
    }[]
  >([]);

  const [allServices, setAllServices] = useState<
    { id: string; name: string; price: number }[]
  >([]);

  const [selectedUsageIds, setSelectedUsageIds] = useState<string[]>([]);
  const [selectedServices, setSelectedServices] = useState<
    { id: string; name: string; price: number }[]
    >([]);
  const [isCustomerLoaded, setIsCustomerLoaded] = useState<boolean>(false);

  const handleSearchUsageHistory = async () => {
    if (!accountName) {
      alert("Vui lòng nhập Account ID.");
      return;
    }

    try {
      // Gọi API để lấy customerId từ accountName
      const customerId = await getCustomerByAccountName(accountName);

      if (!customerId) {
        // Kiểm tra nếu customerId là null
        alert("Không tìm thấy khách hàng với Account ID này.");
        return; // Ngừng thực hiện nếu không tìm thấy customer
      }
      setIsCustomerLoaded(true);

      // Gọi API để lấy usageHistory dựa trên customerId
      const histories = await getUsageHistoriesByCustomerId(customerId);

      if (histories.length === 0) {
        alert("Không có Usage History nào được tìm thấy.");
      }

      // Lọc các usageHistory với customerId và endTime không phải null
      const filteredHistories = histories.filter(
        (history) =>
          history.customerId === customerId && history.endTime !== null && !history.invoiceId
      );

      // Nếu totalCost có thể là null, bạn có thể thay đổi nó thành một giá trị mặc định như 0
      const historiesWithValidTotalCost = filteredHistories.map((history) => ({
        ...history,
        totalCost: history.totalCost ?? 0, // Nếu totalCost là null, gán nó bằng 0
      }));

      setUsageHistory(historiesWithValidTotalCost); // Cập nhật state với giá trị totalCost đã thay đổi
    } catch (error) {
      console.error("Error fetching usage history:", error);
      alert("Có lỗi xảy ra khi tìm Usage History.");
    }
  };

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const services = await getAllServices(); // Gọi hàm getAllServices
        setAllServices(services); // Cập nhật state với danh sách dịch vụ
      } catch (error) {
        console.error("Error fetching services:", error);
        alert("Không thể lấy danh sách dịch vụ.");
      }
    };

    fetchServices();
  }, []);

  const handleServiceChange = (service: {
    id: string;
    name: string;
    price: number;
  }) => {
    setSelectedServices((prev) => {
      const exists = prev.find((s) => s.id === service.id);

      if (exists) {
        // Nếu dịch vụ đã được chọn, loại bỏ khỏi danh sách
        return prev.filter((s) => s.id !== service.id);
      } else {
        // Nếu dịch vụ chưa được chọn, thêm vào danh sách
        return [...prev, service];
      }
    });
  };
  const handleQuantityChange = (serviceId: string, quantity: number) => {
    setSelectedServices((prev) =>
      prev.map((service) =>
        service.id === serviceId ? { ...service, quantity } : service
      )
    );
  };

  const handleUsageChange = (id: string) => {
    setSelectedUsageIds((prev) => {
      if (prev.includes(id)) {
        // Nếu usageHistory đã được chọn, loại bỏ khỏi danh sách
        return prev.filter((usageId) => usageId !== id);
      } else {
        // Nếu usageHistory chưa được chọn, thêm vào danh sách
        return [...prev, id];
      }
    });
  };

  const handleSubmit = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("accountName", accountName); // Thêm accountName vào formData

    // Thêm từng `selectedUsageId` vào formData
    selectedUsageIds.forEach((id) => {
      formData.append("selectedUsageIds[]", id); // Truyền từng `id` dưới dạng một mục riêng
    });

    // Thêm dịch vụ vào formData
    selectedServices.forEach((service, index) => {
      formData.append(`services[${index}][name]`, service.name);
      formData.append(`services[${index}][price]`, service.price.toString());
    });

    try {
      const result = await createInvoice(formData); // Gọi hàm tạo hóa đơn
      if (result.error) {
        alert(result.error);
      } else {
        alert("Hóa đơn đã được tạo thành công.");
      }
    } catch (error) {
      console.error(error);
    }
        // revalidatePath("/invoices");
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">Tạo Hóa Đơn</Button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Tạo Hóa Đơn</DialogTitle>
        </DialogHeader>

        {/* Nhập Account ID */}
        <div className="flex flex-col gap-2">
          <Label>Nhập Account ID</Label>
          <div className="flex gap-2">
            <Input
              type="text"
              name="accountName"
              placeholder="Nhập Account ID"
              value={accountName}
              onChange={(e) => setAccountName(e.target.value)}
            />
            <Button
              onClick={handleSearchUsageHistory}
              className="bg-blue-500 text-white px-4 py-2 rounded"
            >
              Tìm
            </Button>
          </div>
        </div>

        {/* Hiển thị Usage History */}
        {usageHistory.length > 0 && (
          <div>
            <h3 className="font-bold text-lg mb-2">Chọn phiên sử dụng:</h3>
            <div className="space-y-2">
              {usageHistory.map((history) => (
                <div
                  key={history.id}
                  className="flex items-center gap-2"
                >
                  <Checkbox
                    checked={selectedUsageIds.includes(history.id)}
                    onCheckedChange={() => handleUsageChange(history.id)}
                  />
                  <label>
                    Máy {history.computerId} - Chi phí: {history.totalCost} VND
                  </label>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Hiển thị danh sách Services */}
        {isCustomerLoaded && allServices.length > 0 && (
          <div>
            <h3 className="font-bold text-lg mb-2">Chọn dịch vụ:</h3>
            <div className="space-y-2">
              {allServices.map((service) => (
                <div
                  key={service.id}
                  className="flex items-center gap-2"
                >
                  <Checkbox
                    onCheckedChange={() => handleServiceChange(service)}
                  />
                  <label>
                    {service.name} - {service.price} VND
                  </label>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Nút tạo hóa đơn */}
        <DialogFooter>
          <Button
            onClick={handleSubmit}
            className="bg-green-500 text-white px-4 py-2 rounded w-full"
          >
            Tạo hóa đơn
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// export function EditButton({ id }: { id: string }): JSX.Element {
//   const [invoice, setInvoice] = useState<{
//     invoiceDate: Date;
//     totalAmount: number;
//     status: string;
//   } | null>(null);

//   const [customerName, setCustomerName] = useState<string>("");
//   const [customers, setCustomers] = useState<
//     { id: string; fullName: string; citizenId: string }[]
//   >([]);
//   const [selectedCustomer, setSelectedCustomer] = useState<string | null>(null);

//   const [usageHistories, setUsageHistories] = useState<
//     { id: string; computerId: string; startTime: Date; endTime: Date | null }[]
//   >([]);
//   const [selectedHistories, setSelectedHistories] = useState<string[]>([]);

//   useEffect(() => {
//     getInvoiceById(id)
//       .then((data) => {
//         setInvoice(data);
//         setSelectedHistories(data?.usageHistories.map((h) => h.id) || []);
//       })
//       .catch(console.error);
//   }, [id]);

//   useEffect(() => {
//     if (selectedCustomer) {
//       getUsageHistoriesByCustomerId(selectedCustomer)
//         .then(setUsageHistories)
//         .catch(console.error);
//     }
//   }, [selectedCustomer]);

//   const handleSearchCustomer = async () => {
//     const customers = await getCustomersByName(customerName);
//     setCustomers(customers);
//     setSelectedCustomer(null); // Reset selected customer
//   };

//   const handleAddUsageHistory = (historyId: string) => {
//     if (!selectedHistories.includes(historyId)) {
//       setSelectedHistories([...selectedHistories, historyId]);
//     }
//   };

//   const handleRemoveUsageHistory = (historyId: string) => {
//     setSelectedHistories(selectedHistories.filter((id) => id !== historyId));
//   };

//   return (
//     <Dialog>
//       <DialogTrigger asChild>
//         <Button variant="outline">
//           <Pencil className="h-4 w-4" />
//         </Button>
//       </DialogTrigger>
//       <DialogContent>
//         <DialogHeader>
//           <DialogTitle>Sửa thông tin hoá đơn</DialogTitle>
//         </DialogHeader>
//         <form
//           action={async (formData: FormData) => {
//             formData.append(
//               "usageHistories",
//               JSON.stringify(selectedHistories)
//             );
//             formData.append("customerCitizenId", selectedCustomer || "");
//             console.log("Submitting formData:", Array.from(formData.entries()));
//             await editInvoice(formData, id);
//           }}
//         >
//           <Label>Tìm kiếm khách hàng theo tên</Label>
//           <div style={{ display: "flex", gap: "8px" }}>
//             <Input
//               type="text"
//               placeholder="Nhập tên khách hàng"
//               value={customerName}
//               onChange={(e) => setCustomerName(e.target.value)}
//             />
//             <Button
//               type="button"
//               onClick={handleSearchCustomer}
//             >
//               Tìm
//             </Button>
//           </div>

//           {customers.length > 0 && (
//             <>
//               <Label>Chọn khách hàng</Label>
//               <select
//                 onChange={(e) => setSelectedCustomer(e.target.value)}
//                 defaultValue=""
//               >
//                 <option
//                   value=""
//                   disabled
//                 >
//                   -- Chọn khách hàng --
//                 </option>
//                 {customers.map((customer) => (
//                   <option
//                     key={customer.id}
//                     value={customer.id}
//                   >
//                     {customer.fullName} - {customer.citizenId}
//                   </option>
//                 ))}
//               </select>
//             </>
//           )}

//           <Label>Trạng thái</Label>
//           <Input
//             type="text"
//             name="status"
//             defaultValue={invoice?.status}
//             required
//           />
//           <Label>Thành tiền</Label>
//           <Input
//             type="number"
//             name="totalAmount"
//             defaultValue={invoice?.totalAmount}
//             required
//           />

//           <Label>Lịch sử sử dụng đã chọn</Label>
//           <ul>
//             {selectedHistories.map((historyId) => {
//               const history = usageHistories.find((h) => h.id === historyId);
//               return (
//                 <li key={historyId}>
//                   {history?.computerId} (
//                   {history?.startTime.toLocaleDateString("vi-VN")}){" "}
//                   <Button
//                     type="button"
//                     variant="destructive"
//                     onClick={() => handleRemoveUsageHistory(historyId)}
//                   >
//                     Hủy
//                   </Button>
//                 </li>
//               );
//             })}
//           </ul>

//           <Label>Thêm lịch sử sử dụng</Label>
//           <select onChange={(e) => handleAddUsageHistory(e.target.value)}>
//             <option value="">Chọn lịch sử sử dụng</option>
//             {usageHistories
//               .filter((h) => !selectedHistories.includes(h.id))
//               .map((history) => (
//                 <option
//                   key={history.id}
//                   value={history.id}
//                 >
//                   {history.computerId} (
//                   {history.startTime.toLocaleDateString("vi-VN")})
//                 </option>
//               ))}
//           </select>

//           <Button type="submit">Sửa</Button>
//         </form>
//       </DialogContent>
//     </Dialog>
//   );
// }

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
