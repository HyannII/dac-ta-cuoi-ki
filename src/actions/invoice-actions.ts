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
      },
    });
    if (!invoice) return null;
    return {
      customer: { citizenId: invoice.Customer?.citizenId || "" },
      invoiceDate: invoice.invoiceDate,
      totalAmount: invoice.totalAmount,
      status: invoice.status,
    };
  } catch (error) {
    console.error("Error fetching invoice:", error);
    throw new Error("Unable to fetch invoice data");
  }
}

export async function createInvoice(formData: FormData) {
  await prisma.invoice.create({
    data: {
      id: cuid(),
      customerId: await prisma.customer
        .findUniqueOrThrow({
          where: { citizenId: formData.get("customerCitizenId") as string },
          select: { id: true },
        })
        .then(({ id }) => id),
      invoiceDate: new Date(),
      totalAmount: Number(formData.get("totalAmount")),
      status: formData.get("status") as string,
      updatedAt: new Date(),
    },
  });
  revalidatePath("/invoices");
}

export async function editInvoice(formData: FormData, id: string) {
  await prisma.invoice.update({
    where: { id },
    data: {
      customerId: await prisma.customer
        .findUniqueOrThrow({
          where: { citizenId: formData.get("customerCitizenId") as string },
          select: { id: true },
        })
        .then(({ id }) => id),
      invoiceDate: new Date(),
      totalAmount: Number(formData.get("totalAmount")),
      status: formData.get("status") as string,
      updatedAt: new Date(),
    },
  });
  revalidatePath("/invoices");
}

export async function deleteInvoice(id: string) {
  await prisma.invoice.delete({ where: { id } });
  revalidatePath("/invoices");
}
