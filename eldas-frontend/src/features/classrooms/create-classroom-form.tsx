import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import { Button } from "@/components/button";
import { FormField } from "@/components/forms/form-field";
import { Input } from "@/components/input";
import { createClassroom } from "@/services/classroom-service";

const classroomSchema = z.object({
  name: z.string().min(2, "Classroom name should be at least 2 characters."),
});

type ClassroomValues = z.infer<typeof classroomSchema>;

interface CreateClassroomFormProps {
  onCreated?: () => void;
}

export function CreateClassroomForm({ onCreated }: CreateClassroomFormProps) {
  const queryClient = useQueryClient();
  const form = useForm<ClassroomValues>({
    resolver: zodResolver(classroomSchema),
    defaultValues: {
      name: "",
    },
  });

  const mutation = useMutation({
    mutationFn: (values: ClassroomValues) => createClassroom(values.name),
    onSuccess: () => {
      toast.success("Classroom created.");
      void queryClient.invalidateQueries({ queryKey: ["classrooms", "me"] });
      form.reset();
      onCreated?.();
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });

  return (
    <form className="space-y-4" onSubmit={form.handleSubmit((values) => mutation.mutate(values))} data-testid="create-classroom-form">
      <FormField
        label="Classroom name"
        error={form.formState.errors.name?.message}
        hint="Use a name students will recognize immediately."
      >
        <Input placeholder="Class 9A Physics" data-testid="create-classroom-name" {...form.register("name")} />
      </FormField>
      <Button type="submit" className="w-full" disabled={mutation.isPending} data-testid="create-classroom-submit">
        {mutation.isPending ? "Creating..." : "Create classroom"}
      </Button>
    </form>
  );
}
