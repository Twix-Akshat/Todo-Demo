import { PrismaClient } from "@/app/generated/prisma";
import { userSchema } from "@/app/validation/userSchema";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, User, Mail, Lock, UserCog } from 'lucide-react';

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params;
  const prisma = new PrismaClient();
  const user = await prisma.users.findUnique({where:{id:parseInt(id)}});

  if (!user) {
    redirect("/users");
  }

  async function updateUser(formData: FormData) {
    "use server";
    const rawData = {
      name: formData.get("name"),
      email: formData.get("email"),
      password: formData.get("password"),
    };
  
    const result = userSchema.safeParse(rawData);
  
    if (!result.success) {
      console.error(result.error.format());
      throw new Error("Validation failed");
    }
    const { name, email, password } = result.data;

    const prisma = new PrismaClient();
    await prisma.users.update({
      data: { name, email, password },
      where: {
        id: parseInt(id)
      }
    });
    redirect("/users");
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-md mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-100 rounded-lg mb-4">
            <UserCog className="w-6 h-6 text-blue-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Edit User</h1>
          <p className="text-gray-600 mt-2">Update user account information</p>
        </div>

        {/* Form Card */}
        <Card className="shadow-lg border-0">
          <CardHeader className="space-y-1 pb-6">
            <CardTitle className="text-xl text-center">User Information</CardTitle>
            <CardDescription className="text-center">
              Update the details for this user account
            </CardDescription>
          </CardHeader>

          <CardContent>
            <form action={updateUser} className="space-y-6">
              <input type="hidden" name="id" value={user.id}/>
              
              {/* Name Field */}
              <div className="space-y-2">
                <Label htmlFor="name" className="text-sm font-medium text-gray-700">
                  Full Name
                </Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    id="name"
                    name="name"
                    type="text"
                    placeholder="Enter full name"
                    className="pl-10 h-11"
                    defaultValue={user.name}
                    required
                  />
                </div>
              </div>

              {/* Email Field */}
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium text-gray-700">
                  Email Address
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="Enter email address"
                    className="pl-10 h-11"
                    defaultValue={user.email}
                    required
                  />
                </div>
              </div>

              {/* Password Field */}
              <div className="space-y-2">
                <Label htmlFor="password" className="text-sm font-medium text-gray-700">
                  Password
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    id="password"
                    name="password"
                    type="password"
                    placeholder="Enter password"
                    className="pl-10 h-11"
                    defaultValue={user.password}
                    required
                  />
                </div>
              </div>

              {/* Submit Button */}
              <Button type="submit" className="w-full h-11 text-base font-medium">
                <UserCog className="w-4 h-4 mr-2" />
                Update User Account
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Back Link */}
        <div className="text-center mt-6">
          <Button variant="ghost" asChild>
            <Link href="/users">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to All Users
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}