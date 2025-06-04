import { z } from "zod";

export const taskSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  category_id: z.string().regex(/^\d+$/, "Invalid category ID"),
  due_date: z.string().refine((val) => !isNaN(Date.parse(val)), {
    message: "Invalid due date",
  }),
  priority: z.enum(["Low", "Medium", "High"], {
    errorMap: () => ({ message: "Priority must be Low, Medium, or High" }),
  }),
  user_id: z.string().regex(/^\d+$/, "Invalid user ID"),
});
