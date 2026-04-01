import { useEffect } from "react";
import { useFieldArray, useForm, Controller } from "react-hook-form";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Plus, Trash2 } from "lucide-react";
import { Link } from "react-router-dom";

import { Badge } from "@/components/badge";
import { Button } from "@/components/button";
import { Card } from "@/components/card";
import { EmptyState } from "@/components/feedback/empty-state";
import { ErrorPanel } from "@/components/feedback/error-panel";
import { PageLoader } from "@/components/feedback/page-loader";
import { FormField } from "@/components/forms/form-field";
import { TagInput } from "@/components/forms/tag-input";
import { Input } from "@/components/input";
import { SectionHeader } from "@/components/section-header";
import { Select } from "@/components/select";
import { Textarea } from "@/components/textarea";
import { useClassrooms } from "@/hooks/use-classrooms";
import { createTest, getTestsByClass } from "@/services/test-service";

const questionSchema = z.object({
  text: z.string().min(1, "Question text is required."),
  subject: z.string().min(1, "Subject is required."),
  chapter: z.string().min(1, "Chapter is required."),
  concepts: z.array(z.string()).min(1, "Add at least one concept."),
  steps: z.array(z.string()).min(1, "Add at least one solution step."),
  calculation_types: z.array(z.string()).min(1, "Add at least one calculation type."),
});

const builderSchema = z.object({
  classId: z.coerce.number().min(1, "Choose a classroom."),
  subject: z.string().min(1, "Subject is required."),
  chapter: z.string().min(1, "Chapter is required."),
  questions: z.array(questionSchema).min(1, "At least one question is required."),
});

type BuilderValues = z.infer<typeof builderSchema>;

const blankQuestion: BuilderValues["questions"][number] = {
  text: "",
  subject: "",
  chapter: "",
  concepts: [],
  steps: [],
  calculation_types: [],
};

