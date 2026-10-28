#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
build-blog-hub.py — Compilador do Hub de Materiais Públicos & 182 Artigos do Coach Montanha
Gera o portal unificado /materiais e as páginas estáticas com OpenGraph no Vercel Edge.
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
    # Remove "ARTIGO 170 - ", "001_ARTIGO_170_-_", etc.
    title = re.sub(r'^(ARTIGO\s+\d+\s*[-–—]\s*|\d{3}_ARTIGO_\d+_[-–—]\s*)', '', raw_title, flags=re.IGNORECASE)
    return title.strip()

def infer_category(title, content):
    tc = (title + " " + content[:1000]).lower()
    if any(k in tc for k in ["corrida", "maratona", "5k", "15k", "maf", "endurance", "cadência", "pace", "trote"]):
        return "Corrida & Endurance"
    if any(k in tc for k in ["hipertrofia", "musculação", "músculo", "barra fixa", "supino", "agachamento", "força", "hst", "carga"]):
        return "Hipertrofia & Força"
    if any(k in tc for k in ["emagrecer", "emagrecimento", "gordura", "déficit", "calorias", "metabolismo", "ozempic", "fome"]):
        return "Emagrecimento & Metabolismo"
    if any(k in tc for k in ["híbrido", "hibrido", "hyrox", "mobilidade", "fáscia", "alongamento", "articulação", "joelho", "lombar", "foam roller", "remo"]):
        return "Mobilidade & Híbrido"
    if any(k in tc for k in ["nutrição", "dieta", "proteína", "psyllium", "jejum", "carboidrato", "laticínios", "suplemento", "creatina"]):
        return "Nutrição & Suplementação"
    if any(k in tc for k in ["hormônio", "testosterona", "sono", "ansiedade", "saúde", "coluna", "fisiologia", "imunidade"]):
        return "Saúde & Fisiologia"
    return "Mentalidade & Disciplina"

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

    # If title not in meta, try to find first H1
    if 'title' not in meta:
        m = re.search(r'^#\s+(.+)$', body, flags=re.MULTILINE)
        if m:
            meta['title'] = m.group(1).strip()
        else:
            meta['title'] = os.path.splitext(os.path.basename(filepath))[0]

    # Clean title
    meta['clean_title'] = clean_title(meta['title'])
    
    # Generate clean slug
    raw_slug = meta['clean_title']
    slug = slugify(raw_slug)
    if not slug:
        slug = slugify(os.path.splitext(os.path.basename(filepath))[0])
    meta['slug'] = slug

    # Category
    if 'category' not in meta or not meta['category']:
        meta['category'] = infer_category(meta['clean_title'], body)

    # Word count and read time
    words = len(re.findall(r'\w+', body))
    meta['read_time'] = max(2, math.ceil(words / 140))
    meta['word_count'] = words

    # Excerpt (clean markdown for description)
    plain = re.sub(r'[#*`_\[\]>]', '', body)
    plain = re.sub(r'\s+', ' ', plain).strip()
    # Strip any leading quotes or boilerplate
    plain = re.sub(r'^(Artigo #\d+.*?Systeme\.io:\s*|\s*)+', '', plain)
    meta['excerpt'] = plain[:150] + ("..." if len(plain) > 150 else "")

    return meta, body

