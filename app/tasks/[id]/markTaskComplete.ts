"use server";

import { PrismaClient } from "@/app/generated/prisma";
import { revalidatePath } from "next/cache";

const prisma = new PrismaClient();

export async function markTaskComplete(taskId: number) {
  await prisma.tasks.update({
    where: { id: taskId },
    data: { status: "Done" },
  });

  revalidatePath("/users"); // or your page path
}
