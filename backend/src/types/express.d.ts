import type { UserRole } from "@prisma/client";

export type AuthUser = {
	id: number;
	role: UserRole;
};

declare global {
	namespace Express {
		interface Request {
			user?: AuthUser;
		}
	}
}

export {};
