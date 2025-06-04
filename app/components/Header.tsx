import Link from "next/link"
import { Target, Home, Users } from "lucide-react"

export default function Header() {
  return (
    <div className="bg-white border-b border-gray-200 sticky top-0 z-10 shadow-sm">
      <div className="container mx-auto px-4 md:px-6 lg:px-8">
        <header className="flex h-16 md:h-20 w-full shrink-0 items-center">
          <Link href="/" className="flex items-center gap-2 mr-6" prefetch={false}>
            <div className="flex items-center justify-center w-8 h-8 rounded-md bg-gradient-to-r from-blue-500 to-purple-600">
              <Target className="h-4 w-4 text-white" />
            </div>
            <h1 className="font-bold text-lg md:text-xl text-gray-900">
              <span className="hidden sm:inline">Todo Demo</span>
              <span className="sm:hidden">TF</span>
              <span className="text-xs font-normal text-gray-500 ml-1 hidden md:inline">by Akshat</span>
            </h1>
          </Link>

          <div className="ml-auto flex gap-2">
            <Link
              href="/"
              className="group inline-flex h-9 w-max items-center justify-center rounded-md px-4 py-2 text-sm font-medium transition-colors hover:bg-blue-50 hover:text-blue-700 focus:bg-blue-50 focus:text-blue-700 focus:outline-none disabled:pointer-events-none disabled:opacity-50"
              prefetch={false}
            >
              <Home className="h-4 w-4 mr-2" />
              <span>Home</span>
            </Link>
            <Link
              href="/users"
              className="group inline-flex h-9 w-max items-center justify-center rounded-md px-4 py-2 text-sm font-medium transition-colors hover:bg-blue-50 hover:text-blue-700 focus:bg-blue-50 focus:text-blue-700 focus:outline-none disabled:pointer-events-none disabled:opacity-50"
              prefetch={false}
            >
              <Users className="h-4 w-4 mr-2" />
              <span>Users</span>
            </Link>
          </div>
        </header>
      </div>
    </div>
  )
}
