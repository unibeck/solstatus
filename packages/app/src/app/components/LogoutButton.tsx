"use client"

import { useTransition } from "react"
import { setupAuthClient } from "@/lib/auth-client"
import { link } from "@/lib/links"
import { Button } from "@/registry/new-york-v4/ui/button"

type LogoutButtonProps = {
  className?: string
  authUrl: string
}

const buttonStyles = {
  display: "inline-block",
  padding: "0.5rem 1rem",
  background: "#0070f3",
  color: "white",
  border: "none",
  borderRadius: "4px",
  fontSize: "1rem",
  fontWeight: "500",
  cursor: "pointer",
}

const disabledButtonStyles = {
  ...buttonStyles,
  opacity: 0.7,
  cursor: "not-allowed",
}

export function LogoutButton({ className, authUrl }: LogoutButtonProps) {
  const [isPending, startTransition] = useTransition()
  const authClient = setupAuthClient(authUrl)

  const handleSignOut = () => {
    startTransition(() => {
      authClient.signOut({
        fetchOptions: {
          onSuccess: () => {
            window.location.href = link("/user/login")
          },
        },
      })
    })
  }

  return (
    <Button
      onClick={handleSignOut}
      disabled={isPending}
      style={isPending ? disabledButtonStyles : buttonStyles}
      className={className}
    >
      {isPending ? "Logging out..." : "Log Out"}
    </Button>
  )
}
