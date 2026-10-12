# Recon Map: MFIT Personal ➔ Montanha Personal Studio
## Módulo: Prescrição & Criador de Treinos

**Alvo:** MFIT Personal (Web / PWA / App)  
**Destino:** Montanha Personal Studio (`/personal-trainer/students/$id` e `/portal/pt/treino`)  
**Data:** 11/10/2026  
**Diretiva:** `/replica` + `/eco` (Ponytail, Zero Bloat, Performance Nativa)

---

### 1. Inventário de Telas e Componentes (MFIT vs. Montanha Studio)

| Tela / Fluxo | Descrição MFIT | Implementação no Studio | Status |
| :--- | :--- | :--- | :--- |
| **S01 — Biblioteca de Exercícios** | 1.135 exercícios com vídeos CDN MP4, categorias musculares e paginação. | `biblioteca.tsx`: 1.135 exercícios oficiais com paginação client-side (24/página), busca e reprodução. | **Completo (100%)** |
| **S02 — Modal de Seleção de Exercícios** | Busca rápida por texto e grupo muscular com multi-seleção ("Adicionar 5 exercícios"). | `AddExerciseDialog.tsx`: Atualmente seleção 1 a 1. Upgrade necessário para multi-seleção em lote e chips de grupos. | **Em Aprimoramento** |
| **S03 — Editor do Dia de Treino** | Listagem reordenável (drag-and-drop), contagem de séries, carga, descanso e observação. | `TrainingDayDetail.tsx` + `ExerciseCard.tsx`: Drag-and-drop com `SortableList`, auto-save em cada campo. | **Parcialmente Completo** |
| **S04 — Presets & Métodos de Treino** | Séries normais, Bi-set / Tri-set agrupados, Drop-set, Pirâmide, Aeróbico com cadência. | Chips rápidos de séries/reps (`3x 10-12`, `4x 8-10`), descanso (`45s`, `60s`, `90s`) e indicação de método. | **Upgrade em Andamento** |
| **S05 — Execução do Aluno (Player)** | Vídeo em loop contínuo, cronômetro de descanso regressivo, registro de carga usada. | `portal/pt/treino.tsx` + `RestCountdownTimer.tsx`: Vídeos MP4 com feedback sonoro/tátil. | **Funcional** |

---

### 2. Fluxo Central do Treinador (Core Loop)

```
[Selecionar Aluno] ──▶ [Criar/Abrir Programa] ──▶ [Adicionar Dia (ex: Treino A)]
                                                             │
[Salvo Instantaneamente] ◀── [Presets de Séries/Descanso] ◀── [Multi-Seleção na Biblioteca (1.135)]
```

---

### 3. Gaps Prioritários Resolvidos Nesta Iteração

1. **Multi-Seleção na Biblioteca (`AddExerciseDialog.tsx`)**: O treinador seleciona múltiplos exercícios de uma vez com badges de grupos musculares e adiciona em lote ao dia de treino sem reabrir o modal.
2. **Carregamento Unificado dos 1.135 Exercícios**: Fallback instantâneo para o catálogo local normalizado com prioridade do cache do Supabase.
3. **Chips de Presets Rápidos no `ExerciseCard.tsx`**: Botões rápidos de 1 clique para `3x10-12`, `4x8-10`, `4x12-15`, `3x Falha` e descansos (`45s`, `60s`, `90s`, `120s`), acelerando a montagem de treinos em 3x.
