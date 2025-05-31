"use client"

import { useState, useTransition } from "react"
import { setupAuthClient } from "@/lib/auth-client"
import { link } from "@/lib/links"
import { Button } from "@/registry/new-york-v4/ui/button"
import { Card, CardContent } from "@/registry/new-york-v4/ui/card"
import {
  Form,
  FormControl,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/registry/new-york-v4/ui/form"
import { Input } from "@/registry/new-york-v4/ui/input"
import type { AppContext } from "@/worker"
import { useForm } from "react-hook-form"

export function Login({ ctx }: { ctx: AppContext }) {
  const { authUrl } = ctx
  const [email, setEmail] = useState("")
  const [otp, setOtp] = useState("")
  const [result, setResult] = useState("")
  const [isPending, startTransition] = useTransition()
  const [showOtpInput, setShowOtpInput] = useState(false)
  const [emailError, setEmailError] = useState("")
  const [otpError, setOtpError] = useState("")
  const authClient = setupAuthClient(authUrl)

  const validateEmail = (email: string) => {
    if (!email) {
      return "Email is required"
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return "Please enter a valid email address"
    }
    return ""
  }

  const validateOtp = (otp: string) => {
    if (!otp) {
      return "Verification code is required"
    }
    if (otp.length !== 6) {
      return "Verification code must be 6 digits"
    }
    return ""
  }

  const handleSendOtp = (e: React.FormEvent) => {
    e.preventDefault()
    const error = validateEmail(email)
    setEmailError(error)

    if (error) {
      return
    }

    startTransition(() => {
      authClient.emailOtp.sendVerificationOtp(
        {
          email,
          type: "sign-in",
        },
        {
          onRequest: () => setResult("Sending verification code..."),
          onSuccess: () => {
            setShowOtpInput(true)
            setResult("Check your email for the verification code")
          },
          onError: (ctx) => {
            console.log("error sending OTP", ctx.error)
            setResult(`Error: ${ctx.error.message}`)
          },
        },
      )
    })
  }

  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault()
    const error = validateOtp(otp)
    setOtpError(error)

    if (error) {
      return
    }

    startTransition(() => {
      authClient.signIn.emailOtp(
        {
          email,
          otp,
        },
        {
          onRequest: () => setResult("Verifying code..."),
          onSuccess: () => {
            window.location.href = link("/home")
          },
          onError: (ctx) => {
            console.log("error verifying OTP", ctx.error)
            setResult(`Error: ${ctx.error.message}`)
          },
        },
      )
    })
  }

  const handleBackToEmail = () => {
    setShowOtpInput(false)
    setOtp("")
    setOtpError("")
    setResult("")
  }

  const emailFormId = "email-form"
  const emailForm = useForm<{ email: string}>({
    // resolver: zodResolver(endpointMonitorsInsertDTOSchema),
    defaultValues: {
      email: "",
    }
  })

  const otpFormId = "otp-form"
  const otpForm = useForm<{ otp: string}>({
    // resolver: zodResolver(endpointMonitorsInsertDTOSchema),
    defaultValues: {
      otp: "",
    }
  })

  return (
    <div className="p-8 max-w-md mx-auto">
      <div className="text-center mb-6">
        <img src="/images/logoipsum.svg" alt="Logo" className="mx-auto" />
        <h1 className="text-2xl font-semibold mb-4">Continue with Email</h1>
      </div>

      <Card>
        <CardContent className="p-6">
          {!showOtpInput ? (
            <Form {...emailForm}>
              <form
                id={emailFormId}
                onSubmit={handleSendOtp}
                // onSubmit={form.handleSubmit(handleSendOtp)}
              >
                {/* <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter your email" {...field} />
                      </FormControl>
                      <FormDescription>
                        A friendly name to identify this endpoint monitor
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                /> */}

                <FormItem>
                  <FormLabel htmlFor="email">Email</FormLabel>
                  <FormControl>
                    <Input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Enter your email"
                      autoComplete="email"
                    />
                  </FormControl>
                  <FormMessage>{emailError}</FormMessage>
                </FormItem>

                {result && (
                  <FormMessage
                  >
                    {result}
                  </FormMessage>
                )}

                <Button type="submit" disabled={isPending} className="w-full">
                  {isPending ? "Sending Code..." : "Continue with Email"}
                </Button>
              </form>
            </Form>
          ) : (
            <Form {...otpForm}>
              <form
                id={otpFormId}
                onSubmit={handleVerifyOtp}
              >
                <FormItem>
                  <FormLabel htmlFor="otp">Verification Code</FormLabel>
                  <FormControl>
                    <Input
                      id="otp"
                      type="text"
                      value={otp}
                      onChange={(e) => setOtp(e.target.value)}
                      placeholder="Enter 6-digit code"
                      maxLength={6}
                      autoComplete="one-time-code"
                    />
                  </FormControl>
                  <FormMessage>{otpError}</FormMessage>
                </FormItem>

                {result && (
                  <FormMessage>
                    {result}
                  </FormMessage>
                )}

                <div className="flex gap-3">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleBackToEmail}
                    disabled={isPending}
                  >
                    ← Back
                  </Button>
                  <Button type="submit" disabled={isPending} className="flex-1">
                    {isPending ? "Verifying..." : "Verify Code"}
                  </Button>
                </div>
              </form>
            </Form>
          )}
        </CardContent>
      </Card>

      <p className="mt-4 text-sm text-gray-600 text-center">
        <a href="/" className="text-blue-600 hover:underline">
          Back to Landing Page
        </a>
      </p>
    </div>
  )
}