# Base CSS & JS for all pages (Modern dark theme, zero CLS, mobile-first)
COMMON_HEAD = """
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="theme-color" content="#09090b">
  <link rel="icon" type="image/png" href="/logo_dark.png">
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
      --accent-red: #ef4444;
      --accent-green: #10b981;
    }
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      background-color: var(--bg);
      color: var(--text);
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
      line-height: 1.6;
      -webkit-font-smoothing: antialiased;
      overflow-x: hidden;
    }
    a { color: inherit; text-decoration: none; }
    .container { max-width: 1100px; margin: 0 auto; padding: 0 20px; }
    
    /* Top Bar */
    .topbar {
      border-bottom: 1px solid var(--card-border);
      background: rgba(9, 9, 11, 0.9);
      backdrop-filter: blur(12px);
      position: sticky;
      top: 0;
      z-index: 50;
    }
    .topbar-inner {
      display: flex;
      align-items: center;
      justify-content: space-between;
      height: 64px;
    }
    .brand {
      display: flex;
      align-items: center;
      gap: 12px;
      font-weight: 800;
      font-size: 16px;
      letter-spacing: -0.02em;
    }
    .brand img {
      width: 32px;
      height: 32px;
      border-radius: 8px;
    }
    .topbar-actions {
      display: flex;
      align-items: center;
      gap: 10px;
    }
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
    }
    .btn-primary {
      background: var(--primary);
      color: #000;
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
    }
    
    /* Alert / Student Banner */
    .banner-vip {
      background: linear-gradient(90deg, rgba(16, 185, 129, 0.15), rgba(16, 185, 129, 0.05));
      border-bottom: 1px solid rgba(16, 185, 129, 0.25);
      padding: 10px 0;
      font-size: 13px;
      text-align: center;
      color: #6ee7b7;
      display: none;
    }
    .banner-visitor {
      background: linear-gradient(90deg, rgba(245, 158, 11, 0.1), rgba(245, 158, 11, 0.02));
      border-bottom: 1px solid rgba(245, 158, 11, 0.2);
      padding: 10px 0;
      font-size: 13px;
      text-align: center;
      color: #fcd34d;
    }

    /* Modal */
    .modal-backdrop {
      position: fixed;
      inset: 0;
      background: rgba(0, 0, 0, 0.8);
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
    .modal-input:focus {
      border-color: var(--primary);
    }
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
        "Todos",
        "Corrida & Endurance",
        "Hipertrofia & Força",
        "Emagrecimento & Metabolismo",
        "Mobilidade & Híbrido",
        "Nutrição & Suplementação",
        "Saúde & Fisiologia",
        "Mentalidade & Disciplina"
    ]

    cat_pills = "".join([f'<button class="cat-pill {"active" if i == 0 else ""}" data-category="{c}">{c}</button>' for i, c in enumerate(categories)])

    # Ebook cards
    ebook_cards_html = ""
    for eb in ebooks:
        badge_class = "badge-app" if eb.get("type") == "app" else "badge-pdf"
        badge_text = "Web App Interativo" if eb.get("type") == "app" else "PDF AcroForm"
        action_btn = ""
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
  <title>Cofre de Materiais & Blog Oficial | Coach Montanha</title>
  <meta name="description" content="Acesse todos os 182 artigos do blog, e-books e protocolos interativos do Coach Montanha. Força, corrida, mobilidade e performance sem atrito.">
  <meta property="og:title" content="Cofre de Materiais & Blog Oficial | Coach Montanha">
  <meta property="og:description" content="Artigos publicados, e-books com caixas de marcação e web apps de treino abertos para você.">
  <meta property="og:image" content="https://montanha-personal-studio.vercel.app/logo_dark.png">
  <meta property="og:type" content="website">
  <meta property="og:url" content="https://montanha-personal-studio.vercel.app/materiais">
  {COMMON_HEAD}
  {STUDENT_DETECTION_SCRIPT}
  <style>
    /* Banners */
    .hero-section {{
      padding: 48px 0 32px 0;
      text-align: center;
      border-bottom: 1px solid var(--card-border);
      background: radial-gradient(circle at 50% 0%, rgba(245, 158, 11, 0.08) 0%, transparent 70%);
    }}
    .hero-badge {{
      display: inline-flex;
      align-items: center;
      gap: 6px;
      font-size: 11px;
      text-transform: uppercase;
      letter-spacing: 0.1em;
      font-weight: 700;
      color: var(--primary);
      background: var(--primary-soft);
      border: 1px solid rgba(245, 158, 11, 0.25);
      padding: 4px 12px;
      border-radius: 9999px;
      margin-bottom: 16px;
    }}
    .hero-title {{
      font-size: 36px;
      font-weight: 800;
      letter-spacing: -0.03em;
      margin-bottom: 12px;
      color: #fff;
    }}
    .hero-subtitle {{
      font-size: 16px;
      color: var(--text-muted);
      max-width: 680px;
      margin: 0 auto;
    }}
    
    /* Search & Filter Bar */
    .controls-wrap {{
      margin: 32px 0 24px 0;
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
      padding: 14px 20px 14px 44px;
      color: #fff;
      font-size: 15px;
      outline: none;
      transition: border-color 0.2s;
    }}
    .search-input:focus {{
      border-color: var(--primary);
    }}
    .search-icon {{
      position: absolute;
      left: 16px;
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
      padding: 8px 14px;
      border-radius: 9999px;
      font-size: 13px;
      font-weight: 500;
      white-space: nowrap;
      cursor: pointer;
      transition: all 0.2s;
    }}
    .cat-pill:hover {{
      color: #fff;
      border-color: #3f3f46;
    }}
    .cat-pill.active {{
      background: var(--primary);
      color: #000;
      border-color: var(--primary);
      font-weight: 700;
    }}
    
    /* Tabs */
    .section-tabs {{
      display: flex;
      border-bottom: 1px solid var(--card-border);
      margin-bottom: 28px;
      gap: 24px;
    }}
    .tab-btn {{
      background: transparent;
      border: none;
      color: var(--text-dim);
      font-size: 15px;
      font-weight: 600;
      padding: 12px 0;
      cursor: pointer;
      position: relative;
      transition: color 0.2s;
    }}
    .tab-btn:hover {{ color: var(--text); }}
    .tab-btn.active {{
      color: var(--primary);
    }}
    .tab-btn.active::after {{
      content: '';
      position: absolute;
      bottom: -1px;
      left: 0;
      right: 0;
      height: 2px;
      background: var(--primary);
    }}
    
    /* Grids */
    .cards-grid {{
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
      gap: 20px;
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
      box-shadow: 0 12px 24px -10px rgba(0, 0, 0, 0.5);
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
      letter-spacing: 0.05em;
      padding: 3px 8px;
      border-radius: 6px;
    }}
    .badge-artigo {{ background: #27272a; color: #a1a1aa; }}
    .badge-app {{ background: rgba(245, 158, 11, 0.2); color: #fbbf24; }}
    .badge-pdf {{ background: rgba(59, 130, 246, 0.2); color: #60a5fa; }}
    .meta-tag {{ font-size: 12px; color: var(--text-dim); }}
    .card-title {{
      font-size: 17px;
      font-weight: 700;
      color: #fff;
      line-height: 1.4;
      margin-bottom: 10px;
    }}
    .card-desc {{
      font-size: 13.5px;
      color: var(--text-muted);
      line-height: 1.5;
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
      font-weight: 600;
      color: var(--primary);
    }}
    
    /* Footer */
    .hub-footer {{
      border-top: 1px solid var(--card-border);
      padding: 40px 0;
      text-align: center;
      font-size: 13px;
      color: var(--text-dim);
    }}
  </style>
</head>
<body>

  <!-- Banners de Notificação -->
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

  <!-- Barra Superior -->
  <header class="topbar">
    <div class="container topbar-inner">
      <div class="brand">
        <img src="/logo_dark.png" alt="Coach Montanha">
        <span>COACH MONTANHA • COFRE</span>
      </div>
      <div class="topbar-actions">
        <a href="/auth" class="btn btn-outline btn-login-action">Entrar no Studio</a>
        <a href="https://wa.me/5511999999999?text=Ol%C3%A1%20Montanha,%20vim%20pelo%20Cofre%20de%20Materiais%20e%20quero%20conhecer%20a%20Consultoria" class="btn btn-primary" target="_blank">Consultoria WhatsApp</a>
      </div>
    </div>
  </header>

  <!-- Hero -->
  <section class="hero-section">
    <div class="container">
      <span class="hero-badge">Biblioteca Digital Aberta</span>
      <h1 class="hero-title">Cofre de Conhecimento & Treinamento</h1>
      <p class="hero-subtitle">
        182 artigos técnicos, protocolos de força, corrida em Zona 2 e e-books completos com ferramentas interativas diretas no navegador.
      </p>
    </div>
  </section>

  <!-- Conteúdo Principal -->
  <main class="container">
    <div class="controls-wrap">
      <div class="search-input-wrap">
        <span class="search-icon">🔍</span>
        <input type="text" id="searchInput" class="search-input" placeholder="Buscar por tema (ex: barra fixa, remo, 5k, hipertrofia, sono)...">
      </div>
      
      <div class="cat-scroll">
        {cat_pills}
      </div>
    </div>

    <!-- Abas -->
    <div class="section-tabs">
      <button class="tab-btn active" data-tab="todos">Todos os Conteúdos ({len(articles) + len(ebooks)})</button>
      <button class="tab-btn" data-tab="artigos">Artigos Publicados ({len(articles)})</button>
      <button class="tab-btn" data-tab="ebooks">E-books & Protocolos ({len(ebooks)})</button>
    </div>

    <!-- Grid de E-books -->
    <div id="ebooksSection" class="tab-section">
      <h2 style="font-size:20px; font-weight:700; margin-bottom:18px; color:#fff;">E-books & Protocolos Interativos</h2>
      <div class="cards-grid">
        {ebook_cards_html}
      </div>
    </div>

    <!-- Grid de Artigos -->
    <div id="articlesSection" class="tab-section">
      <h2 style="font-size:20px; font-weight:700; margin-bottom:18px; color:#fff;">Artigos Publicados</h2>
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
      <h3 style="font-size:18px; font-weight:800; color:#fff; margin-bottom:8px;">Baixar PDF Oficial</h3>
      <p style="font-size:13.5px; color:var(--text-muted); margin-bottom:20px;">
        Informe seu nome e WhatsApp para receber o material e atualizações dos protocolos do Coach Montanha.
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

  <footer class="hub-footer">
    <div class="container">
      <p>© {2026} Ecossistema Montanha • Studio Personal & Consultoria de Alta Performance.</p>
      <p style="margin-top:6px; font-size:12px;">Construído com zero desperdício de tokens. Hospedado no Edge CDN.</p>
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
      
      // Envio não bloqueante para webhook
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

    // Filtros e Busca Instantânea
    const searchInput = document.getElementById('searchInput');
    const catPills = document.querySelectorAll('.cat-pill');
    const tabBtns = document.querySelectorAll('.tab-btn');
    const articleCards = document.querySelectorAll('.article-card');
    const ebooksSec = document.getElementById('ebooksSection');
    const articlesSec = document.getElementById('articlesSection');

    let activeCategory = 'Todos';
    let activeTab = 'todos';

    function filterContent() {{
      const query = searchInput.value.toLowerCase().trim();

      articleCards.forEach(card => {{
        const title = card.getAttribute('data-title');
        const excerpt = card.getAttribute('data-excerpt');
        const cat = card.getAttribute('data-category');

        const matchesQuery = !query || title.includes(query) || excerpt.includes(query);
        const matchesCat = (activeCategory === 'Todos') || (cat === activeCategory);

        if (matchesQuery && matchesCat) {{
          card.style.display = 'flex';
        }} else {{
          card.style.display = 'none';
        }}
      }});

      // Tabs visibility
      if (activeTab === 'todos') {{
        ebooksSec.style.display = (!query && activeCategory === 'Todos') ? 'block' : 'none';
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
  <meta property="og:image" content="https://montanha-personal-studio.vercel.app/logo_dark.png">
  <meta property="og:site_name" content="Coach Montanha • Studio Personal">
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="{title}">
  <meta name="twitter:description" content="{excerpt}">

  {COMMON_HEAD}
  {STUDENT_DETECTION_SCRIPT}

  <style>
    .article-wrap {{
      max-width: 780px;
      margin: 40px auto 80px auto;
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
      margin-bottom: 14px;
      border: 1px solid rgba(245, 158, 11, 0.25);
    }}
    .article-title {{
      font-size: 32px;
      font-weight: 800;
      color: #fff;
      line-height: 1.3;
      letter-spacing: -0.02em;
      margin-bottom: 14px;
    }}
    .article-meta {{
      display: flex;
      align-items: center;
      gap: 16px;
      font-size: 13.5px;
      color: var(--text-muted);
    }}
    
    /* Typography */
    .prose {{
      font-size: 17px;
      line-height: 1.8;
      color: #d4d4d8;
    }}
    .prose h1, .prose h2, .prose h3, .prose h4 {{
      color: #fff;
      font-weight: 700;
      margin: 40px 0 16px 0;
      letter-spacing: -0.01em;
    }}
    .prose h1 {{ font-size: 26px; }}
    .prose h2 {{ font-size: 22px; border-bottom: 1px solid var(--card-border); padding-bottom: 8px; }}
    .prose h3 {{ font-size: 19px; }}
    .prose p {{ margin-bottom: 20px; }}
    .prose ul, .prose ol {{ margin: 0 0 20px 24px; }}
    .prose li {{ margin-bottom: 8px; }}
    .prose blockquote {{
      border-left: 4px solid var(--primary);
      background: var(--card-bg);
      padding: 16px 20px;
      margin: 24px 0;
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
    .prose th {{ background: var(--card-bg); color: #fff; }}

    /* Share & CTA */
    .share-box {{
      margin: 48px 0;
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
      margin-top: 48px;
      padding-top: 24px;
      border-top: 1px solid var(--card-border);
      gap: 16px;
    }}
    .nav-prev, .nav-next {{
      font-size: 14px;
      font-weight: 600;
      color: var(--primary);
      max-width: 48%;
    }}
    .nav-next {{ text-align: right; }}

    /* Conversion Box */
    .conversion-box {{
      margin-top: 60px;
      padding: 32px;
      border: 1px solid rgba(245, 158, 11, 0.3);
      background: radial-gradient(circle at 100% 0%, rgba(245, 158, 11, 0.1) 0%, rgba(20, 20, 23, 0.8) 100%);
      border-radius: 14px;
      text-align: center;
    }}
  </style>
</head>
<body>

  <!-- Top Bar -->
  <header class="topbar">
    <div class="container topbar-inner">
      <div class="brand">
        <a href="/materiais" style="display:flex; align-items:center; gap:10px;">
          <img src="/logo_dark.png" alt="Coach Montanha">
          <span>COACH MONTANHA</span>
        </a>
      </div>
      <div class="topbar-actions">
        <a href="/materiais" class="btn btn-outline">← Ver Todos os Materiais</a>
        <a href="https://wa.me/5511999999999?text=Ol%C3%A1%20Montanha,%20li%20o%20artigo%20'{title}'%20e%20quero%20conhecer%20a%20Consultoria" class="btn btn-primary" target="_blank">Falar no WhatsApp</a>
      </div>
    </div>
  </header>

  <article class="article-wrap">
    <div class="breadcrumbs">
      <a href="/materiais">Cofre de Materiais</a>
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
        <strong style="color:#fff; display:block; margin-bottom:4px;">Gostou deste conteúdo?</strong>
        <span style="font-size:13px; color:var(--text-muted);">Envie para um amigo ou no grupo de treino.</span>
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

    <!-- Navegação Sequencial -->
    <div class="nav-carousel">
      {prev_link}
      {next_link}
    </div>

    <!-- Caixa de Conversão -->
    <div class="conversion-box">
      <span style="font-size:12px; font-weight:700; text-transform:uppercase; color:var(--primary); letter-spacing:0.08em;">Studio Personal & Consultoria</span>
      <h3 style="font-size:22px; font-weight:800; color:#fff; margin:8px 0 12px 0;">Treine com o Coach Montanha</h3>
      <p style="font-size:14.5px; color:var(--text-muted); max-width:540px; margin:0 auto 20px auto;">
        Chega de seguir treino genérico de aplicativo e continuar travado. Receba periodização individualizada, acompanhamento biomecânico e métricas reais.
      </p>
      <a href="https://wa.me/5511999999999?text=Ol%C3%A1%20Montanha,%20vim%20pelo%20artigo%20'{title}'%20e%20quero%20vagas%20no%20Studio%20ou%20Consultoria" class="btn btn-primary" target="_blank" style="padding:12px 24px; font-size:15px;">
        Solicitar Triagem no WhatsApp ➔
      </a>
    </div>
  </article>

  <footer class="hub-footer">
    <div class="container">
      <p>© {2026} Ecossistema Montanha • Todos os direitos reservados.</p>
    </div>
  </footer>

</body>
</html>
"""
    return html

