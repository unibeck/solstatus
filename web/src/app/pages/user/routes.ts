import { route } from "rwsdk/router"
import { Login } from "@/app/pages/user/Login"
import type { AppContext } from "@/worker"
import { link } from "@/app/shared/links"

const redirectIfAuthenticated = ({ ctx }: { ctx: AppContext }) => {
  if (ctx.user) {
    return new Response(null, {
      status: 302,
      headers: { Location: link("/home") },
    })
  }
}

export const userRoutes = [route("/login", [redirectIfAuthenticated, Login])]
