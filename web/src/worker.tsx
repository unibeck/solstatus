import { prefix, render, route } from "rwsdk/router"
import { defineApp } from "rwsdk/worker"

import { Document } from "@/app/document/Document"
import { setCommonHeaders } from "@/app/document/headers"

import { Home } from "@/app/pages/Home"
import { Landing } from "@/app/pages/Landing"
import { userRoutes } from "@/app/pages/user/routes"
import type { User } from "@/db/schema/auth-schema"
import { auth } from "@/lib/auth"
import { link } from "@/lib/links"

export type AppContext = {
  user: User | undefined
  authUrl: string
}

const isAuthenticated = ({ ctx }: { ctx: AppContext }) => {
  if (!ctx.user) {
    return new Response(null, {
      status: 302,
      headers: { Location: link("/user/login") },
    })
  }
}

export default defineApp([
  setCommonHeaders(),
  async ({ ctx, request }) => {
    const url = new URL(request.url)
    ctx.authUrl = url.origin

    try {
      const session = await auth.api.getSession({
        headers: request.headers,
      })

      if (session?.user) {
        ctx.user = {
          ...session.user,
          image: session.user.image ?? null,
        }
      }
    } catch (error) {
      console.error("Session error:", error)
    }
  },

  route("/api/auth/*", ({ request }) => {
    return auth.handler(request)
  }),

  render(Document, [
    route("/", Landing),
    route("/home", [isAuthenticated, Home]),
    prefix("/user", userRoutes),
  ]),
])
