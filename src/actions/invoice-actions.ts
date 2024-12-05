"use server";

import prisma from "@/lib/db";
import cuid from "cuid";
import { revalidatePath } from "next/cache";

export async function getInvoiceById(id: string) {
  try {
    const invoice = await prisma.invoice.findUnique({
      where: { id },
      include: {
        Customer: {
          select: {
            citizenId: true,
          },
        },
        UsageHistory: {
          select: {
            id: true,
            customerId: true,
            computerId: true,
            startTime: true,
            endTime: true,
            totalHours: true,
            totalCost: true,
          },
        },
      },
    });

    if (!invoice) return null;

    return {
      customer: { citizenId: invoice.Customer?.citizenId || "" },
      invoiceDate: invoice.invoiceDate,
      totalAmount: invoice.totalAmount,
      status: invoice.status,
      usageHistories: invoice.UsageHistory.map((history) => ({
        id: history.id,
        customerId: history.customerId,
        computerId: history.computerId,
        startTime: history.startTime,
        endTime: history.endTime,
        totalHours: history.totalHours,
        totalCost: history.totalCost,
      })),
    };
  } catch (error) {
    console.error("Error fetching invoice:", error);
    throw new Error("Unable to fetch invoice data");
  }
}

export async function getCustomerByAccountName(
  username: string
): Promise<string | null> {
  try {
    const customer = await prisma.customer.findFirst({
      where: {
        Account: {
          username: username,
        },
      },
      select: {
        id: true, // Chỉ lấy trường id
      },
    });

    if (!customer) {
      // Nếu không tìm thấy customer, trả về null
      return null;
    }

    return customer.id; // Trả về customerId
  } catch (error) {
    console.error("Error fetching customer by account name:", error);
    throw new Error("Không thể lấy thông tin customerId");
  }
}


export async function getUsageHistoriesByCustomerId(customerId: string) {
  const usageHistories = await prisma.usageHistory.findMany({
    where: { customerId },
    select: {
      id: true,
      customerId: true,
      computerId: true,
      totalCost: true,
      invoiceId: true,
      startTime: true,
      endTime: true,
    },
  });
  return usageHistories;
}

export async function getUsageHistoriesByIds(ids: string[]) {
  return prisma.usageHistory.findMany({
    where: { id: { in: ids } },
    select: { id: true, totalCost: true }, // Lấy các trường cần thiết
  });
}


export async function getAllServices() {
  try {
    const services = await prisma.service.findMany({
      select: {
        id: true,
        name: true,
        price: true,
      },
    });
    return services;
  } catch (error) {
    console.error("Error fetching services:", error);
    throw new Error("Không thể lấy danh sách dịch vụ");
  }
}

export async function getCustomerByCitizenId(citizenId: string) {
  return await prisma.customer.findUnique({
    where: { citizenId },
  });
}

export async function createNewInvoice(
  customerId: string,
  totalAmount: number
) {
  return await prisma.invoice.create({
    data: {
      id: cuid(),
      customerId,
      totalAmount,
      status: "Unpaid",
      updatedAt: new Date(),
    },
  });
}

export async function getServicesByNames(serviceNames: string[]) {
  return await prisma.service.findMany({
    where: { name: { in: serviceNames } },
    select: { id: true, name: true },
  });
}

export async function linkUsageHistoryToInvoice(
  selectedUsageIds: string[],
  invoiceId: string
) {
  return await prisma.usageHistory.updateMany({
    where: { id: { in: selectedUsageIds } },
    data: { invoiceId },
  });
}

export async function createInvoiceServices(
  invoiceId: string,
  servicesToAdd: Array<{
    id: string;
    serviceId: string;
    quantity: number;
    totalPrice: number;
  }>
) {
  if (!servicesToAdd || servicesToAdd.length === 0) {
    throw new Error("Services to add cannot be empty.");
  }

  try {
    const createdServices = await prisma.invoiceService.createMany({
      data: servicesToAdd.map((service) => ({
        ...service,
        invoiceId, // Đảm bảo mỗi dịch vụ được liên kết với hóa đơn,
        updatedAt: new Date(),
      })),
    });

    return createdServices;
  } catch (error) {
    console.error("Error creating invoice services:", error);
    throw new Error("Unable to create invoice services.");
  }
}


export async function editInvoice(formData: FormData, id: string) {
  const customerCitizenId = formData.get("customerCitizenId") as string;
  const usageHistoriesRaw = formData.get("usageHistories") as string;
  const totalAmount = Number(formData.get("totalAmount"));
  const status = formData.get("status") as string;

  if (!customerCitizenId || !usageHistoriesRaw) {
    throw new Error(
      "Missing customerCitizenId or usageHistories in form data."
    );
  }

  const selectedUsageHistories = JSON.parse(
    usageHistoriesRaw as string
  ) as string[];

  try {
    // Tìm ID của khách hàng dựa trên citizenId
    const customer = await prisma.customer.findUnique({
      where: { citizenId: customerCitizenId as string },
      select: { id: true },
    });

    if (!customer) {
      throw new Error(`Customer with citizenId ${customerCitizenId} not found`);
    }

    // Cập nhật hóa đơn
    await prisma.invoice.update({
      where: { id },
      data: {
        customerId: customer.id,
        totalAmount,
        status,
        updatedAt: new Date(),
      },
    });

    // Xóa liên kết UsageHistories cũ
    await prisma.usageHistory.updateMany({
      where: { invoiceId: id },
      data: { invoiceId: null },
    });

    // Liên kết UsageHistories mới nếu có
    if (selectedUsageHistories.length > 0) {
      for (const usageHistoryId of selectedUsageHistories) {
        const usageHistory = await prisma.usageHistory.findUnique({
          where: { id: usageHistoryId },
        });

        if (!usageHistory) {
          throw new Error(`UsageHistory with id ${usageHistoryId} not found`);
        }

        await prisma.usageHistory.update({
          where: { id: usageHistoryId },
          data: { invoiceId: id },
        });
      }
    }

    // Làm mới giao diện
    revalidatePath("/invoices");
  } catch (error) {
    console.error("Error updating invoice:", error);
    throw new Error("Unable to update invoice");
  }
}

export async function deleteInvoice(id: string) {
  try {
    await prisma.invoice.delete({
      where: { id },
    });
    revalidatePath("/invoices");
    console.log(
      `Invoice with ID ${id} deleted successfully with cascading delete`
    );
  } catch (error) {
    console.error("Error deleting invoice:", error);
    throw new Error("Unable to delete invoice. Please try again.");
  }
}


