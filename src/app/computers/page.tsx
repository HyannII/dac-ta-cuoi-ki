
import { CreateButton} from "./components";
import { ViewAllComputers } from "./view-all-computers";

export default function Computers() {
  return (
    <div className="container mx-auto py-10">
      <h1 className="text-2xl font-bold mb-5">Quản lý máy tính</h1>
      <div className="mb-4">
        <CreateButton />
      </div>
      <ViewAllComputers />
    </div>
  );
}
