"use client";

import { useState, useTransition } from "react";
import { startRegistration } from "@simplewebauthn/browser";
import {
  finishPasskeyRegistration,
  startPasskeyRegistration,
} from "./functions";
import { Button } from "@/app/components/ui/button";
import { AuthLayout } from "@/app/layouts/AuthLayout";
import { link } from "@/app/shared/links";
import { Alert, AlertTitle } from "@/app/components/ui/alert";
import { AlertCircle } from "lucide-react";

export function Signup() {
  const [username, setUsername] = useState("");
  const [result, setResult] = useState("");
  const [isPending, startTransition] = useTransition();

  const passkeyRegister = async () => {
    // 1. Get a challenge from the worker
    const options = await startPasskeyRegistration(username);

    // 2. Ask the browser to sign the challenge
    const registration = await startRegistration({ optionsJSON: options });

    // 3. Give the signed challenge to the worker to finish the registration process
    const success = await finishPasskeyRegistration(username, registration);

    if (!success) {
      setResult("Registration failed");
    } else {
      window.location.href = link("/user/login");
    }
  };

  const handlePerformPasskeyRegister = () => {
    startTransition(() => void passkeyRegister());
  };

  return (
    <AuthLayout>
      <div className="auth-form max-w-[400px] w-full mx-auto px-10">
        <div className="absolute top-0 right-0 p-10">
          <a
            href={link("/user/login")}
            className="font-display font-bold text-black text-sm underline underline-offset-8 hover:decoration-primary"
          >
            Login
          </a>
        </div>
        <h1 className="page-title text-center">Create an Account</h1>
        <p className="py-6">Enter a username to setup an account.</p>
        {result && (
          <Alert variant="destructive" className="mb-5">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>{result}</AlertTitle>
          </Alert>
        )}
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Username"
        />
        <Button
          onClick={handlePerformPasskeyRegister}
          disabled={isPending}
          className="font-display w-full mb-6"
        >
          {isPending ? <>...</> : "Register with passkey"}
        </Button>
        <p>
          By clicking continue, you agree to our {" "}
          <a href={link("/legal/terms")}>Terms of Service</a> and{" "}
          <a href={link("/legal/privacy")}>Privacy Policy</a>.
        </p>
      </div>
    </AuthLayout>
  );
}
