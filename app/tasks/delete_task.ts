// app/actions/deleteUser.ts
"use server";

import { revalidatePath } from "next/cache";
import { PrismaClient } from "../generated/prisma";

const prisma = new PrismaClient();

export async function deleteTask(formData: FormData) {
    const id = Number(formData.get("id"));
    await prisma.tasks.delete({
        where: { id },
    });
    revalidatePath("/tasks/"+formData.get("user_id"));
}
