"use client";

import { useTransition } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { markTaskComplete } from "./markTaskComplete";

export function TaskCheckbox({ taskId }: { taskId: number }) {
  const [isPending, startTransition] = useTransition();

  return (
    <Checkbox
      disabled={isPending}
      onCheckedChange={() =>
        startTransition(() => {
          markTaskComplete(taskId);
        })
      }
    />
  );
}
