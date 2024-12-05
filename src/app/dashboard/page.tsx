import { AppSidebar } from "@/components/app-sidebar"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Separator } from "@/components/ui/separator"
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { readAllTables } from "../../../prisma/seedCreator"

const main = async () => {
  // Tạo seed cho tất cả các bảng
  await readAllTables({
    allSeeds: true, // Tạo tất cả seed
    seedFile: true, // Tạo file seed.ts
    logTables: true, // Log ra danh sách các bảng
    arrFilters: [
      // (Tùy chọn) Thêm các bộ lọc để loại bỏ/điều chỉnh dữ liệu
      {
        keyToFilter: "password",
        replaceTo: "encrypted-password",
        inTable: "User",
      },
      { keyToFilter: "deletedAt" },
    ],
    onlyTables: [], // (Tùy chọn) Nếu để trống, sẽ đọc tất cả các bảng
    folderName: "seeds", // Tên thư mục chứa các file seed
  });
};

main()
  .then(() => console.log("Seed creation completed."))
  .catch((err) => console.error("Error during seed creation:", err));

