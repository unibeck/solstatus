import { defineApp, ErrorResponse } from "rwsdk/worker";
import { route, render, prefix } from "rwsdk/router";
import { Document } from "@/app/Document";
import { Home } from "@/app/pages/Home";
import { setCommonHeaders } from "@/app/headers";
import { userRoutes } from "@/app/pages/user/routes";
import { sessions, setupSessionStore } from "./session/store";
import { Session } from "./session/durableObject";
import { db, setupDb } from "./db";
import type { User } from "@prisma/client";
import { env } from "cloudflare:workers";
import { List } from "./app/pages/applications/List";
import { New } from "./app/pages/applications/New";
import { Details } from "./app/pages/applications/Details";
import { Edit } from "./app/pages/applications/Edit";
export { SessionDurableObject } from "./session/durableObject";

export type AppContext = {
  session: Session | null;
  user: User | null;
};

const isAuthenticated = ({ ctx }: { ctx: AppContext }) => {
  if (!ctx.user) {
    return new Response(null, {
      status: 302,
      headers: { Location: "/user/login" },
    });
  }
};

export default defineApp([
  setCommonHeaders(),
  async ({ ctx, request, headers }) => {
    await setupDb(env);
    setupSessionStore(env);

    try {
      ctx.session = await sessions.load(request);
    } catch (error) {
      if (error instanceof ErrorResponse && error.code === 401) {
        await sessions.remove(request, headers);
        headers.set("Location", "/user/login");

        return new Response(null, {
          status: 302,
          headers,
        });
      }

      throw error;
    }

    if (ctx.session?.userId) {
      ctx.user = await db.user.findUnique({
        where: {
          id: ctx.session.userId,
        },
      });
    }
  },
  render(Document, [
    route("/", [isAuthenticated, Home]),
    prefix("/user", userRoutes),
    route("/legal/privacy", () => <h1>Privacy Policy</h1>),
    route("/legal/terms", () => <h1>Terms of Service</h1>),
    prefix("/applications", [
      route("/", [isAuthenticated, List]),
      route("/new", [isAuthenticated, New]),
      route("/:id", [isAuthenticated, Details]),
      route("/:id/edit", [isAuthenticated, Edit]),
    ]),
  ]),
]);
