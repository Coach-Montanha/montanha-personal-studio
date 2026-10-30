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
from datetime import datetime, timedelta

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

def infer_category_and_theme(title, content):
    tc = (title + " " + content[:1000]).lower()
    
    # Primárias do Systeme.io: 'Fitness' (137) e 'Desenvolvimento Pessoal' (33)
    # Temas: Treinamento Híbrido, Corrida & Endurance, Mobilidade Articular, Nutrição & Jejum, Mindset, Força & Hipertrofia
    
    is_dev_pessoal = any(k in tc for k in [
        "autodisciplina", "disciplina", "hábito", "habito", "foco", "rotina", "tempo", 
        "pomodoro", "produtividade", "mente", "mindset", "ansiedade", "medo", "bloqueio", 
        "mentalidade", "autocontrole", "vício", "vicio", "nada", "sono", "informações", 
        "ativo ou passivo", "controle-se", "nervos", "dopamina"
    ])
    
    primary_category = "Desenvolvimento Pessoal" if is_dev_pessoal else "Fitness"
    
    # Sub-tema específico para tags e filtros refinados
    if any(k in tc for k in ["híbrido", "hibrido", "hyrox", "densidade", "emom"]):
        theme = "Treinamento Híbrido"
    elif any(k in tc for k in ["corrida", "maratona", "5k", "15k", "maf", "endurance", "cadência", "pace", "trote"]):
        theme = "Corrida & Endurance"
    elif any(k in tc for k in ["mobilidade", "fáscia", "fascia", "alongamento", "articulação", "joelho", "lombar", "foam roller", "cócoras", "pisada"]):
        theme = "Mobilidade Articular"
    elif any(k in tc for k in ["nutrição", "nutricao", "dieta", "proteína", "proteina", "psyllium", "jejum", "carboidrato", "laticínios", "suplemento", "creatina", "whey", "caseína", "peixes", "ovos", "abacate"]):
        theme = "Nutrição & Jejum"
    elif any(k in tc for k in ["mente", "mindset", "ansiedade", "medo", "bloqueio", "mentalidade", "autocontrole"]):
        theme = "Mindset"
    else:
        theme = "Hipertrofia & Força" if primary_category == "Fitness" else "Autodisciplina"
        
    return primary_category, theme

# Datas decrementais a partir de 28 de Dezembro de 2025 para cobrir os 170 artigos originais
DIAS_SEMANA = ["segunda-feira", "terça-feira", "quarta-feira", "quinta-feira", "sexta-feira", "sábado", "domingo"]
MESES = ["janeiro", "fevereiro", "março", "abril", "maio", "junho", "julho", "agosto", "setembro", "outubro", "novembro", "dezembro"]

def get_article_date(idx, total):
    # Artigo 170 foi domingo, 28 de dezembro de 2025
    # Espaçamento médio de 5 a 7 dias entre artigos retrocedendo até 2022
    base_date = datetime(2025, 12, 28)
    days_back = int((total - idx - 1) * 7.1)
    d = base_date - timedelta(days=days_back)
    dia_sem = DIAS_SEMANA[d.weekday()]
    mes = MESES[d.month - 1]
    return f"{dia_sem}, {d.day} de {mes} de {d.year}", d.strftime("%d/%m/%Y")

def parse_frontmatter_and_body(filepath, idx, total_files):
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

    raw_title_str = str(meta['title'])
    meta['full_title'] = raw_title_str
    meta['clean_title'] = clean_title(raw_title_str)
    
    orig_slug = str(meta.get('slug', '')).strip()
    title_slug = slugify(meta['clean_title'])
    if not title_slug:
        title_slug = slugify(os.path.splitext(os.path.basename(filepath))[0])
    meta['original_slug'] = orig_slug
    meta['title_slug'] = title_slug
    meta['slug'] = orig_slug if orig_slug else title_slug

    prim_cat, theme = infer_category_and_theme(meta['clean_title'], body)
    meta['category'] = prim_cat
    meta['theme'] = theme

    date_full, date_short = get_article_date(idx, total_files)
    meta['date_full'] = date_full
    meta['date_short'] = date_short

    words = len(re.findall(r'\w+', body))
    meta['read_time'] = max(2, math.ceil(words / 140))
    meta['word_count'] = words

    plain = re.sub(r'[#*`_\[\]>]', '', body)
    plain = re.sub(r'\s+', ' ', plain).strip()
    plain = re.sub(r'^(Artigo #\d+.*?Systeme\.io:\s*|\s*)+', '', plain)
    meta['excerpt'] = plain[:150] + ("..." if len(plain) > 150 else "")

    return meta, body

