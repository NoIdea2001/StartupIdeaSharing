"use server";

import { auth } from "@/auth";
import { parseServerActionResponse } from "./utils";
import slugify from "slugify";
import { writeClient } from "@/sanity/lib/write-cliet";


export async function createIdea(state: unknown, form: FormData, pitch: string) {
  const session = await auth();

  if (!session) {
    return parseServerActionResponse({
      status: "ERROR",
      error: "Not signed in",
    });
  }
//   console.log(session);
  

  const { title, description, category, link } = Object.fromEntries(
    Array.from(form).filter(([key]) => key !== "pitch")
  );

  const slug = slugify(title as string,{ lower: true , strict: true });

  try {
    const startup = {
        title,
        description,
        category,
        image: link,
        slug:{
            _type: "slug",
            current: slug,
        },
        author: {
            _type: "reference",
            _ref: session?.id,
        },
        pitch,
    }

    const result = await writeClient.create({_type: "startup", ...startup});
    return parseServerActionResponse({
        ...result,
        status: "SUCCESS",
        error: "",
        });
    
  } catch (error) {
    console.log(error);
    return parseServerActionResponse({
      status: "ERROR",
      error: "An unexpected error has occurred",
    });
  }

}
