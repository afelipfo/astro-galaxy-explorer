import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, router, protectedProcedure } from "./_core/trpc";
import { z } from "zod";

export const appRouter = router({
  system: systemRouter,

  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),

  // Router para imágenes públicas
  images: router({
    getAll: publicProcedure.query(async () => {
      const { getAllPublicImages } = await import("./db");
      return getAllPublicImages();
    }),
    getUserImages: protectedProcedure.query(async ({ ctx }) => {
      const { getUserPublicImages } = await import("./db");
      return getUserPublicImages(ctx.user.id);
    }),
    upload: protectedProcedure
      .input(
        z.object({
          imageUrl: z.string(),
          celestialObjectTag: z.string().optional(),
          description: z.string().optional(),
        })
      )
      .mutation(async ({ ctx, input }) => {
        const { createPublicImage } = await import("./db");
        const id = `img_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        return createPublicImage({
          id,
          userId: ctx.user.id,
          imageUrl: input.imageUrl,
          celestialObjectTag: input.celestialObjectTag,
          description: input.description,
        });
      }),
  }),

  // Router para juegos
  games: router({
    getProgress: protectedProcedure.query(async ({ ctx }) => {
      const { getUserGameProgress } = await import("./db");
      return getUserGameProgress(ctx.user.id);
    }),
    saveProgress: protectedProcedure
      .input(
        z.object({
          gameType: z.enum(["puzzle", "wordsearch", "quiz"]),
          celestialObject: z.string().optional(),
          score: z.string().optional(),
        })
      )
      .mutation(async ({ ctx, input }) => {
        const { saveGameProgress } = await import("./db");
        const id = `game_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        return saveGameProgress({
          id,
          userId: ctx.user.id,
          gameType: input.gameType,
          celestialObject: input.celestialObject,
          score: input.score,
        });
      }),
  }),

  // Router para chatbot
  chat: router({
    getHistory: protectedProcedure.query(async ({ ctx }) => {
      const { getUserChatHistory } = await import("./db");
      return getUserChatHistory(ctx.user.id);
    }),
    sendMessage: protectedProcedure
      .input(
        z.object({
          message: z.string(),
        })
      )
      .mutation(async ({ ctx, input }) => {
        const { invokeLLM } = await import("./_core/llm");
        const { saveChatMessage } = await import("./db");
        
        // Llamar al LLM para obtener respuesta
        const llmResponse = await invokeLLM({
          messages: [
            {
              role: "system",
              content: "Eres un asistente experto en astronomía que ayuda a los usuarios a navegar y aprender sobre el sistema solar, planetas, estrellas, nebulosas, galaxias y otros objetos celestes. Proporciona información precisa, educativa y fascinante. Responde en español de manera clara y amigable.",
            },
            {
              role: "user",
              content: input.message,
            },
          ],
        });

        const responseContent = llmResponse.choices[0]?.message?.content;
        const response = typeof responseContent === 'string' ? responseContent : "Lo siento, no pude procesar tu mensaje.";

        // Guardar en historial
        const id = `chat_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        await saveChatMessage({
          id,
          userId: ctx.user.id,
          message: input.message,
          response,
        });

        return { response };
      }),
  }),
});

export type AppRouter = typeof appRouter;

