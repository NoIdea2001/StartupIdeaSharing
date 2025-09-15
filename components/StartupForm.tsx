"use client";
import { Input } from "@/components/ui/input";
import React, { useState, useActionState } from "react";
import { Textarea } from "./ui/textarea";
import MDEditor from "@uiw/react-md-editor";
import { Button } from "./ui/button";
import { Send } from "lucide-react";
import { z } from "zod";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { createIdea } from "@/lib/actions";

type Primitive = string | number | boolean | undefined | null;
// Allow additional dynamic keys (e.g., _id) without using 'any'.
type FormState = {
  error: string;
  status: "INITIAL" | "SUCCESS" | "ERROR";
  _id?: string;
} & {
  [key: string]: Primitive;
};

const StartupForm = () => {
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [pitch, setPitch] = useState("");
  const { toast } = useToast();
  const router = useRouter();

  const handleFormSubmit = async (
    prevState: FormState,
    formData: FormData
  ): Promise<FormState> => {
    try {
      const result = await createIdea(prevState, formData, pitch);

      if (result.status === "SUCCESS") {
        toast({
          title: "Success",
          description: "Your idea has been submitted",
        });
        router.push(`/startup/${result._id}`);
      }
      return result;
    } catch (error) {
      if (error instanceof z.ZodError) {
        const fieldErrors = error.flatten().fieldErrors;
        setErrors(fieldErrors as unknown as Record<string, string>);
        toast({
          title: "Error",
          description: "Please check your Inputs",
          variant: "destructive",
        });
        return {
          ...(prevState || { error: "", status: "INITIAL" }),
          error: "Validation failed",
          status: "ERROR",
        };
      }
      return {
        ...(prevState || { error: "", status: "INITIAL" }),
        error: "An unexpected error has occurred",
        status: "ERROR",
      };
    }
  };
  const [state, formAction, isPending] = useActionState<FormState, FormData>(
    handleFormSubmit as unknown as (
      s: FormState,
      f: FormData
    ) => FormState | Promise<FormState>,
    { error: "", status: "INITIAL" }
  );
  console.log(state);

  return (
    <form action={formAction} className="startup-form">
      <div>
        <label htmlFor="title" className="startup-form_label">
          Title
        </label>
        <Input
          id="title"
          name="title"
          className="startup-form_input"
          required
          placeholder="Startup Title"
        />
        {errors.title && <p className="startup-form_error">{errors.title}</p>}
      </div>
      <div>
        <label htmlFor="description" className="startup-form_label">
          Description
        </label>
        <Textarea
          id="description"
          name="description"
          className="startup-form_textarea"
          required
          placeholder="Startup Description"
        />
        {errors.description && (
          <p className="startup-form_error">{errors.description}</p>
        )}
      </div>
      <div>
        <label htmlFor="category" className="startup-form_label">
          Category
        </label>
        <Input
          id="category"
          name="category"
          className="startup-form_input"
          required
          placeholder="Startup Category (e.g. Technology, Health, etc)"
        />
        {errors.category && (
          <p className="startup-form_error">{errors.category}</p>
        )}
      </div>
      <div>
        <label htmlFor="link" className="startup-form_label">
          Image URL
        </label>
        <Input
          id="link"
          name="link"
          type="url"
          className="startup-form_input"
          required
          placeholder="https://example.com/image.jpg"
        />
        {errors.link && <p className="startup-form_error">{errors.link}</p>}
      </div>
      <div data-color-mode="light">
        <label htmlFor="pitch" className="startup-form_label">
          Pitch
        </label>
        <MDEditor
          id="pitch"
          preview="edit"
          height={300}
          value={pitch}
          style={{ borderRadius: 20, overflow: "hidden" }}
          onChange={(value) => setPitch(value as string)}
          textareaProps={{
            placeholder:
              "Briefly describe your idea and what problem it solves",
          }}
          previewOptions={{
            disallowedElements: ["style"],
          }}
        />
        {errors.pitch && <p className="startup-form_error">{errors.pitch}</p>}
      </div>

      <Button
        type="submit"
        className="startup-form_btn text-white"
        disabled={isPending}
      >
        {isPending ? "Submitting..." : "Submit your pitch"}
        <Send className="size-6 ml-2"></Send>
      </Button>
    </form>
  );
};

export default StartupForm;
