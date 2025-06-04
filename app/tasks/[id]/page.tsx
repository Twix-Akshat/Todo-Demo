import { PrismaClient } from "@/app/generated/prisma"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import Pagination from "@/app/components/Pagination"
import Link from "next/link"
import { Calendar, Edit, Plus } from "lucide-react"
import DeleteButton from "./delete_task_button"
import { TaskCheckbox } from "./checkbox"

// Define a type for task priority
type TaskPriority = "Low" | "Medium" | "High" | null

export default async function Page({
  params,
  searchParams,
}: {
  params: { id: string }
  searchParams?: { page?: string }
}) {
  const { id } = params
  const page = Number.parseInt(searchParams?.page || "1")
  const pageSize = 5
  const prisma = new PrismaClient()

  const [tasks, totalTasks, username] = await Promise.all([
    prisma.tasks.findMany({
      where: { user_id: Number(id) },
      skip: (page - 1) * pageSize,
      take: pageSize,
    }),
    prisma.tasks.count({
      where: { user_id: Number(id) },
    }),
    prisma.users.findUnique({ where: { id: Number(id) } }),
  ])

  const totalPages = Math.ceil(totalTasks / pageSize)

  // Add proper type for priority parameter
  const getPriorityColor = (priority: TaskPriority) => {
    if (!priority) return "border-l-gray-500 bg-gray-50"

    switch (priority.toLowerCase()) {
      case "low":
        return "border-l-green-500 bg-green-50"
      case "medium":
        return "border-l-yellow-500 bg-yellow-50"
      case "high":
        return "border-l-red-500 bg-red-50"
      default:
        return "border-l-gray-500 bg-gray-50"
    }
  }

  // Add proper type for priority parameter
  const getPriorityBadge = (priority: TaskPriority) => {
    if (!priority) return "bg-gray-100 text-gray-800 hover:bg-gray-100"

    switch (priority.toLowerCase()) {
      case "low":
        return "bg-green-100 text-green-800 hover:bg-green-100"
      case "medium":
        return "bg-yellow-100 text-yellow-800 hover:bg-yellow-100"
      case "high":
        return "bg-red-100 text-red-800 hover:bg-red-100"
      default:
        return "bg-gray-100 text-gray-800 hover:bg-gray-100"
    }
  }

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Tasks for {username?.name}</h1>
          <p className="text-gray-600 mt-1">
            {totalTasks} {totalTasks === 1 ? "task" : "tasks"} total
          </p>
        </div>
        <Button asChild>
          <Link href={`/tasks/${id}/new`}>
            <Plus className="w-4 h-4 mr-2" />
            New Task
          </Link>
        </Button>
      </div>

      {/* Tasks Grid */}
      <div className="grid gap-4">
        {tasks.length === 0 ? (
          <Card className="p-8 text-center">
            <p className="text-gray-500">No tasks found. Create your first task!</p>
          </Card>
        ) : (
          tasks.map((task) => (
            <Card
              key={task.id}
              className={`border-l-4 transition-all hover:shadow-md ${getPriorityColor(task.priority as TaskPriority)} ${
                task.status === "Done" ? "opacity-75" : ""
              }`}
            >
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3
                        className={`font-semibold text-lg ${
                          task.status === "Done" ? "line-through text-gray-500" : "text-gray-900"
                        }`}
                      >
                        {task.title}
                      </h3>
                      {task.priority && (
                        <Badge variant="secondary" className={getPriorityBadge(task.priority as TaskPriority)}>
                          {task.priority}
                        </Badge>
                      )}
                    </div>
                    {task.description && (
                      <p className={`text-sm ${task.status === "Done" ? "text-gray-400" : "text-gray-600"}`}>
                        {task.description}
                      </p>
                    )}
                  </div>

                  {/* Completion Checkbox */}
                  <div className="ml-4">
                    {task.status !== "Done" ? <TaskCheckbox taskId={task.id} /> : <Checkbox checked disabled />}
                  </div>
                </div>
              </CardHeader>

              <CardContent className="pt-0">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4 text-sm text-gray-500">
                    {task.due_date && (
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        <span>{new Date(task.due_date).toLocaleDateString()}</span>
                      </div>
                    )}
                    <Badge variant="outline" className="text-xs">
                      {task.status}
                    </Badge>
                  </div>

                  <div className="flex items-center gap-2">
                    <Button variant="ghost" size="sm" asChild>
                      <Link href={`/tasks/edit/${task.id}`}>
                        <Edit className="w-4 h-4" />
                      </Link>
                    </Button>
                    <DeleteButton id={task.id} user_id={task.user_id} />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center pt-4">
          <Pagination currentPage={page} totalPages={totalPages} />
        </div>
      )}
    </div>
  )
}
