import { useEffect, useState } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";

import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";
import { getMyTrainingPortalDataServerFn } from "@/lib/student-access.functions";
import { HevyWorkoutSessionView } from "@/components/pt/HevyWorkoutSessionView";
import { HevyExerciseEvolutionDialog } from "@/components/pt/HevyExerciseEvolutionDialog";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  loadLocalSessionSnapshot,
  type WorkoutSessionRow,
} from "@/lib/workout-session-store";

export const Route = createFileRoute("/_authenticated/portal/pt/sessao/$sessionId")({
  head: () => ({ meta: [{ title: "Treino em andamento" }] }),
  component: WorkoutSessionPage,
});

function WorkoutSessionPage() {
  const { sessionId } = Route.useParams();
  const navigate = useNavigate();
  const qc = useQueryClient();
  const { user, loading: loadingAuth } = useAuth();

  const [progressionOpen, setProgressionOpen] = useState(false);
  const [selectedProgressEx, setSelectedProgressEx] = useState<string | null>(null);
  const [selectedProgressExId, setSelectedProgressExId] = useState<string | null>(null);

  const localSnapshot = loadLocalSessionSnapshot(sessionId);

  const { data: dbSession, isLoading: loadingSession } = useQuery({
    queryKey: ["workout-session", sessionId],
    enabled: !!user?.id,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("workout_sessions" as never)
        .select("*")
        .eq("id", sessionId)
        .maybeSingle();
      if (error && localSnapshot?.session) {
        return localSnapshot.session;
      }
      return (data as WorkoutSessionRow | null) ?? localSnapshot?.session ?? null;
    },
  });

  const activeSession = dbSession ?? localSnapshot?.session ?? null;

  const { data: portalData, isLoading: loadingPortal } = useQuery({
    queryKey: ["pt-portal-server-data", user?.id],
    enabled: !!user?.id,
    queryFn: async () => {
      try {
        return await getMyTrainingPortalDataServerFn();
      } catch {
        return null;
      }
    },
  });

  const routineDayId = activeSession?.routine_day_id;

  const { data: fallbackDayData, isLoading: loadingFallbackDay } = useQuery({
    queryKey: ["workout-session-day-fallback", routineDayId],
    enabled: !!routineDayId && (!portalData?.days || portalData.days.length === 0),
    queryFn: async () => {
      const [{ data: day }, { data: exs }] = await Promise.all([
        supabase
          .from("pt_training_days" as never)
          .select("*")
          .eq("id", routineDayId!)
          .maybeSingle(),
        supabase
          .from("pt_training_exercises" as never)
          .select("*")
          .eq("training_day_id", routineDayId!)
          .order("sort_order", { ascending: true })
          .order("created_at", { ascending: true }),
      ]);
      return { day: day as any, exercises: (exs || []) as any[] };
    },
  });

  const day =
    portalData?.days?.find((d: any) => d.id === routineDayId) ??
    fallbackDayData?.day ??
    null;

  const exercises =
    portalData?.exercises && portalData.exercises.length > 0
      ? portalData.exercises.filter((e: any) => e.training_day_id === routineDayId)
      : fallbackDayData?.exercises ?? [];

  // Se a sessão já foi concluída e o usuário entrou pela URL antiga, volta ao módulo Treino
  useEffect(() => {
    if (activeSession?.status === "concluido") {
      navigate({ to: "/portal/pt/treino", replace: true });
    }
  }, [activeSession?.status, navigate]);

  if (loadingAuth || (!activeSession && loadingSession) || (!day && (loadingPortal || loadingFallbackDay))) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center p-6">
        <div className="flex items-center gap-2.5 text-sm text-muted-foreground">
          <Loader2 className="h-5 w-5 animate-spin text-primary" />
          Carregando seu treino…
        </div>
      </div>
    );
  }

  if (!activeSession || !day || !user?.id) {
    return (
      <Card className="mx-auto mt-8 max-w-md p-6 text-center space-y-3">
        <p className="text-sm font-semibold text-foreground">Sessão de treino não encontrada</p>
        <p className="text-xs text-muted-foreground">
          Volte à lista de treinos para iniciar uma nova sessão.
        </p>
        <Button size="sm" onClick={() => navigate({ to: "/portal/pt/treino", replace: true })}>
          Voltar para Treinos
        </Button>
      </Card>
    );
  }

  return (
    <>
      <HevyWorkoutSessionView
        session={activeSession}
        day={day}
        exercises={exercises}
        userId={user.id}
        studentId={portalData?.student?.id}
        studentName={portalData?.student?.name}
        onBack={() => navigate({ to: "/portal/pt/treino" })}
        onFinished={() => {
          qc.invalidateQueries({ queryKey: ["workout-session", sessionId] });
          qc.invalidateQueries({ queryKey: ["pt-portal-executions"] });
          qc.invalidateQueries({ queryKey: ["pt-portal-server-data"] });
          navigate({ to: "/portal/pt/treino", replace: true });
        }}
        onOpenExerciseEvolution={(ex) => {
          setSelectedProgressEx(ex.name);
          setSelectedProgressExId(ex.id);
          setProgressionOpen(true);
        }}
      />

      {portalData?.student?.id && (
        <HevyExerciseEvolutionDialog
          open={progressionOpen}
          onOpenChange={setProgressionOpen}
          studentId={portalData.student.id}
          initialExerciseName={selectedProgressEx}
          initialExerciseId={selectedProgressExId}
        />
      )}
    </>
  );
}
