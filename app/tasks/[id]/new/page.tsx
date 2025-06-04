import { Suspense } from "react"
import { notFound } from "next/navigation"
import NewTaskForm from "./new-task-form"
import { getCategories } from "@/app/actions/updateTask"

// Mock function to validate user exists - replace with your actual user validation
async function validateUser(userId: string) {
  // Add your user validation logic here
  // For now, just check if it's a valid number
  if (!/^\d+$/.test(userId)) {
    return false
  }
  return true
}


interface PageProps {
  params: Promise<{
    id: string
  }>
}

export default async function NewTaskPage({ params }: PageProps) {
  const userId = (await params).id

  // Validate user exists
  const userExists = await validateUser(userId)
  if (!userExists) {
    notFound()
  }

  // Fetch categories
  const categories = await getCategories()

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <NewTaskForm userId={userId} categories={categories} />
    </Suspense>
  )
}
