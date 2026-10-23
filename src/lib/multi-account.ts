import { supabase } from "@/integrations/supabase/client";
import type { Session, User } from "@supabase/supabase-js";

export interface SavedAccount {
  id: string;
  email: string;
  name?: string;
  role?: string;
  avatarUrl?: string;
  session: {
    access_token: string;
    refresh_token: string;
  };
  lastActiveAt: number;
}

const STORAGE_KEY = "studio_multiprofile_accounts_v1";

/**
 * Retorna todas as contas salvas no dispositivo
 */
export function getSavedAccounts(): SavedAccount[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

/**
 * Salva ou atualiza a conta atual no armazenamento do dispositivo
 */
export function saveCurrentAccount(session: Session, meta?: { name?: string; role?: string; avatarUrl?: string }) {
  if (typeof window === "undefined" || !session?.user?.id) return;

  const current = getSavedAccounts();
  const index = current.findIndex((a) => a.id === session.user.id);

  const accountData: SavedAccount = {
    id: session.user.id,
    email: session.user.email || "",
    name: meta?.name || (session.user.user_metadata as any)?.name || (session.user.user_metadata as any)?.full_name || session.user.email?.split("@")[0] || "Usuário",
    role: meta?.role || (session.user.user_metadata as any)?.role || "Instrutor",
    avatarUrl: meta?.avatarUrl || (session.user.user_metadata as any)?.avatar_url,
    session: {
      access_token: session.access_token,
      refresh_token: session.refresh_token,
    },
    lastActiveAt: Date.now(),
  };

  let updated: SavedAccount[];
  if (index >= 0) {
    updated = [...current];
    updated[index] = { ...updated[index], ...accountData };
  } else {
    updated = [accountData, ...current];
  }

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  } catch (err) {
    console.warn("[MultiAccount] Erro ao salvar conta:", err);
  }
}

/**
 * Alterna para uma conta salva com 1 clique usando o refresh_token
 */
export async function switchToAccount(accountId: string): Promise<boolean> {
  const accounts = getSavedAccounts();
  const target = accounts.find((a) => a.id === accountId);
  if (!target) return false;

  try {
    const { data, error } = await supabase.auth.setSession({
      access_token: target.session.access_token,
      refresh_token: target.session.refresh_token,
    });

    if (error || !data.session) {
      // Se os tokens expiraram, tenta refresh
      const { data: refreshData, error: refreshError } = await supabase.auth.refreshSession({
        refresh_token: target.session.refresh_token,
      });
      if (refreshError || !refreshData.session) {
        removeSavedAccount(accountId);
        return false;
      }
      saveCurrentAccount(refreshData.session, { name: target.name, role: target.role });
      window.location.reload();
      return true;
    }

    saveCurrentAccount(data.session, { name: target.name, role: target.role });
    window.location.reload();
    return true;
  } catch (err) {
    console.warn("[MultiAccount] Erro ao alternar conta:", err);
    return false;
  }
}

/**
 * Remove uma conta salva do dispositivo
 */
export function removeSavedAccount(accountId: string) {
  if (typeof window === "undefined") return;
  const current = getSavedAccounts();
  const updated = current.filter((a) => a.id !== accountId);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
}

/**
 * Prepara o app para adicionar uma segunda conta sem perder a sessão da primeira
 */
export async function prepareAddNewAccount() {
  // 1. Garante que a sessão atual está salva antes de deslogar temporariamente
  const { data } = await supabase.auth.getSession();
  if (data?.session) {
    saveCurrentAccount(data.session);
  }

  // 2. Desloga apenas para abrir a tela de login
  await supabase.auth.signOut();
  window.location.href = "/auth";
}