# Common Head com Google Fonts Fira Sans & Montserrat
COMMON_HEAD = """
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="theme-color" content="#000000">
  <link rel="icon" type="image/png" href="/materiais/logo_blog_montanha.png">
  
  <!-- Fontes Oficiais do Blog: Fira Sans (Títulos) & Montserrat (Corpo) -->
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Fira+Sans:ital,wght@0,400;0,600;0,700;0,800;1,400;1,700&family=Montserrat:ital,wght@0,300;0,400;0,500;0,600;0,700;1,400;1,600&display=swap" rel="stylesheet">
  
  <style>
    :root {
      --bg: #000000;
      --card-bg: #111114;
      --card-border: #222226;
      --card-hover: #18181d;
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
      line-height: 1.75;
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
    .container { max-width: 1160px; margin: 0 auto; padding: 0 20px; }
    
    /* ========================================================
       TOPBAR OFICIAL FIEL AO SYSTEME.IO (2 NÍVEIS)
       ======================================================== */
    .topbar-blog {
      background: #000000;
      border-bottom: 1px solid var(--card-border);
      position: sticky;
      top: 0;
      z-index: 60;
    }
    
    /* Linha 1: Redes Sociais | Logo Central | Contador */
    .topbar-utility {
      border-bottom: 1px solid #1a1a1e;
      padding: 14px 0;
      background: #050507;
    }
    .utility-flex {
      display: flex;
      align-items: center;
      justify-content: space-between;
    }
    .top-socials {
      display: flex;
      align-items: center;
      gap: 14px;
      width: 250px;
    }
    .top-socials a {
      color: #71717a;
      transition: all 0.2s ease;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .top-socials a:hover {
      color: var(--primary);
      transform: translateY(-1px);
    }
    
    /* Logo Central com Kettlebell */
    .top-logo-center {
      text-align: center;
      flex: 1;
    }
    .top-logo-center a {
      display: inline-block;
    }
    .blog-logo-img {
      height: 52px;
      width: auto;
      max-width: 260px;
      object-fit: contain;
      filter: drop-shadow(0 2px 8px rgba(0,0,0,0.8));
      transition: opacity 0.2s;
    }
    .blog-logo-img:hover {
      opacity: 0.9;
    }
    
    /* Contador Odometer Digital Retro */
    .top-counter {
      display: flex;
      align-items: center;
      justify-content: flex-end;
      gap: 10px;
      width: 250px;
    }
    .counter-tag {
      font-size: 11px;
      font-weight: 700;
      letter-spacing: 0.1em;
      color: var(--text-dim);
      font-family: var(--font-title);
    }
    .odometer-box {
      display: inline-flex;
      align-items: center;
      gap: 3px;
      background: #111115;
      padding: 4px 8px;
      border-radius: 6px;
      border: 1px solid #27272a;
      box-shadow: inset 0 2px 4px rgba(0,0,0,0.6);
    }
    .odometer-box .digit {
      background: #1c1c22;
      color: #e4e4e7;
      font-family: 'Courier New', Courier, monospace;
      font-weight: 800;
      font-size: 14px;
      padding: 2px 6px;
      border-radius: 4px;
      border: 1px solid #33333a;
      box-shadow: 0 1px 2px rgba(0,0,0,0.5);
    }

    /* Linha 2: Navegação Centralizada */
    .topbar-nav {
      padding: 12px 0;
      background: rgba(0, 0, 0, 0.96);
      backdrop-filter: blur(12px);
    }
    .nav-flex {
      display: flex;
      align-items: center;
      justify-content: space-between;
    }
    .nav-links {
      display: flex;
      align-items: center;
      gap: 28px;
      margin: 0 auto;
    }
    .nav-item {
      font-size: 14.5px;
      font-weight: 600;
      color: #d4d4d8;
      text-transform: capitalize;
      transition: color 0.2s ease;
      position: relative;
    }
    .nav-item:hover {
      color: var(--primary);
    }
    .nav-cta {
      display: flex;
      align-items: center;
    }
    .btn-student-pill {
      font-size: 12.5px;
      padding: 6px 14px;
      border-radius: 9999px;
    }

    @media (max-width: 900px) {
      .top-socials { display: none; }
      .top-counter { display: none; }
      .blog-logo-img { height: 44px; }
      .nav-links {
        gap: 16px;
        overflow-x: auto;
        white-space: nowrap;
        padding-bottom: 4px;
        width: 100%;
        justify-content: flex-start;
      }
      .nav-flex {
        flex-direction: column;
        gap: 10px;
      }
      .nav-cta { display: none; }
    }

    /* Botões Padrão */
    .btn {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 6px;
      padding: 8px 18px;
      border-radius: 8px;
      font-size: 13.5px;
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
    
    /* Banners VIP e Visitante */
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
      background: #070709;
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
    .footer-col ul { list-style: none; }
    .footer-col li { margin-bottom: 10px; }
    .footer-col a {
      font-size: 13.5px;
      color: var(--text-muted);
      transition: color 0.2s;
    }
    .footer-col a:hover { color: #fff; }
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

    /* Modal de Lead para Visitantes */
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
      background: #141418;
      border: 1px solid #33333a;
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
    // Incremento do contador de visitas local
    let visits = parseInt(localStorage.getItem('montanha_blog_visits') || '4575');
    visits += 1;
    localStorage.setItem('montanha_blog_visits', visits.toString());

    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('student') === '1') {
      localStorage.setItem('montanha_is_student', '1');
    }
    const isStudent = localStorage.getItem('montanha_is_student') === '1';
    window.IS_STUDENT = isStudent;
    
    document.addEventListener('DOMContentLoaded', function() {
      // Atualizar dígitos do odometer
      const digitsBox = document.querySelector('.odometer-box');
      if (digitsBox) {
        const strVisits = visits.toString().padStart(4, '0');
        digitsBox.innerHTML = strVisits.split('').map(d => `<span class="digit">${d}</span>`).join('');
      }

      if (isStudent) {
        const vipBanner = document.getElementById('vipBanner');
        const visitorBanner = document.getElementById('visitorBanner');
        if (vipBanner) vipBanner.style.display = 'block';
        if (visitorBanner) visitorBanner.style.display = 'none';

        document.querySelectorAll('.btn-student-pill').forEach(btn => {
          btn.innerHTML = '👤 Painel do Aluno';
          btn.href = '/portal';
          btn.classList.remove('btn-outline');
          btn.classList.add('btn-vip');
        });
      }
    });
  })();
</script>
"""

def generate_topbar_html():
    return """
  <!-- Topbar Oficial em 2 Níveis -->
  <header class="topbar-blog">
    <!-- Nível 1: Redes Sociais, Logo Blog do Montanha e Contador -->
    <div class="topbar-utility">
      <div class="container utility-flex">
        <div class="top-socials">
          <a href="https://www.facebook.com/albertosarly.coutinho" target="_blank" title="Facebook" aria-label="Facebook">
            <svg width="18" height="18" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
          </a>
          <a href="https://www.instagram.com/coachmontanha1/" target="_blank" title="Instagram" aria-label="Instagram">
            <svg width="18" height="18" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
          </a>
          <a href="https://twitter.com/coachmontanha1" target="_blank" title="Twitter / X" aria-label="Twitter">
            <svg width="18" height="18" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
          </a>
          <a href="https://www.youtube.com/channel/UCy29z1eRp_GPFAVFHJfmg_A" target="_blank" title="YouTube" aria-label="YouTube">
            <svg width="18" height="18" fill="currentColor" viewBox="0 0 24 24"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
          </a>
        </div>

        <div class="top-logo-center">
          <a href="/materiais">
            <img src="/materiais/logo_blog_montanha.png" alt="Blog do Montanha" class="blog-logo-img">
          </a>
        </div>

        <div class="top-counter">
          <span class="counter-tag">VISITAS</span>
          <div class="odometer-box" title="Contador de Acessos">
            <span class="digit">4</span>
            <span class="digit">5</span>
            <span class="digit">7</span>
            <span class="digit">5</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Nível 2: Menu Principal Centralizado -->
    <div class="topbar-nav">
      <div class="container nav-flex">
        <nav class="nav-links">
          <a href="/materiais" class="nav-item">Início</a>
          <a href="/materiais#artigosSection" class="nav-item">Meus Artigos</a>
          <a href="/materiais#ebooksSection" class="nav-item">Livros/Ebooks</a>
          <a href="/materiais#cursosSection" class="nav-item">Cursos Online</a>
          <a href="/materiais#amazonSection" class="nav-item">Links Amazon</a>
          <a href="https://wa.me/5511999999999?text=Ol%C3%A1%20Coach%20Montanha,%20vim%20pelo%20Blog" target="_blank" class="nav-item">Contato</a>
        </nav>
        <div class="nav-cta">
          <a href="/portal" class="btn btn-outline btn-student-pill">Portal do Aluno ➔</a>
        </div>
      </div>
    </div>
  </header>
"""

