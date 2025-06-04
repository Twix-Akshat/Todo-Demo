"use server"

import { taskSchema } from "@/app/validation/taskSchema"
import { PrismaClient } from "@/app/generated/prisma"
import { redirect } from "next/navigation"
import { z } from "zod"

export async function createTask(formData: FormData) {
  const prisma = new PrismaClient()
  
  try {
    // Extract form data
    const rawData = {
      title: formData.get("title") as string,
      description: (formData.get("description") as string) || undefined,
      category_id: formData.get("category_id") as string,
      due_date: formData.get("due_date") as string,
      priority: formData.get("priority") as string,
      user_id: formData.get("user_id") as string,
    }

    // Validate with Zod schema
    const validatedData = taskSchema.parse(rawData)

    // Create the task in the database using Prisma
    await prisma.tasks.create({
      data: {
        title: validatedData.title,
        description: validatedData.description || null,
        category_id: Number.parseInt(validatedData.category_id),
        due_date: new Date(validatedData.due_date),
        priority: validatedData.priority,
        user_id: Number.parseInt(validatedData.user_id),
        created_at: new Date(),
        updated_at: new Date(),
      },
    })

  } catch (error) {
    if (error instanceof z.ZodError) {
      // Handle validation errors
      const fieldErrors: Record<string, string> = {}
      error.errors.forEach((err) => {
        if (err.path.length > 0) {
          fieldErrors[err.path[0] as string] = err.message
        }
      })

      return {
        success: false,
        errors: fieldErrors,
      }
    }

    // Handle database or other errors
    console.error("Error creating task:", error)
    return {
      success: false,
      errors: { general: "Failed to create task. Please try again." },
    }
  } finally {
    // Always close Prisma connection
    await prisma.$disconnect()
  }

  // Redirect after successful creation (outside try-catch)
  const userId = formData.get("user_id") as string
  redirect(`/tasks/${userId}`)
}