export function TeacherTestsPage() {
  const queryClient = useQueryClient();
  const classroomsQuery = useClassrooms();
  const form = useForm<BuilderValues>({
    resolver: zodResolver(builderSchema),
    defaultValues: {
      classId: 0,
      subject: "",
      chapter: "",
      questions: [blankQuestion],
    },
  });
  const selectedClassId = form.watch("classId");
  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "questions",
  });

  useEffect(() => {
    if (!selectedClassId && classroomsQuery.data?.[0]) {
      form.setValue("classId", classroomsQuery.data[0].id);
    }
  }, [classroomsQuery.data, form, selectedClassId]);

  const testsQuery = useQuery({
    queryKey: ["tests", selectedClassId],
    queryFn: () => getTestsByClass(selectedClassId),
    enabled: Boolean(selectedClassId),
  });

  const mutation = useMutation({
    mutationFn: (values: BuilderValues) =>
      createTest({
        class_id: values.classId,
        subject: values.subject,
        chapter: values.chapter,
        questions: values.questions,
      }),
    onSuccess: () => {
      toast.success("Test created successfully.");
      form.reset({
        classId: selectedClassId,
        subject: "",
        chapter: "",
        questions: [blankQuestion],
      });
      void queryClient.invalidateQueries({ queryKey: ["tests", selectedClassId] });
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });

  if (classroomsQuery.isLoading) {
    return <PageLoader label="Loading classroom options..." />;
  }

  if (classroomsQuery.isError) {
    return <ErrorPanel message={classroomsQuery.error.message} onRetry={() => classroomsQuery.refetch()} />;
  }

  const classrooms = classroomsQuery.data ?? [];
  const selectedClassroom = classrooms.find((classroom) => classroom.id === selectedClassId) ?? null;

  if (!classrooms.length) {
    return (
      <EmptyState
        title="Create a classroom before building tests"
        description="Tests are attached to classrooms, so start by creating a class in the teacher dashboard."
      />
    );
  }

  return (
    <div className="space-y-6">
      <SectionHeader
        eyebrow="Teacher tests"
        title="Build structured assessments"
        description="Create tests with question-level concepts, steps, and calculation metadata that feed directly into Eldas cognitive analysis."
      />

      <div className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
        <Card>
          <form className="space-y-6" onSubmit={form.handleSubmit((values) => mutation.mutate(values))}>
            <div className="grid gap-4 md:grid-cols-3">
              <FormField label="Classroom" error={form.formState.errors.classId?.message}>
                <Select {...form.register("classId")}>
                  <option value="">Choose a classroom</option>
                  {classrooms.map((classroom) => (
                    <option key={classroom.id} value={classroom.id}>
                      {classroom.name}
                    </option>
                  ))}
                </Select>
              </FormField>
              <FormField label="Subject" error={form.formState.errors.subject?.message}>
                <Input placeholder="Physics" {...form.register("subject")} />
              </FormField>
              <FormField label="Chapter" error={form.formState.errors.chapter?.message}>
                <Input placeholder="Laws of Motion" {...form.register("chapter")} />
              </FormField>
            </div>

            <div className="space-y-4">
              {fields.map((field, index) => (
                <Card key={field.id} className="border border-slate-100 bg-slate-50/70">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="eyebrow">Question {index + 1}</p>
                      <h3 className="mt-2 font-display text-xl font-bold text-ink">Cognitive metadata block</h3>
                    </div>
                    {fields.length > 1 ? (
                      <Button variant="outline" onClick={() => remove(index)}>
                        <Trash2 className="h-4 w-4" />
                        Remove
                      </Button>
                    ) : null}
                  </div>

                  <div className="mt-5 grid gap-4">
                    <FormField label="Question text" error={form.formState.errors.questions?.[index]?.text?.message}>
                      <Textarea placeholder="Write the full question prompt..." {...form.register(`questions.${index}.text`)} />
                    </FormField>
                    <div className="grid gap-4 md:grid-cols-2">
                      <FormField label="Question subject" error={form.formState.errors.questions?.[index]?.subject?.message}>
                        <Input placeholder="Physics" {...form.register(`questions.${index}.subject`)} />
                      </FormField>
                      <FormField label="Question chapter" error={form.formState.errors.questions?.[index]?.chapter?.message}>
                        <Input placeholder="Kinematics" {...form.register(`questions.${index}.chapter`)} />
                      </FormField>
                    </div>
                    <Controller
                      control={form.control}
                      name={`questions.${index}.concepts`}
                      render={({ field: controllerField }) => (
                        <TagInput
                          label="Concepts"
                          values={controllerField.value}
                          onChange={controllerField.onChange}
                          placeholder="Add concept"
                        />
                      )}
                    />
                    <Controller
                      control={form.control}
                      name={`questions.${index}.steps`}
                      render={({ field: controllerField }) => (
                        <TagInput
                          label="Steps"
                          values={controllerField.value}
                          onChange={controllerField.onChange}
                          placeholder="Add solution step"
                        />
                      )}
                    />
                    <Controller
                      control={form.control}
                      name={`questions.${index}.calculation_types`}
                      render={({ field: controllerField }) => (
                        <TagInput
                          label="Calculation types"
                          values={controllerField.value}
                          onChange={controllerField.onChange}
                          placeholder="Add calculation type"
                        />
                      )}
                    />
                  </div>
                </Card>
              ))}
            </div>

            <div className="flex flex-wrap gap-3">
              <Button variant="outline" onClick={() => append(blankQuestion)}>
                <Plus className="h-4 w-4" />
                Add question
              </Button>
              <Button type="submit" disabled={mutation.isPending}>
                {mutation.isPending ? "Creating test..." : "Create test"}
              </Button>
            </div>
          </form>
        </Card>

        <Card>
          <p className="eyebrow">Existing tests</p>
          <h3 className="mt-2 font-display text-2xl font-bold text-ink">Class assessment library</h3>
          <p className="mt-3 text-sm leading-6 text-slate-500">
            {selectedClassroom
              ? `Browse the published tests for ${selectedClassroom.name} and open a richer detail page for question review.`
              : "Choose a classroom to review the tests already published for it."}
          </p>
          <div className="mt-5 space-y-4">
            {testsQuery.isLoading ? (
              <PageLoader label="Loading tests..." />
            ) : testsQuery.isError ? (
              <ErrorPanel message={testsQuery.error.message} onRetry={() => testsQuery.refetch()} />
            ) : testsQuery.data?.length ? (
              testsQuery.data.map((test) => (
                <Card key={test.id} className="border border-slate-100 bg-slate-50/70">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <h4 className="font-display text-xl font-bold text-ink">
                        {test.subject} - {test.chapter}
                      </h4>
                      <p className="mt-2 text-sm text-slate-500">{test.questions.length} question blocks</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <Badge tone="accent">Class {test.class_id}</Badge>
                      <Link
                        to={`/teacher/classrooms/${test.class_id}/tests/${test.id}`}
                        state={{
                          classroom: selectedClassroom ?? classrooms.find((classroom) => classroom.id === test.class_id) ?? null,
                          test,
                        }}
                        className="inline-flex h-11 items-center justify-center rounded-2xl border border-slate-200 px-4 text-sm font-semibold text-ink transition hover:bg-white"
                      >
                        View detail
                      </Link>
                    </div>
                  </div>
                  <div className="mt-4 space-y-3">
                    {test.questions.slice(0, 2).map((question) => (
                      <div key={question.id} className="rounded-2xl bg-white p-4">
                        <p className="text-sm font-semibold text-ink">{question.text}</p>
                        <div className="mt-3 flex flex-wrap gap-2">
                          {question.concepts.map((concept) => (
                            <Badge key={`${question.id}-${concept}`}>{concept}</Badge>
                          ))}
                        </div>
                      </div>
                    ))}
                    {test.questions.length > 2 ? (
                      <p className="text-sm text-slate-500">
                        {test.questions.length - 2} more question blocks are available in the full test detail view.
                      </p>
                    ) : null}
                  </div>
                </Card>
              ))
            ) : (
              <EmptyState
                title="No tests yet"
                description="Once you publish a test for this class, it will appear here with its questions and metadata."
              />
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}
