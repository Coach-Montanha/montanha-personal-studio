export interface ImpersonateData {
  targetUserId?: string;
  targetEmail: string;
}

export function getImpersonateUser(): { id: string; email: string; user_metadata: { name: string } } | null {
  if (typeof window === "undefined") return null;

  try {
    const raw = localStorage.getItem("montanha.impersonate") || localStorage.getItem("edufinance.impersonate");
    if (!raw) return null;

    const parsed: ImpersonateData = JSON.parse(raw);
    if (parsed && parsed.targetEmail) {
      return {
        id: parsed.targetUserId || `usr_${parsed.targetEmail}`,
        email: parsed.targetEmail,
        user_metadata: { name: parsed.targetEmail.split("@")[0] }
      };
    }
  } catch {
    // Ignore corrupted storage
  }

  return null;
}
