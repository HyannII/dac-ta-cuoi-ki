import {
  BookUser,
  Calendar,
  ContactRound,
  FileClock,
  Home,
  Inbox,
  PcCase,
  Salad,
  Search,
  Settings,
  SquareUserRound,
  Zap,
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

// Menu items.
const items = [
  {
    title: "Tạo nhanh",
    url: "/quick-create",
    icon: Zap,
  },
  {
    title: "Tài khoản",
    url: "/accounts",
    icon: SquareUserRound,
  },
  {
    title: "Máy tính",
    url: "/computers",
    icon: PcCase,
  },
  {
    title: "Khách hàng",
    url: "/customers",
    icon: Calendar,
  },
  {
    title: "Hoá đơn",
    url: "/invoices",
    icon: BookUser,
  },
  {
    title: "Dịch vụ",
    url: "#",
    icon: Salad,
  },
  {
    title: "Nhân viên",
    url: "#",
    icon: ContactRound,
  },
  {
    title: "Phiên sử dụng",
    url: "/usage-history",
    icon: FileClock,
  },
];

export function AppSidebar() {
  return (
    <Sidebar variant="inset">
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="h-12 text-xl">Quản lí phòng máy</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title} className="h-12 flex items-center">
                  <SidebarMenuButton asChild size={"lg"}>
                    <a href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
