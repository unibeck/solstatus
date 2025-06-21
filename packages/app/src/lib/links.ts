// import { defineLinks } from "rwsdk/router"

// export const link = defineLinks(["/", "/home", "/user/login"])
// TODO: remove this once we have proper typed links
export const link = (path: "/" | "/home" | "/user/login") => path