def main():
    print("Iniciando build do Blog Hub e 182 Artigos...")
    
    # 1. Carregar Artigos
    md_files = sorted(glob.glob(os.path.join(ARTICLES_SRC_DIR, "*.md")))
    print(f"Total de arquivos Markdown encontrados: {len(md_files)}")
    
    articles = []
    seen_slugs = set()
    
    md = markdown.Markdown(extensions=['extra', 'tables', 'fenced_code', 'nl2br'])

    for idx, filepath in enumerate(md_files):
        meta, body_raw = parse_frontmatter_and_body(filepath)
        
        # Ensure unique slug
        slug = meta['slug']
        if slug in seen_slugs:
            slug = f"{slug}-{idx+1}"
        seen_slugs.add(slug)
        meta['slug'] = slug

        # Convert markdown to html
        # Remove any leading title # headers if identical to meta title to avoid duplication
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

    # 2. Definir E-books
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
            'category': 'Hipertrofia & Força',
            'type': 'pdf',
            'url': '/materiais/ebooks/EbookComplementarVocconheceroTreinamentoEspecficodeHipertrofiaHST.pdf'
        },
        {
            'title': 'Treinar Duas Vezes por Dia para Ganhar Músculo',
            'desc': 'Como fracionar o volume diário de musculação para aumentar síntese proteica sem saturar o sistema nervoso.',
            'category': 'Hipertrofia & Força',
            'type': 'pdf',
            'url': '/materiais/ebooks/Valeapenatreinarduasvezespordiaparaganharmaismsculos.pdf'
        },
        {
            'title': 'Desafio 30 Dias de Cócoras',
            'desc': 'Restauração da mobilidade de tornozelo e quadril através do padrão primordial de agachamento profundo diário.',
            'category': 'Mobilidade & Híbrido',
            'type': 'pdf',
            'url': '/materiais/ebooks/EbookDesafio30DiasdeCcoras.pdf'
        },
        {
            'title': 'Cálculo de TDEE e Macronutrientes',
            'desc': 'A matemática exata para calcular seu gasto calórico total e estruturar proteínas, gorduras e carboidratos para recomposição.',
            'category': 'Nutrição & Suplementação',
            'type': 'pdf',
            'url': '/materiais/ebooks/EbookGETeMacros-Comocalcular_.pdf'
        },
        {
            'title': 'Reprograme sua Mente para Emagrecer',
            'desc': 'Quebra de hábitos compulsivos, gatilhos de estresse e mecanismos de saciedade hormonal.',
            'category': 'Emagrecimento & Metabolismo',
            'type': 'pdf',
            'url': '/materiais/ebooks/EbookComplementarReprogramesuamenteparaemagrecer.pdf'
        },
        {
            'title': 'O Sono Eficiente Sem Neura',
            'desc': 'Higiene do sono baseada em ritmo circadiano, temperatura ambiente e regulação de melatonina para atletas.',
            'category': 'Saúde & Fisiologia',
            'type': 'pdf',
            'url': '/materiais/ebooks/RoteiroWebinrioOSonoEficienteSemNeura.pdf'
        }
    ]

    # 3. Preparar diretórios de destino
    os.makedirs(DEST_DIR, exist_ok=True)
    os.makedirs(os.path.join(DEST_DIR, "artigos"), exist_ok=True)
    os.makedirs(os.path.join(DEST_DIR, "data"), exist_ok=True)
    os.makedirs(os.path.join(DEST_DIR, "ebooks"), exist_ok=True)

    # 4. Copiar PDFs para DEST_DIR/ebooks se existirem
    for f in glob.glob(os.path.join(PDFS_SRC_DIR, "*.pdf")):
        fname = os.path.basename(f)
        dest_pdf = os.path.join(DEST_DIR, "ebooks", fname)
        if not os.path.exists(dest_pdf):
            shutil.copy2(f, dest_pdf)

    # 5. Gerar páginas individuais dos artigos
    print("Gerando 182 páginas HTML individuais de artigos...")
    for i, a in enumerate(articles):
        prev_a = articles[i - 1] if i > 0 else None
        next_a = articles[i + 1] if i < len(articles) - 1 else None
        
        art_html = generate_article_html(a['meta'], a['body_html'], prev_a, next_a)
        
        # Save to /materiais/artigos/<slug>/index.html
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

    print("✅ Build do Hub e Artigos concluído com sucesso!")

if __name__ == "__main__":
    main()
