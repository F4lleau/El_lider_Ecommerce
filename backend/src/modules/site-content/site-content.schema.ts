import { z } from "zod";

export const siteContentKeyParamsSchema = z.object({
	key: z.string().trim().min(1, "La key es requerida"),
});

export type SiteContentKeyParams = z.infer<typeof siteContentKeyParamsSchema>;
