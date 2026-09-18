# Corrigir três falhas monitoradas

## Objetivo
Validar e corrigir, somente quando confirmados, os três alertas: edição de trancamento PT, números financeiros do Studio e mensagem de check-in em dupla.

## Implementação
- Ligar o estado de edição do trancamento ao diálogo já existente na página do aluno PT.
- Substituir qualquer valor financeiro demonstrativo por dados reais já calculados; se o bloco não puder representar dados reais com segurança, removê-lo.
- Ajustar a mensagem de WhatsApp para considerar o saldo restante real e preservar o caso de check-in em dupla sem débito.
- Validar os arquivos alterados e o comportamento relevante.
- Marcar cada alerta confirmado como corrigido no monitoramento.

## Limites
- Sem mudanças visuais ou funcionais fora desses três fluxos.
- Sem alterações no banco de dados.
