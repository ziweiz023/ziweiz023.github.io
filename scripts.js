
document.addEventListener("DOMContentLoaded", () => {
    const exploreBtn = document.getElementById("explore-map");
    const cviSection = document.getElementById("CVI");
  
    if (exploreBtn && cviSection) {
      exploreBtn.addEventListener("mouseenter", () => {
        cviSection.classList.add("zoomed");
      });
  
      exploreBtn.addEventListener("mouseleave", () => {
        cviSection.classList.remove("zoomed");
      });
    }
  });


  document.addEventListener("DOMContentLoaded", () => {
    const exploreBtn = document.getElementById("read-report");
    const cviSection = document.getElementById("report");
  
    if (exploreBtn && cviSection) {
      exploreBtn.addEventListener("mouseenter", () => {
        cviSection.classList.add("zoomed");
      });
  
      exploreBtn.addEventListener("mouseleave", () => {
        cviSection.classList.remove("zoomed");
      });
    }
  });

  document.addEventListener("DOMContentLoaded", () => {
    const exploreBtn = document.getElementById("poster");
    const cviSection = document.getElementById("report");
  
    if (exploreBtn && cviSection) {
      exploreBtn.addEventListener("mouseenter", () => {
        cviSection.classList.add("zoomed");
      });
  
      exploreBtn.addEventListener("mouseleave", () => {
        cviSection.classList.remove("zoomed");
      });
    }
  });