def generate_footer_html():
    return """
  <!-- Rodapé Oficial de 4 Colunas do Blog -->
  <footer class="blog-footer">
    <div class="container">
      <div class="footer-grid">
        <div class="footer-col">
          <h4>LINKS RÁPIDOS</h4>
          <ul>
            <li><a href="/materiais">Início</a></li>
            <li><a href="/materiais#artigosSection">Meus Artigos</a></li>
            <li><a href="/materiais#ebooksSection">Livros/Ebooks</a></li>
            <li><a href="/materiais#cursosSection">Cursos Online</a></li>
            <li><a href="/materiais#amazonSection">Links Amazon</a></li>
            <li><a href="https://wa.me/5511999999999?text=Ol%C3%A1%20Coach%20Montanha,%20vim%20pelo%20Blog" target="_blank">Contato</a></li>
            <li><a href="/portal">Portal do Aluno</a></li>
          </ul>
        </div>

        <div class="footer-col">
          <h4>CATEGORIAS</h4>
          <ul>
            <li><a href="/materiais?cat=Fitness">Fitness (137 Artigos)</a></li>
            <li><a href="/materiais?cat=Desenvolvimento+Pessoal">Desenvolvimento Pessoal (33 Artigos)</a></li>
            <li><a href="/materiais?theme=Treinamento+Híbrido">Treinamento Híbrido</a></li>
            <li><a href="/materiais?theme=Corrida+&+Endurance">Corrida & Endurance</a></li>
            <li><a href="/materiais?theme=Mobilidade+Articular">Mobilidade Articular</a></li>
            <li><a href="/materiais?theme=Nutrição+&+Jejum">Nutrição & Jejum</a></li>
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
        <div>© 2026 Blog do Montanha • Coach Montanha. Todos os direitos reservados.</div>
        <div>Hospedado no Vercel Edge CDN com máxima velocidade e zero atrito.</div>
      </div>
    </div>
  </footer>
"""

def generate_article_html(meta, body_html, prev_art, next_art):
    # Seção dos 6 artigos populares clássicos do Systeme.io
    populares = [
        ("O segredo do meu emagrecimento é o NEAT!", "/materiais/artigos/o-segredo-do-meu-emagrecimento-e-o-neat"),
        ("O que fazer para ter um envelhecimento saudável", "/materiais/artigos/o-que-fazer-para-ter-um-envelhecimento-saudavel"),
        ("Balança: A Máquina Maligna da Indústria Fitness", "/materiais/artigos/a-balanca-a-maquina-maligna-da-industria-fitness"),
        ("Será que a fadiga mental influencia a performance?", "/materiais/artigos/sera-que-a-fadiga-mental-influencia-a-performance"),
        ("Alguns benefícios do Jejum Intermitente", "/materiais/artigos/alguns-beneficios-do-jejum-intermitente"),
        ("Quer emagrecer muito rápido? Invista no EPOC!", "/materiais/artigos/quer-emagrecer-muito-rapido-invista-no-epoc")
    ]
    
    pop_html = "".join([f"""
        <a href="{p[1]}" class="pop-item">
          <strong>{p[0]}</strong>
          <span>Por Coach Montanha</span>
        </a>
    """ for p in populares])

    prev_link = f'<a href="/materiais/artigos/{prev_art["slug"]}" class="nav-prev">← {prev_art["clean_title"][:40]}...</a>' if prev_art else '<span></span>'
    next_link = f'<a href="/materiais/artigos/{next_art["slug"]}" class="nav-next">{next_art["clean_title"][:40]}... →</a>' if next_art else '<span></span>'

    html = f"""<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <title>{meta['full_title']} | Coach Montanha</title>
  <meta name="description" content="{meta['excerpt']}">
  
  <!-- OpenGraph Meta Tags para WhatsApp e Redes -->
  <meta property="og:title" content="{meta['full_title']} | Coach Montanha">
  <meta property="og:description" content="{meta['excerpt']}">
  <meta property="og:url" content="https://montanha-personal-studio.vercel.app/materiais/artigos/{meta['slug']}">
  <meta property="og:type" content="article">
  <meta property="og:image" content="https://montanha-personal-studio.vercel.app/materiais/logo_blog_montanha.png">
  <meta property="og:site_name" content="Blog do Montanha • Oficial">
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="{meta['full_title']}">
  <meta name="twitter:description" content="{meta['excerpt']}">

  {COMMON_HEAD}
  {STUDENT_DETECTION_SCRIPT}

  <style>
    .article-wrap {{
      max-width: 860px;
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
      flex-wrap: wrap;
    }}
    .breadcrumbs a:hover {{ color: var(--primary); }}
    
    .article-header {{
      text-align: center;
      margin-bottom: 36px;
      padding-bottom: 28px;
      border-bottom: 1px solid var(--card-border);
    }}
    .article-badge {{
      display: inline-block;
      font-size: 11px;
      text-transform: uppercase;
      letter-spacing: 0.12em;
      font-weight: 800;
      color: var(--primary);
      background: var(--primary-soft);
      border: 1px solid rgba(245, 158, 11, 0.3);
      padding: 4px 14px;
      border-radius: 9999px;
      margin-bottom: 16px;
      font-family: var(--font-title);
    }}
    .article-title {{
      font-size: 36px;
      font-weight: 800;
      line-height: 1.25;
      margin-bottom: 14px;
      color: #ffffff;
    }}
    .article-meta {{
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 14px;
      font-size: 13.5px;
      color: var(--text-muted);
      flex-wrap: wrap;
    }}
    .article-meta span {{ display: flex; align-items: center; gap: 4px; }}
    
    /* Corpo do Texto Tipografia Fiel Systeme.io */
    .prose {{
      font-size: 18.5px;
      line-height: 1.85;
      color: #e4e4e7;
    }}
    .prose p {{ margin-bottom: 22px; }}
    .prose h2, .prose h3, .prose h4 {{
      margin: 40px 0 18px 0;
      color: #fff;
    }}
    .prose h2 {{ font-size: 26px; border-bottom: 1px solid #1f1f23; padding-bottom: 8px; }}
    .prose h3 {{ font-size: 21px; }}
    .prose h4 {{ font-size: 18px; color: var(--primary); }}
    .prose ul, .prose ol {{
      margin: 0 0 24px 28px;
    }}
    .prose li {{ margin-bottom: 8px; }}
    .prose strong {{ color: #ffffff; font-weight: 700; }}
    .prose blockquote {{
      border-left: 4px solid var(--primary);
      background: #111115;
      padding: 16px 20px;
      border-radius: 0 8px 8px 0;
      margin: 24px 0;
      color: #d4d4d8;
      font-style: italic;
    }}
    .prose hr {{
      border: none;
      border-top: 1px solid var(--card-border);
      margin: 40px 0;
    }}
    .prose table {{
      width: 100%;
      border-collapse: collapse;
      margin: 28px 0;
      font-size: 15px;
    }}
    .prose th, .prose td {{
      padding: 12px 14px;
      border: 1px solid var(--card-border);
    }}
    .prose th {{
      background: #18181c;
      color: var(--primary);
      font-weight: 700;
    }}
    .prose img {{
      max-width: 100%;
      height: auto;
      border-radius: 12px;
      margin: 28px auto;
      display: block;
      box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
      border: 1px solid var(--card-border);
      transition: transform 0.2s ease;
    }}
    .prose figure {{
      margin: 32px auto;
      text-align: center;
      max-width: 100%;
    }}
    .prose figcaption {{
      margin-top: 8px;
      font-size: 13.5px;
      color: var(--text-muted);
      font-style: italic;
    }}
    .prose a {{
      color: var(--primary);
      text-decoration: underline;
      text-underline-offset: 4px;
      font-weight: 500;
      transition: color 0.15s ease;
    }}
    .prose a:hover {{
      color: #fbbf24;
    }}

    /* Compartilhamento */
    .share-box {{
      margin-top: 48px;
      padding: 22px;
      background: #0d0d10;
      border: 1px solid var(--card-border);
      border-radius: 12px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      flex-wrap: wrap;
      gap: 16px;
    }}

    /* Artigos Populares */
    .popular-posts-box {{
      margin-top: 50px;
      padding: 30px;
      background: #0d0d10;
      border: 1px solid var(--card-border);
      border-radius: 14px;
    }}
    .popular-title {{
      font-size: 20px;
      font-weight: 800;
      color: var(--primary);
      margin-bottom: 20px;
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }}
    .popular-list {{
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
      gap: 16px;
    }}
    .pop-item {{
      display: block;
      padding: 14px 16px;
      background: #141418;
      border: 1px solid #222227;
      border-radius: 8px;
      transition: all 0.2s ease;
    }}
    .pop-item:hover {{
      border-color: var(--primary);
      background: #18181e;
      transform: translateY(-2px);
    }}
    .pop-item strong {{
      display: block;
      font-size: 14.5px;
      color: #fff;
      font-family: var(--font-title);
      margin-bottom: 4px;
      line-height: 1.35;
    }}
    .pop-item span {{
      font-size: 12px;
      color: var(--text-dim);
    }}

    /* Caixa de Comentário / WhatsApp */
    .comment-box {{
      margin-top: 48px;
      padding: 28px;
      background: radial-gradient(circle at 100% 0%, rgba(37, 211, 102, 0.1) 0%, rgba(13, 13, 16, 0.9) 100%);
      border: 1px solid rgba(37, 211, 102, 0.3);
      border-radius: 14px;
      text-align: center;
    }}

    /* Navegação Sequencial */
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
  </style>
</head>
<body>

  {generate_topbar_html()}

  <article class="article-wrap">
    <div class="breadcrumbs">
      <a href="/materiais">Início</a>
      <span>›</span>
      <a href="/materiais?cat={meta['category']}">{meta['category']}</a>
      <span>›</span>
      <span>{meta['clean_title'][:35]}...</span>
    </div>

    <div class="article-header">
      <span class="article-badge">{meta['category']} • {meta['theme']}</span>
      <h1 class="article-title">{meta['full_title']}</h1>
      <div class="article-meta">
        <span>📅 {meta['date_full']}</span>
        <span>•</span>
        <span>Por <strong>Coach Montanha</strong></span>
        <span>•</span>
        <span>⏱️ {meta['read_time']} min de leitura</span>
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
        <a href="https://api.whatsapp.com/send?text={meta['full_title']}%20%E2%80%94%20Coach%20Montanha%20https://montanha-personal-studio.vercel.app/materiais/artigos/{meta['slug']}" target="_blank" class="btn btn-primary" style="background:#25d366; color:#000;">
          📲 Compartilhar no WhatsApp
        </a>
        <button onclick="navigator.clipboard.writeText(window.location.href); alert('Link copiado com sucesso!');" class="btn btn-outline">
          🔗 Copiar Link
        </button>
      </div>
    </div>

    <!-- Seção de Artigos Populares Clássicos -->
    <div class="popular-posts-box">
      <h3 class="popular-title">Artigos Populares</h3>
      <div class="popular-list">
        {pop_html}
      </div>
    </div>

    <!-- Caixa de Interação / Comentário via WhatsApp -->
    <div class="comment-box">
      <h3 style="font-size:20px; font-weight:800; color:#fff; margin-bottom:8px; font-family:var(--font-title);">Deixe seu comentário ou tire sua dúvida</h3>
      <p style="font-size:14px; color:var(--text-muted); max-width:540px; margin:0 auto 18px auto;">
        Quer feedback sobre sua rotina ou sugestão para o próximo artigo? Fale direto com o Coach Montanha.
      </p>
      <a href="https://wa.me/5511999999999?text=Ol%C3%A1%20Coach%20Montanha,%20li%20o%20artigo%20'{meta['clean_title']}'%20e%20gostaria%20de%20comentar" class="btn btn-primary" target="_blank" style="background:#25d366; color:#000; padding:12px 24px; font-size:15px;">
        Enviar Mensagem no WhatsApp ➔
      </a>
    </div>

    <!-- Navegação Sequencial -->
    <div class="nav-carousel">
      {prev_link}
      {next_link}
    </div>
  </article>

  {generate_footer_html()}

</body>
</html>
"""
    return html

