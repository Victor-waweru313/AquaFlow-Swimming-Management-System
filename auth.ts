import NextAuthModule from "next-auth";
import { authConfig } from "@/lib/auth.config";

// next-auth package may export the factory as default or as a named export depending on bundler.
const NextAuthFactory: any = (NextAuthModule as any)?.default ?? NextAuthModule;

let nextAuthInstance: any;
if (typeof NextAuthFactory === "function") {
	nextAuthInstance = NextAuthFactory(authConfig);
} else {
	// Try dynamic require as a fallback
	// eslint-disable-next-line @typescript-eslint/no-var-requires
	const req = require("next-auth");
	const mod = (req as any)?.default ?? req;
	if (typeof mod !== "function") {
		throw new Error("NextAuth factory is not a function");
	}
	nextAuthInstance = mod(authConfig);
}

export const handlers = nextAuthInstance.handlers;
export const auth = nextAuthInstance.auth;
export const signIn = nextAuthInstance.signIn;
export const signOut = nextAuthInstance.signOut;
