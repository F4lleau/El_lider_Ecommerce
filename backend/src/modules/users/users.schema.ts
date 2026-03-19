import { z } from "zod";

export const meSchema = z.object({
	userId: z.number().int().positive(),
});

export type MeInput = z.infer<typeof meSchema>;
