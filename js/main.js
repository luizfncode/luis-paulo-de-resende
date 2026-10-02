/* =========================================================
   WHATSAPP
   ========================================================= */

const WA_NUMBER = "556196829401";
const WA_TEXT =
  "Olá, Dr. Luís Paulo. Gostaria de conversar sobre uma questão jurídica.";

const waUrl = `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(WA_TEXT)}`;

if (/^\d+$/.test(WA_NUMBER)) {
  document.querySelectorAll("[data-wa]").forEach((link) => {
    link.href = waUrl;
    link.target = "_blank";
    link.rel = "noopener";
  });
}


/* =========================================================
   ELEMENTOS PRINCIPAIS
   ========================================================= */

const header = document.getElementById("top");
const burger = document.querySelector(".burger");
const menu = document.getElementById("menu");

const prefersReducedMotion = window.matchMedia(
  "(prefers-reduced-motion: reduce)"
).matches;


/* =========================================================
   MENU MOBILE
   ========================================================= */

const setMenu = (open) => {
  if (!menu || !burger) return;

  menu.classList.toggle("open", open);

  burger.setAttribute("aria-expanded", String(open));

  burger.setAttribute(
    "aria-label",
    open ? "Fechar menu" : "Abrir menu"
  );

  document.body.style.overflow = open ? "hidden" : "";
};


/* Ordem das animações dos itens do menu */
if (menu) {
  menu
    .querySelectorAll("li, .nav-cta")
    .forEach((element, index) => {
      element.style.setProperty("--k", index);
    });
}


/* Abrir / fechar pelo botão */
burger?.addEventListener("click", () => {
  setMenu(!menu.classList.contains("open"));
});


/* Fechar ao clicar em um link */
menu?.addEventListener("click", (event) => {
  if (event.target.closest("a")) {
    setMenu(false);
  }
});


/* Fechar com Escape */
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    setMenu(false);
  }
});


/* =========================================================
   TÍTULOS H2
   Revelação palavra por palavra
   ========================================================= */

document.querySelectorAll("h2").forEach((heading) => {
  heading.setAttribute(
    "aria-label",
    heading.textContent.replace(/\s+/g, " ").trim()
  );

  heading.classList.remove("rv");
  heading.classList.add("ttl");

  const fragment = document.createDocumentFragment();
  let index = 0;

  heading.childNodes.forEach((node) => {

    /* Mantém elementos que já existiam dentro do h2 */
    if (node.nodeType !== Node.TEXT_NODE) {
      fragment.append(node.cloneNode(true));
      return;
    }

    /* Divide o texto em palavras */
    node.textContent
      .split(/\s+/)
      .filter(Boolean)
      .forEach((word) => {
        const wordWrapper = document.createElement("span");
        const wordText = document.createElement("span");

        wordWrapper.className = "w";
        wordWrapper.setAttribute("aria-hidden", "true");

        wordText.textContent = word;
        wordText.style.setProperty("--i", index++);

        wordWrapper.append(wordText);

        fragment.append(wordWrapper, " ");
      });
  });

  heading.replaceChildren(fragment);
});


/* =========================================================
   ESCALONAMENTO DE ANIMAÇÕES
   ========================================================= */

/* Cards e posts */
document.querySelectorAll(".grid4, .grid3").forEach((grid) => {
  [...grid.children].forEach((item, index) => {
    item.style.setProperty(
      "--d",
      `${(index % 4) * 0.1}s`
    );
  });
});


/* Itens da lista de informações */
document.querySelectorAll(".facts li").forEach((item) => {
  const index = [...item.parentNode.children].indexOf(item);

  item.style.setProperty("--i", index);
});


/* =========================================================
   REVEAL AO ENTRAR NA VIEWPORT
   ========================================================= */

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;

      entry.target.classList.add("in");

      revealObserver.unobserve(entry.target);
    });
  },
  {
    threshold: 0.12,
    rootMargin: "0px 0px -6% 0px"
  }
);


/* Elementos que serão observados */
document
  .querySelectorAll(".rv, .ttl, section, footer")
  .forEach((element) => {

    /*
      A intro possui sua própria sequência de animação.
      Portanto, seus elementos internos não entram aqui.
    */
    if (
      !element.closest(".intro") ||
      element.matches(".intro")
    ) {
      revealObserver.observe(element);
    }
  });


/* =========================================================
   LINK ATIVO DO MENU
   ========================================================= */

