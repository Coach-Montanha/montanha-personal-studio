# Original User Request

## Initial Request — 2026-09-23T23:50:39Z

Requested team: Equipe completa (Full team)

Sistema de saldo de check-ins bônus vinculado diretamente ao perfil do aluno (independente de planos contratados), permitindo ao gestor conceder créditos extras (ex: sorteios, promoções), transferir saldo entre alunos pelo painel administrativo, e ao aluno decidir via modal no portal se deseja utilizar seu check-in bônus para garantir a vaga na aula.

Working directory: C:\Users\Administrator\Documents\Projetos\Montanha Personal Studio
Integrity mode: development

## Requirements

### R1. Saldo e Concessão de Check-ins Bônus no Perfil do Aluno
O gestor/coach deve poder adicionar, visualizar e gerenciar um saldo de check-ins bônus diretamente na ficha/perfil do aluno, desvinculado de planos ou pagamentos mensais. O saldo de bônus deve ser cumulativo e não possuir prazo de expiração automático, permanecendo ativo até o consumo efetivo ou transferência.

### R2. Transferência Administrativa de Bônus Entre Alunos
O gestor/coach deve ter uma ação dedicada no painel administrativo para repassar/transferir uma quantidade X de check-ins bônus de um aluno de origem para outro aluno de destino selecionado, atualizando os saldos e registrando a operação.

### R3. Modal Interativo de Decisão no Portal do Aluno
Ao agendar ou fazer check-in em uma aula/turma pelo portal do aluno, se o aluno possuir saldo de check-ins bônus disponível, o sistema deve exibir um modal interativo e transparente perguntando se ele deseja utilizar 1 check-in de bônus para reservar a vaga (ou prosseguir com a cota regular de seu plano, caso possua e esteja disponível).

### R4. Débito Seguro de Vaga e Estorno em Cancelamento
Ao confirmar o agendamento com bônus, o sistema deve debitar exatamente 1 crédito do saldo de bônus do aluno e garantir a reserva na turma respeitando a capacidade máxima. Caso o aluno cancele o agendamento dentro da janela permitida de cancelamento, o crédito bônus utilizado deve ser automaticamente restituído ao seu saldo.

### R5. Visibilidade do Saldo de Bônus para o Aluno
O aluno deve conseguir visualizar seu saldo atual de check-ins bônus de forma clara e destacada no seu painel/perfil do portal, sabendo quantos créditos possui disponíveis para agendamentos.

## Acceptance Criteria

### Gestão e Saldo (Painel do Studio)
- [ ] O perfil do aluno exibe o saldo atual de check-ins bônus disponíveis.
- [ ] O gestor consegue creditar ou ajustar a quantidade de check-ins bônus de um aluno com confirmação visual e atualização em tempo real.
- [ ] A ferramenta de transferência permite selecionar o aluno destinatário, informar a quantidade a transferir e aplicar a operação, debitando a origem e creditando o destino sem inconsistências.

### Fluxo de Reserva no Portal do Aluno
- [ ] Quando um aluno com saldo bônus clica para reservar uma aula, o modal de confirmação de uso de bônus é exibido com detalhes da aula e saldo restante.
- [ ] Se o aluno confirmar o uso do bônus, a vaga é reservada na sessão e o saldo bônus do aluno é decrementado em 1.
- [ ] Se o aluno optar por não usar o bônus (ou cancelar a ação), o agendamento só procede se a cota do plano vigente permitir, sem debitar o saldo de bônus.
- [ ] Aluno sem plano ativo mas com saldo bônus consegue agendar a aula utilizando seu bônus.
- [ ] O cancelamento do check-in dentro da janela permitida estorna o bônus consumido de volta para o saldo do aluno.

### Qualidade de Código e Integridade
- [ ] `bun run build` executa com sucesso com código de saída 0 (zero erros de TypeScript e empacotamento).
- [ ] Nenhum saldo negativo de bônus pode ser gerado no banco de dados em condições concorrentes ou múltiplos cliques.
