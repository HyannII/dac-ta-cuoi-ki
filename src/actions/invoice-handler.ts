import cuid from "cuid";
import {
  getCustomerByCitizenId,
  createNewInvoice,
  getServicesByNames,
  createInvoiceServices,
  linkUsageHistoryToInvoice,
  getCustomerByAccountName,
  getUsageHistoriesByIds,
} from "./invoice-actions";

export async function createInvoice(
  formData: FormData
): Promise<{ error?: string; invoice?: any }> {
  const accountName = formData.get("accountName") as string;

  // Lấy tất cả các `selectedUsageIds` từ `formData`
  const selectedUsageIds: string[] = [];
  formData.forEach((value, key) => {
    if (key === "selectedUsageIds[]") {
      selectedUsageIds.push(value as string);
    }
  });

  // Lấy danh sách dịch vụ từ `formData`
  const services: { name: string; price: number; quantity: number }[] = [];

  formData.forEach((value, key) => {
    const match = key.match(/^services\[(\d+)\]\[(.+)\]$/);
    if (match) {
      const index = parseInt(match[1], 10);
      const field = match[2];

      if (field === "name" || field === "price" || field === "quantity") {
        services[index] = services[index] || {};
        services[index][field] =
          field === "price" || field === "quantity"
            ? parseFloat(value as string)
            : (value as string);
      }
    }
  });

  if (!accountName) {
    return { error: "Account Name is required" };
  }

  if (selectedUsageIds.length === 0) {
    return { error: "Selected Usage IDs are invalid" };
  }

  if (services.length === 0) {
    return { error: "Services are invalid" };
  }

  try {
    const customer = await getCustomerByAccountName(accountName);
    if (!customer) throw new Error("Không tìm thấy khách hàng");

    // Lấy thông tin UsageHistory từ selectedUsageIds
    const usageHistories = await getUsageHistoriesByIds(selectedUsageIds);

    if (!usageHistories || usageHistories.length === 0) {
      return { error: "Usage Histories are invalid or not found" };
    }

    // Tính tổng tiền từ UsageHistory
    const totalUsageCost = usageHistories.reduce(
      (sum, history) => sum + (history.totalCost || 0),
      0
    );

    // Tính tổng tiền từ dịch vụ
    const totalServiceCost = services.reduce(
      (sum, service) => sum + service.price * service.quantity,
      0
    );

    // Tính tổng tiền hóa đơn
    const totalAmount = totalUsageCost + totalServiceCost;

    const invoice = await createNewInvoice(customer, totalAmount);

    const existingServices = await getServicesByNames(
      services.map((service) => service.name)
    );

    const servicesToAdd = services
      .map((service) => {
        const existingService = existingServices.find(
          (s) => s.name === service.name
        );
        if (existingService) {
          return {
            id: cuid(),
            invoiceId: invoice.id,
            serviceId: existingService.id,
            quantity: service.quantity,
            totalPrice: service.price * service.quantity,
          };
        }
        return null;
      })
      .filter(Boolean);

    if (servicesToAdd.length > 0) {
      await createInvoiceServices(invoice.id, servicesToAdd as any[]);
    }

    if (selectedUsageIds.length > 0) {
      await linkUsageHistoryToInvoice(selectedUsageIds, invoice.id);
    }
    return { invoice };
  } catch (error) {
    console.error("Error creating invoice:", error);
    return { error: "Unable to create invoice" };
  }
}
