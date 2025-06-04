import { PrismaClient } from "@/app/generated/prisma";
import { userSchema } from "@/app/validation/userSchema";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function Page(props:{params:Promise<{id:string}>}) {
    const {id} = await props.params;
    const prisma = new PrismaClient();
    const user = await prisma.users.findUnique({where:{id:parseInt(id)}});


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
            where:{
                id:parseInt(id)
            }
        });
        redirect("/users");
    }

  return (
    <div>
      <h1>Edit User</h1>
      <form action={updateUser}>
      <input type="hidden" name="id" value={user?.id}/>
        <table className="table-auto border-collapse border border-gray-300">
          <tbody>
            <tr>
              <td>Name</td>
              <td><input type="text" name="name"defaultValue={user?.name} /></td>
            </tr>
            <tr>
              <td>Email</td>
              <td><input type="email" name="email" defaultValue={user?.email} /></td>
            </tr>
            <tr>
              <td>Password</td>
              <td><input type="password" name="password" defaultValue={user?.password}/></td>
            </tr>
            <tr>
              <td><input type="submit" value="Update User" /></td>
            </tr>
          </tbody>
        </table>
      </form>
      <Link href="/users">Back to Users</Link>
    </div>
  );
}
