import { BookUser, Calendar, ContactRound, FileClock, Home, Inbox, PcCase, Salad, Search, Settings, SquareUserRound } from "lucide-react";

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
    title: "Accounts",
    url: "/accounts",
    icon: SquareUserRound,
  },
  {
    title: "Computers",
    url: "/computers",
    icon: PcCase,
  },
  {
    title: "Customers",
    url: "/customers",
    icon: Calendar,
  },
  {
    title: "Invoices",
    url: "#",
    icon: BookUser,
  },
  {
    title: "Services",
    url: "#",
    icon: Salad,
  },
  {
    title: "Staffs",
    url: "#",
    icon: ContactRound,
  },
  {
    title: "UsageHistory",
    url: "#",
    icon: FileClock,
  },
];

export function AppSidebar() {
  return (
    <Sidebar variant="inset">
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Application</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
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
