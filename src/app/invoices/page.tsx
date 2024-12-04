import { CreateButton} from "./components";
import { ViewAllInvoices } from "./view-all-invoices";

export default function Invoices() {

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-2xl font-bold mb-5">Quản lý hoá đơn</h1>
      <div className="mb-4">
        <CreateButton />
      </div>
      <ViewAllInvoices />
    </div>
  );
}
