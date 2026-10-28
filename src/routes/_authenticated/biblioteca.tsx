import { createFileRoute } from "@tanstack/react-router";
import { useEffect } from "react";

export const Route = createFileRoute("/_authenticated/biblioteca")({
  component: BibliotecaView,
});

function BibliotecaView() {
  useEffect(() => {
    // Redireciona diretamente para o cofre com credencial VIP de aluno ativada
    window.location.replace("/materiais?student=1");
  }, []);

  return (
    <div className="flex h-[70vh] flex-col items-center justify-center gap-4 text-center px-4">
      <div className="h-9 w-9 animate-spin rounded-full border-2 border-primary border-t-transparent" />
      <p className="text-base font-semibold text-foreground">Abrindo o Cofre de Artigos & E-books...</p>
      <a
        href="/materiais?student=1"
        className="mt-2 inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2 text-sm font-bold text-primary-foreground hover:bg-primary/90"
      >
        Acessar Diretamente ➔
      </a>
    </div>
  );
}
