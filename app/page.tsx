import Link from "next/link"
import { PrismaClient } from "./generated/prisma"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Users, CheckSquare, Clock, TrendingUp, Plus, ArrowRight, Zap } from "lucide-react"

export default async function Home() {
  const prisma = new PrismaClient()

  const [totalUsers, totalTasks, completedTasks, pendingTasks, recentTasks, recentUsers] = await Promise.all([
    prisma.users.count(),
    prisma.tasks.count(),
    prisma.tasks.count({ where: { status: "Done" } }),
    prisma.tasks.count({ where: { status: { not: "Done" } } }),
    prisma.tasks.findMany({
      take: 5,
      orderBy: { id: "desc" },
      include: { users: { select: { name: true } } },
    }),
    prisma.users.findMany({
      take: 3,
      orderBy: { id: "desc" },
    }),
  ])

  const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="max-w-7xl mx-auto p-6 space-y-8">
        {/* Hero Section */}
        <div className="text-center py-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Welcome to{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">Akshat Patel Todo Demo</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Your personal productivity hub. Manage tasks, track progress, and stay organized with ease.
          </p>

          {/* Quick Actions */}
          <div className="flex flex-wrap justify-center gap-4">
            <Button asChild size="lg" className="h-12">
              <Link href="/users/add">
                <Plus className="w-4 h-4 mr-2" />
                Add New User
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="h-12">
              <Link href="/users">
                <Users className="w-4 h-4 mr-2" />
                View Users
              </Link>
            </Button>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="border-l-4 border-l-blue-500 bg-gradient-to-r from-blue-50 to-blue-100">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-blue-700">Total Users</CardTitle>
              <Users className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-900">{totalUsers}</div>
              <p className="text-xs text-blue-600 mt-1">Active team members</p>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-green-500 bg-gradient-to-r from-green-50 to-green-100">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-green-700">Completed Tasks</CardTitle>
              <CheckSquare className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-900">{completedTasks}</div>
              <p className="text-xs text-green-600 mt-1">Tasks finished</p>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-yellow-500 bg-gradient-to-r from-yellow-50 to-yellow-100">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-yellow-700">Pending Tasks</CardTitle>
              <Clock className="h-4 w-4 text-yellow-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-900">{pendingTasks}</div>
              <p className="text-xs text-yellow-600 mt-1">Tasks remaining</p>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-purple-500 bg-gradient-to-r from-purple-50 to-purple-100">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-purple-700">Completion Rate</CardTitle>
              <TrendingUp className="h-4 w-4 text-purple-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-900">{completionRate}%</div>
              <p className="text-xs text-purple-600 mt-1">Overall progress</p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Recent Tasks */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Zap className="w-5 h-5 text-blue-500" />
                    Recent Tasks
                  </CardTitle>
                  <CardDescription>Latest task activity across your team</CardDescription>
                </div>
                <Button variant="ghost" size="sm" asChild>
                  <Link href="/users">
                    View All <ArrowRight className="w-4 h-4 ml-1" />
                  </Link>
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {recentTasks.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <CheckSquare className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                  <p>No tasks yet. Create your first task to get started!</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {recentTasks.map((task) => (
                    <div
                      key={task.id}
                      className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                    >
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900">{task.title}</h4>
                        <p className="text-sm text-gray-600">Assigned to: {task.users?.name || "Unknown"}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge
                          variant="secondary"
                          className={
                            task.priority === "High"
                              ? "bg-red-100 text-red-800"
                              : task.priority === "Medium"
                                ? "bg-yellow-100 text-yellow-800"
                                : "bg-green-100 text-green-800"
                          }
                        >
                          {task.priority}
                        </Badge>
                        <Badge variant="outline">{task.status}</Badge>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Team Overview */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="w-5 h-5 text-green-500" />
                Active Users
              </CardTitle>
              <CardDescription>Your active users</CardDescription>
            </CardHeader>
            <CardContent>
              {recentUsers.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <Users className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                  <p>No team members yet.</p>
                  <Button asChild size="sm" className="mt-4">
                    <Link href="/users/add">Add First Member</Link>
                  </Button>
                </div>
              ) : (
                <div className="space-y-3">
                  {recentUsers.map((user) => (
                    <div key={user.id} className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50">
                      <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white text-sm font-semibold">
                        {user.name?.charAt(0).toUpperCase()}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-gray-900 truncate">{user.name}</p>
                        <p className="text-sm text-gray-500 truncate">{user.email}</p>
                      </div>
                    </div>
                  ))}
                  <Button asChild variant="outline" size="sm" className="w-full mt-4">
                    <Link href="/users">
                      View All Members <ArrowRight className="w-4 h-4 ml-1" />
                    </Link>
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

      </div>
    </div>
  )
}
