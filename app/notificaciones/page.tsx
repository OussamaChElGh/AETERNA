import { NotificationsPageClient } from "@/components/NotificationsPageClient";

export const metadata = {
  title: "Notificaciones",
  description: "Centro de notificaciones de ANEKTIA",
  robots: { index: false, follow: false }
};

export default function NotificacionesPage() {
  return <NotificationsPageClient />;
}
