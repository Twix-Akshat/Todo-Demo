"use client"

import { useState } from "react"
import Link from "next/link"
import { ArrowLeft, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { createTask } from "./createTask"

interface Category {
  id: number
  name: string
}

interface NewTaskFormProps {
  userId: string
  categories: Category[]
}

export default function NewTaskForm({ userId, categories }: NewTaskFormProps) {
  const [errors, setErrors] = useState<Record<string, string> | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  async function handleSubmit(formData: FormData) {
    setIsSubmitting(true)
    setErrors(null)

    try {
      const result = await createTask(formData)

      if (result.success) {
        // Redirect to tasks page on success
        window.location.href = `/tasks/${userId}`
      } else {
        setErrors(result.errors || { general: "Failed to create task" })
      }
    } catch (error) {
        console.log(error);
        
      setErrors({ general: "An unexpected error occurred" })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <Link
            href={`/tasks/${userId}`}
            className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900 mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-1" />
            Back to Tasks
          </Link>
          <h1 className="text-2xl font-semibold text-gray-900">Create Task</h1>
          <p className="text-gray-600 mt-1">Fill in the details for your new task</p>
        </div>

        {/* Error Alert */}
        {errors?.general && (
          <Alert className="mb-6 border-red-200 bg-red-50">
            <AlertCircle className="h-4 w-4 text-red-600" />
            <AlertDescription className="text-red-800">{errors.general}</AlertDescription>
          </Alert>
        )}

        {/* Form Card */}
        <Card className="shadow-sm">
          <CardHeader className="pb-6">
            <CardTitle className="text-lg">Task Information</CardTitle>
            <CardDescription>Enter the details for your task</CardDescription>
          </CardHeader>
          <CardContent>
            <form action={handleSubmit} className="space-y-6">
              {/* Hidden Fields */}
              <input type="hidden" name="user_id" value={userId} />

              {/* Title */}
              <div className="space-y-2">
                <Label htmlFor="title" className="text-sm font-medium">
                  Title <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="title"
                  name="title"
                  placeholder="Enter task title"
                  className={errors?.title ? "border-red-300 focus:border-red-500" : ""}
                />
                {errors?.title && <p className="text-sm text-red-600">{errors.title}</p>}
              </div>

              {/* Description */}
              <div className="space-y-2">
                <Label htmlFor="description" className="text-sm font-medium">
                  Description
                </Label>
                <Textarea
                  id="description"
                  name="description"
                  placeholder="Enter task description (optional)"
                  rows={3}
                  className={errors?.description ? "border-red-300 focus:border-red-500" : ""}
                />
                {errors?.description && <p className="text-sm text-red-600">{errors.description}</p>}
              </div>

              {/* Priority and Due Date Row */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Priority */}
                <div className="space-y-2">
                  <Label htmlFor="priority" className="text-sm font-medium">
                    Priority <span className="text-red-500">*</span>
                  </Label>
                  <Select name="priority">
                    <SelectTrigger className={errors?.priority ? "border-red-300 focus:border-red-500" : ""}>
                      <SelectValue placeholder="Select priority" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Low">
                        <span className="flex items-center">
                          <span className="w-2 h-2 rounded-full bg-green-500 mr-2"></span>
                          Low
                        </span>
                      </SelectItem>
                      <SelectItem value="Medium">
                        <span className="flex items-center">
                          <span className="w-2 h-2 rounded-full bg-yellow-500 mr-2"></span>
                          Medium
                        </span>
                      </SelectItem>
                      <SelectItem value="High">
                        <span className="flex items-center">
                          <span className="w-2 h-2 rounded-full bg-red-500 mr-2"></span>
                          High
                        </span>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  {errors?.priority && <p className="text-sm text-red-600">{errors.priority}</p>}
                </div>

                {/* Due Date */}
                <div className="space-y-2">
                  <Label htmlFor="due_date" className="text-sm font-medium">
                    Due Date <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="due_date"
                    name="due_date"
                    type="date"
                    className={errors?.due_date ? "border-red-300 focus:border-red-500" : ""}
                  />
                  {errors?.due_date && <p className="text-sm text-red-600">{errors.due_date}</p>}
                </div>
              </div>

              {/* Category */}
              <div className="space-y-2">
                <Label htmlFor="category_id" className="text-sm font-medium">
                  Category <span className="text-red-500">*</span>
                </Label>
                <Select name="category_id">
                  <SelectTrigger className={errors?.category_id ? "border-red-300 focus:border-red-500" : ""}>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category.id} value={category.id.toString()}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors?.category_id && <p className="text-sm text-red-600">{errors.category_id}</p>}
              </div>

              {/* Submit Button */}
              <div className="pt-4">
                <Button type="submit" className="w-full md:w-auto" disabled={isSubmitting}>
                  {isSubmitting ? "Creating Task..." : "Create Task"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
