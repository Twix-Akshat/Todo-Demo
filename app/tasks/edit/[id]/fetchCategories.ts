import { PrismaClient } from "@/app/generated/prisma"

export default async function getCategories() {
    "use server"
    const prisma = new PrismaClient()
    const categories = await prisma.categories.findMany()
    return categories
  }