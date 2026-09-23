import { useEffect, useState } from "react";
import type { Session, User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";

export function useAuth() {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const { data: sub } = supabase.auth.onAuthStateChange((_e, s) => {
      setSession(s);
      setUser(s?.user ?? null);
    });
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      if (data.session?.user) {
        setUser(data.session.user);
      } else if (typeof window !== "undefined") {
        const rawImp = localStorage.getItem("edufinance.impersonate");
        if (rawImp) {
          try {
            const imp = JSON.parse(rawImp);
            if (imp?.targetEmail) {
              setUser({
                id: imp.targetUserId || `usr_${imp.targetEmail}`,
                email: imp.targetEmail,
                user_metadata: { name: imp.targetEmail.split("@")[0] }
              } as any);
            }
          } catch {}
        }
      }
      setLoading(false);
    });
    return () => sub.subscription.unsubscribe();
  }, []);

  return { session, user, loading };
}
