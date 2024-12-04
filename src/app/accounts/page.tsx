import { CreateButton, DeleteButton, EditButton } from "./components";
import { ViewAllAccounts } from "./view-all-accounts";

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
