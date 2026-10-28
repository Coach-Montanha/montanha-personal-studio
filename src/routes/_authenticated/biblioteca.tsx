import { createFileRoute } from "@tanstack/react-router";
import { useEffect } from "react";

export const Route = createFileRoute("/_authenticated/biblioteca")({
  component: BibliotecaView,
});

function BibliotecaView() {
  useEffect(() => {
    // Redireciona para o cofre com credencial VIP de aluno ativada
    window.location.href = "/materiais?student=1";
  }, []);

  return (
    <div className="flex h-[60vh] flex-col items-center justify-center gap-4 text-center">
      <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
      <p className="text-sm font-medium text-muted-foreground">Abrindo o Cofre de Artigos & E-books do Studio...</p>
    </div>
  );
}