const navLinks = [
  ...document.querySelectorAll("nav a")
];

const sectionObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;

      navLinks.forEach((link) => {
        const isCurrent =
          link.getAttribute("href") === `#${entry.target.id}`;

        if (isCurrent) {
          link.setAttribute("aria-current", "true");
        } else {
          link.removeAttribute("aria-current");
        }
      });
    });
  },
  {
    rootMargin: "-45% 0px -50% 0px"
  }
);


document
  .querySelectorAll("section[id]")
  .forEach((section) => {
    sectionObserver.observe(section);
  });


/* =========================================================
   HEADER + PARALLAX
   ========================================================= */

const parallaxElements = [
  ...document.querySelectorAll("[data-par]")
];

let scrollTicking = false;


const updateScroll = () => {

  /* Header sólido depois de 40px */
  header?.classList.toggle(
    "solid",
    window.scrollY > 40
  );


  /* Parallax */
  if (!prefersReducedMotion) {
    parallaxElements.forEach((element) => {
      const rect = element.getBoundingClientRect();

      if (
        rect.bottom > 0 &&
        rect.top < window.innerHeight
      ) {
        const intensity =
          parseFloat(element.dataset.par) || 0.03;

        const offset =
          (
            rect.top +
            rect.height / 2 -
            window.innerHeight / 2
          ) * -intensity;

        element.style.setProperty(
          "--py",
          `${offset}px`
        );
      }
    });
  }

  scrollTicking = false;
};


window.addEventListener(
  "scroll",
  () => {
    if (scrollTicking) return;

    scrollTicking = true;

    requestAnimationFrame(updateScroll);
  },
  {
    passive: true
  }
);


/* Estado inicial */
updateScroll();


/* =========================================================
   CURSOR DESKTOP
   ========================================================= */

const desktopPointer =
  window.matchMedia(
    "(hover: hover) and (pointer: fine)"
  ).matches;


if (desktopPointer && !prefersReducedMotion) {

  const cursor = document.createElement("div");

  cursor.className = "cursor";
  cursor.setAttribute("aria-hidden", "true");

  document.body.append(cursor);


  let mouseX = 0;
  let mouseY = 0;

  let cursorX = 0;
  let cursorY = 0;


  /* Movimento do cursor */
  window.addEventListener(
    "pointermove",
    (event) => {
      mouseX = event.clientX;
      mouseY = event.clientY;

      cursor.classList.add("on");

      cursor.classList.toggle(
        "hov",
        !!event.target.closest("a, button")
      );
    },
    {
      passive: true
    }
  );


  /* Esconder cursor ao sair da página */
  document.documentElement.addEventListener(
    "pointerleave",
    () => {
      cursor.classList.remove("on");
    }
  );


  /* Suavização do movimento */
  const animateCursor = () => {

    if (
      Math.abs(mouseX - cursorX) +
      Math.abs(mouseY - cursorY) >
      0.3
    ) {
      cursorX += (mouseX - cursorX) * 0.18;
      cursorY += (mouseY - cursorY) * 0.18;

      cursor.style.transform =
        `translate3d(${cursorX}px, ${cursorY}px, 0)`;
    }

    requestAnimationFrame(animateCursor);
  };

  animateCursor();


  /* =======================================================
     MOVIMENTO INTERNO DAS IMAGENS
     ======================================================= */

  document
    .querySelectorAll(".photo, .arch")
    .forEach((element) => {

      const setPosition = (x, y) => {
        element.style.setProperty("--mx", x);
        element.style.setProperty("--my", y);
      };


      element.addEventListener(
        "pointermove",
        (event) => {

          const rect =
            element.getBoundingClientRect();

          const x =
            ((event.clientX - rect.left) / rect.width - 0.5) * 2;

          const y =
            ((event.clientY - rect.top) / rect.height - 0.5) * 2;

          setPosition(x, y);
        }
      );


      element.addEventListener(
        "pointerleave",
        () => {
          setPosition(0, 0);
        }
      );

    });
}


/* =========================================================
   INTRO DE ABERTURA
   ========================================================= */

const skipIntro = () => {

  document
    .querySelector(".splash")
    ?.classList.add("out");

  document.documentElement.classList.remove(
    "intro-on"
  );
};


/* Clique na splash */
document
  .querySelector(".splash")
  ?.addEventListener("click", skipIntro);


/* Qualquer tecla pula a intro */
window.addEventListener(
  "keydown",
  skipIntro,
  {
    once: true
  }
);