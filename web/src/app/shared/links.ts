import { defineLinks } from "rwsdk/router";

export const link = defineLinks([
  "/",
  "/user/login",
  "/user/signup",
  "/user/logout",
  "/legal/privacy",
  "/legal/terms",
  "/applications",
  "/applications/new",
  "/applications/:id",
  "/applications/:id/edit",
]);
