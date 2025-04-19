// document.addEventListener("DOMContentLoaded", () => {
//   const exploreBtn = document.getElementById("explore-map");
//   const cviSection = document.getElementById("CVI");

//   if (exploreBtn && cviSection) {
//     exploreBtn.addEventListener("mouseenter", () => {
//       cviSection.style.transition = "transform 0.5s ease";
//       cviSection.style.transform = "scale(1.03)";
//     });

//     exploreBtn.addEventListener("mouseleave", () => {
//       cviSection.style.transform = "scale(1)";
//     });
//   }
// });

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