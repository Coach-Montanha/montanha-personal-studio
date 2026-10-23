import { Capacitor } from "@capacitor/core";
import { LocalNotifications } from "@capacitor/local-notifications";

export const isNativeApp = () => Capacitor.isNativePlatform();

/**
 * Cria canal de notificação com alta prioridade no Android (som, vibração e banner na barra de status)
 */
export async function setupNativeNotificationChannel() {
  if (!isNativeApp()) return;
  try {
    await LocalNotifications.createChannel({
      id: "studio_alerts",
      name: "Alertas do Studio",
      description: "Notificações em tempo real de novos check-ins e avisos de turmas",
      importance: 5, // High importance (heads-up notification)
      visibility: 1, // Public on lock screen
      sound: "default",
      vibration: true,
      lights: true,
      lightColor: "#2563EB",
    });
  } catch (err) {
    console.warn("[LocalNotifications] Falha ao criar canal Android:", err);
  }
}

/**
 * Checa o estado da permissão de notificação (granted, denied, prompt)
 */
export async function checkNotificationPermissionStatus(): Promise<"granted" | "denied" | "prompt"> {
  if (isNativeApp()) {
    try {
      const status = await LocalNotifications.checkPermissions();
      return status.display;
    } catch {
      return "prompt";
    }
  }

  if (typeof window !== "undefined" && "Notification" in window) {
    return Notification.permission as "granted" | "denied" | "prompt";
  }

  return "prompt";
}

/**
 * Solicita permissão de notificação (Nativo Android/iOS ou Navegador Web)
 */
export async function requestNotificationPermissions(): Promise<boolean> {
  if (isNativeApp()) {
    try {
      const status = await LocalNotifications.checkPermissions();
      if (status.display === "granted") {
        await setupNativeNotificationChannel();
        return true;
      }

      const request = await LocalNotifications.requestPermissions();
      const granted = request.display === "granted";
      if (granted) {
        await setupNativeNotificationChannel();
      }
      return granted;
    } catch (err) {
      console.warn("[LocalNotifications] Erro ao solicitar permissões nativas:", err);
      return false;
    }
  }

  // Web Browser fallback
  if (typeof window !== "undefined" && "Notification" in window) {
    if (Notification.permission === "granted") return true;
    try {
      const perm = await Notification.requestPermission();
      return perm === "granted";
    } catch {
      return false;
    }
  }

  return false;
}

/**
 * Agenda lembrete de aula gerenciado pelo sistema operacional (AlarmManager nativo do Android).
 * Dispara com som e vibração mesmo se o app estiver fechado e a tela bloqueada.
 */
export async function scheduleClassReminderNotification({
  id,
  title,
  body,
  triggerAt,
  url = "/agenda",
}: {
  id: number;
  title: string;
  body: string;
  triggerAt: Date;
  url?: string;
}) {
  if (triggerAt.getTime() <= Date.now()) return;

  if (isNativeApp()) {
    try {
      await setupNativeNotificationChannel();
      await LocalNotifications.schedule({
        notifications: [
          {
            id,
            title,
            body,
            channelId: "studio_alerts",
            extra: { url },
            schedule: { at: triggerAt, allowWhileIdle: true },
          },
        ],
      });
    } catch (err) {
      console.warn("[LocalNotifications] Falha ao agendar alarme pré-aula:", err);
    }
  }
}

/**
 * Dispara notificação imediata com som e banner no Android/iOS ou Web
 */
export async function triggerDeviceNotification({
  title,
  body,
  url = "/agenda",
}: {
  title: string;
  body: string;
  url?: string;
}) {
  // 1. Android / iOS Nativo via Capacitor (disparo instantâneo)
  if (isNativeApp()) {
    try {
      await setupNativeNotificationChannel();
      await LocalNotifications.schedule({
        notifications: [
          {
            id: Math.floor(Math.random() * 2147483647),
            title,
            body,
            channelId: "studio_alerts",
            extra: { url },
          },
        ],
      });
      return;
    } catch (err) {
      console.warn("[LocalNotifications] Falha ao disparar notificação nativa:", err);
    }
  }

  // 2. Web Browser Fallback (Service Worker ou Notification API)
  if (typeof window !== "undefined" && "Notification" in window && Notification.permission === "granted") {
    try {
      if ("serviceWorker" in navigator && navigator.serviceWorker.ready) {
        navigator.serviceWorker.ready.then((reg) => {
          reg.showNotification(title, {
            body,
            icon: "/icon-192.png",
            badge: "/favicon.svg",
            vibrate: [200, 100, 200],
            tag: "studio-alert-" + Date.now(),
            renotify: true,
            data: { url },
          } as any);
        });
      } else {
        new Notification(title, {
          body,
          icon: "/icon-192.png",
        });
      }
    } catch (err) {
      console.warn("[WebNotification] Erro ao disparar notificação web:", err);
    }
  }
}
