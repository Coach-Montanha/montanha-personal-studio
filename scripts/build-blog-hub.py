#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
build-blog-hub.py — Compilador do Hub de Materiais Públicos & 182 Artigos do Coach Montanha
Engenharia reversa e espelhamento fiel do blog original do Systeme.io (coachmontanha1.systeme.io).
"""

import os
import re
import sys
import glob
import json
import math
import shutil
import unicodedata
import markdown
import yaml

if sys.stdout:
    try:
        sys.stdout.reconfigure(encoding='utf-8')
    except Exception:
        pass

ARTICLES_SRC_DIR = r"c:\Users\Administrator\Documents\Projetos\Obsidian-Cofre-Montanha\01-Blog-e-Ebooks\Artigos"
PDFS_SRC_DIR = r"c:\Users\Administrator\Documents\Projetos\Blog do Montanha\PDFs"
DEST_DIR = r"c:\Users\Administrator\Documents\Projetos\Ecossistema Montanha\Montanha Personal Studio\public\materiais"
MIRROR_DIR = r"c:\Users\Administrator\Documents\Projetos\Ecossistema Montanha\Montanha Hybrid Training\public\materiais"

def slugify(text):
    text = unicodedata.normalize('NFKD', text)
    text = text.encode('ascii', 'ignore').decode('utf-8')
    text = re.sub(r'[^\w\s-]', '', text).strip().lower()
    text = re.sub(r'[-\s]+', '-', text)
    return text

def clean_title(raw_title):
    title = re.sub(r'^(ARTIGO\s+\d+\s*[-–—]\s*|\d{3}_ARTIGO_\d+_[-–—]\s*)', '', raw_title, flags=re.IGNORECASE)
    return title.strip()

def infer_category(title, content):
    tc = (title + " " + content[:1000]).lower()
    # Categorias originais do Systeme.io + Especialidades do Studio
    if any(k in tc for k in ["híbrido", "hibrido", "hyrox", "densidade", "emom"]):
        return "Treinamento Híbrido"
    if any(k in tc for k in ["corrida", "maratona", "5k", "15k", "maf", "endurance", "cadência", "pace", "trote"]):
        return "Corrida & Endurance"
    if any(k in tc for k in ["mobilidade", "fáscia", "alongamento", "articulação", "joelho", "lombar", "foam roller", "cócoras"]):
        return "Mobilidade Articular"
    if any(k in tc for k in ["hipertrofia", "musculação", "músculo", "barra fixa", "supino", "agachamento", "força", "hst", "carga"]):
        return "Fitness"
    if any(k in tc for k in ["emagrecer", "emagrecimento", "gordura", "déficit", "calorias", "metabolismo", "ozempic", "fome", "neat", "epoc"]):
        return "Fitness"
    if any(k in tc for k in ["nutrição", "dieta", "proteína", "psyllium", "jejum", "carboidrato", "laticínios", "suplemento", "creatina"]):
        return "Nutrição & Jejum"
    if any(k in tc for k in ["autodisciplina", "disciplina", "hábito", "foco", "rotina", "tempo", "pomodoro", "produtividade"]):
        return "Desenvolvimento Pessoal"
    if any(k in tc for k in ["mente", "mindset", "ansiedade", "medo", "bloqueio", "mentalidade", "autocontrole"]):
        return "Mindset"
    return "Fitness"

def parse_frontmatter_and_body(filepath):
    with open(filepath, 'r', encoding='utf-8', errors='ignore') as f:
        text = f.read()

    meta = {}
    body = text
    if text.startswith('---'):
        parts = text.split('---', 2)
        if len(parts) >= 3:
            raw_meta = parts[1]
            body = parts[2].strip()
            try:
                parsed = yaml.safe_load(raw_meta)
                if isinstance(parsed, dict):
                    meta = parsed
            except Exception:
                for line in raw_meta.split('\n'):
                    if ':' in line and not line.startswith((' ', '\t')):
                        key, val = line.split(':', 1)
                        meta[key.strip()] = val.strip().strip('"').strip("'")

    if 'title' not in meta or not meta['title']:
        m = re.search(r'^#\s+(.+)$', body, flags=re.MULTILINE)
        if m:
            meta['title'] = m.group(1).strip()
        else:
            meta['title'] = os.path.splitext(os.path.basename(filepath))[0]

    meta['clean_title'] = clean_title(str(meta['title']))
    
    slug = slugify(meta['clean_title'])
    if not slug:
        slug = slugify(os.path.splitext(os.path.basename(filepath))[0])
    meta['slug'] = slug

    if 'category' not in meta or not meta['category']:
        meta['category'] = infer_category(meta['clean_title'], body)

    words = len(re.findall(r'\w+', body))
    meta['read_time'] = max(2, math.ceil(words / 140))
    meta['word_count'] = words

    plain = re.sub(r'[#*`_\[\]>]', '', body)
    plain = re.sub(r'\s+', ' ', plain).strip()
    plain = re.sub(r'^(Artigo #\d+.*?Systeme\.io:\s*|\s*)+', '', plain)
    meta['excerpt'] = plain[:150] + ("..." if len(plain) > 150 else "")

    return meta, body

# Common Head com Google Fonts Fira Sans & Montserrat do Systeme.io
COMMON_HEAD = """
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="theme-color" content="#09090b">
  <link rel="icon" type="image/png" href="/materiais/logo_montanha.png">
  
  <!-- Fontes Oficiais do Blog: Fira Sans (Títulos) & Montserrat (Corpo) -->
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Fira+Sans:ital,wght@0,400;0,600;0,700;0,800;1,400;1,700&family=Montserrat:ital,wght@0,300;0,400;0,500;0,600;0,700;1,400;1,600&display=swap" rel="stylesheet">
  
  <style>
    :root {
      --bg: #09090b;
      --card-bg: #141417;
      --card-border: #27272a;
      --card-hover: #1c1c21;
      --text: #f4f4f5;
      --text-muted: #a1a1aa;
      --text-dim: #71717a;
      --primary: #f59e0b;
      --primary-hover: #d97706;
      --primary-soft: rgba(245, 158, 11, 0.12);
      --font-title: 'Fira Sans', sans-serif;
      --font-body: 'Montserrat', sans-serif;
    }
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      background-color: var(--bg);
      color: var(--text);
      font-family: var(--font-body);
      line-height: 1.7;
      -webkit-font-smoothing: antialiased;
      overflow-x: hidden;
    }
    h1, h2, h3, h4, h5, h6 {
      font-family: var(--font-title);
      font-weight: 700;
      color: #ffffff;
      letter-spacing: -0.01em;
    }
    a { color: inherit; text-decoration: none; }
    .container { max-width: 1140px; margin: 0 auto; padding: 0 20px; }
    
    /* Topbar Original do Blog */
    .topbar {
      border-bottom: 1px solid var(--card-border);
      background: rgba(9, 9, 11, 0.95);
      backdrop-filter: blur(14px);
      position: sticky;
      top: 0;
      z-index: 50;
    }
    .topbar-inner {
      display: flex;
      align-items: center;
      justify-content: space-between;
      height: 72px;
    }
    .brand {
      display: flex;
      align-items: center;
      gap: 12px;
      font-family: var(--font-title);
      font-weight: 800;
      font-size: 18px;
      letter-spacing: -0.02em;
    }
    .brand img {
      width: 44px;
      height: 44px;
      object-fit: contain;
    }
    
    /* Menu Central do Blog Original */
    .nav-menu {
      display: flex;
      align-items: center;
      gap: 20px;
    }
    .nav-menu a {
      font-size: 14px;
      font-weight: 600;
      color: var(--text-muted);
      transition: color 0.2s;
    }
    .nav-menu a:hover {
      color: var(--primary);
    }
    @media (max-width: 900px) {
      .nav-menu { display: none; }
    }

    .topbar-actions {
      display: flex;
      align-items: center;
      gap: 12px;
    }
    .social-icons-top {
      display: flex;
      align-items: center;
      gap: 10px;
      margin-right: 6px;
    }
    .social-icons-top a {
      color: var(--text-muted);
      font-size: 15px;
      transition: color 0.2s;
    }
    .social-icons-top a:hover { color: var(--primary); }
    
    .btn {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 6px;
      padding: 8px 16px;
      border-radius: 8px;
      font-size: 13px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.2s ease;
      border: 1px solid transparent;
      font-family: var(--font-title);
    }
    .btn-primary {
      background: var(--primary);
      color: #000;
      font-weight: 700;
    }
    .btn-primary:hover {
      background: var(--primary-hover);
    }
    .btn-outline {
      background: transparent;
      border-color: var(--card-border);
      color: var(--text);
    }
    .btn-outline:hover {
      background: var(--card-border);
    }
    .btn-vip {
      background: rgba(16, 185, 129, 0.15);
      border-color: rgba(16, 185, 129, 0.3);
      color: #34d399;
      font-weight: 700;
    }
    
    /* Banners */
    .banner-vip {
      background: linear-gradient(90deg, rgba(16, 185, 129, 0.18), rgba(16, 185, 129, 0.06));
      border-bottom: 1px solid rgba(16, 185, 129, 0.3);
      padding: 10px 0;
      font-size: 13px;
      text-align: center;
      color: #6ee7b7;
      display: none;
    }
    .banner-visitor {
      background: linear-gradient(90deg, rgba(245, 158, 11, 0.12), rgba(245, 158, 11, 0.02));
      border-bottom: 1px solid rgba(245, 158, 11, 0.25);
      padding: 10px 0;
      font-size: 13px;
      text-align: center;
      color: #fcd34d;
    }

    /* Rodapé Oficial de 4 Colunas */
    .blog-footer {
      border-top: 1px solid var(--card-border);
      background: #0d0d10;
      padding: 60px 0 30px 0;
      margin-top: 80px;
    }
    .footer-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
      gap: 36px;
      margin-bottom: 40px;
    }
    .footer-col h4 {
      font-size: 14px;
      text-transform: uppercase;
      letter-spacing: 0.08em;
      color: var(--primary);
      margin-bottom: 18px;
    }
    .footer-col ul {
      list-style: none;
    }
    .footer-col li {
      margin-bottom: 10px;
    }
    .footer-col a {
      font-size: 13.5px;
      color: var(--text-muted);
      transition: color 0.2s;
    }
    .footer-col a:hover {
      color: #fff;
    }
    .footer-newsletter p {
      font-size: 13px;
      color: var(--text-muted);
      margin-bottom: 14px;
      line-height: 1.5;
    }
    .footer-input {
      width: 100%;
      background: #18181b;
      border: 1px solid #3f3f46;
      border-radius: 8px;
      padding: 10px 12px;
      color: #fff;
      font-size: 13px;
      margin-bottom: 10px;
      outline: none;
    }
    .footer-input:focus { border-color: var(--primary); }
    .footer-bottom {
      border-top: 1px solid var(--card-border);
      padding-top: 24px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      flex-wrap: wrap;
      gap: 12px;
      font-size: 12.5px;
      color: var(--text-dim);
    }

    /* Modal de Lead */
    .modal-backdrop {
      position: fixed;
      inset: 0;
      background: rgba(0, 0, 0, 0.85);
      backdrop-filter: blur(8px);
      z-index: 100;
      display: none;
      align-items: center;
      justify-content: center;
      padding: 20px;
    }
    .modal-box {
      background: #18181b;
      border: 1px solid #3f3f46;
      border-radius: 14px;
      max-width: 440px;
      width: 100%;
      padding: 28px;
      position: relative;
      box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.7);
    }
    .modal-close {
      position: absolute;
      top: 16px;
      right: 16px;
      background: transparent;
      border: none;
      color: var(--text-muted);
      font-size: 20px;
      cursor: pointer;
    }
    .modal-input {
      width: 100%;
      background: #09090b;
      border: 1px solid #3f3f46;
      padding: 12px 14px;
      border-radius: 8px;
      color: #fff;
      font-size: 14px;
      margin-bottom: 12px;
      outline: none;
    }
    .modal-input:focus { border-color: var(--primary); }
  </style>
