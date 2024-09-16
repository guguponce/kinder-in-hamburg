"use client";
import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { User } from "@supabase/supabase-js";
import { getClientUser } from "@app/api/auth/supabaseClient";
import { createClient } from "@auth/client";

// Define types for the context
interface SessionContextType {
  user: User | null | undefined;
  status: "loading" | "authenticated" | "unauthenticated";
}

// Create context
const SessionContext = createContext<SessionContextType | undefined>(undefined);

// Create a hook to access the session context
export const useSupabaseSession = (): SessionContextType => {
  const context = useContext(SessionContext);
  if (!context) {
    throw new Error("useSession must be used within a SessionProvider");
  }
  return context;
};

// Create the provider component
export const SessionProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<null | User>();
  const [status, setStatus] = useState<
    "loading" | "authenticated" | "unauthenticated"
  >("loading");

  useEffect(() => {
    // Fetch initial session from Supabase
    getClientUser().then(({ user }) => {
      setUser(user);
      setStatus(user ? "authenticated" : "unauthenticated");
    });

    // Listen for changes to the session (login/logout)
    const supabase = createClient();
    const { data: authListener } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setUser(session?.user ?? null);
        setStatus(!!session ? "authenticated" : "unauthenticated");
      }
    );

    // Cleanup listener on component unmount
    return () => {
      authListener?.subscription.unsubscribe();
    };
  }, []);

  return (
    <SessionContext.Provider value={{ user, status }}>
      {children}
    </SessionContext.Provider>
  );
};
