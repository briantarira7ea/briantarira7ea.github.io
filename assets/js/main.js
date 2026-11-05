/* Brian Tarira · Portfolio 2.0 · main.js
 * Módulos: lluvia de fondo, typewriter, contadores, reveal, nav,
 * diagrama de arquitectura clicable, simulador ITIL y terminal CLI.
 */
(() => {
  'use strict';

  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- 1. Lluvia de datos de fondo ---------- */
  function matrixRain() {
    const canvas = $('#matrix');
    if (!canvas || reduceMotion) return;
    const ctx = canvas.getContext('2d');
    const glyphs = '01<>/{}#$AWSAZURE';
    const FS = 16;
    let drops = [];

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      const cols = Math.floor(canvas.width / FS);
      drops = Array.from({ length: cols }, () => Math.random() * -40);
    };
    resize();
    window.addEventListener('resize', resize);

    setInterval(() => {
      if (document.hidden) return;
      ctx.fillStyle = 'rgba(5, 7, 13, 0.12)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.font = `${FS - 2}px monospace`;
      drops.forEach((y, i) => {
        const ch = glyphs[Math.floor(Math.random() * glyphs.length)];
        ctx.fillStyle = Math.random() > 0.97 ? '#ff9900' : '#00f0ff';
        ctx.fillText(ch, i * FS, y * FS);
        drops[i] = (y * FS > canvas.height && Math.random() > 0.975) ? 0 : y + 1;
      });
    }, 60);
  }

  /* ---------- 2. Typewriter del hero ---------- */
  function typewriter() {
    const el = $('#typed');
    if (!el) return;
    const words = [
      'Cloud & Systems Engineer Junior',
      'DevOps · AWS · Linux · Windows Server',
      'Automatizo lo repetitivo. Tú ganas tiempo.',
      'Reduje el trabajo manual más de un 60 %.'
    ];
    if (reduceMotion) { el.textContent = words[0]; return; }

    let w = 0, i = 0, deleting = false;
    const tick = () => {
      const word = words[w];
      if (!deleting) {
        i++;
        el.textContent = word.slice(0, i);
        if (i === word.length) { deleting = true; return setTimeout(tick, 1600); }
        return setTimeout(tick, 70);
      }
      i--;
      el.textContent = word.slice(0, i);
      if (i === 0) {
        deleting = false;
        w = (w + 1) % words.length;
        return setTimeout(tick, 400);
      }
      setTimeout(tick, 35);
    };
    tick();
  }

  /* ---------- 3. Contadores animados ---------- */
  function counters() {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const el = entry.target;
        io.unobserve(el);
        const target = Number(el.dataset.count);
        const pre = el.dataset.prefix || '';
        const suf = el.dataset.suffix || '';
        if (reduceMotion) { el.textContent = pre + target + suf; return; }
        const t0 = performance.now();
        const dur = 1400;
        const step = (now) => {
          const p = Math.min((now - t0) / dur, 1);
          const eased = 1 - Math.pow(1 - p, 3);
          el.textContent = pre + Math.round(target * eased) + suf;
          if (p < 1) requestAnimationFrame(step);
        };
        requestAnimationFrame(step);
      });
    }, { threshold: 0.6 });
    $$('[data-count]').forEach((el) => io.observe(el));
  }

  /* ---------- 4. Revelado al hacer scroll ---------- */
  function reveal() {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('visible');
        io.unobserve(entry.target);
      });
    }, { threshold: 0.12 });
    $$('.reveal').forEach((el) => io.observe(el));
  }

  /* ---------- 5. Menú móvil ---------- */
  function nav() {
    const btn = $('.nav-toggle');
    const links = $('.nav-links');
    if (!btn || !links) return;
    btn.addEventListener('click', () => {
      const open = links.classList.toggle('open');
      btn.setAttribute('aria-expanded', String(open));
    });
    $$('.nav-links a').forEach((a) => a.addEventListener('click', () => {
      links.classList.remove('open');
      btn.setAttribute('aria-expanded', 'false');
    }));
  }

  /* ---------- 6. Diagrama de arquitectura clicable ---------- */
  const NODES = {
    users: {
      title: 'Usuarios',
      desc: 'Tráfico HTTPS desde navegador y móvil. Un único punto de entrada: los servicios internos nunca se exponen directamente.',
      impact: 'Superficie de ataque reducida a un solo endpoint público.',
      tags: ['HTTPS', 'Edge']
    },
    cloudflare: {
      title: 'Cloudflare · WAF / CDN',
      desc: 'Filtra tráfico malicioso, cachea estáticos y oculta la IP de origen. Reglas WAF y protección frente a DDoS antes de tocar AWS.',
      impact: 'Menos carga en origen y bloqueo de tráfico hostil en el perímetro.',
      tags: ['WAF', 'CDN', 'DDoS']
    },
    route53: {
      title: 'Route 53',
      desc: 'Resolución DNS con registros A y CNAME para el dominio. Base para failover y enrutamiento según salud del servicio.',
      impact: 'Cambios de infraestructura sin afectar al usuario: el DNS desacopla el origen.',
      tags: ['DNS', 'Failover', 'Health checks']
    },
    nginx: {
      title: 'Nginx · Reverse proxy',
      desc: 'Termina TLS, redirige HTTP a HTTPS y reenvía hacia los contenedores. Cada cambio se valida con nginx -t antes de recargar.',
      impact: 'Un único punto de control para caché, cabeceras de seguridad y balanceo.',
      tags: ['TLS', 'Proxy', 'nginx -t']
    },
    ec2: {
      title: 'EC2 · Docker',
      desc: 'Instancia Linux con Docker y Docker Compose. Despliegue reproducible desde Git mediante CI/CD, con el mismo artefacto en dev y prod.',
      impact: 'Entornos idénticos y despliegues en minutos en lugar de horas.',
      tags: ['EC2', 'Docker', 'Compose', 'CI/CD']
    },
    rds: {
      title: 'PostgreSQL',
      desc: 'Base de datos con backups y acceso restringido mediante Security Groups. Sin exposición pública a Internet.',
      impact: 'Datos fuera del servidor de aplicación y recuperación ante fallos.',
      tags: ['PostgreSQL', 'Backups', 'Security Groups']
    },
    s3: {
      title: 'S3 · Backups',
      desc: 'Almacenamiento de objetos para backups y artefactos, con ciclo de vida: transición a clases frías y expiración automática.',
      impact: 'Coste de almacenamiento optimizado mediante lifecycle policies.',
      tags: ['S3', 'Lifecycle', 'Versionado']
    },
    iam: {
      title: 'IAM · Mínimo privilegio',
      desc: 'Roles con permisos mínimos para EC2 y pipelines. Nada de claves de acceso de larga duración en el código.',
      impact: 'Reduce el radio de impacto si una credencial se ve comprometida.',
      tags: ['IAM', 'Least privilege', 'Roles']
    },
    entra: {
      title: 'Entra ID · Intune',
      desc: 'Identidad centralizada con MFA, acceso condicional y gestión de dispositivos (MDM). Es lo que administro a diario en Eskape IT.',
      impact: 'Altas, bajas y cumplimiento de dispositivos desde un único panel.',
      tags: ['Entra ID', 'MFA', 'Intune', 'MDM']
    }
  };

  function architecture() {
    const panel = $('#arch-detail');
    const nodes = $$('.node');
    if (!panel || !nodes.length) return;

    const render = (key) => {
      const n = NODES[key];
      if (!n) return;
      nodes.forEach((g) => g.classList.toggle('active', g.dataset.node === key));

      panel.innerHTML = '';
      const h = document.createElement('h3');
      h.textContent = n.title;
      const p = document.createElement('p');
      p.textContent = n.desc;
      const impact = document.createElement('p');
      impact.className = 'impact';
      impact.textContent = '→ ' + n.impact;
      const ul = document.createElement('ul');
      ul.className = 'tags';
      n.tags.forEach((t) => {
        const li = document.createElement('li');
        li.textContent = t;
        ul.appendChild(li);
      });
      panel.append(h, p, impact, ul);

      panel.classList.remove('flash');
      void panel.offsetWidth; // reinicia la animación
      panel.classList.add('flash');
    };

    nodes.forEach((g) => {
      g.addEventListener('click', () => render(g.dataset.node));
      g.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          render(g.dataset.node);
        }
      });
    });
    render('ec2');
  }

  /* ---------- 7. Simulador de incidentes ITIL ---------- */
  const TICKETS = [
    {
      id: 'INC-2041', prio: 'P2',
      title: 'Usuario sin acceso a M365 tras cambio de contraseña',
      steps: [
        { prompt: 'Primer paso: ¿cómo verificas el problema?',
          good: 'Revisar el estado de la cuenta y los sign-ins en Entra ID',
          bad: 'Forzar un reset de contraseña sin verificar la identidad',
          log: 'Cuenta activa. Bloqueo por acceso condicional detectado.' },
        { prompt: 'El acceso está bloqueado por política. ¿Qué haces?',
          good: 'Registrar el dispositivo en Intune y ajustar la excepción',
          bad: 'Desactivar MFA para todos los usuarios',
          log: 'Dispositivo registrado. Acceso restaurado de forma controlada.' },
        { prompt: 'Cierre del ticket:',
          good: 'Documentar la causa raíz en Jira y cerrar',
          bad: 'Cerrar sin documentar',
          log: 'Ticket cerrado con causa raíz documentada.' }
      ]
    },
    {
      id: 'INC-2057', prio: 'P1',
      title: 'Disco al 98 % en servidor Linux de backups',
      steps: [
        { prompt: 'Primer diagnóstico:',
          good: 'Identificar los consumidores de espacio con du / ncdu',
          bad: 'Reiniciar el servidor',
          log: 'Ficheros de backup antiguos sin rotación: ~14 GB ocupados.' },
        { prompt: 'Liberar espacio de forma controlada:',
          good: 'Aplicar la política de retención y limpiar logs rotados',
          bad: 'Borrar /var/backups a mano sin verificar',
          log: 'Espacio liberado. Disco al 69 %.' },
        { prompt: 'Para que no vuelva a pasar:',
          good: 'Programar un script de alerta por umbral con cron',
          bad: 'Confiar en revisiones manuales semanales',
          log: 'Alerta automatizada activa. Ticket resuelto.' }
      ]
    },
    {
      id: 'INC-2063', prio: 'P1',
      title: 'Nginx devuelve 502 en la web de producción',
      steps: [
        { prompt: '¿Qué miras primero?',
          good: 'Logs de error de Nginx y estado del upstream',
          bad: 'Reinstalar Nginx entero',
          log: 'Upstream apuntando a un puerto incorrecto tras el despliegue.' },
        { prompt: 'Corrige y valida:',
          good: 'Corregir el puerto, ejecutar nginx -t y recargar',
          bad: 'Reiniciar la máquina sin validar la configuración',
          log: 'Configuración válida. Servicio recargado sin cortes.' },
        { prompt: 'Verificación final:',
          good: 'Comprobar con curl -I y monitorizar unos minutos',
          bad: 'Dar por bueno si carga en tu móvil',
          log: 'Respuesta 200 OK sostenida. SLA cumplido.' }
      ]
    }
  ];

  function itilSimulator() {
    const el = {
      queue: $('#queue'), id: $('#t-id'), prio: $('#t-prio'), title: $('#t-title'),
      fill: $('#sla-fill'), slaText: $('#sla-text'), prompt: $('#t-prompt'),
      options: $('#options'), log: $('#itil-log'), reset: $('#itil-reset')
    };
    if (!el.queue) return;
    let ticket = null, step = 0, sla = 100;

    const paintSla = () => {
      el.fill.style.width = `${sla}%`;
      el.fill.className = sla > 60 ? '' : (sla > 30 ? 'warn' : 'bad');
      el.slaText.textContent = `SLA ${sla}%`;
    };

    const log = (msg, cls = '') => {
      const line = document.createElement('div');
      line.className = cls;
      line.textContent = msg;
      el.log.appendChild(line);
      el.log.scrollTop = el.log.scrollHeight;
    };

    const renderStep = () => {
      el.options.innerHTML = '';
      if (!ticket) return;
      if (step >= ticket.steps.length) {
        el.prompt.textContent = `Ticket cerrado · SLA final ${sla}%. Elige otro de la cola.`;
        return;
      }
      const s = ticket.steps[step];
      el.prompt.textContent = s.prompt;
      const choices = [{ text: s.good, ok: true }, { text: s.bad, ok: false }]
        .sort(() => Math.random() - 0.5);
      choices.forEach(({ text, ok }) => {
        const b = document.createElement('button');
        b.type = 'button';
        b.className = 'btn-option';
        b.textContent = text;
        b.addEventListener('click', () => choose(ok, s));
        el.options.appendChild(b);
      });
    };

    const choose = (ok, s) => {
      if (ok) {
        log(`✔ ${s.log}`, 'ok');
        step++;
      } else {
        sla = Math.max(0, sla - 20);
        log('✖ Decisión de riesgo descartada. SLA −20 %', 'bad');
      }
      paintSla();
      renderStep();
    };

    const select = (t, btn) => {
      ticket = t;
      step = 0;
      sla = 100;
      el.id.textContent = t.id;
      el.prio.textContent = t.prio;
      el.title.textContent = t.title;
      el.log.innerHTML = '';
      $$('.queue-item').forEach((b) => b.classList.toggle('active', b === btn));
      log(`> Ticket ${t.id} asignado · prioridad ${t.prio}`);
      paintSla();
      renderStep();
    };

    const resetAll = () => {
      ticket = null;
      step = 0;
      sla = 100;
      el.id.textContent = '';
      el.prio.textContent = '';
      el.title.textContent = 'Selecciona un ticket';
      el.log.innerHTML = '';
      el.prompt.textContent = 'La cola está lista. Atiende cada incidente como lo harías en producción.';
      el.options.innerHTML = '';
      $$('.queue-item').forEach((b) => b.classList.remove('active'));
      paintSla();
    };

    TICKETS.forEach((t) => {
      const b = document.createElement('button');
      b.type = 'button';
      b.className = 'queue-item';
      const idSpan = document.createElement('span');
      idSpan.className = 'qi-id';
      idSpan.textContent = `${t.id} · ${t.prio}`;
      const titleSpan = document.createElement('span');
      titleSpan.className = 'qi-title';
      titleSpan.textContent = t.title;
      b.append(idSpan, titleSpan);
      b.addEventListener('click', () => select(t, b));
      el.queue.appendChild(b);
    });

    el.reset.addEventListener('click', resetAll);
    resetAll();
  }

  /* ---------- 8. Terminal CLI ---------- */
  function terminal() {
    const out = $('#term-out');
    const form = $('#term-form');
    const input = $('#term-in');
    if (!out || !form || !input) return;
    const history = [];
    let hi = -1;

    const print = (lines, cls = '') => {
      (Array.isArray(lines) ? lines : [lines]).forEach((text) => {
        const d = document.createElement('div');
        d.className = `line ${cls}`;
        d.textContent = text;
        out.appendChild(d);
      });
      out.scrollTop = out.scrollHeight;
    };

    const commands = {
      help: () => print([
        'Comandos disponibles:',
        '  whoami          Perfil técnico',
        '  skills          Stack y competencias',
        '  aws status      Estado SIMULADO de la infraestructura',
        '  ls proyectos    Proyectos y labs',
        '  contact         Canales de contacto',
        '  clear           Limpia la terminal',
        '  sudo hire-me    Ya sabes qué hace esto'
      ]),

      whoami: () => print([
        'brian_tarira · Cloud & Systems Engineer Junior · Barcelona (Mollet del Vallès)',
        'uid=1000(brian) gid=devops groups=linux,windows,aws,itil'
      ]),

      skills: () => print([
        'CLOUD / DEVOPS    AWS (EC2, S3, IAM, Route 53) · Azure / Entra ID · Docker · Compose · Kubernetes (básico) · Git · CI/CD · Nginx',
        'SISTEMAS          Linux (Debian, Ubuntu, CentOS) · Windows Server 2019/22 · Active Directory · VMware vSphere · Proxmox · Hyper-V · Citrix',
        'AUTOMATIZACIÓN    Bash · PowerShell',
        'REDES Y SEGURIDAD TCP/IP · DNS · DHCP · VLANs · VPN IPsec · Cloudflare (WAF/CDN) · MS Defender · Intune (MDM)',
        'DATOS / GESTIÓN   SQL · MySQL · PostgreSQL · ITIL v4 · Jira'
      ]),

      'aws status': () => print([
        '[SIMULACIÓN] aws status --region eu-west-1',
        '  EC2         web-prod-01       running     OK',
        '  RDS         pg-portfolio      available   OK',
        '  S3          backups-bt        healthy     OK',
        '  Route 53    portfolio.dns     NOERROR     OK',
        '  CloudWatch  alarmas en ALARM: 0',
        '  Coste       −18 % tras apagar entornos dev fuera de horario (simulado)'
      ], 'accent'),

      'ls proyectos': () => print([
        'restobar-alex/        Web en producción (GitHub Pages)',
        'backups-ps-bash/      Automatización de backups (Eskape IT)',
        'aws-jam/              Retos de infraestructura en tiempo real',
        'hackathon-valencia/   Competición cloud inter-centros',
        'labs-cloud-sysadmin/  Docker, Linux, Windows Server, AD'
      ]),

      contact: () => print([
        'email     briandouglas795@gmail.com',
        'linkedin  linkedin.com/in/brian-tarira',
        'github    github.com/briantarira7ea'
      ]),

      'sudo hire-me': () => {
        print(['[sudo] contraseña para visitante: ••••••••', 'Acceso concedido. Abriendo canal de contacto...'], 'accent');
        setTimeout(() => {
          const target = document.getElementById('contacto');
          if (target) target.scrollIntoView({ behavior: 'smooth' });
        }, 900);
      }
    };

    const run = (raw) => {
      const clean = raw.trim();
      const cmd = clean.toLowerCase().replace(/\s+/g, ' ');
      print(`brian@cloud:~$ ${clean}`, 'cmd');
      if (!cmd) return;
      if (cmd === 'clear') { out.innerHTML = ''; return; }
      const fn = commands[cmd];
      if (fn) fn();
      else print(`bash: ${clean.split(' ')[0]}: comando no encontrado. Escribe "help".`, 'err');
    };

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const value = input.value;
      if (value.trim()) history.unshift(value);
      hi = -1;
      run(value);
      input.value = '';
    });

    input.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowUp') {
        e.preventDefault();
        if (hi < history.length - 1) { hi++; input.value = history[hi]; }
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        if (hi > 0) { hi--; input.value = history[hi]; }
        else { hi = -1; input.value = ''; }
      }
    });

    print([
      'brian-os v2.0 · sesión simulada en el navegador',
      'Escribe "help" para ver los comandos disponibles.'
    ], 'accent');
  }

  /* ---------- Init ---------- */
  document.addEventListener('DOMContentLoaded', () => {
    const year = $('#year');
    if (year) year.textContent = new Date().getFullYear();
    matrixRain();
    typewriter();
    counters();
    reveal();
    nav();
    architecture();
    itilSimulator();
    terminal();
  });
})();