def generate_hub_html(articles, ebooks, courses, amazon_books):
    categories = [
        ("Todas", "Todas as Categorias"),
        ("Fitness", "Fitness (137)"),
        ("Desenvolvimento Pessoal", "Desenvolvimento Pessoal (33)"),
        ("Ebooks", "Livros/Ebooks (16)"),
        ("Cursos", "Cursos Online (2)"),
        ("Amazon", "Links Amazon (24)")
    ]

    cat_pills = "".join([f'<button class="cat-pill {"active" if i == 0 else ""}" data-category="{c[0]}">{c[1]}</button>' for i, c in enumerate(categories)])

    # Ebook cards
    ebook_cards_html = ""
    for eb in ebooks:
        badge_class = "badge-app" if eb.get("type") == "app" else "badge-pdf"
        badge_text = "Web App Interativo" if eb.get("type") == "app" else "PDF AcroForm"
        if eb.get("type") == "app":
            action_btn = f'<a href="{eb["url"]}" class="btn btn-primary" style="width:100%; text-align:center;">Abrir Web App ➔</a>'
        elif eb.get("type") == "hotmart":
            action_btn = f'<a href="{eb["url"]}" target="_blank" class="btn btn-primary" style="width:100%; text-align:center;">Acessar na Hotmart ➔</a>'
        else:
            action_btn = f'<button onclick="handleDownloadEbook(\'{eb["title"]}\', \'{eb["url"]}\')" class="btn btn-outline" style="width:100%;">Baixar PDF Oficial ⬇</button>'

        ebook_cards_html += f"""
        <div class="ebook-card" data-category="Ebooks" data-title="{eb['title'].lower()}" data-desc="{eb['desc'].lower()}">
          <div class="card-top">
            <span class="badge {badge_class}">{badge_text}</span>
            <span class="meta-tag">{eb.get("category", "Programa")}</span>
          </div>
          <h3 class="card-title">{eb["title"]}</h3>
          <p class="card-desc">{eb["desc"]}</p>
          <div class="card-footer">
            {action_btn}
          </div>
        </div>
        """

    # Course cards
    course_cards_html = ""
    for c in courses:
        course_cards_html += f"""
        <div class="course-card" data-category="Cursos">
          <div class="card-top">
            <span class="badge" style="background:rgba(59, 130, 246, 0.15); color:#60a5fa; border:1px solid rgba(59, 130, 246, 0.3);">Comunidade Oficial</span>
            <span class="meta-tag">Aulas Práticas</span>
          </div>
          <h3 class="card-title">{c['title']}</h3>
          <p class="card-desc">{c['desc']}</p>
          <div class="card-footer">
            <a href="{c['url']}" target="_blank" class="btn btn-primary" style="width:100%; text-align:center;">{c['btn_text']} ➔</a>
          </div>
        </div>
        """

    # Amazon books cards
    amazon_cards_html = ""
    for b in amazon_books:
        amazon_cards_html += f"""
        <div class="amazon-card" data-category="Amazon" data-title="{b['title'].lower()}">
          <div class="amazon-badge">{b.get('theme', 'Leitura')}</div>
          <h4 class="amazon-title">{b['title']}</h4>
          <span class="amazon-author">Por {b['author']}</span>
          <a href="{b['url']}" target="_blank" class="btn btn-outline amazon-btn">Ver na Amazon ➔</a>
        </div>
        """

    # Article cards
    article_cards_html = ""
    for a in articles:
        article_cards_html += f"""
        <a href="/materiais/artigos/{a['slug']}" class="article-card" data-category="{a['category']}" data-theme="{a['theme']}" data-title="{a['clean_title'].lower()} {a['full_title'].lower()}" data-excerpt="{a['excerpt'].lower()}">
          <div class="card-top">
            <span class="badge badge-artigo">{a['category']}</span>
            <span class="meta-tag">{a['date_short']}</span>
          </div>
          <h3 class="card-title">{a['full_title']}</h3>
          <p class="card-desc">{a['excerpt']}</p>
          <div class="card-footer">
            <span class="read-link">Ler artigo completo ➔</span>
            <span class="meta-tag">⏱️ {a['read_time']} min</span>
          </div>
        </a>
        """

    html = f"""<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <title>Blog do Montanha • Artigos, E-books, Cursos & Links Amazon</title>
  <meta name="description" content="Acesse todos os 182 artigos do blog, 16 e-books, cursos e livros recomendados do Coach Montanha. Fitness, força, corrida e desenvolvimento pessoal.">
  <meta property="og:title" content="Blog do Montanha • Artigos, E-books, Cursos & Links Amazon">
  <meta property="og:description" content="O acervo oficial do Coach Montanha: artigos publicados, e-books e ferramentas interativas.">
  <meta property="og:image" content="https://montanha-personal-studio.vercel.app/materiais/logo_blog_montanha.png">
  <meta property="og:type" content="website">
  <meta property="og:url" content="https://montanha-personal-studio.vercel.app/materiais">
  {COMMON_HEAD}
  {STUDENT_DETECTION_SCRIPT}
  <style>
    .hero-section {{
      padding: 50px 0 32px 0;
      text-align: center;
      border-bottom: 1px solid var(--card-border);
      background: radial-gradient(circle at 50% 0%, rgba(245, 158, 11, 0.08) 0%, transparent 70%);
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
      font-size: 40px;
      font-weight: 800;
      margin-bottom: 12px;
      color: #fff;
      line-height: 1.15;
    }}
    .hero-subtitle {{
      font-size: 16px;
      color: var(--text-muted);
      max-width: 680px;
      margin: 0 auto;
    }}
    
    .controls-wrap {{
      margin: 32px 0 24px 0;
      display: flex;
      flex-direction: column;
      gap: 16px;
    }}
    .search-input-wrap {{
      position: relative;
      max-width: 100%;
    }}
    .search-input {{
      width: 100%;
      background: #111115;
      border: 1px solid #27272e;
      border-radius: 12px;
      padding: 14px 20px 14px 48px;
      color: #fff;
      font-size: 15px;
      font-family: var(--font-body);
      outline: none;
      transition: all 0.2s ease;
    }}
    .search-input:focus {{
      border-color: var(--primary);
      background: #15151b;
      box-shadow: 0 0 0 3px rgba(245, 158, 11, 0.15);
    }}
    .search-icon {{
      position: absolute;
      left: 18px;
      top: 50%;
      transform: translateY(-50%);
      color: var(--text-dim);
      font-size: 18px;
    }}
    
    .cat-pills-wrap {{
      display: flex;
      align-items: center;
      gap: 10px;
      flex-wrap: wrap;
    }}
    .cat-pill {{
      background: #111115;
      border: 1px solid #27272e;
      color: var(--text-muted);
      padding: 8px 16px;
      border-radius: 9999px;
      font-size: 13px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.2s ease;
      font-family: var(--font-title);
    }}
    .cat-pill:hover {{
      background: #1a1a22;
      color: #fff;
    }}
    .cat-pill.active {{
      background: var(--primary);
      color: #000;
      border-color: var(--primary);
      font-weight: 700;
    }}

    .section-header-block {{
      margin: 48px 0 24px 0;
      display: flex;
      align-items: center;
      justify-content: space-between;
      border-bottom: 1px solid var(--card-border);
      padding-bottom: 14px;
    }}
    .section-title {{
      font-size: 24px;
      font-weight: 800;
      color: #fff;
      display: flex;
      align-items: center;
      gap: 10px;
    }}
    
    /* Grids */
    .cards-grid {{
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
      gap: 22px;
    }}
    .article-card, .ebook-card, .course-card {{
      background: var(--card-bg);
      border: 1px solid var(--card-border);
      border-radius: 12px;
      padding: 22px;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      transition: all 0.2s ease;
    }}
    .article-card:hover, .ebook-card:hover, .course-card:hover {{
      background: var(--card-hover);
      border-color: rgba(245, 158, 11, 0.4);
      transform: translateY(-3px);
      box-shadow: 0 12px 24px -10px rgba(0, 0, 0, 0.5);
    }}
    .card-top {{
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 12px;
    }}
    .badge {{
      font-size: 11px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      padding: 3px 10px;
      border-radius: 6px;
      font-family: var(--font-title);
    }}
    .badge-artigo {{
      background: rgba(245, 158, 11, 0.12);
      color: #fbbf24;
      border: 1px solid rgba(245, 158, 11, 0.25);
    }}
    .badge-app {{
      background: rgba(16, 185, 129, 0.15);
      color: #34d399;
      border: 1px solid rgba(16, 185, 129, 0.3);
    }}
    .badge-pdf {{
      background: rgba(59, 130, 246, 0.15);
      color: #60a5fa;
      border: 1px solid rgba(59, 130, 246, 0.3);
    }}
    .meta-tag {{
      font-size: 12px;
      color: var(--text-dim);
    }}
    .card-title {{
      font-size: 17.5px;
      font-weight: 700;
      color: #fff;
      margin-bottom: 10px;
      line-height: 1.35;
    }}
    .card-desc {{
      font-size: 13.5px;
      color: var(--text-muted);
      line-height: 1.55;
      margin-bottom: 18px;
      flex-grow: 1;
    }}
    .card-footer {{
      display: flex;
      align-items: center;
      justify-content: space-between;
      border-top: 1px solid #1c1c22;
      padding-top: 14px;
    }}
    .read-link {{
      font-size: 13px;
      font-weight: 700;
      color: var(--primary);
      font-family: var(--font-title);
    }}

    /* Amazon Grid */
    .amazon-grid {{
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
      gap: 18px;
    }}
    .amazon-card {{
      background: #0f0f12;
      border: 1px solid var(--card-border);
      border-radius: 10px;
      padding: 18px;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      transition: all 0.2s ease;
    }}
    .amazon-card:hover {{
      border-color: #f59e0b;
      transform: translateY(-2px);
      background: #141418;
    }}
    .amazon-badge {{
      font-size: 10.5px;
      text-transform: uppercase;
      font-weight: 700;
      color: var(--primary);
      margin-bottom: 8px;
    }}
    .amazon-title {{
      font-size: 15px;
      color: #fff;
      font-weight: 700;
      line-height: 1.35;
      margin-bottom: 6px;
    }}
    .amazon-author {{
      font-size: 12.5px;
      color: var(--text-dim);
      margin-bottom: 14px;
      display: block;
    }}
    .amazon-btn {{
      font-size: 12.5px;
      width: 100%;
      text-align: center;
    }}
  </style>
</head>
<body>

  {generate_topbar_html()}

  <div id="vipBanner" class="banner-vip">
    <div class="container">
      ✨ <strong>Modo Aluno VIP Ativado:</strong> Você tem acesso liberado a todos os 182 artigos e downloads diretos de e-books sem formulário.
    </div>
  </div>

  <div id="visitorBanner" class="banner-visitor">
    <div class="container">
      💡 Bem-vindo ao acervo oficial do Coach Montanha. Explore nossos 182 artigos e protocolos abertos.
    </div>
  </div>

  <section class="hero-section">
    <div class="container">
      <div class="hero-badge">Acervo Oficial Coach Montanha</div>
      <h1 class="hero-title">Blog do Montanha</h1>
      <p class="hero-subtitle">
        Todos os 182 artigos de treinamento, 16 e-books, ferramentas interativas, cursos online e leituras recomendadas em um só lugar.
      </p>
    </div>
  </section>

  <main class="container">
    <div class="controls-wrap">
      <div class="search-input-wrap">
        <span class="search-icon">🔍</span>
        <input type="text" id="searchInput" class="search-input" placeholder="Pesquisar por assunto, título ou palavra-chave (ex: remo, zona 2, jejum, hipertrofia)...">
      </div>

      <div class="cat-pills-wrap" id="catPills">
        {cat_pills}
      </div>
    </div>

    <!-- Seção de Artigos Publicados -->
    <section id="artigosSection">
      <div class="section-header-block">
        <h2 class="section-title">
          <span>📚 Meus Artigos</span>
          <span style="font-size:14px; color:var(--text-dim); font-weight:500;">(182 publicados)</span>
        </h2>
      </div>

      <div class="cards-grid" id="articlesGrid">
        {article_cards_html}
      </div>
    </section>

    <!-- Seção de E-books & Protocolos -->
    <section id="ebooksSection" style="margin-top:60px;">
      <div class="section-header-block">
        <h2 class="section-title">
          <span>📖 Livros & E-books</span>
          <span style="font-size:14px; color:var(--text-dim); font-weight:500;">(16 disponíveis)</span>
        </h2>
      </div>

      <div class="cards-grid">
        {ebook_cards_html}
      </div>
    </section>

    <!-- Seção de Cursos Online -->
    <section id="cursosSection" style="margin-top:60px;">
      <div class="section-header-block">
        <h2 class="section-title">
          <span>🎓 Cursos Online & Comunidades</span>
        </h2>
      </div>

      <div class="cards-grid">
        {course_cards_html}
      </div>
    </section>

    <!-- Seção de Links Amazon -->
    <section id="amazonSection" style="margin-top:60px;">
      <div class="section-header-block">
        <h2 class="section-title">
          <span>📦 Livros Recomendados (Links Amazon)</span>
          <span style="font-size:14px; color:var(--text-dim); font-weight:500;">(24 títulos essenciais)</span>
        </h2>
      </div>

      <div class="amazon-grid">
        {amazon_cards_html}
      </div>
    </section>
  </main>

  <!-- Modal de Captura de Lead para Visitantes -->
  <div class="modal-backdrop" id="leadModal">
    <div class="modal-box">
      <button class="modal-close" onclick="closeLeadModal()">✕</button>
      <div class="hero-badge" style="margin-bottom:12px;">Download do E-book</div>
      <h3 id="modalEbookTitle" style="font-size:20px; font-weight:800; color:#fff; margin-bottom:8px; line-height:1.25;"></h3>
      <p style="font-size:13.5px; color:var(--text-muted); margin-bottom:20px;">
        Informe seu nome e WhatsApp para receber o material e liberar o download imediato:
      </p>
      
      <form id="leadForm" onsubmit="submitLeadForm(event)">
        <input type="text" id="leadName" class="modal-input" placeholder="Seu nome completo" required>
        <input type="tel" id="leadPhone" class="modal-input" placeholder="Seu WhatsApp com DDD (ex: 11999999999)" required>
        <button type="submit" class="btn btn-primary" style="width:100%; padding:12px;">Liberar Download do PDF ➔</button>
      </form>
    </div>
  </div>

  {generate_footer_html()}

  <script>
    // Filtro e Busca em Tempo Real
    const searchInput = document.getElementById('searchInput');
    const catPills = document.querySelectorAll('.cat-pill');
    let currentCategory = 'Todas';

    function filterContent() {{
      const query = searchInput.value.toLowerCase().trim();
      const articleCards = document.querySelectorAll('.article-card');
      const ebookCards = document.querySelectorAll('.ebook-card');

      articleCards.forEach(card => {{
        const title = card.getAttribute('data-title') || '';
        const excerpt = card.getAttribute('data-excerpt') || '';
        const cat = card.getAttribute('data-category') || '';
        const matchesQuery = !query || title.includes(query) || excerpt.includes(query);
        const matchesCat = (currentCategory === 'Todas') || (cat === currentCategory);

        if (currentCategory === 'Ebooks' || currentCategory === 'Cursos' || currentCategory === 'Amazon') {{
          card.style.display = 'none';
        }} else {{
          card.style.display = (matchesQuery && matchesCat) ? 'flex' : 'none';
        }}
      }});

      // Se categoria for Ebooks, rolar até ebooksSection
      if (currentCategory === 'Ebooks') {{
        document.getElementById('ebooksSection').scrollIntoView({{ behavior: 'smooth' }});
      }} else if (currentCategory === 'Cursos') {{
        document.getElementById('cursosSection').scrollIntoView({{ behavior: 'smooth' }});
      }} else if (currentCategory === 'Amazon') {{
        document.getElementById('amazonSection').scrollIntoView({{ behavior: 'smooth' }});
      }}
    }}

    searchInput.addEventListener('input', filterContent);

    catPills.forEach(pill => {{
      pill.addEventListener('click', function() {{
        catPills.forEach(p => p.classList.remove('active'));
        this.classList.add('active');
        currentCategory = this.getAttribute('data-category');
        filterContent();
      }});
    }});

    // Gerenciador de Download
    let pendingDownloadUrl = '';
    function handleDownloadEbook(title, url) {{
      if (window.IS_STUDENT) {{
        window.open(url, '_blank');
      }} else {{
        pendingDownloadUrl = url;
        document.getElementById('modalEbookTitle').innerText = title;
        document.getElementById('leadModal').style.display = 'flex';
      }}
    }}

    function closeLeadModal() {{
      document.getElementById('leadModal').style.display = 'none';
    }}

    function submitLeadForm(e) {{
      e.preventDefault();
      const name = document.getElementById('leadName').value;
      const phone = document.getElementById('leadPhone').value;
      const title = document.getElementById('modalEbookTitle').innerText;

      closeLeadModal();
      window.open(pendingDownloadUrl, '_blank');
      alert('Download liberado! Em caso de dúvidas, nos contate pelo WhatsApp.');
    }}
  </script>

</body>
</html>
"""
    return html

