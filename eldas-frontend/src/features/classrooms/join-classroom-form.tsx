import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import { Button } from "@/components/button";
import { FormField } from "@/components/forms/form-field";
import { Input } from "@/components/input";
import { joinClassroom } from "@/services/classroom-service";

const joinSchema = z.object({
  joinCode: z.string().min(4, "Enter a valid join code."),
});

type JoinValues = z.infer<typeof joinSchema>;

export function JoinClassroomForm() {
  const queryClient = useQueryClient();
  const form = useForm<JoinValues>({
    resolver: zodResolver(joinSchema),
    defaultValues: {
      joinCode: "",
    },
  });

  const mutation = useMutation({
    mutationFn: (values: JoinValues) => joinClassroom({ join_code: values.joinCode }),
    onSuccess: () => {
      toast.success("You have joined the classroom.");
      void queryClient.invalidateQueries({ queryKey: ["classrooms", "me"] });
      form.reset();
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });

  return (
    <form className="space-y-4" onSubmit={form.handleSubmit((values) => mutation.mutate(values))} data-testid="join-classroom-form">
      <FormField label="Join code" error={form.formState.errors.joinCode?.message}>
        <Input placeholder="Enter classroom code" data-testid="join-classroom-code" {...form.register("joinCode")} />
      </FormField>
      <Button type="submit" variant="secondary" className="w-full" disabled={mutation.isPending} data-testid="join-classroom-submit">
        {mutation.isPending ? "Joining..." : "Join classroom"}
      </Button>
    </form>
  );
}
