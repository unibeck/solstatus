import { env } from "cloudflare:workers"
import { betterAuth } from "better-auth"
import { drizzleAdapter } from "better-auth/adapters/drizzle"
import { emailOTP } from "better-auth/plugins"
import { db } from "@/db/db"
import * as schema from "@/db/schema"
import { secondaryStorage } from "@/db/secondaryStorage"

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "sqlite",
    schema: schema,
  }),

  secondaryStorage,
  secret: env.BETTER_AUTH_SECRET,

  plugins: [
    emailOTP({
      sendVerificationOTP: async ({ email, otp, type }, request) => {
        // send email to user with OTP
        console.log({ email, otp, type })
      },
      otpLength: 6,
      expiresIn: 300, // 5 minutes
    }),
  ],
})
