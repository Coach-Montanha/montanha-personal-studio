# 📋 HANDOVER: Programa de Mobilidade 30 Dias & Cofre de Materiais

Este documento preserva todo o histórico técnico, decisões arquiteturais, arquivos gerados e links públicos do **Programa de Mobilidade 30 Dias** e do **Cofre de Materiais Seguros**, permitindo que qualquer assistente de IA ou desenvolvedor continue o projeto imediatamente.

---

## 1. Resumo do Projeto
- **Objetivo:** Programa diário de mobilidade e liberação miofascial (Foam Roller) de 30 dias para alunos do Coach Montanha e leads externos.
- **Base Técnica:** Extraído e sintetizado de materiais de Kelly Starrett (*Hamstrung*, *Mobility Notes*, *Mobility Glossary*) e Greg Brookes (*9 Foam Roller Exercises*).
- **Formatos:**
  1. **Web App Interativo:** Mobile-first, checklist com `localStorage`, timers de 60s/90s, links do YouTube para execução e botão de download do PDF.
  2. **PDF Interativo:** Fundo branco limpo, logo escuro vetorizado na capa, contracapa com Instagram (`@coachmontanha1`) e e-mail (`albertosarly@hotmail.com`), 43 links clicáveis e 30 caixas AcroForm (`/Btn` com streams `/AP`).

---

## 2. Arquitetura de Segurança: Cofre de Materiais (`/materiais/`)
- **Localização:** `Montanha Personal Studio/public/materiais/`
- **Isolamento Total:** Arquivos puramente estáticos servidos pela Edge CDN da Vercel. Não tocam no Supabase, não utilizam cookies de autenticação e não possuem ligação visível no menu principal do app.
- **Anti-Varredura:** A rota raiz `/materiais/` possui proteção contra indexação de busca (`noindex`) e redireciona automaticamente para a home `/`, impedindo que pessoas externas descubram outros arquivos.
- **Regra de Domínio Vercel:** **NUNCA usar `www.`** em domínios `.vercel.app`. Os certificados SSL wildcard só cobrem 3º nível (`*.vercel.app`). Com `www.` ocorre o erro `NET::ERR_CERT_COMMON_NAME_INVALID`.

---

## 3. URLs Oficiais de Produção (Ativas com HTTP 200)
- 🌐 **Web App do Aluno:** `https://montanha-personal-studio.vercel.app/materiais/mobilidade`
- 📄 **Download do PDF:** `https://montanha-personal-studio.vercel.app/materiais/mobilidade/Programa_Mobilidade_30_Dias_Coach_Montanha_Clean.pdf`
- 🔒 **Barreira de Proteção:** `https://montanha-personal-studio.vercel.app/materiais` (Redirecionamento seguro)

---

## 4. Localização dos Arquivos no Computador

### Montanha Personal Studio:
- Pasta do Cofre: `C:\Users\Administrator\Documents\Projetos\Ecossistema Montanha\Montanha Personal Studio\public\materiais`
- Web App: `C:\Users\Administrator\Documents\Projetos\Ecossistema Montanha\Montanha Personal Studio\public\materiais\mobilidade\index.html`
- PDF: `C:\Users\Administrator\Documents\Projetos\Ecossistema Montanha\Montanha Personal Studio\public\materiais\mobilidade\Programa_Mobilidade_30_Dias_Coach_Montanha_Clean.pdf`

### Montanha Hybrid Training (Espelho):
- Pasta do Cofre: `C:\Users\Administrator\Documents\Projetos\Ecossistema Montanha\Montanha Hybrid Training\public\materiais`

### Scripts Geradores (Mail Conection):
- Gerador do PDF Interativo: `C:\Users\Administrator\Documents\Projetos\Mail Conection\generate_interactive_pdf.py`
- Construtor do Web App: `C:\Users\Administrator\Documents\Projetos\Mail Conection\build_mobilidade_site.py`

---

## 5. Como Adicionar Novos Materiais
1. **Novo PDF:** Salve em `public/materiais/nome-do-arquivo.pdf`.
   - URL: `https://montanha-personal-studio.vercel.app/materiais/nome-do-arquivo.pdf`
2. **Novo Web App:** Crie `public/materiais/nome-do-guia/index.html`.
   - URL: `https://montanha-personal-studio.vercel.app/materiais/nome-do-guia`
3. **Deploy:** `git add .`, commit e `git push origin main`.
