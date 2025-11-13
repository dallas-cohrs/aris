import { createClient } from "./supabase";

/**
 * Gets the current authenticated user from Supabase.
 * @returns The user object if authenticated, null otherwise
 */
export async function getUser() {
  try {
    const supabase = await createClient();
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser();

    if (error) {
      // Don't log expected auth errors (missing session)
      if (error.name !== "AuthSessionMissingError") {
        console.error("Error getting user:", error);
      }
      return null;
    }

    return user;
  } catch (error: any) {
    // Don't log expected auth errors (missing session)
    if (error?.name !== "AuthSessionMissingError") {
      console.error("Error in getUser:", error);
    }
    return null;
  }
}

/**
 * Gets the current session from Supabase.
 * @returns The session object if authenticated, null otherwise
 */
export async function getSession() {
  try {
    const supabase = await createClient();
    const {
      data: { session },
      error,
    } = await supabase.auth.getSession();

    if (error) {
      console.error("Error getting session:", error);
      return null;
    }

    return session;
  } catch (error) {
    console.error("Error in getSession:", error);
    return null;
  }
}
