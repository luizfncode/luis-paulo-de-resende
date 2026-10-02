/* Configuração: trocar pelo número real (DDI+DDD+número, só dígitos) */
const WA_NUMBER = "556196829401";
const WA_TEXT = "Olá, Dr. Luís Paulo. Gostaria de conversar sobre uma questão jurídica.";
const waUrl = `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(WA_TEXT)}`;
if (/^\d+$/.test(WA_NUMBER)) {
  document.querySelectorAll("[data-wa]").forEach(a => { a.href = waUrl; a.target = "_blank"; a.rel = "noopener"; });
}

const header = document.getElementById("top");
const burger = document.querySelector(".burger");
const menu = document.getElementById("menu");
const still = matchMedia("(prefers-reduced-motion: reduce)").matches;
const setMenu = open => {
  menu.classList.toggle("open", open);
  burger.setAttribute("aria-expanded", open);
  burger.setAttribute("aria-label", open ? "Fechar menu" : "Abrir menu");
  document.body.style.overflow = open ? "hidden" : "";
};
menu.querySelectorAll("li,.nav-cta").forEach((el, i) => el.style.setProperty("--k", i));
burger.addEventListener("click", () => setMenu(!menu.classList.contains("open")));
menu.addEventListener("click", e => e.target.closest("a") && setMenu(false));
document.addEventListener("keydown", e => e.key === "Escape" && setMenu(false));

/* Títulos h2: reveal palavra por palavra (texto original preservado) */
document.querySelectorAll("h2").forEach(h => {
  h.setAttribute("aria-label", h.textContent.replace(/\s+/g, " ").trim());
  h.classList.remove("rv"); h.classList.add("ttl");
  const frag = document.createDocumentFragment(); let i = 0;
  h.childNodes.forEach(n => {
    if (n.nodeType !== 3) return frag.append(n.cloneNode(true));
    n.textContent.split(/\s+/).filter(Boolean).forEach(word => {
      const w = document.createElement("span"), s = document.createElement("span");
      w.className = "w"; w.setAttribute("aria-hidden", "true");
      s.textContent = word; s.style.setProperty("--i", i++);
      w.append(s); frag.append(w, " ");
    });
  });
  h.replaceChildren(frag);
});

/* Escalonamento de grupos */
document.querySelectorAll(".grid4,.grid3").forEach(g => [...g.children].forEach((c, i) => c.style.setProperty("--d", (i % 4) * .1 + "s")));
document.querySelectorAll(".facts li").forEach(li => li.style.setProperty("--i", [...li.parentNode.children].indexOf(li)));

/* Reveal ao entrar na viewport (a intro é sequenciada pela própria seção) */
const io = new IntersectionObserver(es => es.forEach(e => {
  if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); }
}), { threshold: .12, rootMargin: "0px 0px -6% 0px" });
document.querySelectorAll(".rv,.ttl,section,footer").forEach(el => {
  if (!el.closest(".intro") || el.matches(".intro")) io.observe(el);
});

/* Link ativo no menu */
const links = [...document.querySelectorAll("nav a")];
const so = new IntersectionObserver(es => es.forEach(e => {
  if (!e.isIntersecting) return;
  links.forEach(a => a.getAttribute("href") === "#" + e.target.id ? a.setAttribute("aria-current", "true") : a.removeAttribute("aria-current"));
}), { rootMargin: "-45% 0px -50% 0px" });
document.querySelectorAll("section[id]").forEach(s => so.observe(s));

/* Header + parallax sutil */
const pars = [...document.querySelectorAll("[data-par]")];
let ticking = false;
const onScroll = () => {
  header.classList.toggle("solid", scrollY > 40);
  if (!still) pars.forEach(el => {
    const r = el.getBoundingClientRect();
    if (r.bottom > 0 && r.top < innerHeight) el.style.setProperty("--py", (r.top + r.height / 2 - innerHeight / 2) * -(parseFloat(el.dataset.par) || .03) + "px");
  });
  ticking = false;
};
addEventListener("scroll", () => { if (!ticking) { ticking = true; requestAnimationFrame(onScroll); } }, { passive: true });
onScroll();

/* Desktop: cursor discreto e movimento interno das imagens */
if (matchMedia("(hover: hover) and (pointer: fine)").matches && !still) {
  const dot = document.createElement("div");
  dot.className = "cursor"; dot.setAttribute("aria-hidden", "true"); document.body.append(dot);
  let x = 0, y = 0, cx = 0, cy = 0;
  addEventListener("pointermove", e => {
    x = e.clientX; y = e.clientY; dot.classList.add("on");
    dot.classList.toggle("hov", !!e.target.closest("a,button"));
  }, { passive: true });
  document.documentElement.addEventListener("pointerleave", () => dot.classList.remove("on"));
  (function loop() {
    if (Math.abs(x - cx) + Math.abs(y - cy) > .3) {
      cx += (x - cx) * .18; cy += (y - cy) * .18;
      dot.style.transform = `translate3d(${cx}px,${cy}px,0)`;
    }
    requestAnimationFrame(loop);
  })();
  document.querySelectorAll(".photo,.arch").forEach(el => {
    const set = (a, b) => { el.style.setProperty("--mx", a); el.style.setProperty("--my", b); };
    el.addEventListener("pointermove", e => {
      const r = el.getBoundingClientRect();
      set(((e.clientX - r.left) / r.width - .5) * 2, ((e.clientY - r.top) / r.height - .5) * 2);
    });
    el.addEventListener("pointerleave", () => set(0, 0));
  });
}

/* Intro de abertura: toque, clique ou tecla pula a animação */
const skipIntro = () => {
  document.querySelector(".splash")?.classList.add("out");
  document.documentElement.classList.remove("intro-on");
};
document.querySelector(".splash")?.addEventListener("click", skipIntro);
addEventListener("keydown", skipIntro, { once: true });
