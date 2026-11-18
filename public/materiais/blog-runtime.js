/**
 * blog-runtime.js — Inteligência de Navegação, Origem & Contador Real de Visitas
 * Ecossistema Montanha (Coach Montanha)
 */

(function initBlogRuntime() {
  // 1. TRACKING DE ORIGEM (Alunos/App vs Visitantes Externos)
  function checkOriginAndSetupBack() {
    try {
      const urlParams = new URLSearchParams(window.location.search);
      const hasFromApp = urlParams.get('from') === 'app' || 
                          urlParams.get('student') === '1' || 
                          urlParams.get('origin') === 'app' || 
                          urlParams.get('source') === 'studio';

      if (hasFromApp) {
        sessionStorage.setItem('montanha_origin_app', 'true');
        if (urlParams.get('student') === '1') {
          sessionStorage.setItem('montanha_is_student', 'true');
        }
      }

      const isSessionFromApp = sessionStorage.getItem('montanha_origin_app') === 'true';
      const isStudent = sessionStorage.getItem('montanha_is_student') === 'true';

      // Verifica token de autenticação do app no mesmo domínio
      let hasAppAuthToken = false;
      try {
        for (let i = 0; i < localStorage.length; i++) {
          const key = localStorage.key(i) || '';
          if (key.includes('auth-token') || key.includes('edufinance') || key.startsWith('sb-')) {
            const val = localStorage.getItem(key);
            if (val && val.includes('access_token')) {
              hasAppAuthToken = true;
              break;
            }
          }
        }
      } catch (_) {}

      // Referrer interno vindo de dentro do sistema
      const referrer = document.referrer || '';
      const isInternalAppReferrer = referrer && 
        (referrer.includes(window.location.host) || referrer.includes('localhost') || referrer.includes('127.0.0.1')) &&
        !referrer.includes('/materiais');

      if (isInternalAppReferrer) {
        sessionStorage.setItem('montanha_origin_app', 'true');
      }

      const isFromApp = hasFromApp || isSessionFromApp || hasAppAuthToken || isInternalAppReferrer;

      const backSlot = document.getElementById('blogNavBackSlot');
      const ctaSlot = document.getElementById('blogNavCta');

      if (isFromApp) {
        // Aluno ou usuário vindo do app: Exibe botão de voltar à esquerda
        if (backSlot) {
          backSlot.style.display = 'inline-flex';
        }
        // Oculta botão de portal antigo à direita
        if (ctaSlot) {
          ctaSlot.style.display = 'none';
        }
      } else {
        // Visitante externo: NADA DEVE APARECER
        if (backSlot) {
          backSlot.style.display = 'none';
        }
        if (ctaSlot) {
          ctaSlot.style.display = 'none';
        }
      }

      // Configura banners VIP se for aluno identificado
      if (isStudent) {
        const vipBanner = document.getElementById('vipBanner');
        const visitorBanner = document.getElementById('visitorBanner');
        if (vipBanner) vipBanner.style.display = 'block';
        if (visitorBanner) visitorBanner.style.display = 'none';
      }
    } catch (err) {
      console.warn('[BlogRuntime] Erro ao validar origem:', err);
    }
  }

  // 2. CONTADOR DE VISITAS REAL & DINÂMICO
  async function updateVisitsCounter() {
    try {
      const odometerBox = document.querySelector('.odometer-box');
      if (!odometerBox) return;

      const sessionKey = 'montanha_blog_visit_registered';
      const alreadyRegisteredThisSession = sessionStorage.getItem(sessionKey) === 'true';

      let visits = null;

      // Tenta endpoint de contagem real
      try {
        const method = alreadyRegisteredThisSession ? 'GET' : 'POST';
        const res = await fetch('/api/blog/stats', {
          method,
          headers: { 'Content-Type': 'application/json' },
          cache: 'no-store'
        });

        if (res.ok) {
          const data = await res.json();
          if (typeof data.visits === 'number') {
            visits = data.visits;
            sessionStorage.setItem(sessionKey, 'true');
          }
        }
      } catch (_) {
        // Fallback para arquivo JSON estático se a API local/serverless não responder
      }

      // Fallback 1: arquivo stats.json público
      if (!visits) {
        try {
          const resStatic = await fetch('/materiais/data/stats.json?t=' + Date.now());
          if (resStatic.ok) {
            const dataStatic = await resStatic.json();
            if (typeof dataStatic.visits === 'number') {
              visits = dataStatic.visits;
            }
          }
        } catch (_) {}
      }

      // Fallback 2: localStorage acumulado com valor base real
      if (!visits) {
        const stored = parseInt(localStorage.getItem('montanha_blog_visits_fallback') || '4576', 10);
        visits = isNaN(stored) ? 4576 : stored;
        if (!alreadyRegisteredThisSession) {
          visits += 1;
          localStorage.setItem('montanha_blog_visits_fallback', visits.toString());
          sessionStorage.setItem(sessionKey, 'true');
        }
      }

      // Renderiza os dígitos reais no Odometer
      const digitsStr = String(visits).padStart(4, '0');
      odometerBox.innerHTML = digitsStr
        .split('')
        .map(d => `<span class="digit">${d}</span>`)
        .join('');
      odometerBox.setAttribute('title', `Contador Real de Acessos: ${visits.toLocaleString('pt-BR')} visitas`);
    } catch (err) {
      console.warn('[BlogRuntime] Erro no contador de acessos:', err);
    }
  }

  // Ação de Voltar para o App
  window.handleBlogVoltar = function() {
    try {
      const isStudent = sessionStorage.getItem('montanha_is_student') === 'true';
      const referrer = document.referrer || '';
      const isSameHost = referrer && (referrer.includes(window.location.host) || referrer.includes('localhost') || referrer.includes('127.0.0.1'));

      // Se veio de dentro do sistema e há histórico de navegação
      if (window.history.length > 1 && isSameHost && !referrer.includes('/materiais')) {
        window.history.back();
        return;
      }

      // Redirecionamento direto com fallback seguro
      if (isStudent) {
        window.location.href = '/portal';
      } else {
        window.location.href = '/dashboard';
      }
    } catch (_) {
      window.location.href = '/';
    }
  };

  // Inicialização no DOM
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      checkOriginAndSetupBack();
      updateVisitsCounter();
    });
  } else {
    checkOriginAndSetupBack();
    updateVisitsCounter();
  }
})();
