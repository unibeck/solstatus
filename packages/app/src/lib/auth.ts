import { env } from "cloudflare:workers"
import { schema } from "@solstatus/common/db/schema"
import { betterAuth } from "better-auth"
import { drizzleAdapter } from "better-auth/adapters/drizzle"
import { emailOTP } from "better-auth/plugins"
import { secondaryStorage } from "@/db/secondaryStorage"

export const auth = betterAuth({
  database: drizzleAdapter(env.DB, {
    provider: "sqlite",
    schema: {
      ...schema,
      account: schema.AccountTable,
      session: schema.SessionTable,
      user: schema.UserTable,
      verification: schema.VerificationTable,
    },
  }),

  secondaryStorage,
  secret: env.BETTER_AUTH_SECRET,

  plugins: [
    emailOTP({
      sendVerificationOTP: async ({ email, otp, type }, _request) => {
        // send email to user with OTP
        console.log({ email, otp, type })
      },
      otpLength: 6,
      expiresIn: 300, // 5 minutes
    }),
  ],
})
