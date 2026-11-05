(function(){
  "use strict";
  var doc=document, root=doc.documentElement;
  var lang="es";

  /* ---------- Datos del mapa ---------- */
  var NODES=[
   {id:"users",x:10,y:158,st:"prod",
    es:{t:"Usuarios y soporte",s:"Service Desk con ITIL",sum:"El punto de partida: personas con problemas reales y un SLA que cumplir.",b:["Más de 40 tickets al mes (L1/L2) en Jira y TeamViewer","Atención bilingüe en español e inglés","Escalado y documentación de incidencias según ITIL"],w:"Eskape IT Services, oct. 2025 a jul. 2026"},
    en:{t:"Users and support",s:"ITIL service desk",sum:"Where it starts: people with real problems and an SLA to meet.",b:["40+ L1/L2 tickets per month in Jira and TeamViewer","Bilingual support in Spanish and English","Incident escalation and documentation following ITIL"],w:"Eskape IT Services, Oct 2025 to Jul 2026"}},
   {id:"identity",x:260,y:20,st:"prod",
    es:{t:"Identidad y dispositivos",s:"Entra ID, AD, Intune",sum:"Quién entra, con qué equipo y con qué permisos.",b:["Grupos, permisos y licencias M365 en Azure AD / Entra ID","Enrolamiento y políticas de dispositivos con Intune (MDM)","Buzones, listas de distribución y permisos en Exchange","Active Directory, GPO y altas masivas con PowerShell"],w:"Eskape IT Services"},
    en:{t:"Identity and devices",s:"Entra ID, AD, Intune",sum:"Who gets in, on which device and with which permissions.",b:["Groups, permissions and M365 licences in Azure AD / Entra ID","Device enrolment and policies with Intune (MDM)","Mailboxes, distribution lists and permissions in Exchange","Active Directory, GPO and bulk user creation with PowerShell"],w:"Eskape IT Services"}},
   {id:"systems",x:260,y:158,st:"prod",
    es:{t:"Sistemas",s:"Windows Server y Linux",sum:"Los servidores y las máquinas virtuales donde corre todo lo demás.",b:["Windows Server 2019/22 y Linux (Debian, Ubuntu)","DNS, DHCP y políticas de grupo","Migraciones P2V en VMware vSphere","Citrix: altas, bajas y gestión de sesiones","También en el stack: Proxmox, Hyper-V e Isard-VDI"],w:"Eskape IT Services y labs propios"},
    en:{t:"Systems",s:"Windows Server and Linux",sum:"The servers and virtual machines everything else runs on.",b:["Windows Server 2019/22 and Linux (Debian, Ubuntu)","DNS, DHCP and Group Policy","P2V migrations on VMware vSphere","Citrix: user setup, removal and session management","Also in my stack: Proxmox, Hyper-V and Isard-VDI"],w:"Eskape IT Services and personal labs"}},
   {id:"network",x:260,y:296,st:"prod",
    es:{t:"Redes y seguridad",s:"VPN, VLANs, Defender",sum:"Que las cosas se conecten, y que solo lo hagan quienes deben.",b:["VPN site-to-site IPsec y VLANs","Bloqueo de dominios e IPs con Microsoft Defender","TCP/IP, DNS y DHCP","Cloudflare (WAF y CDN) en mis proyectos web"],w:"Eskape IT Services y proyectos propios"},
    en:{t:"Network and security",s:"VPN, VLANs, Defender",sum:"Keeping things connected, and only for those who should be.",b:["Site-to-site IPsec VPNs and VLANs","Domain and IP blocking with Microsoft Defender","TCP/IP, DNS and DHCP","Cloudflare (WAF and CDN) on my own web projects"],w:"Eskape IT Services and personal projects"}},
   {id:"automation",x:520,y:70,st:"prod",
    es:{t:"Automatización",s:"PowerShell, Bash, Git",sum:"Scripts de backup y mantenimiento que redujeron más de un 60 % el trabajo manual.",b:["PowerShell y Bash para backups, tareas de AD y mantenimiento","Git para versionar scripts y labs","CI/CD en el stack del máster; pipeline propio con GitHub Actions en construcción"],w:"Eskape IT Services y Máster AWS (ITB)"},
    en:{t:"Automation",s:"PowerShell, Bash, Git",sum:"Backup and maintenance scripts that cut manual work by more than 60%.",b:["PowerShell and Bash for backups, AD tasks and maintenance","Git to version scripts and labs","CI/CD in my master's stack; own GitHub Actions pipeline in progress"],w:"Eskape IT Services and AWS Master (ITB)"}},
   {id:"containers",x:520,y:246,st:"labs",
    es:{t:"Contenedores y web",s:"Docker, Compose, Nginx",sum:"Aplicaciones empaquetadas que se despliegan igual en cualquier sitio.",b:["Docker y Docker Compose en labs propios","Nginx como servidor web y proxy","Kubernetes: nivel básico","Webs reales publicadas en GitHub Pages, como Restobar Alex"],w:"Máster AWS (ITB) y labs en GitHub"},
    en:{t:"Containers and web",s:"Docker, Compose, Nginx",sum:"Packaged applications that deploy the same way anywhere.",b:["Docker and Docker Compose in personal labs","Nginx as web server and proxy","Kubernetes: basic level","Real websites on GitHub Pages, such as Restobar Alex"],w:"AWS Master (ITB) and GitHub labs"}},
   {id:"cloud",x:780,y:158,st:"labs",
    es:{t:"Cloud",s:"AWS y Azure",sum:"Hacia donde va mi perfil: infraestructura en la nube, bien definida y repetible.",b:["AWS: EC2, S3, IAM y Route 53","AWS Jam: retos de infraestructura en tiempo real","Hackathon Cloud Computing en Valencia","Azure: máquinas virtuales y Entra ID","Terraform (infraestructura como código): proyecto en construcción"],w:"Máster AWS Cloud Computing, Institut ITB"},
    en:{t:"Cloud",s:"AWS and Azure",sum:"Where my profile is heading: cloud infrastructure, well defined and repeatable.",b:["AWS: EC2, S3, IAM and Route 53","AWS Jam: real-time infrastructure challenges","Cloud Computing Hackathon in Valencia","Azure: virtual machines and Entra ID","Terraform (infrastructure as code): project in progress"],w:"Specialisation Master in AWS Cloud Computing, Institut ITB"}}
  ];
  var EDGES=[["users","identity"],["users","systems"],["users","network"],["identity","automation"],["systems","automation"],["systems","containers"],["network","containers"],["automation","cloud"],["containers","cloud"]];
  var STATUS={prod:{es:"En producción",en:"In production"},labs:{es:"Máster y labs",en:"Master's and labs"},build:{es:"En construcción",en:"In progress"}};
  var W=200,H=84,NS="http://www.w3.org/2000/svg",sel="automation";
  function byId(id){for(var i=0;i<NODES.length;i++)if(NODES[i].id===id)return NODES[i]}
  function el(n,a,p){var e=doc.createElementNS(NS,n);for(var k in a)e.setAttribute(k,a[k]);if(p)p.appendChild(e);return e}

  /* ---------- Mapa ---------- */
  var svg=doc.getElementById("svg"),stack=doc.getElementById("stack");
  function build(){
    var edges=el("g",{},svg),i;
    for(i=0;i<EDGES.length;i++){
      var a=byId(EDGES[i][0]),b=byId(EDGES[i][1]);
      var x1=a.x+W,y1=a.y+H/2,x2=b.x,y2=b.y+H/2,dx=(x2-x1)/2;
      var p=el("path",{"class":"edge","d":"M"+x1+","+y1+" C"+(x1+dx)+","+y1+" "+(x2-dx)+","+y2+" "+x2+","+y2,"data-a":a.id,"data-b":b.id},edges);
      p.style.setProperty("--i",i);p.style.setProperty("--L",Math.ceil(p.getTotalLength())+2);
    }
    NODES.forEach(function(n){
      var g=el("g",{"class":"node","tabindex":"0","role":"button","data-id":n.id,"aria-pressed":"false"},svg);
      el("rect",{x:n.x,y:n.y,width:W,height:H,rx:12},g);
      el("circle",{"class":"dot "+(n.st==="prod"?"":n.st),cx:n.x+20,cy:n.y+24,r:5},g);
      var t=el("text",{"class":"t",x:n.x+34,y:n.y+29},g),s=el("text",{"class":"s",x:n.x+18,y:n.y+56},g);
      n._t=t;n._s=s;n._g=g;
      g.addEventListener("click",function(){select(n.id)});
      g.addEventListener("keydown",function(e){if(e.key==="Enter"||e.key===" "){e.preventDefault();select(n.id)}});
      var b=doc.createElement("button");b.type="button";b.setAttribute("aria-pressed","false");b.dataset.id=n.id;
      b.innerHTML="<strong></strong><span></span>";stack.appendChild(b);n._b=b;
      b.addEventListener("click",function(){select(n.id)});
    });
  }
  function paint(){
    NODES.forEach(function(n){
      var d=n[lang];n._t.textContent=d.t;n._s.textContent=d.s;
      n._b.firstChild.textContent=d.t;n._b.lastChild.textContent=d.s;
      var on=n.id===sel;
      n._g.classList.toggle("sel",on);n._g.setAttribute("aria-pressed",on);
      n._b.setAttribute("aria-pressed",on);
    });
    var edges=svg.querySelectorAll(".edge");
    for(var i=0;i<edges.length;i++){var e=edges[i];e.classList.toggle("on",e.dataset.a===sel||e.dataset.b===sel)}
    var n=byId(sel),d=n[lang],c=doc.getElementById("chip"),ul=doc.getElementById("pb");
    doc.getElementById("pt").textContent=d.t;
    c.className="chip "+n.st;c.textContent=STATUS[n.st][lang];
    doc.getElementById("ps").textContent=d.sum;
    ul.innerHTML="";d.b.forEach(function(x){var li=doc.createElement("li");li.textContent=x;ul.appendChild(li)});
    doc.getElementById("pw").textContent=d.w;
  }
  function select(id){sel=id;paint()}

  /* ---------- Idioma ---------- */
  function setLang(l){
    lang=l;root.lang=l;
    var list=doc.querySelectorAll("[data-en]");
    for(var i=0;i<list.length;i++){
      var e=list[i];
      if(e.dataset.es===undefined)e.dataset.es=e.innerHTML;
      e.innerHTML=l==="en"?e.dataset.en:e.dataset.es;
    }
    var m=doc.querySelectorAll("[data-en-label]");
    for(var j=0;j<m.length;j++){var q=m[j];if(!q.dataset.esLabel)q.dataset.esLabel=q.getAttribute("aria-label")||"";q.setAttribute("aria-label",l==="en"?q.dataset.enLabel:q.dataset.esLabel)}
    doc.getElementById("lang").textContent=l==="en"?"ES":"EN";
    doc.title=l==="en"?"Brian Tarira | Junior Cloud & Systems Engineer":"Brian Tarira | Cloud & Systems Engineer Junior";
    try{localStorage.setItem("lang",l)}catch(e){}
    themeLabel();paint();
  }
  doc.getElementById("lang").addEventListener("click",function(){setLang(lang==="es"?"en":"es")});

  /* ---------- Tema ---------- */
  function themeLabel(){doc.getElementById("theme").textContent=root.dataset.theme==="dark"?(lang==="en"?"Light":"Claro"):(lang==="en"?"Dark":"Oscuro")}
  function setTheme(t){root.dataset.theme=t;themeLabel();try{localStorage.setItem("theme",t)}catch(e){}}
  doc.getElementById("theme").addEventListener("click",function(){setTheme(root.dataset.theme==="dark"?"light":"dark")});

  /* ---------- Copiar email ---------- */
  var cp=doc.getElementById("copy"),st=doc.getElementById("copied");
  cp.addEventListener("click",function(){
    var mail="briandouglas795@gmail.com";
    function ok(){st.textContent=lang==="en"?"Copied":"Copiado";setTimeout(function(){st.textContent=""},2500)}
    if(navigator.clipboard&&navigator.clipboard.writeText){navigator.clipboard.writeText(mail).then(ok,function(){window.location="mailto:"+mail})}
    else{window.location="mailto:"+mail}
  });

  /* ---------- Navegación activa ---------- */
  if("IntersectionObserver" in window){
    var links={};[].forEach.call(doc.querySelectorAll(".bar nav a"),function(a){links[a.getAttribute("href").slice(1)]=a});
    var io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){for(var k in links)links[k].classList.remove("on");if(links[e.target.id])links[e.target.id].classList.add("on")}})},{rootMargin:"-45% 0px -50% 0px"});
    [].forEach.call(doc.querySelectorAll("main section[id]"),function(s){io.observe(s)});
  }

  /* ---------- Arranque ---------- */
  build();
  var t0="light";try{t0=localStorage.getItem("theme")||(window.matchMedia&&matchMedia("(prefers-color-scheme: dark)").matches?"dark":"light")}catch(e){}
  setTheme(t0);
  var l0="es";try{l0=localStorage.getItem("lang")||((navigator.language||"es").slice(0,2)==="en"?"en":"es")}catch(e){}
  setLang(l0);
  doc.querySelector(".map").classList.add("draw");
})();
