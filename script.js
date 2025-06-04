// ✅ Pulizia e miglioramento script.js

// Disabilita right-click e trascinamento su elementi media
document.addEventListener("contextmenu", e => e.preventDefault());

document.addEventListener("DOMContentLoaded", () => {
  // 🔒 Blocca il trascinamento di immagini e video
  document.querySelectorAll("img, video").forEach(el => {
    el.setAttribute("draggable", "false");
    el.addEventListener("dragstart", e => e.preventDefault());
  });

  // 🌀 Avvia transizione fade-in alla prima visualizzazione
  requestAnimationFrame(() => {
    document.documentElement.classList.add("fade-in");
  });

  // ⬅️ Transizione fade-out sui link interni
  document.querySelectorAll("a[href]").forEach(link => {
    const href = link.getAttribute("href");
    if (!href || href.startsWith("#") || href.startsWith("mailto:") || link.target === "_blank") return;

    link.addEventListener("click", e => {
      e.preventDefault();
      document.documentElement.classList.remove("fade-in");
      document.documentElement.classList.add("fade-out");
      setTimeout(() => {
        window.location.href = href;
      }, 600);
    });
  });

  // 🎞️ Video hover + z-index + autoplay dopo 1 secondo
  const videos = document.querySelectorAll(".image-grid video");

  videos.forEach(video => {
    video.muted = true;
    video.volume = 0.5;
    const wrapper = video.closest(".video-wrapper");
    let hoverTimeout;

    const startHover = () => {
      videos.forEach(v => { if (v !== video) v.style.zIndex = "1"; });
      video.style.zIndex = "20";
      hoverTimeout = setTimeout(() => {
        const playWhenReady = () => {
          if (video.readyState >= 2) video.play().catch(() => {});
          else video.addEventListener("canplay", () => video.play().catch(() => {}), { once: true });
        };
        playWhenReady();
      }, 1000);
    };

    const stopHover = () => {
      clearTimeout(hoverTimeout);
      video.pause();
      setTimeout(() => {
        const isHovered = video.matches(":hover") || wrapper?.querySelector(".see-more:hover");
        if (!isHovered) video.style.zIndex = "1";
      }, 400);
    };

    if (wrapper) {
      wrapper.addEventListener("mouseenter", startHover);
      wrapper.addEventListener("mouseleave", stopHover);
    }
  });

  // 👀 Animazione in ingresso di sezioni e griglie video
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.25 });

  document.querySelectorAll(".category, .image-grid").forEach(el => observer.observe(el));

  // 📎 Link dinamico "See more..." in base a data-category
  document.querySelectorAll(".video-wrapper").forEach(wrapper => {
    const category = wrapper.dataset.category;
    const link = wrapper.querySelector(".see-more");
    if (link && category) link.setAttribute("href", `${category}.html`);
  });

  // 🎯 Click su titolo sezione per redirect
  const sectionToPage = {
    "music-videos": "sections/music.html",
    "clubbing": "sections/clubbing.html",
    "shorts": "sections/shorts.html",
    "commercial": "sections/commercial.html",
    "festival": "sections/festival.html"
  };

  document.querySelectorAll(".category h2").forEach(h2 => {
    h2.style.cursor = "pointer";
    const section = h2.closest(".category");
    const id = section?.id;
    const targetPage = sectionToPage[id];
    if (targetPage) {
      h2.addEventListener("click", () => {
        document.documentElement.classList.remove("fade-in");
        document.documentElement.classList.add("fade-out");
        setTimeout(() => {
          window.location.href = targetPage;
        }, 600);
      });
    }
  });

  // 🍔 Hamburger menu: toggle animazione + comparsa graduale
  const hamburger = document.querySelector(".hamburger");
  const nav = document.querySelector(".header-left nav");
  const body = document.body;

  if (hamburger && nav) {
    hamburger.addEventListener("click", () => {
      nav.classList.toggle("open");
      hamburger.classList.toggle("active");

      // ✅ Blocca lo scroll del body quando il menu è aperto
      if (nav.classList.contains("open")) {
        body.style.overflow = "hidden";
      } else {
        body.style.overflow = "";
      }
    });
  }

  // Blocca ogni tentativo di autoplay o interazione video su mobile
if (window.innerWidth <= 768) {
  document.querySelectorAll(".image-grid .video-wrapper video").forEach(video => {
    video.removeAttribute("autoplay");
    video.removeAttribute("muted");
    video.removeAttribute("loop");
    video.pause();
    video.controls = false;
    video.style.pointerEvents = "none";
  });
}

document.addEventListener("click", (e) => {
  const isClickInsideMenu = nav.contains(e.target);
  const isClickOnHamburger = hamburger.contains(e.target);

  if (!isClickInsideMenu && !isClickOnHamburger && nav.classList.contains("open")) {
    nav.classList.remove("open");
    hamburger.classList.remove("active");
    body.style.overflow = "";
  }

  // 🌟 Animazione STAGGERED su categorie
  const categories = document.querySelectorAll(".category");
});
});


// 📍 Anima immagini quando il titolo di sezione entra nel viewport
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const section = entry.target.closest("section");
      if (!section) return;

      const images = section.querySelectorAll(".project-image");
      images.forEach((img, i) => {
        setTimeout(() => {
          img.classList.add("stagger-visible");
        }, i * 150); // Stagger di 150ms
      });

      observer.unobserve(entry.target); // Una volta attivato, non osserviamo più
    }
  });
}, {
  threshold: 0.5
});

// Target: ogni h2 dentro una sezione
document.querySelectorAll("section h2").forEach(h2 => {
  observer.observe(h2);
});

// 🎯 IntersectionObserver per animazioni categorie (eseguito subito)
const categories = document.querySelectorAll(".category");

const categoryObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const wrappers = entry.target.querySelectorAll(".video-wrapper");

      wrappers.forEach((wrapper, i) => {
        setTimeout(() => {
          wrapper.classList.add("visible");
        }, i * 200);
      });

      categoryObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.3 });

categories.forEach(cat => categoryObserver.observe(cat));

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("contact-form");

  form.addEventListener("submit", async (e) => {
    e.preventDefault(); // blocca invio classico

    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());

    try {
      const response = await fetch("https://formspree.io/f/mblonnld", {
        method: "POST",
        headers: { 'Accept': 'application/json' },
        body: formData
      });

      if (response.ok) {
        window.location.href = "/whosfra/thanks.html"; // ✅ percorso dalla root GitHub Pages
      } else {
        alert("Errore durante l'invio del messaggio.");
      }
    } catch (error) {
      // console.error("Errore:", error);
      // alert("Errore imprevisto. Assicurati di disattivare eventuali AdBlockers.");
    }
  });
});