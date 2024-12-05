"use server";

import prisma from "@/lib/db";
import cuid from "cuid";
import { revalidatePath } from "next/cache";

export async function getServiceById(id: string) {
  try {
    const service = await prisma.service.findUnique({
      where: { id },
    });
    if (!service) return null;
    return {
      name: service.name,
      price: service.price,
    };
  } catch (error) {
    console.error("Error fetching service:", error);
    throw new Error("Unable to fetch service data");
  }
}

export async function createService(formData: FormData) {
  await prisma.service.create({
    data: {
      id: cuid(),
      name: formData.get("name") as string,
      price: Number(formData.get("price")),
      updatedAt: new Date(),
    },
  });
  revalidatePath("/services");
}

export async function editService(formData: FormData, id: string) {
  await prisma.service.update({
    where: { id },
    data: {
      name: formData.get("name") as string,
      price: Number(formData.get("price")),
      updatedAt: new Date(),
    },
  });
  revalidatePath("/services");
}

export async function deleteService(id: string) {
  await prisma.service.delete({ where: { id } });
  revalidatePath("/services");
}
