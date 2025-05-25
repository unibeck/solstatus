import { route } from "rwsdk/router";
import { Login } from "./Login";
import { Signup } from "./Signup";
import { sessions } from "@/session/store";

export const userRoutes = [
  route("/login", [Login]),
  route("/signup", [Signup]),
  route("/logout", async function ({ request }) {
    const headers = new Headers();
    await sessions.remove(request, headers);
    headers.set("Location", "/");

    return new Response(null, {
      status: 302,
      headers,
    });
  }),
];
