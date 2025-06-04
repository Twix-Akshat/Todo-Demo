import { PrismaClient, tasks_priority } from "@/app/generated/prisma";
import { taskSchema } from "@/app/validation/taskSchema";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { ArrowLeft, AlertCircle } from "lucide-react";
import { headers } from "next/headers";

export default async function Page(props:{params:Promise<{id:string}>}) {
    const {id} = await props.params;
    const user_id = id; // Using the id from params as user_id

    async function createNewTask(formData: FormData) {
        "use server"
        const title = formData.get("title");
        const description = formData.get("description");
        const category_id = formData.get("category_id");
        const due_date = formData.get("due_date");
        const priority = formData.get("priority");
        const user_id = formData.get("user_id");
      
        const result = taskSchema.safeParse({
          title,
          description,
          category_id,
          due_date,
          priority,
          user_id,
        });
      
        if (!result.success) {
          const errors = result.error.format();
          // Redirect back with error state
          redirect(`/tasks/${id}/new?error=${encodeURIComponent(JSON.stringify(errors))}`);
        }
      
        const data = result.data;
        const prisma = new PrismaClient();
        await prisma.tasks.create({
          data: {
            title: data.title,
            description: data.description || "",
            user_id: parseInt(data.user_id),
            status: "To_Do",
            priority: data.priority as tasks_priority,
            due_date: new Date(data.due_date).toISOString(),
            category_id: parseInt(data.category_id),
          },
        });
      
        redirect("/tasks/" + data.user_id);
    }

    // Get search params for error handling
    const headersList = await headers();
    const referer = headersList.get('referer') || '';
    const url = new URL(referer);
    const errorParam = url.searchParams.get('error');
    const errors = errorParam ? JSON.parse(decodeURIComponent(errorParam)) : {};

    async function getCategories() {
        "use server";
        const prisma = new PrismaClient();
        const categories = await prisma.categories.findMany();
        return categories;
    }

    const categories = await getCategories();

  return (
    
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <Link
            href={`/tasks/${id}`}
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
            <form action={createNewTask} className="space-y-6">
              {/* Hidden Fields */}
              <input type="hidden" name="user_id" value={user_id} />

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
                <Button type="submit" className="w-full md:w-auto">
                  Create Task
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
