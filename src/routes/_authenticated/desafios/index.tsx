import { Trophy } from "lucide-react";
import { PageHeader } from "@/components/ui-kit/PageHeader";
import { createFileRoute } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/_authenticated/desafios")({
  component: DesafiosPage,
});

function DesafiosPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        icon={Trophy}
        eyebrow="Gestão"
        title="Desafios"
        description="Crie e gerencie grupos de desafio para engajar seus alunos."
        actions={
          <Button variant="outline">Criar novo desafio</Button>
        }
      />
      {/* Placeholder content */}
      <div className="p-4 bg-muted rounded-lg">
        <p className="text-muted-foreground">Nenhum desafio criado ainda.</p>
      </div>
    </div>
  );
}
