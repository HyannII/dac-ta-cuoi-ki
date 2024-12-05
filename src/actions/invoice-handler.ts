import cuid from "cuid";
import {
  getCustomerByCitizenId,
  createNewInvoice,
  getServicesByNames,
  createInvoiceServices,
  linkUsageHistoryToInvoice,
  getCustomerByAccountName,
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
  const services: { name: string; price: number }[] = [];

  formData.forEach((value, key) => {
    const match = key.match(/^services\[(\d+)\]\[(.+)\]$/);
    if (match) {
      const index = parseInt(match[1], 10);
      const field = match[2];

      if (field === "name" || field === "price") {
        services[index] = services[index] || {};
        services[index][field] =
          field === "price" ? parseFloat(value as string) : (value as string);
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

    const totalAmount = services.reduce(
      (sum, service) => sum + service.price,
      0
    );

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
            quantity: 1,
            totalPrice: service.price,
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
