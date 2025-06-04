import Link from "next/link"

export default function Footer() {
  return (
    <footer className="bg-gray-50 border-t border-gray-200 mt-auto">
      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-gray-600">
          <p>© 2025 Todo Demo by Akshat. Built with Next.js</p>
          <div className="flex gap-4">
            <Link href="/" className="hover:text-blue-600 transition-colors">
              Home
            </Link>
            <Link href="/users" className="hover:text-blue-600 transition-colors">
              Users
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
