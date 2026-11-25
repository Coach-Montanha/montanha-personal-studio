# Pontos de Restauração — Montanha Personal Studio

Registro oficial de checkpoints estáveis do repositório para rollback seguro.

## `checkpoint-pre-ajuste-alunos-2026-11-25`
- **Data/Hora**: 2026-11-25 20:16 (-03:00)
- **Commit Base**: `b7cadd1` (`feat(treinos): visibilidade de alunos com treinos vinculados e protecao contra sobrescrita`)
- **Tag Git**: `checkpoint-pre-ajuste-alunos-2026-11-25` (sincronizada em `origin`)
- **Motivo**: Estado estável com todas as funcionalidades atuais operando normalmente antes dos ajustes nos registros dos alunos (Studio / Personal) e vinculação de treinos.
- **Como restaurar (caso necessário)**:
  ```bash
  git checkout checkpoint-pre-ajuste-alunos-2026-11-25
  # ou para criar uma branch a partir deste ponto:
  git checkout -b restore/pre-ajuste-alunos checkpoint-pre-ajuste-alunos-2026-11-25
  ```
