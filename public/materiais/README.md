# 🔒 Cofre de Recursos e Materiais Públicos Seguros

Este diretório (`public/materiais/`) funciona como o **Hub de Recursos Isolados** do Ecossistema Montanha.

### 🛡️ Princípios de Segurança e Isolamento:
1. **Zero Acesso ao Banco de Dados**: Os arquivos aqui são puramente estáticos e servidos na borda (Edge CDN da Vercel). Não tocam em tabelas de alunos, credenciais ou tokens do Supabase.
2. **Sem Listagem de Diretório**: A raiz `/materiais/` possui proteção contra indexação (`noindex`) e bloqueio de listagem, redirecionando qualquer tentativa de varredura.
3. **Acesso Exclusivo por Link Direto**: Apenas pessoas (alunos ou público externo) que possuírem o link exato conseguem visualizar o arquivo correspondente.
4. **Compatibilidade Mobile Perfeita**: Materiais interativos (como o `/materiais/mobilidade`) funcionam como Web App em qualquer celular sem exigir instalação de aplicativo ou leitor de PDF.

### 📁 Como Adicionar Novos Materiais:
- **Novo PDF**: Coloque o arquivo em `public/materiais/seu-arquivo.pdf`.
  - Link direto: `https://montanha-personal-studio.vercel.app/materiais/seu-arquivo.pdf`
- **Novo Guia Interativo**: Crie uma pasta `public/materiais/nome-do-guia/` com um `index.html`.
  - Link direto: `https://montanha-personal-studio.vercel.app/materiais/nome-do-guia`
