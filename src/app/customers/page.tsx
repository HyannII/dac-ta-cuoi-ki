
import { CreateButton} from "./components";
import { ViewAllCustomers } from "./view-all-customers";

export default function Computers() {
  return (
    <div className="container mx-auto py-10">
      <h1 className="text-2xl font-bold mb-5">Quản lý khách hàng</h1>
      <div className="mb-4">
        <CreateButton />
      </div>
      <ViewAllCustomers />
    </div>
  );
}