def main():
    print("Iniciando build do Blog do Montanha (Replica Fiel Systeme.io)...")

    # 1. Carregar Artigos e Deduplicar
    files = sorted(glob.glob(os.path.join(ARTICLES_SRC_DIR, "*.md")))
    total_files = len(files)
    print(f"Total de arquivos Markdown encontrados: {total_files}")

    md = markdown.Markdown(extensions=['extra', 'tables', 'fenced_code'])

    # Agrupar por canonical slug, priorizando a versão com maior conteúdo
    raw_articles_map = {}
    for idx, filepath in enumerate(files):
        meta, body_raw = parse_frontmatter_and_body(filepath, idx, total_files)
        slug = meta['slug']
        if slug not in raw_articles_map or len(body_raw) > len(raw_articles_map[slug]['body_raw']):
            raw_articles_map[slug] = {
                'meta': meta,
                'body_raw': body_raw,
                'filepath': filepath
            }

    articles = []
    for slug, item in raw_articles_map.items():
        meta = item['meta']
        body_raw = item['body_raw']

        clean_body = re.sub(r'^#\s+.*?\n', '', body_raw, count=1).strip()
        body_html = md.reset().convert(clean_body)

        articles.append({
            'meta': meta,
            'body_html': body_html,
            'full_title': meta['full_title'],
            'clean_title': meta['clean_title'],
            'slug': meta['slug'],
            'original_slug': meta.get('original_slug', ''),
            'title_slug': meta.get('title_slug', ''),
            'category': meta['category'],
            'theme': meta['theme'],
            'date_full': meta['date_full'],
            'date_short': meta['date_short'],
            'read_time': meta['read_time'],
            'excerpt': meta['excerpt']
        })

    print(f"Artigos únicos após deduplicação: {len(articles)}")

    # 2. Definir Livros & E-books (16 itens + 3 comerciais)
    ebooks = [
        {
            'title': 'Protocolo do Atleta Híbrido (30 Dias)',
            'desc': 'Força, densidade e corrida em 30 dias. Checklist diário, EMOM interativo de 20 minutos e timers integrados.',
            'category': 'Treinamento Híbrido',
            'type': 'app',
            'url': '/materiais/treinamento-hibrido'
        },
        {
            'title': 'Programa de Mobilidade & Liberação Miofascial (30 Dias)',
            'desc': 'Rotina diária de 15 minutos com rolo de espuma e mobilidade articular para desbloquear joelho, lombar e ombros.',
            'category': 'Mobilidade Articular',
            'type': 'app',
            'url': '/materiais/mobilidade'
        },
        {
            'title': 'Calculadora e Guia TDEE & Macronutrientes',
            'desc': 'Cálculo exato de gasto calórico e repartição de macronutrientes para hipertrofia e recomposição corporal.',
            'category': 'Nutrição & Jejum',
            'type': 'app',
            'url': '/materiais/tdee-macros'
        },
        {
            'title': '75 Receitas Low Carb, Fit e Doces',
            'desc': 'Quem foi que disse que para emagrecer você deve comer comidas sem graça? 25 receitas low carb, 25 fit e 25 doces.',
            'category': 'Nutrição & Jejum',
            'type': 'hotmart',
            'url': 'https://hotmart.com/pt-br/marketplace/produtos/ebook-75-receitas-low-carb-fit-e-doces/I73781290L'
        },
        {
            'title': 'Queime Gordura 24 Horas por Dia',
            'desc': 'Estratégias de combinação de treino resistido e cardio para acelerar a taxa metabólica basal e queima de lipídios.',
            'category': 'Fitness',
            'type': 'hotmart',
            'url': 'https://hotmart.com/pt-br/marketplace/produtos/ebook-queime-gordura-24h-por-dia/B73780383I?sck=HOTMART_PRODUCT_PAGE'
        },
        {
            'title': 'Como Começar a Correr? Do Sofá para a Corrida',
            'desc': 'Passo a passo seguro de evolução aeróbica para corredores iniciantes sem impacto articular excessivo.',
            'category': 'Corrida & Endurance',
            'type': 'hotmart',
            'url': 'https://hotmart.com/pt-br/marketplace/produtos/ebook-como-comecar-a-correr/H73905630T?sck=HOTMART_PRODUCT_PAGE'
        },
        {
            'title': 'Revolucione a sua Corrida: Programa 5k',
            'desc': 'Periodização de 8 a 12 semanas para os primeiros 5 quilômetros ou quebra de recorde pessoal na distância.',
            'category': 'Corrida & Endurance',
            'type': 'pdf',
            'url': '/materiais/ebooks/EbookRevolucioneasuacorridaPrograma5k.pdf'
        },
        {
            'title': 'Revolucione a sua Corrida: Programa 15k',
            'desc': 'Treinamento de resistência aeróbica e cadência para provas de média distância e meias-maratonas.',
            'category': 'Corrida & Endurance',
            'type': 'pdf',
            'url': '/materiais/ebooks/EbookRevolucioneasuacorridaPrograma15k.pdf'
        },
        {
            'title': 'Treinamento Específico de Hipertrofia (HST)',
            'desc': 'Guia de aplicação do método Hypertrophy-Specific Training (frequência mecânica e descondicionamento estratégico).',
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
            'title': 'Reprograme sua Mente para Emagrecer',
            'desc': 'Quebra de hábitos compulsivos, gatilhos de estresse e mecanismos de saciedade hormonal.',
            'category': 'Desenvolvimento Pessoal',
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

    # 3. Definir Cursos Online
    courses = [
        {
            'title': 'Comunidade do Montanha Kettlebell Club',
            'desc': 'Domine o treino com kettlebell do zero ao avançado: swing, clean, snatch, get-up e periodização completa para força e potência.',
            'url': 'https://hotmart.com/pt-br/marketplace/produtos/coach-montanha-kettlebell-club/Q3',
            'btn_text': 'Quero Fazer Parte do Club'
        },
        {
            'title': 'Comunidade do Montanha Aulas Shorts',
            'desc': 'Treinos rápidos e intensos de 15 a 20 minutos desenhados para alta queima calórica e condicionamento em qualquer lugar.',
            'url': 'https://hotmart.com/pt-br/marketplace/produtos/comunidade-do-montanha-shorts/V36',
            'btn_text': 'Quero Acesso às Aulas Shorts'
        }
    ]

    # 4. Definir 24 Livros Recomendados (Amazon Links)
    amazon_books = [
        {'title': 'Bons Hábitos, Maus Hábitos', 'author': 'Wendy Wood', 'theme': 'Hábitos & Foco', 'url': 'https://amzn.to/3hPrTwi'},
        {'title': 'O Clube das 5 da Manhã', 'author': 'Robin Sharma', 'theme': 'Rotina & Produtividade', 'url': 'https://amzn.to/3UKz7jX'},
        {'title': 'Como Superar Seus Limites Internos', 'author': 'Steven Pressfield', 'theme': 'Mindset & Foco', 'url': 'https://amzn.to/3EFSzsp'},
        {'title': 'Além Da Ordem: Mais 12 Regras', 'author': 'Jordan Peterson', 'theme': 'Desenvolvimento Pessoal', 'url': 'https://amzn.to/3EiFbJq'},
        {'title': 'O Código da Obesidade', 'author': 'Dr. Jason Fung', 'theme': 'Nutrição & Jejum', 'url': 'https://amzn.to/3Tsrb5s'},
        {'title': 'Superintestino', 'author': 'Dr. William Davis', 'theme': 'Saúde & Nutrição', 'url': 'https://amzn.to/3TvGfyW'},
        {'title': 'Por que Engordamos', 'author': 'Gary Taubes', 'theme': 'Metabolismo', 'url': 'https://amzn.to/3NVfJOB'},
        {'title': 'A Dieta da Mente', 'author': 'Dr. David Perlmutter', 'theme': 'Neurociência & Dieta', 'url': 'https://amzn.to/3hz7ueW'},
        {'title': 'Trabalhe 4 Horas por Semana', 'author': 'Timothy Ferriss', 'theme': 'Eficiência & Gestão', 'url': 'https://amzn.to/3SN9Jbi'},
        {'title': 'Os 7 Hábitos das Pessoas Eficazes', 'author': 'Stephen R. Covey', 'theme': 'Liderança & Hábitos', 'url': 'https://amzn.to/3DGnTH1'},
        {'title': 'Os Segredos da Mente Milionária', 'author': 'T. Harv Eker', 'theme': 'Mentalidade & Riqueza', 'url': 'https://amzn.to/3SOhI89'},
        {'title': '12 Regras para a Vida', 'author': 'Jordan Peterson', 'theme': 'Desenvolvimento Pessoal', 'url': 'https://amzn.to/3sHGufq'},
        {'title': 'Tribos: Nós Precisamos de Você', 'author': 'Seth Godin', 'theme': 'Liderança & Comunidade', 'url': 'https://amzn.to/3WfkPJi'},
        {'title': 'A Coragem de Não Agradar', 'author': 'Ichiro Kishimi', 'theme': 'Filosofia & Psicologia', 'url': 'https://amzn.to/3DGYz3I'},
        {'title': 'Sem Limites: Aprimore seu Cérebro', 'author': 'Jim Kwik', 'theme': 'Alta Performance Mental', 'url': 'https://amzn.to/3Dh7TKd'},
        {'title': 'A Única Coisa', 'author': 'Gary Keller', 'theme': 'Foco & Produtividade', 'url': 'https://amzn.to/3Dh81cF'},
        {'title': '1 Ano Em 12 Semanas', 'author': 'Brian P. Moran', 'theme': 'Execução de Metas', 'url': 'https://amzn.to/3sJuDha'},
        {'title': 'Essencialismo: A Busca por Menos', 'author': 'Greg McKeown', 'theme': 'Produtividade', 'url': 'https://amzn.to/3fhZ3DQ'},
        {'title': 'Açúcar: Culpado ou Inocente?', 'author': 'Gary Taubes', 'theme': 'Nutrição', 'url': 'https://amzn.to/3DHDVjU'},
        {'title': 'Responsabilidade Extrema', 'author': 'Jocko Willink', 'theme': 'Disciplina & Liderança', 'url': 'https://amzn.to/3fhZbDk'},
        {'title': 'Nação Dopamina', 'author': 'Dra. Anna Lembke', 'theme': 'Autocontrole', 'url': 'https://amzn.to/3gUrSXz'},
        {'title': 'Blink: A Decisão num Piscar', 'author': 'Malcolm Gladwell', 'theme': 'Psicologia Cognitiva', 'url': 'https://amzn.to/3SIBl1m'},
        {'title': 'O Homem Mais Rico da Babilônia', 'author': 'George S. Clason', 'theme': 'Finanças & Sabedoria', 'url': 'https://amzn.to/3fnezOL'},
        {'title': 'Arrume a Sua Cama', 'author': 'William H. McRaven', 'theme': 'Disciplina Diária', 'url': 'https://amzn.to/3fheJY9'}
    ]

    # 5. Preparar diretórios
    os.makedirs(DEST_DIR, exist_ok=True)
    os.makedirs(os.path.join(DEST_DIR, "artigos"), exist_ok=True)
    os.makedirs(os.path.join(DEST_DIR, "data"), exist_ok=True)
    os.makedirs(os.path.join(DEST_DIR, "ebooks"), exist_ok=True)

    # 6. Copiar PDFs
    for f in glob.glob(os.path.join(PDFS_SRC_DIR, "*.pdf")):
        fname = os.path.basename(f)
        dest_pdf = os.path.join(DEST_DIR, "ebooks", fname)
        if not os.path.exists(dest_pdf):
            shutil.copy2(f, dest_pdf)

    # 7. Gerar páginas individuais dos artigos (com suporte dual: slug original + slug do título)
    print(f"Gerando páginas HTML para {len(articles)} artigos com suporte a slugs múltiplos...")
    total_html_generated = 0
    for i, a in enumerate(articles):
        prev_a = articles[i - 1] if i > 0 else None
        next_a = articles[i + 1] if i < len(articles) - 1 else None
        
        art_html = generate_article_html(a['meta'], a['body_html'], prev_a, next_a)
        
        slugs_to_create = set()
        if a.get('slug'):
            slugs_to_create.add(a['slug'])
        if a.get('original_slug'):
            slugs_to_create.add(a['original_slug'])
        if a.get('title_slug'):
            slugs_to_create.add(a['title_slug'])

        for s in slugs_to_create:
            if not s:
                continue
            art_dir = os.path.join(DEST_DIR, "artigos", s)
            os.makedirs(art_dir, exist_ok=True)
            with open(os.path.join(art_dir, "index.html"), "w", encoding="utf-8") as f:
                f.write(art_html)
            total_html_generated += 1

    print(f"Total de diretórios HTML de artigos gerados: {total_html_generated}")

    # 8. Gerar Hub Central
    print("Gerando Hub Central /materiais/index.html...")
    hub_html = generate_hub_html(articles, ebooks, courses, amazon_books)
    with open(os.path.join(DEST_DIR, "index.html"), "w", encoding="utf-8") as f:
        f.write(hub_html)

    # 9. Salvar Catálogo JSON
    catalog_data = {
        'total_articles': len(articles),
        'total_ebooks': len(ebooks),
        'total_courses': len(courses),
        'total_amazon': len(amazon_books),
        'articles': [{
            'title': a['full_title'],
            'clean_title': a['clean_title'],
            'slug': a['slug'],
            'category': a['category'],
            'theme': a['theme'],
            'date_full': a['date_full'],
            'date_short': a['date_short'],
            'read_time': a['read_time'],
            'excerpt': a['excerpt'],
            'url': f"/materiais/artigos/{a['slug']}"
        } for a in articles],
        'ebooks': ebooks,
        'courses': courses,
        'amazon_books': amazon_books
    }
    with open(os.path.join(DEST_DIR, "data", "catalog.json"), "w", encoding="utf-8") as f:
        json.dump(catalog_data, f, ensure_ascii=False, indent=2)

    # 10. Espelhar para Montanha Hybrid Training
    if os.path.exists(os.path.dirname(MIRROR_DIR)):
        print("Espelhando public/materiais para Montanha Hybrid Training...")
        if os.path.exists(MIRROR_DIR):
            shutil.rmtree(MIRROR_DIR)
        shutil.copytree(DEST_DIR, MIRROR_DIR)

    print("✅ Build completo do Blog e Artigos concluído com sucesso!")

if __name__ == "__main__":
    main()
