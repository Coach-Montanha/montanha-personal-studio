import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/_authenticated/treino")({
  beforeLoad: () => {
    throw redirect({ to: "/portal/pt/treino" });
  },
  component: () => null,
});
