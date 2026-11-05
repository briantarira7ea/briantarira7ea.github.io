document.addEventListener("DOMContentLoaded", () => {
  initArchitectureInspector();
  initTerminal();
  initIncidentSimulator();
});

/* 1. CLOUD ARCHITECTURE INSPECTOR */
const nodeData = {
  dns: {
    title: "Route 53 & CloudFront (CDN & DNS)",
    desc: "Enrutamiento inteligente de tráfico global con registros A, CNAME, Alias y políticas de Failover. Distribución de contenido estático mediante CloudFront con certificados SSL/TLS mediante AWS Certificate Manager (ACM)."
  },
  alb: {
    title: "Application Load Balancer (ALB)",
    desc: "Balanceador de carga HTTP/HTTPS de Capa 7. Distribuye las peticiones entre las diferentes instancias EC2 activas realizando Health Checks continuos sobre la ruta /health."
  },
  compute: {
    title: "EC2 Auto Scaling Group (Compute Layer)",
    desc: "Grupo de escalado automático para servidores Linux (Ubuntu/Debian) y Windows Server. Configuración de Golden Images (AMIs) y scripts de inicio UserData para el despliegue automatizado."
  },
  iam: {
    title: "IAM & Entra ID (Identidad & Seguridad Híbrida)",
    desc: "Gestión de identidades con política de mínimo privilegio (Least Privilege), integración con Microsoft Entra ID (Azure AD), roles IAM para instancias EC2 y autenticación MFA obligatoria."
  },
  storage: {
    title: "AWS S3 & Scripting de Backup",
    desc: "Buckets S3 con cifrado en reposo (SSE-S3), políticas de ciclo de vida (Lifecycle Rules a Glacier) y scripts en Bash/PowerShell para el volcado automático de bases de datos y registros."
  },
  iac: {
    title: "Terraform & Automation CI/CD",
    desc: "Infraestructura como código (IaC) modularizada en Terraform para aprovisionar VPC, Subnets y Security Groups. Integración con pipelines de integración y despliegue continuo."
  }
};

function initArchitectureInspector() {
  const nodes = document.querySelectorAll(".arch-node");
  const inspector = document.getElementById("nodeInspector");
  const titleEl = document.getElementById("inspectorTitle");
  const contentEl = document.getElementById("inspectorContent");
  const closeBtn = document.querySelector(".close-inspector");

  nodes.forEach(node => {
    node.addEventListener("click", () => {
      nodes.forEach(n => n.classList.remove("active-node"));
      node.classList.add("active-node");
      
      const key = node.getAttribute("data-node");
      if (nodeData[key]) {
        titleEl.innerHTML = `<i class="fas fa-server"></i> ${nodeData[key].title}`;
        contentEl.innerHTML = `<p>${nodeData[key].desc}</p>`;
      }
    });
  });

  if (closeBtn) {
    closeBtn.addEventListener("click", () => {
      nodes.forEach(n => n.classList.remove("active-node"));
      titleEl.innerHTML = `<i class="fas fa-info-circle"></i> Selecciona un nodo del diagrama`;
      contentEl.innerHTML = `<p class="text-muted">Haz clic en cualquier nodo para inspeccionar los detalles técnicos.</p>`;
    });
  }
}

/* 2. INTERACTIVE TERMINAL SIMULATOR */
function initTerminal() {
  const input = document.getElementById("terminalInput");
  if (!input) return;

  input.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      const command = input.value.trim();
      if (command) {
        runCommand(command);
        input.value = "";
      }
    }
  });
}

