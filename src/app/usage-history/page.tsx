import { CreateButton} from "./components";
import { ViewAllUsageHistories } from "./view-all-usage-histories";

export default function UsageHistory() {

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-2xl font-bold mb-5">Quản lý phiên sử dụng</h1>
      <div className="mb-4">
        <CreateButton />
      </div>
      <ViewAllUsageHistories />
    </div>
  );
}
