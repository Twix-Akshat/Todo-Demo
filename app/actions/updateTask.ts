// app/tasks/edit/[id]/actions.ts
"use server"

import { PrismaClient, type tasks_priority } from "@/app/generated/prisma"
import { taskSchema } from "@/app/validation/taskSchema"
import { redirect } from "next/navigation"

const prisma = new PrismaClient()

export async function updateTask(formData: FormData) {
  const rawData = {
    title: formData.get("title"),
    description: formData.get("description"),
    category_id: formData.get("category_id"),
    due_date: formData.get("due_date"),
    priority: formData.get("priority"),
    user_id: formData.get("user_id"),
  }

  const result = taskSchema.safeParse(rawData)

  if (!result.success) {
    const errorMessages = Object.fromEntries(
      Object.entries(result.error.format()).map(([key, value]) => [
        key,
        Array.isArray(value) ? value[0] : value._errors?.[0] || "Invalid value",
      ]),
    )

    const searchParams = new URLSearchParams()
    searchParams.set("errors", JSON.stringify(errorMessages))
    redirect(`/tasks/${formData.get("id")}/edit?${searchParams.toString()}`)
  }

  const { title, description, category_id, due_date, priority, user_id } = result.data

  try {
    await prisma.tasks.update({
      where: { id: Number(formData.get("id")) },
      data: {
        title,
        description: description || "",
        user_id: Number(user_id),
        status: "To_Do",
        priority: priority as tasks_priority,
        due_date: new Date(due_date),
        category_id: Number(category_id),
      },
    })

    redirect(`/tasks/${user_id}`)
  } catch (error) {
    console.error(error)
    const searchParams = new URLSearchParams()
    searchParams.set("errors", JSON.stringify({ general: "Failed to update task. Please try again." }))
    // redirect(`/tasks/${formData.get("id")}/edit?${searchParams.toString()}`)
    redirect('/tasks/'+user_id)
  }
}

export async function getCategories() {
  return await prisma.categories.findMany()
}