"""

STUDENT_DETECTION_SCRIPT = """
<script>
  (function() {
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('student') === '1') {
      localStorage.setItem('montanha_is_student', '1');
    }
    const isStudent = localStorage.getItem('montanha_is_student') === '1';
    window.IS_STUDENT = isStudent;
    
    document.addEventListener('DOMContentLoaded', function() {
      if (isStudent) {
        const vipBanners = document.querySelectorAll('.banner-vip');
        const visitorBanners = document.querySelectorAll('.banner-visitor');
        vipBanners.forEach(b => b.style.display = 'block');
        visitorBanners.forEach(b => b.style.display = 'none');
        
        const loginBtns = document.querySelectorAll('.btn-login-action');
        loginBtns.forEach(btn => {
          btn.textContent = '← Voltar ao Studio';
          btn.href = '/portal';
          btn.classList.remove('btn-outline');
          btn.classList.add('btn-vip');
        });
      }
    });
  })();
</script>
"""

def generate_hub_html(articles, ebooks):
    categories = [
        "Todas",
        "Fitness",
        "Desenvolvimento Pessoal",
        "Mindset",
        "Treinamento Híbrido",
        "Corrida & Endurance",
        "Mobilidade Articular",
        "Nutrição & Jejum"
    ]

    cat_pills = "".join([f'<button class="cat-pill {"active" if i == 0 else ""}" data-category="{c}">{c}</button>' for i, c in enumerate(categories)])

    # Ebook cards
    ebook_cards_html = ""
    for eb in ebooks:
        badge_class = "badge-app" if eb.get("type") == "app" else "badge-pdf"
        badge_text = "Web App Interativo" if eb.get("type") == "app" else "PDF AcroForm"
        if eb.get("type") == "app":
            action_btn = f'<a href="{eb["url"]}" class="btn btn-primary" style="width:100%; text-align:center;">Abrir Web App ➔</a>'
        else:
            action_btn = f'<button onclick="handleDownloadEbook(\'{eb["title"]}\', \'{eb["url"]}\')" class="btn btn-outline" style="width:100%;">Baixar PDF Oficial ⬇</button>'

        ebook_cards_html += f"""
        <div class="ebook-card">
          <div class="card-top">
            <span class="badge {badge_class}">{badge_text}</span>
            <span class="meta-tag">{eb.get("category", "Programa Oficial")}</span>
          </div>
          <h3 class="card-title">{eb["title"]}</h3>
          <p class="card-desc">{eb["desc"]}</p>
          <div class="card-footer">
            {action_btn}
          </div>
        </div>
        """

    # Article cards
    article_cards_html = ""
    for a in articles:
        article_cards_html += f"""
        <a href="/materiais/artigos/{a['slug']}" class="article-card" data-category="{a['category']}" data-title="{a['clean_title'].lower()}" data-excerpt="{a['excerpt'].lower()}">
          <div class="card-top">
            <span class="badge badge-artigo">{a['category']}</span>
            <span class="meta-tag">{a['read_time']} min de leitura</span>
          </div>
          <h3 class="card-title">{a['clean_title']}</h3>
          <p class="card-desc">{a['excerpt']}</p>
          <div class="card-footer">
            <span class="read-link">Ler artigo completo ➔</span>
          </div>
        </a>
        """

    html = f"""<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <title>Blog do Montanha • Artigos, E-books & Protocolos Oficiais</title>
  <meta name="description" content="Acesse todos os 182 artigos do blog, e-books e protocolos interativos do Coach Montanha. Fitness, força, corrida em Zona 2, desenvolvimento pessoal e mindset.">
  <meta property="og:title" content="Blog do Montanha • Artigos, E-books & Protocolos Oficiais">
  <meta property="og:description" content="O acervo oficial do Coach Montanha: artigos publicados, e-books e ferramentas interativas.">
  <meta property="og:image" content="https://montanha-personal-studio.vercel.app/materiais/logo_montanha.png">
  <meta property="og:type" content="website">
  <meta property="og:url" content="https://montanha-personal-studio.vercel.app/materiais">
  {COMMON_HEAD}
  {STUDENT_DETECTION_SCRIPT}
  <style>
    .hero-section {{
      padding: 56px 0 36px 0;
      text-align: center;
      border-bottom: 1px solid var(--card-border);
      background: radial-gradient(circle at 50% 0%, rgba(245, 158, 11, 0.09) 0%, transparent 70%);
    }}
    .hero-badge {{
      display: inline-flex;
      align-items: center;
      gap: 6px;
      font-size: 11.5px;
      text-transform: uppercase;
      letter-spacing: 0.1em;
      font-weight: 700;
      color: var(--primary);
      background: var(--primary-soft);
      border: 1px solid rgba(245, 158, 11, 0.25);
      padding: 4px 14px;
      border-radius: 9999px;
      margin-bottom: 16px;
      font-family: var(--font-title);
    }}
    .hero-title {{
      font-size: 42px;
      font-weight: 800;
      margin-bottom: 14px;
      color: #fff;
      line-height: 1.15;
    }}
    .hero-subtitle {{
      font-size: 16.5px;
      color: var(--text-muted);
      max-width: 720px;
      margin: 0 auto;
    }}
    
    .controls-wrap {{
      margin: 36px 0 28px 0;
      display: flex;
      flex-direction: column;
      gap: 16px;
    }}
    .search-input-wrap {{
      position: relative;
      width: 100%;
    }}
    .search-input {{
      width: 100%;
      background: var(--card-bg);
      border: 1px solid var(--card-border);
      border-radius: 12px;
      padding: 16px 20px 16px 46px;
      color: #fff;
      font-size: 15px;
      outline: none;
      font-family: var(--font-body);
      transition: border-color 0.2s;
    }}
    .search-input:focus {{ border-color: var(--primary); }}
    .search-icon {{
      position: absolute;
      left: 18px;
      top: 50%;
      transform: translateY(-50%);
      color: var(--text-dim);
      font-size: 18px;
    }}
    .cat-scroll {{
      display: flex;
      gap: 8px;
      overflow-x: auto;
      padding-bottom: 6px;
      scrollbar-width: none;
    }}
    .cat-scroll::-webkit-scrollbar {{ display: none; }}
    .cat-pill {{
      background: var(--card-bg);
      border: 1px solid var(--card-border);
      color: var(--text-muted);
      padding: 8px 16px;
      border-radius: 9999px;
      font-size: 13px;
      font-weight: 600;
      white-space: nowrap;
      cursor: pointer;
      font-family: var(--font-title);
      transition: all 0.2s;
    }}
    .cat-pill:hover {{ color: #fff; border-color: #3f3f46; }}
    .cat-pill.active {{
      background: var(--primary);
      color: #000;
      border-color: var(--primary);
      font-weight: 800;
    }}
    
    .section-tabs {{
      display: flex;
      border-bottom: 1px solid var(--card-border);
      margin-bottom: 32px;
      gap: 28px;
    }}
    .tab-btn {{
      background: transparent;
      border: none;
      color: var(--text-dim);
      font-size: 16px;
      font-weight: 700;
      font-family: var(--font-title);
      padding: 14px 0;
      cursor: pointer;
      position: relative;
      transition: color 0.2s;
    }}
    .tab-btn:hover {{ color: var(--text); }}
    .tab-btn.active {{ color: var(--primary); }}
    .tab-btn.active::after {{
      content: '';
      position: absolute;
      bottom: -1px;
      left: 0;
      right: 0;
      height: 3px;
      background: var(--primary);
      border-radius: 3px 3px 0 0;
    }}
    
    .cards-grid {{
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
      gap: 22px;
      margin-bottom: 60px;
    }}
    .article-card, .ebook-card {{
      background: var(--card-bg);
      border: 1px solid var(--card-border);
      border-radius: 12px;
      padding: 24px;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      transition: transform 0.2s, border-color 0.2s, box-shadow 0.2s;
    }}
    .article-card:hover, .ebook-card:hover {{
      transform: translateY(-3px);
      border-color: #3f3f46;
      box-shadow: 0 12px 24px -10px rgba(0, 0, 0, 0.6);
    }}
    .card-top {{
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 14px;
    }}
    .badge {{
      font-size: 11px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.06em;
      padding: 4px 9px;
      border-radius: 6px;
      font-family: var(--font-title);
    }}
    .badge-artigo {{ background: #27272a; color: #a1a1aa; }}
    .badge-app {{ background: rgba(245, 158, 11, 0.2); color: #fbbf24; }}
    .badge-pdf {{ background: rgba(59, 130, 246, 0.2); color: #60a5fa; }}
    .meta-tag {{ font-size: 12px; color: var(--text-dim); }}
    .card-title {{
      font-size: 18px;
      font-weight: 700;
      color: #fff;
      line-height: 1.35;
      margin-bottom: 10px;
    }}
    .card-desc {{
      font-size: 13.5px;
      color: var(--text-muted);
      line-height: 1.55;
      margin-bottom: 20px;
      flex-grow: 1;
    }}
    .card-footer {{
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding-top: 14px;
      border-top: 1px solid rgba(255, 255, 255, 0.06);
    }}
    .read-link {{
      font-size: 13px;
      font-weight: 700;
      color: var(--primary);
      font-family: var(--font-title);
    }}
  </style>
</head>
<body>

  <!-- Banners de Reconhecimento -->
  <div class="banner-vip">
    <div class="container">
      <strong>✅ Área do Aluno Conectada:</strong> Acesso irrestrito a todos os e-books e protocolos com download imediato em 1 toque.
    </div>
  </div>
  
  <div class="banner-visitor">
    <div class="container">
      Acesso aberto aos artigos e e-books oficiais do <strong>Coach Montanha</strong>. Alunos do Studio têm acesso integrado no app.
    </div>
  </div>

  <!-- Barra Superior Original do Blog -->
  <header class="topbar">
    <div class="container topbar-inner">
      <div class="brand">
        <a href="/materiais" style="display:flex; align-items:center; gap:12px;">
          <img src="/materiais/logo_montanha.png" alt="Coach Montanha">
          <span>COACH MONTANHA</span>
        </a>
      </div>

      <!-- Links do Menu Original -->
      <nav class="nav-menu">
        <a href="/materiais">Início</a>
        <a href="#artigosSection">Meus Artigos</a>
        <a href="#ebooksSection">Livros/Ebooks</a>
        <a href="https://wa.me/5511999999999?text=Ol%C3%A1%20Coach%20Montanha,%20quero%20conhecer%20os%20Cursos%20Online" target="_blank">Cursos Online</a>
        <a href="https://coachmontanha1.systeme.io/amazon" target="_blank">Links Amazon</a>
        <a href="https://wa.me/5511999999999?text=Ol%C3%A1%20Coach%20Montanha,%20vim%20pelo%20Blog%20e%20gostaria%20de%20falar%20com%20voc%C3%AA" target="_blank">Contato</a>
      </nav>

      <div class="topbar-actions">
        <!-- Ícones Sociais -->
        <div class="social-icons-top">
          <a href="https://www.instagram.com/coachmontanha1/" target="_blank" title="Instagram">📸</a>
          <a href="https://www.youtube.com/channel/UCy29z1eRp_GPFAVFHJfmg_A" target="_blank" title="YouTube">📺</a>
          <a href="https://twitter.com/coachmontanha1" target="_blank" title="Twitter/X">🐦</a>
          <a href="https://www.facebook.com/albertosarly.coutinho" target="_blank" title="Facebook">📘</a>
        </div>
        <a href="/portal" class="btn btn-outline btn-login-action">Entrar no Studio</a>
      </div>
    </div>
  </header>

  <!-- Hero Section -->
  <section class="hero-section">
    <div class="container">
      <span class="hero-badge">Acervo Oficial de Treinamento & Artigos</span>
      <h1 class="hero-title">Blog do Montanha</h1>
      <p class="hero-subtitle">
        182 artigos sobre treinamento de força, corrida em Zona 2, emagrecimento sustentável, desenvolvimento pessoal e mentalidade, além de e-books e web apps interativos.
      </p>
    </div>
  </section>

  <!-- Main Catalog -->
  <main class="container">
    <div class="controls-wrap">
      <div class="search-input-wrap">
        <span class="search-icon">🔍</span>
        <input type="text" id="searchInput" class="search-input" placeholder="Buscar por tema (ex: remo, barra fixa, corrida, neat, epoc, jejum, sono)...">
      </div>
      
      <div class="cat-scroll">
        {cat_pills}
      </div>
    </div>

    <!-- Abas -->
    <div class="section-tabs">
      <button class="tab-btn active" data-tab="todos">Todos os Conteúdos ({len(articles) + len(ebooks)})</button>
      <button class="tab-btn" data-tab="artigos">Meus Artigos ({len(articles)})</button>
      <button class="tab-btn" data-tab="ebooks">Livros & E-books ({len(ebooks)})</button>
    </div>

    <!-- Grid de E-books -->
    <div id="ebooksSection" class="tab-section">
      <h2 style="font-size:22px; font-weight:700; margin-bottom:20px; color:#fff;">Livros, E-books & Protocolos Interativos</h2>
      <div class="cards-grid">
        {ebook_cards_html}
      </div>
    </div>

    <!-- Grid de Artigos -->
    <div id="articlesSection" class="tab-section">
      <h2 style="font-size:22px; font-weight:700; margin-bottom:20px; color:#fff;">Artigos Publicados</h2>
      <div id="articlesGrid" class="cards-grid">
        {article_cards_html}
      </div>
    </div>
  </main>

  <!-- Modal de Captura de Lead para E-books -->
  <div id="leadModal" class="modal-backdrop">
    <div class="modal-box">
      <button class="modal-close" onclick="closeLeadModal()">✕</button>
      <div style="font-size:28px; margin-bottom:12px;">📥</div>
      <h3 style="font-size:18px; font-weight:800; color:#fff; margin-bottom:8px; font-family:var(--font-title);">Baixar Material Oficial</h3>
      <p style="font-size:13.5px; color:var(--text-muted); margin-bottom:20px;">
        Informe seu nome e WhatsApp para receber o download e atualizações do Coach Montanha.
      </p>
      <form id="leadForm" onsubmit="submitLead(event)">
        <input type="text" id="leadName" class="modal-input" placeholder="Seu Nome Completo" required>
        <input type="tel" id="leadPhone" class="modal-input" placeholder="Seu WhatsApp com DDD (ex: 11 99999-9999)" required>
        <button type="submit" class="btn btn-primary" style="width:100%; padding:12px; font-size:14px; margin-bottom:12px;">Liberar Download Imediato ⬇</button>
      </form>
      <div style="text-align:center;">
        <button onclick="bypassLead()" style="background:none; border:none; color:var(--text-dim); font-size:12px; cursor:pointer; text-decoration:underline;">
          Já sou aluno do Studio (Baixar sem preencher)
        </button>
      </div>
    </div>
  </div>

  <!-- Rodapé Oficial de 4 Colunas do Blog Original -->
  <footer class="blog-footer">
    <div class="container">
      <div class="footer-grid">
        <!-- Coluna 1 -->
        <div class="footer-col">
          <h4>LINKS RÁPIDOS</h4>
          <ul>
            <li><a href="/materiais">Início</a></li>
            <li><a href="#artigosSection">Meus Artigos</a></li>
            <li><a href="#ebooksSection">Livros/Ebooks</a></li>
            <li><a href="https://wa.me/5511999999999?text=Ol%C3%A1%20Coach%20Montanha,%20quero%20conhecer%20os%20Cursos%20Online" target="_blank">Cursos Online</a></li>
            <li><a href="https://coachmontanha1.systeme.io/amazon" target="_blank">Links Amazon</a></li>
            <li><a href="https://wa.me/5511999999999?text=Ol%C3%A1%20Coach%20Montanha,%20vim%20pelo%20Blog" target="_blank">Contato</a></li>
            <li><a href="/portal">Portal do Aluno</a></li>
          </ul>
        </div>

        <!-- Coluna 2 -->
        <div class="footer-col">
          <h4>CATEGORIAS</h4>
          <ul>
            <li><a href="javascript:void(0)" onclick="selectCategory('Fitness')">Fitness</a></li>
            <li><a href="javascript:void(0)" onclick="selectCategory('Desenvolvimento Pessoal')">Desenvolvimento Pessoal</a></li>
            <li><a href="javascript:void(0)" onclick="selectCategory('Mindset')">Mindset</a></li>
            <li><a href="javascript:void(0)" onclick="selectCategory('Treinamento Híbrido')">Treinamento Híbrido</a></li>
            <li><a href="javascript:void(0)" onclick="selectCategory('Corrida & Endurance')">Corrida & Endurance</a></li>
            <li><a href="javascript:void(0)" onclick="selectCategory('Mobilidade Articular')">Mobilidade Articular</a></li>
            <li><a href="javascript:void(0)" onclick="selectCategory('Nutrição & Jejum')">Nutrição & Jejum</a></li>
          </ul>
        </div>

        <!-- Coluna 3 -->
        <div class="footer-col">
          <h4>REDES SOCIAIS</h4>
          <ul>
            <li><a href="https://www.instagram.com/coachmontanha1/" target="_blank">📸 Instagram (@coachmontanha1)</a></li>
            <li><a href="https://www.youtube.com/channel/UCy29z1eRp_GPFAVFHJfmg_A" target="_blank">📺 YouTube (Coach Montanha)</a></li>
            <li><a href="https://twitter.com/coachmontanha1" target="_blank">🐦 Twitter / X</a></li>
            <li><a href="https://www.facebook.com/albertosarly.coutinho" target="_blank">📘 Facebook</a></li>
          </ul>
        </div>

        <!-- Coluna 4 -->
        <div class="footer-col footer-newsletter">
          <h4>NEWSLETTER</h4>
          <p>Quer receber nossos artigos sempre que forem postados? Coloque o seu e-mail aqui!</p>
          <form onsubmit="event.preventDefault(); alert('E-mail cadastrado com sucesso!'); this.reset();">
            <input type="email" class="footer-input" placeholder="Seu melhor e-mail" required>
            <button type="submit" class="btn btn-primary" style="width:100%;">ASSINAR</button>
          </form>
        </div>
      </div>

      <div class="footer-bottom">
        <div>© 2026 Ecossistema Montanha • Coach Montanha. Todos os direitos reservados.</div>
        <div>Hospedado no Vercel Edge CDN com máxima velocidade e zero atrito.</div>
      </div>
    </div>
  </footer>

  <script>
    let currentDownloadUrl = '';
    let currentEbookTitle = '';

    function handleDownloadEbook(title, url) {{
      if (window.IS_STUDENT) {{
        window.open(url, '_blank');
        return;
      }}
      currentDownloadUrl = url;
      currentEbookTitle = title;
      document.getElementById('leadModal').style.display = 'flex';
    }}

    function closeLeadModal() {{
      document.getElementById('leadModal').style.display = 'none';
    }}

    function bypassLead() {{
      closeLeadModal();
      if (currentDownloadUrl) window.open(currentDownloadUrl, '_blank');
    }}

    async function submitLead(e) {{
      e.preventDefault();
      const name = document.getElementById('leadName').value;
      const phone = document.getElementById('leadPhone').value;
      
      fetch('/api/forms/google-webhook', {{
        method: 'POST',
        headers: {{ 'Content-Type': 'application/json' }},
        body: JSON.stringify({{
          name: name,
          phone: phone,
          ebook: currentEbookTitle,
          source: 'hub_materiais',
          date: new Date().toISOString()
        }})
      }}).catch(() => {{}});

      closeLeadModal();
      if (currentDownloadUrl) {{
        window.open(currentDownloadUrl, '_blank');
      }}
    }}

    const searchInput = document.getElementById('searchInput');
    const catPills = document.querySelectorAll('.cat-pill');
    const tabBtns = document.querySelectorAll('.tab-btn');
    const articleCards = document.querySelectorAll('.article-card');
    const ebooksSec = document.getElementById('ebooksSection');
    const articlesSec = document.getElementById('articlesSection');

    let activeCategory = 'Todas';
    let activeTab = 'todos';

    function selectCategory(catName) {{
      catPills.forEach(p => {{
        if (p.getAttribute('data-category') === catName) {{
          p.click();
        }}
      }});
      articlesSec.scrollIntoView({{ behavior: 'smooth' }});
    }}

    function filterContent() {{
      const query = searchInput.value.toLowerCase().trim();

      articleCards.forEach(card => {{
        const title = card.getAttribute('data-title');
        const excerpt = card.getAttribute('data-excerpt');
        const cat = card.getAttribute('data-category');

        const matchesQuery = !query || title.includes(query) || excerpt.includes(query);
        const matchesCat = (activeCategory === 'Todas') || (cat === activeCategory);

        if (matchesQuery && matchesCat) {{
          card.style.display = 'flex';
        }} else {{
          card.style.display = 'none';
        }}
      }});

      if (activeTab === 'todos') {{
        ebooksSec.style.display = (!query && activeCategory === 'Todas') ? 'block' : 'none';
        articlesSec.style.display = 'block';
      }} else if (activeTab === 'ebooks') {{
        ebooksSec.style.display = 'block';
        articlesSec.style.display = 'none';
      }} else if (activeTab === 'artigos') {{
        ebooksSec.style.display = 'none';
        articlesSec.style.display = 'block';
      }}
    }}

    searchInput.addEventListener('input', filterContent);

    catPills.forEach(pill => {{
      pill.addEventListener('click', () => {{
        catPills.forEach(p => p.classList.remove('active'));
        pill.classList.add('active');
        activeCategory = pill.getAttribute('data-category');
        filterContent();
      }});
    }});

    tabBtns.forEach(btn => {{
      btn.addEventListener('click', () => {{
        tabBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        activeTab = btn.getAttribute('data-tab');
        filterContent();
      }});
    }});
  </script>
</body>
</html>
"""
    return html

def generate_article_html(article_meta, body_html, prev_article, next_article):
    title = article_meta['clean_title']
    category = article_meta['category']
    excerpt = article_meta['excerpt']
    read_time = article_meta['read_time']
    slug = article_meta['slug']

    share_text = f"Artigo: {title} — Coach Montanha"
    share_url = f"https://montanha-personal-studio.vercel.app/materiais/artigos/{slug}"
    whatsapp_share = f"https://api.whatsapp.com/send?text={share_text}%20{share_url}"

    prev_link = f'<a href="/materiais/artigos/{prev_article["slug"]}" class="nav-prev">← {prev_article["clean_title"][:45]}...</a>' if prev_article else '<span></span>'
    next_link = f'<a href="/materiais/artigos/{next_article["slug"]}" class="nav-next">{next_article["clean_title"][:45]}... →</a>' if next_article else '<span></span>'

    # Os 6 Artigos Populares Clássicos do Blog Original
    popular_articles_html = """
    <div class="popular-posts-box">
      <h3 class="popular-title">Artigos populares</h3>
      <div class="popular-list">
        <a href="/materiais/artigos/o-segredo-do-meu-emagrecimento-e-o-neat" class="pop-item">
          <strong>O segredo do meu emagrecimento é o NEAT!</strong>
          <span>Por Coach Montanha</span>
        </a>
        <a href="/materiais/artigos/o-que-fazer-para-ter-um-envelhecimento-saudavel" class="pop-item">
          <strong>O que fazer para ter um envelhecimento saudável</strong>
          <span>Por Coach Montanha</span>
        </a>
        <a href="/materiais/artigos/a-balanca-a-maquina-maligna-da-industria-fitness" class="pop-item">
          <strong>Balança: A Máquina Maligna da Indústria Fitness</strong>
          <span>Por Coach Montanha</span>
        </a>
        <a href="/materiais/artigos/sera-que-a-fadiga-mental-influencia-a-performance" class="pop-item">
          <strong>Será que a fadiga mental influencia a performance?</strong>
          <span>Por Coach Montanha</span>
        </a>
        <a href="/materiais/artigos/alguns-beneficios-do-jejum-intermitente" class="pop-item">
          <strong>Alguns benefícios do Jejum Intermitente</strong>
          <span>Por Coach Montanha</span>
        </a>
        <a href="/materiais/artigos/quer-emagrecer-muito-rapido-invista-no-epoc" class="pop-item">
          <strong>Quer emagrecer muito rápido? Invista no EPOC!</strong>
          <span>Por Coach Montanha</span>
        </a>
      </div>
    </div>
    """

    html = f"""<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <title>{title} | Coach Montanha</title>
  <meta name="description" content="{excerpt}">
  
  <!-- OpenGraph Meta Tags para WhatsApp e Redes -->
  <meta property="og:title" content="{title} | Coach Montanha">
  <meta property="og:description" content="{excerpt}">
  <meta property="og:url" content="{share_url}">
  <meta property="og:type" content="article">
  <meta property="og:image" content="https://montanha-personal-studio.vercel.app/materiais/logo_montanha.png">
  <meta property="og:site_name" content="Coach Montanha • Blog Oficial">
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="{title}">
  <meta name="twitter:description" content="{excerpt}">

  {COMMON_HEAD}
  {STUDENT_DETECTION_SCRIPT}

  <style>
    .article-wrap {{
      max-width: 820px;
      margin: 40px auto 60px auto;
      padding: 0 20px;
    }}
    .breadcrumbs {{
      font-size: 13px;
      color: var(--text-dim);
      margin-bottom: 24px;
      display: flex;
      align-items: center;
      gap: 8px;
    }}
    .breadcrumbs a:hover {{ color: var(--text); }}
    .article-header {{
      margin-bottom: 36px;
      border-bottom: 1px solid var(--card-border);
      padding-bottom: 28px;
    }}
    .article-badge {{
      display: inline-block;
      font-size: 11px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.08em;
      background: var(--primary-soft);
      color: var(--primary);
      padding: 4px 10px;
      border-radius: 6px;
      margin-bottom: 16px;
      border: 1px solid rgba(245, 158, 11, 0.25);
      font-family: var(--font-title);
    }}
    .article-title {{
      font-size: 38px;
      font-weight: 800;
      color: #fff;
      line-height: 1.25;
      letter-spacing: -0.02em;
      margin-bottom: 14px;
    }}
    .article-meta {{
      display: flex;
      align-items: center;
      gap: 16px;
      font-size: 14px;
      color: var(--text-muted);
    }}
    
    .prose {{
      font-size: 18.5px;
      line-height: 1.8;
      color: #d4d4d8;
    }}
    .prose h1, .prose h2, .prose h3, .prose h4 {{
      color: #fff;
      font-weight: 700;
      margin: 40px 0 16px 0;
      letter-spacing: -0.01em;
    }}
    .prose h1 {{ font-size: 28px; }}
    .prose h2 {{ font-size: 23px; border-bottom: 1px solid var(--card-border); padding-bottom: 8px; }}
    .prose h3 {{ font-size: 20px; }}
    .prose p {{ margin-bottom: 22px; }}
    .prose ul, .prose ol {{ margin: 0 0 22px 24px; }}
    .prose li {{ margin-bottom: 8px; }}
    .prose blockquote {{
      border-left: 4px solid var(--primary);
      background: var(--card-bg);
      padding: 16px 20px;
      margin: 26px 0;
      border-radius: 0 8px 8px 0;
      color: #e4e4e7;
      font-style: italic;
    }}
    .prose code {{
      background: #27272a;
      color: #fcd34d;
      padding: 2px 6px;
      border-radius: 4px;
      font-size: 14px;
    }}
    .prose pre {{
      background: #18181b;
      border: 1px solid var(--card-border);
      padding: 16px;
      border-radius: 8px;
      overflow-x: auto;
      margin-bottom: 24px;
    }}
    .prose hr {{
      border: none;
      border-top: 1px solid var(--card-border);
      margin: 40px 0;
    }}
    .prose a {{
      color: var(--primary);
      text-decoration: underline;
    }}
    .prose table {{
      width: 100%;
      border-collapse: collapse;
      margin: 24px 0;
      font-size: 14.5px;
    }}
    .prose th, .prose td {{
      border: 1px solid var(--card-border);
      padding: 10px 14px;
      text-align: left;
    }}
    .prose th {{ background: var(--card-bg); color: #fff; font-family: var(--font-title); }}

    /* Artigos Populares Box */
    .popular-posts-box {{
      margin: 50px 0 30px 0;
      padding: 28px;
      background: #121215;
      border: 1px solid var(--card-border);
      border-radius: 14px;
    }}
    .popular-title {{
      font-size: 22px;
      font-weight: 700;
      color: var(--primary);
      margin-bottom: 20px;
      border-bottom: 1px solid var(--card-border);
      padding-bottom: 10px;
    }}
    .popular-list {{
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
      gap: 16px;
    }}
    .pop-item {{
      background: var(--card-bg);
      border: 1px solid rgba(255, 255, 255, 0.05);
      padding: 14px 16px;
      border-radius: 8px;
      display: flex;
      flex-direction: column;
      gap: 4px;
      transition: all 0.2s;
    }}
    .pop-item:hover {{
      border-color: var(--primary);
      transform: translateY(-2px);
    }}
    .pop-item strong {{
      font-size: 14px;
      color: #fff;
      line-height: 1.4;
    }}
    .pop-item span {{
      font-size: 11.5px;
      color: var(--text-dim);
    }}

    /* Share & Feedback Box */
    .share-box {{
      margin: 40px 0;
      padding: 24px;
      background: var(--card-bg);
      border: 1px solid var(--card-border);
      border-radius: 12px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      flex-wrap: wrap;
      gap: 16px;
    }}
    .nav-carousel {{
      display: flex;
      justify-content: space-between;
      margin-top: 40px;
      padding-top: 24px;
      border-top: 1px solid var(--card-border);
      gap: 16px;
    }}
    .nav-prev, .nav-next {{
      font-size: 14px;
      font-weight: 700;
      color: var(--primary);
      font-family: var(--font-title);
      max-width: 48%;
    }}
    .nav-next {{ text-align: right; }}

    /* Caixa de Comentário / WhatsApp */
    .comment-box {{
      margin-top: 48px;
      padding: 28px;
      background: radial-gradient(circle at 100% 0%, rgba(37, 211, 102, 0.1) 0%, rgba(20, 20, 23, 0.8) 100%);
      border: 1px solid rgba(37, 211, 102, 0.3);
      border-radius: 14px;
      text-align: center;
    }}
  </style>
</head>
<body>

  <!-- Topbar Original -->
  <header class="topbar">
    <div class="container topbar-inner">
      <div class="brand">
        <a href="/materiais" style="display:flex; align-items:center; gap:12px;">
          <img src="/materiais/logo_montanha.png" alt="Coach Montanha">
          <span>COACH MONTANHA</span>
        </a>
      </div>

      <nav class="nav-menu">
        <a href="/materiais">Início</a>
        <a href="/materiais#artigosSection">Meus Artigos</a>
        <a href="/materiais#ebooksSection">Livros/Ebooks</a>
        <a href="https://wa.me/5511999999999?text=Ol%C3%A1%20Coach%20Montanha,%20quero%20conhecer%20os%20Cursos%20Online" target="_blank">Cursos Online</a>
        <a href="https://coachmontanha1.systeme.io/amazon" target="_blank">Links Amazon</a>
        <a href="https://wa.me/5511999999999?text=Ol%C3%A1%20Coach%20Montanha,%20vim%20pelo%20artigo%20'{title}'" target="_blank">Contato</a>
      </nav>

      <div class="topbar-actions">
        <a href="/materiais" class="btn btn-outline">← Todos os Artigos</a>
      </div>
    </div>
  </header>

  <article class="article-wrap">
    <div class="breadcrumbs">
      <a href="/materiais">Início</a>
      <span>›</span>
      <a href="/materiais?cat={category}">{category}</a>
      <span>›</span>
      <span>{title[:40]}...</span>
    </div>

    <div class="article-header">
      <span class="article-badge">{category}</span>
      <h1 class="article-title">{title}</h1>
      <div class="article-meta">
        <span>Por <strong>Coach Montanha</strong></span>
        <span>•</span>
        <span>⏱️ {read_time} min de leitura</span>
      </div>
    </div>

    <div class="prose">
      {body_html}
    </div>

    <!-- Compartilhamento -->
    <div class="share-box">
      <div>
        <strong style="color:#fff; display:block; margin-bottom:4px; font-family:var(--font-title);">Gostou deste artigo?</strong>
        <span style="font-size:13px; color:var(--text-muted);">Compartilhe com quem treina com você.</span>
      </div>
      <div style="display:flex; gap:10px;">
        <a href="{whatsapp_share}" target="_blank" class="btn btn-primary" style="background:#25d366; color:#000;">
          📲 Compartilhar no WhatsApp
        </a>
        <button onclick="navigator.clipboard.writeText(window.location.href); alert('Link copiado com sucesso!');" class="btn btn-outline">
          🔗 Copiar Link
        </button>
      </div>
    </div>

    <!-- Seção de Artigos Populares Clássicos -->
    {popular_articles_html}

    <!-- Caixa de Interação / Comentário via WhatsApp -->
    <div class="comment-box">
      <h3 style="font-size:20px; font-weight:800; color:#fff; margin-bottom:8px; font-family:var(--font-title);">Deixe seu comentário ou tire sua dúvida</h3>
      <p style="font-size:14px; color:var(--text-muted); max-width:540px; margin:0 auto 18px auto;">
        Quer feedback sobre sua execução ou sugestão para um próximo artigo? Fale diretamente com o Coach Montanha.
      </p>
      <a href="https://wa.me/5511999999999?text=Ol%C3%A1%20Coach%20Montanha,%20li%20o%20artigo%20'{title}'%20e%20gostaria%20de%20comentar" class="btn btn-primary" target="_blank" style="background:#25d366; color:#000; padding:12px 24px; font-size:15px;">
        Enviar Mensagem no WhatsApp ➔
      </a>
    </div>

    <!-- Navegação Sequencial -->
    <div class="nav-carousel">
      {prev_link}
      {next_link}
    </div>
  </article>

  <!-- Rodapé Oficial de 4 Colunas -->
  <footer class="blog-footer">
    <div class="container">
      <div class="footer-grid">
        <div class="footer-col">
          <h4>LINKS RÁPIDOS</h4>
          <ul>
            <li><a href="/materiais">Início</a></li>
            <li><a href="/materiais#artigosSection">Meus Artigos</a></li>
            <li><a href="/materiais#ebooksSection">Livros/Ebooks</a></li>
            <li><a href="https://wa.me/5511999999999?text=Ol%C3%A1%20Coach%20Montanha,%20quero%20conhecer%20os%20Cursos%20Online" target="_blank">Cursos Online</a></li>
            <li><a href="https://coachmontanha1.systeme.io/amazon" target="_blank">Links Amazon</a></li>
            <li><a href="https://wa.me/5511999999999?text=Ol%C3%A1%20Coach%20Montanha,%20vim%20pelo%20Blog" target="_blank">Contato</a></li>
            <li><a href="/portal">Portal do Aluno</a></li>
          </ul>
        </div>

        <div class="footer-col">
          <h4>CATEGORIAS</h4>
          <ul>
            <li><a href="/materiais?cat=Fitness">Fitness</a></li>
            <li><a href="/materiais?cat=Desenvolvimento+Pessoal">Desenvolvimento Pessoal</a></li>
            <li><a href="/materiais?cat=Mindset">Mindset</a></li>
            <li><a href="/materiais?cat=Treinamento+H%C3%ADbrido">Treinamento Híbrido</a></li>
            <li><a href="/materiais?cat=Corrida+%26+Endurance">Corrida & Endurance</a></li>
            <li><a href="/materiais?cat=Mobilidade+Articular">Mobilidade Articular</a></li>
            <li><a href="/materiais?cat=Nutri%C3%A7%C3%A3o+%26+Jejum">Nutrição & Jejum</a></li>
          </ul>
        </div>

        <div class="footer-col">
          <h4>REDES SOCIAIS</h4>
          <ul>
            <li><a href="https://www.instagram.com/coachmontanha1/" target="_blank">📸 Instagram (@coachmontanha1)</a></li>
            <li><a href="https://www.youtube.com/channel/UCy29z1eRp_GPFAVFHJfmg_A" target="_blank">📺 YouTube (Coach Montanha)</a></li>
            <li><a href="https://twitter.com/coachmontanha1" target="_blank">🐦 Twitter / X</a></li>
            <li><a href="https://www.facebook.com/albertosarly.coutinho" target="_blank">📘 Facebook</a></li>
          </ul>
        </div>

        <div class="footer-col footer-newsletter">
          <h4>NEWSLETTER</h4>
          <p>Quer receber nossos artigos sempre que forem postados? Coloque o seu e-mail aqui!</p>
          <form onsubmit="event.preventDefault(); alert('E-mail cadastrado com sucesso!'); this.reset();">
            <input type="email" class="footer-input" placeholder="Seu melhor e-mail" required>
            <button type="submit" class="btn btn-primary" style="width:100%;">ASSINAR</button>
          </form>
        </div>
      </div>

      <div class="footer-bottom">
        <div>© 2026 Ecossistema Montanha • Coach Montanha. Todos os direitos reservados.</div>
        <div>Hospedado no Vercel Edge CDN com máxima velocidade e zero atrito.</div>
      </div>
    </div>
  </footer>

</body>
</html>
"""
    return html

def main():
    print("Iniciando build do Blog do Montanha (Replica & Upgrade Systeme.io)...")
    
    # 1. Carregar Artigos
    md_files = sorted(glob.glob(os.path.join(ARTICLES_SRC_DIR, "*.md")))
    print(f"Total de arquivos Markdown encontrados: {len(md_files)}")
    
    articles = []
    seen_slugs = set()
    md = markdown.Markdown(extensions=['extra', 'tables', 'fenced_code', 'nl2br'])

    for idx, filepath in enumerate(md_files):
        meta, body_raw = parse_frontmatter_and_body(filepath)
        
        slug = meta['slug']
        if slug in seen_slugs:
            slug = f"{slug}-{idx+1}"
        seen_slugs.add(slug)
        meta['slug'] = slug

        clean_body = re.sub(r'^#\s+.*?\n', '', body_raw, count=1).strip()
        body_html = md.reset().convert(clean_body)
        
        articles.append({
            'meta': meta,
            'body_html': body_html,
            'clean_title': meta['clean_title'],
            'slug': meta['slug'],
            'category': meta['category'],
            'read_time': meta['read_time'],
            'excerpt': meta['excerpt']
        })

    print(f"Artigos processados: {len(articles)}")

    # 2. Definir Livros & E-books
    ebooks = [
        {
            'title': 'Protocolo do Atleta Híbrido (30 Dias)',
            'desc': 'Força funcional, blocos EMOM de densidade (Hyrox style) e corrida contínua em Zona 2. Inclui timers embutidos e checklist interativo.',
            'category': 'Treinamento Híbrido',
            'type': 'app',
            'url': '/materiais/treinamento-hibrido'
        },
        {
            'title': 'Protocolo do Atleta Híbrido (PDF AcroForm)',
            'desc': 'Versão oficial em PDF com 30 caixas de marcação vetoriais clicáveis, links de execução em vídeo e layout para impressão.',
            'category': 'Treinamento Híbrido',
            'type': 'pdf',
            'url': '/materiais/treinamento-hibrido/Protocolo_Atleta_Hibrido_30_Dias_Coach_Montanha.pdf'
        },
        {
            'title': 'Programa de Mobilidade (30 Dias)',
            'desc': 'Rotinas diárias de 15 minutos com foco em liberação miofascial (rolo de espuma) e mobilidade articular para destravar o corpo.',
            'category': 'Mobilidade Articular',
            'type': 'app',
            'url': '/materiais/mobilidade'
        },
        {
            'title': 'Programa de Mobilidade (PDF AcroForm)',
            'desc': 'Manual completo com fotos em alta definição, cronômetros recomendados e checklist de 30 dias com caixas clicáveis.',
            'category': 'Mobilidade Articular',
            'type': 'pdf',
            'url': '/materiais/mobilidade/Programa_Mobilidade_30_Dias_Coach_Montanha_Clean.pdf'
        },
        {
            'title': 'Revolucione a sua Corrida — Programa 5k',
            'desc': 'Periodização passo a passo para construir sua primeira base de 5km sem canelite e sem destruir os joelhos.',
            'category': 'Corrida & Endurance',
            'type': 'pdf',
            'url': '/materiais/ebooks/EbookRevolucioneasuacorridaPrograma5k.pdf'
        },
        {
            'title': 'Revolucione a sua Corrida — Programa 15k',
            'desc': 'Estratégia de volume e economia de corrida para quebrar platôs e rodar 15km com ritmo controlado.',
            'category': 'Corrida & Endurance',
            'type': 'pdf',
            'url': '/materiais/ebooks/EbookRevolucioneasuacorridaPrograma15k.pdf'
        },
        {
            'title': 'Treinamento Específico de Hipertrofia (HST)',
            'desc': 'Guia completo de aplicação do método Hypertrophy-Specific Training (frequência mecânica e descondicionamento estratégico).',
            'category': 'Fitness',
            'type': 'pdf',
            'url': '/materiais/ebooks/EbookComplementarVocconheceroTreinamentoEspecficodeHipertrofiaHST.pdf'
        },
        {
            'title': 'Treinar Duas Vezes por Dia para Ganhar Músculo',
            'desc': 'Como fracionar o volume diário de musculação para aumentar síntese proteica sem saturar o sistema nervoso.',
            'category': 'Fitness',
            'type': 'pdf',
            'url': '/materiais/ebooks/Valeapenatreinarduasvezespordiaparaganharmaismsculos.pdf'
        },
        {
            'title': 'Desafio 30 Dias de Cócoras',
            'desc': 'Restauração da mobilidade de tornozelo e quadril através do padrão primordial de agachamento profundo diário.',
            'category': 'Mobilidade Articular',
            'type': 'pdf',
            'url': '/materiais/ebooks/EbookDesafio30DiasdeCcoras.pdf'
        },
        {
            'title': 'Cálculo de TDEE e Macronutrientes',
            'desc': 'A matemática exata para calcular seu gasto calórico total e estruturar proteínas, gorduras e carboidratos para recomposição.',
            'category': 'Nutrição & Jejum',
            'type': 'pdf',
            'url': '/materiais/ebooks/EbookGETeMacros-Comocalcular_.pdf'
        },
        {
            'title': 'Reprograme sua Mente para Emagrecer',
            'desc': 'Quebra de hábitos compulsivos, gatilhos de estresse e mecanismos de saciedade hormonal.',
            'category': 'Mindset',
            'type': 'pdf',
            'url': '/materiais/ebooks/EbookComplementarReprogramesuamenteparaemagrecer.pdf'
        },
        {
            'title': 'O Sono Eficiente Sem Neura',
            'desc': 'Higiene do sono baseada em ritmo circadiano, temperatura ambiente e regulação de melatonina para atletas.',
            'category': 'Desenvolvimento Pessoal',
            'type': 'pdf',
            'url': '/materiais/ebooks/RoteiroWebinrioOSonoEficienteSemNeura.pdf'
        }
    ]

    # 3. Preparar diretórios
    os.makedirs(DEST_DIR, exist_ok=True)
    os.makedirs(os.path.join(DEST_DIR, "artigos"), exist_ok=True)
    os.makedirs(os.path.join(DEST_DIR, "data"), exist_ok=True)
    os.makedirs(os.path.join(DEST_DIR, "ebooks"), exist_ok=True)

    # 4. Copiar PDFs
    for f in glob.glob(os.path.join(PDFS_SRC_DIR, "*.pdf")):
        fname = os.path.basename(f)
        dest_pdf = os.path.join(DEST_DIR, "ebooks", fname)
        if not os.path.exists(dest_pdf):
            shutil.copy2(f, dest_pdf)

    # 5. Gerar páginas individuais dos artigos
    print("Gerando 182 páginas HTML com o novo layout...")
    for i, a in enumerate(articles):
        prev_a = articles[i - 1] if i > 0 else None
        next_a = articles[i + 1] if i < len(articles) - 1 else None
        
        art_html = generate_article_html(a['meta'], a['body_html'], prev_a, next_a)
        
        art_dir = os.path.join(DEST_DIR, "artigos", a['slug'])
        os.makedirs(art_dir, exist_ok=True)
        with open(os.path.join(art_dir, "index.html"), "w", encoding="utf-8") as f:
            f.write(art_html)

    # 6. Gerar Hub Central
    print("Gerando Hub Central /materiais/index.html...")
    hub_html = generate_hub_html(articles, ebooks)
    with open(os.path.join(DEST_DIR, "index.html"), "w", encoding="utf-8") as f:
        f.write(hub_html)

    # 7. Salvar Catálogo JSON
    catalog_data = {
        'total_articles': len(articles),
        'total_ebooks': len(ebooks),
        'articles': [{
            'title': a['clean_title'],
            'slug': a['slug'],
            'category': a['category'],
            'read_time': a['read_time'],
            'excerpt': a['excerpt'],
            'url': f"/materiais/artigos/{a['slug']}"
        } for a in articles],
        'ebooks': ebooks
    }
    with open(os.path.join(DEST_DIR, "data", "catalog.json"), "w", encoding="utf-8") as f:
        json.dump(catalog_data, f, ensure_ascii=False, indent=2)

    # 8. Espelhar para Montanha Hybrid Training
    if os.path.exists(os.path.dirname(MIRROR_DIR)):
        print("Espelhando public/materiais para Montanha Hybrid Training...")
        if os.path.exists(MIRROR_DIR):
            shutil.rmtree(MIRROR_DIR)
        shutil.copytree(DEST_DIR, MIRROR_DIR)

    print("✅ Build do Blog e Artigos concluído com sucesso!")

if __name__ == "__main__":
    main()
