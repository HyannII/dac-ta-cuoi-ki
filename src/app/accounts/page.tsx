import { Metadata } from "next";
import { CreateButton} from "./components";
import { ViewAllAccounts } from "./view-all-accounts";
export const metadata: Metadata = {
  title: "Accounts",
  description: "Generated by create next app",
};
export default function Accounts() {

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-2xl font-bold mb-5">Quản lý tài khoản</h1>
      <div className="mb-4">
        <CreateButton />
      </div>
      <ViewAllAccounts />
    </div>
  );
}
