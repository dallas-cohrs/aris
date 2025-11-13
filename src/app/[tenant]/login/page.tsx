"use client";

import { useActionState, useEffect } from "react";
import { useFormStatus } from "react-dom";
import { useTenant } from "@/components/tenant-provider";
import { loginAction } from "@/actions/login";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { IconLoader2, IconLock, IconUser } from "@tabler/icons-react";
import { useRouter } from "next/navigation"

function SubmitButton() {
  const { pending } = useFormStatus();
  
  return (
    <Button
      type="submit"
      className="w-full"
      disabled={pending}
    >
      {pending ? (
        <>
          <IconLoader2 className="mr-2 h-4 w-4 animate-spin" />
          Signing in...
        </>
      ) : (
        "Sign in"
      )}
    </Button>
  );
}

export default function TenantLoginPage() {
  const router = useRouter();
  const tenant = useTenant();
  const tenantSlug = tenant?.slug || "";
  
  const [state, formAction] = useActionState(
    (state: any, formData: FormData) => loginAction(formData, tenantSlug),
    undefined
  );

  useEffect(() => {
    if (state?.success) {
      router.push(`/${tenantSlug}/dashboard`)
    }
  }, [state, router, tenantSlug])

  // Get tenant branding colors or use defaults
  const tenantName = tenant?.name || "ARIS";
  const tenantDisplayName = tenant?.display_name || tenantName;

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-background via-background to-muted/20 p-4">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="space-y-1 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
            <IconLock className="h-8 w-8 text-primary" />
          </div>
          <CardTitle className="text-2xl font-bold">{tenantDisplayName}</CardTitle>
          <CardDescription>
            Sign in to your account to continue
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form action={formAction} className="space-y-4">
            {state?.error && (
              <div className="rounded-md bg-destructive/15 p-3 text-sm text-destructive">
                {state.error}
              </div>
            )}
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <IconUser className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="name@example.com"
                  className="pl-9"
                  required
                  autoComplete="email"
                />
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Password</Label>
                <button
                  type="button"
                  className="text-xs text-muted-foreground hover:text-foreground"
                  onClick={() => {
                    // Password reset functionality coming soon
                  }}
                >
                  Forgot password?
                </button>
              </div>
              <div className="relative">
                <IconLock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="password"
                  name="password"
                  type="password"
                  placeholder="Enter your password"
                  className="pl-9"
                  required
                  autoComplete="current-password"
                />
              </div>
            </div>
            <SubmitButton />
          </form>
          <div className="mt-6 text-center text-sm text-muted-foreground">
            <p>
              Don't have an account?{" "}
              <button
                type="button"
                className="font-medium text-primary hover:underline"
                onClick={() => {
                  // Contact administrator functionality
                }}
              >
                Contact administrator
              </button>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
