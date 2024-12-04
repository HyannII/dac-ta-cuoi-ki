"use server";

import prisma from "@/lib/db";
import cuid from "cuid";
import { revalidatePath } from "next/cache";

export async function getComputerById(id: string) {
  try {
    const computer = await prisma.computer.findUnique({
      where: { id },
    });
    if (!computer) return null;
    return {
      name: computer.name,
      status: computer.status,
      location: computer.location || "",
      specs: computer.specs || "",
    };
  } catch (error) {
    console.error("Error fetching computer:", error);
    throw new Error("Unable to fetch computer data");
  }
}

export async function createComputer(formData: FormData) {
  await prisma.computer.create({
    data: {
      id: cuid(),
      name: formData.get("name") as string,
      status: formData.get("status") as string,
      location: formData.get("location") as string,
      specs: formData.get("specs") as string,
      updatedAt: new Date(),
    },
  });
  revalidatePath("/computers");
}

export async function editComputer(formData: FormData, id: string) {
  await prisma.computer.update({
    where: { id },
    data: {
      name: formData.get("name") as string,
      status: formData.get("status") as string,
      location: formData.get("location") as string,
      specs: formData.get("specs") as string,
      updatedAt: new Date(),
    },
  });
  revalidatePath("/computers");
}

export async function deleteComputer(id: string) {
  await prisma.computer.delete({ where: { id } });
  revalidatePath("/computers");
}
