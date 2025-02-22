import { db } from "@/db";
import { videos } from "@/db/schema";
import { serve } from "@upstash/workflow/nextjs";
import { and, eq } from "drizzle-orm";

interface InputType {
  userId: string;
  videoId: string;
}

const DESCRIPTION_SYSTEM_PROMPT = `Your task is to summarize the transcript of a video. Please follow these guidelines:
- Be brief. Condense the content into a summary that captures the key points and main ideas without losing important details.
- Avoid jargon or overly complex language unless necessary for the context.
- Focus on the most critical information, ignoring filler, repetitive statements, or irrelevant tangents.
- ONLY return the summary, no other text, annotations, or comments.
- Aim for a summary that is 3-5 sentences long and no more than 200 characters.`;

export const { POST } = serve(async (context) => {
  const input = context.requestPayload as InputType;
  const { userId, videoId } = input;
  const video = await context.run("get-video", async () => {
    const [existingVideo] = await db
      .select()
      .from(videos)
      .where(and(eq(videos.id, videoId), eq(videos.userId, userId)));
    if (!existingVideo) {
      throw new Error("Not found");
    }
    return existingVideo;
  });

  const transcript = await context.run("get-transcript", async () => {
    const trackUrl = `https://stream.mux.com/${video.muxPlaybackId}/text/${video.muxTrackId}.txt`;
    const response = await fetch(trackUrl);
    const text = await response.text();
    if (!text) {
      throw new Error("Bad response from Mux");
    }
    return text;
  });

  const { body } = await context.api.openai.call("generate-description", {
    baseURL: "https://openrouter.ai/api/v1/chat/completions",
    token: process.env.DEEPSEEK_API_KEY!,
    operation: "chat.completions.create",
    body: {
      model: "deepseek/deepseek-r1:free",
      messages: [
        {
          role: "system",
          content: DESCRIPTION_SYSTEM_PROMPT,
        },
        {
          role: "user",
          content: transcript,
        },
      ],
      temperature: 0.7,
      max_tokens: 100,
    },
  });

  await context.run("update-video", async () => {
    const description = body.choices[0]?.message.content;
    if (!description) {
      throw new Error("Bad request");
    }
    await db
      .update(videos)
      .set({
        description: description || video.description,
      })
      .where(and(eq(videos.id, videoId), eq(videos.userId, userId)));
  });
});
