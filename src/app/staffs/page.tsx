import { Metadata } from "next";
import { CreateButton } from "./components";
import { ViewAllStaffs } from "./view-all-staffs";
export const metadata: Metadata = {
  title: "Customers",
  description: "Generated by create next app",
};
export default function Staffs() {
  return (
    <div className="container mx-auto py-10">
      <h1 className="text-2xl font-bold mb-5">Quản lý nhân viên</h1>
      <div className="mb-4">
        <CreateButton />
      </div>
      <ViewAllStaffs />
    </div>
  );
}
