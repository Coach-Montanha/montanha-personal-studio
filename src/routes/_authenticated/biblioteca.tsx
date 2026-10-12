import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/_authenticated/biblioteca")({
  beforeLoad: () => {
    throw redirect({ to: "/personal-trainer/biblioteca" });
  },
  component: () => null,
});
