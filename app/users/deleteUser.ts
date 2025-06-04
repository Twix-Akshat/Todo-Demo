// app/actions/deleteUser.ts
"use server";

import { revalidatePath } from "next/cache";
import { PrismaClient } from "../generated/prisma";

const prisma = new PrismaClient();

export async function deleteUser(formData: FormData) {
    const id = Number(formData.get("id"));

    await prisma.users.delete({
        where: { id },
    });

    revalidatePath("/users");
}