function runCommand(cmd) {
  const output = document.getElementById("terminalOutput");
  const cleanCmd = cmd.toLowerCase().trim();

  // Create prompt echo
  const promptLine = document.createElement("div");
  promptLine.className = "term-line";
  promptLine.innerHTML = `<span class="term-prompt">brian@aws-cloud:~$</span> ${escapeHtml(cmd)}`;
  output.appendChild(promptLine);

  let responseText = "";

  switch (cleanCmd) {
    case "help":
      responseText = `
Comandos disponibles:
  <span class="cmd-keyword">skills</span>         - Muestra el stack de tecnologías y nivel
  <span class="cmd-keyword">aws status</span>     - Estado de los servicios Cloud simulados
  <span class="cmd-keyword">terraform plan</span> - Ejecuta simulación de plan de infraestructura
  <span class="cmd-keyword">cat cv.txt</span>     - Muestra un resumen del Curriculum Vitae
  <span class="cmd-keyword">contacto</span>       - Muestra correo y redes profesionales
  <span class="cmd-keyword">clear</span>          - Limpia la pantalla de la terminal
      `;
      break;

    case "skills":
      responseText = `
[+] Stack Técnico Brian Tarira:
  - AWS Cloud: VPC, EC2, S3, IAM, Route53, ALB, CloudWatch
  - Sistemas: Linux (Ubuntu/Debian/openSUSE), Windows Server, Active Directory, Entra ID
  - Scripting: PowerShell, Bash, Python
  - IaC & DevOps: Terraform, Git, GitHub Actions, Docker (básico)
  - Metodología: ITIL v4 (Gestión >40 tickets/mes)
      `;
      break;

    case "aws status":
      responseText = `
[AWS Cloud Health Status - us-east-1]
  ✔ VPC (10.0.0.0/16) ...... OK (Public & Private Subnets)
  ✔ EC2 Auto Scaling ........ OK (3 Healthy Instances)
  ✔ ALB Load Balancer ....... OK (0UnhealthyTargetCount)
  ✔ S3 Backup Buckets ....... OK (Encrypted AES-256)
      `;
      break;

    case "terraform plan":
      responseText = `
<span class="highlight">Terraform v1.6.0 on linux_amd64</span>
Initializing provider plugins...
Executing plan...

An execution plan has been generated:
  <span style="color:var(--accent-green)">+ aws_instance.web_server</span> (t3.micro)
  <span style="color:var(--accent-green)">+ aws_security_group.allow_tls</span> (port 443, 80)
  <span style="color:var(--accent-green)">+ aws_s3_bucket.portfolio_assets</span>

Plan: 3 to add, 0 to change, 0 to destroy.
      `;
      break;

    case "cat cv.txt":
      responseText = `
BRIAN TARIRA - Cloud & Systems Engineer Junior
------------------------------------------------
Ubicación: Barcelona (Híbrido/Remoto)
Idiomas: Español (Nativo), Catalán (Nativo), Inglés (B2)
Resumen: Especialista en soporte N1/N2, automatización de sistemas y despliegues en AWS Cloud con enfoque en mejores prácticas ITIL.
      `;
      break;

    case "contacto":
      responseText = `
Email: briandouglas795@gmail.com
GitHub: https://github.com/briantarira7ea
LinkedIn: https://linkedin.com/in/briantarira
      `;
      break;

    case "clear":
      output.innerHTML = "";
      return;

    default:
      responseText = `Comando no reconocido: <span style="color:#ef4444">${escapeHtml(cmd)}</span>. Escribe <span class="cmd-keyword">'help'</span> para ver la lista.`;
      break;
  }

  const responseLine = document.createElement("div");
  responseLine.className = "term-line";
  responseLine.innerHTML = responseText;
  output.appendChild(responseLine);

  output.scrollTop = output.scrollHeight;
}

function escapeHtml(text) {
  return text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

/* 3. INCIDENT SIMULATOR DATA */
const ticketsData = {
  1: {
    title: "#INC-402: Provisionamiento Entra ID & Intune",
    desc: "El departamento de RRHH solicita alta urgente para un nuevo empleado Cloud Junior con asignación de licencias M365 y políticas de cumplimiento Intune.",
    solution: [
      "1. Creación de usuario en Microsoft Entra ID con política de contraseña segura.",
      "2. Asignación al grupo de seguridad 'Cloud-DevOps-Team'.",
      "3. Sincronización de licencias M365 y enrolamiento de dispositivo en Intune.",
      "4. Validación de acceso con autenticación MFA (Microsoft Authenticator)."
    ],
    status: "Cerrado / Resuelto"
  },
  2: {
    title: "#INC-809: Pico de Latencia en Servidor Web EC2",
    desc: "Alerta automática de CloudWatch: Uso de CPU > 90% en la instancia web principal durante 15 minutos.",
    solution: [
      "1. Análisis de métricas en CloudWatch Logs e inspección SSH a la instancia.",
      "2. Identificación de proceso bloqueado mediante comando 'top' / 'htop'.",
      "3. Escalado horizontal automático mediante grupo Auto Scaling agregando 1 instancia adicional.",
      "4. Reinicio de servicio NGINX y mitigación inmediata del pico de tráfico."
    ],
    status: "Cerrado / Resuelto"
  },
  3: {
    title: "#INC-105: Corrección de Script Backup PowerShell",
    desc: "El job programado en Task Scheduler falló al intentar exportar logs a la ruta de red compartida.",
    solution: [
      "1. Verificación del log de errores: Permiso denegado en la ruta SMB.",
      "2. Corrección del script PowerShell añadiendo credenciales cifradas y manejo de excepciones (Try/Catch).",
      "3. Prueba exitosa de ejecución manual y reprogramación de la tarea."
    ],
    status: "Cerrado / Resuelto"
  }
};

function initIncidentSimulator() {
  const btns = document.querySelectorAll(".ticket-btn");
  const display = document.getElementById("ticketDetails");

  function renderTicket(id) {
    const data = ticketsData[id];
    if (!data) return;

    display.innerHTML = `
      <div class="ticket-header" style="margin-bottom:15px;">
        <h3 style="color:var(--accent-blue)">${data.title}</h3>
        <span class="node-badge status-ok" style="margin-top:5px; display:inline-block">${data.status}</span>
      </div>
      <p style="color:var(--text-muted); margin-bottom:15px;"><strong>Descripción del problema:</strong> ${data.desc}</p>
      <h4 style="color:var(--accent-aws); margin-bottom:10px;"><i class="fas fa-wrench"></i> Procedimiento de Resolución Aplicado:</h4>
      <ul style="list-style:none; padding-left:0;">
        ${data.solution.map(step => `<li style="margin-bottom:8px; font-size:0.9rem;"><i class="fas fa-check-circle" style="color:var(--accent-green); margin-right:8px;"></i>${step}</li>`).join('')}
      </ul>
    `;
  }

  btns.forEach(btn => {
    btn.addEventListener("click", () => {
      btns.forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      const id = btn.getAttribute("data-ticket");
      renderTicket(id);
    });
  });

  // Render first by default
  renderTicket(1);
}
