import { PrismaClient } from "../generated/prisma"
import Link from "next/link"
import DeleteButton from "./delete_button"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { Edit, Eye, Mail, Plus, User, UsersIcon } from "lucide-react"

export default async function Users() {
  const prisma = new PrismaClient()
  const users = await prisma.users.findMany()

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2)
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-100 rounded-lg">
            <UsersIcon className="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Current Users</h1>
            <p className="text-gray-500">{users.length} members</p>
          </div>
        </div>
        <Button asChild size="lg">
          <Link href="/users/add">
            <Plus className="w-4 h-4 mr-2" />
            Add Member
          </Link>
        </Button>
      </div>

      {/* Users List */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        {users.length === 0 ? (
          <div className="p-12 text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <User className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No team members yet</h3>
            <p className="text-gray-500 mb-6">Get started by adding your first team member</p>
            <Button asChild>
              <Link href="/users/add">
                <Plus className="w-4 h-4 mr-2" />
                Add First Member
              </Link>
            </Button>
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {users.map((user) => (
              <div key={user.id} className="p-6 hover:bg-gray-50 transition-colors group">
                <div className="flex items-center justify-between">
                  {/* User Info */}
                  <div className="flex items-center gap-4 flex-1">
                    <Avatar className="h-12 w-12 ring-2 ring-white shadow-sm">
                      <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white font-semibold">
                        {getInitials(user.name || "U")}
                      </AvatarFallback>
                    </Avatar>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="text-lg font-semibold text-gray-900 truncate">{user.name}</h3>
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          Active
                        </span>
                      </div>
                      <div className="flex items-center gap-1 text-gray-600">
                        <Mail className="w-4 h-4" />
                        <span className="truncate">{user.email}</span>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button variant="ghost" size="sm" asChild>
                      <Link href={`/tasks/${user.id}`}>
                        <Eye className="w-4 h-4 mr-1" />
                        View Tasks
                      </Link>
                    </Button>

                    <Button variant="ghost" size="sm" asChild>
                      <Link href={`/users/edit/${user.id}`}>
                        <Edit className="w-4 h-4" />
                      </Link>
                    </Button>

                    <DeleteButton id={user.id} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Footer Stats */}
      {users.length > 0 && (
        <div className="mt-6 flex items-center justify-center">
          <div className="flex items-center gap-6 text-sm text-gray-500 bg-gray-50 px-6 py-3 rounded-lg">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span>{users.length} Active Members</span>
            </div>
            <Separator orientation="vertical" className="h-4" />
            <span>Team Directory</span>
          </div>
        </div>
      )}
    </div>
  )
}
