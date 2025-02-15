/*!
 * Start Bootstrap - Resume v7.0.5 (https://startbootstrap.com/theme/resume)
 * Copyright 2013-2022 Start Bootstrap
 * Licensed under MIT (https://github.com/StartBootstrap/startbootstrap-resume/blob/master/LICENSE)
 */
//
// Scripts
//

window.addEventListener("DOMContentLoaded", (event) => {
  // Activate Bootstrap scrollspy on the main nav element
  const sideNav = document.body.querySelector("#sideNav");
  if (sideNav) {
    new bootstrap.ScrollSpy(document.body, {
      target: "#sideNav",
      offset: 74,
    });
  }

  // Collapse responsive navbar when toggler is visible
  const navbarToggler = document.body.querySelector(".navbar-toggler");
  const responsiveNavItems = [].slice.call(
    document.querySelectorAll("#navbarResponsive .nav-link")
  );
  responsiveNavItems.map(function (responsiveNavItem) {
    responsiveNavItem.addEventListener("click", () => {
      if (window.getComputedStyle(navbarToggler).display !== "none") {
        navbarToggler.click();
      }
    });
  });
});

// let scrollX = window.pageXOffset || document.documentElement.scrollLeft;
let scrollY = window.pageYOffset || document.documentElement.scrollTop;
let scrollDiff = 0;
let strength = 0;
let currDiv = 0;
const strengthLimit = 500;
let blurRadius = 0; // Initial blur radius (start with no blur)

const canvas = document.getElementById("myCanvas"); // Get your canvas element
canvas.width = 200;
canvas.height = 200;
const ctx = canvas.getContext("2d");
const img1 = new Image();
img1.src = "assets/pictures/0.jpg";
const img2 = new Image();
img2.src = "assets/pictures/0.jpg";


const divBounds = [
  {
    id: "about",
    picture: "assets/pictures/0.jpg",
    bounds: 0,
  },
  {
    id: "experience",
    picture: "assets/pictures/stars.jpg",
    bounds:
      document.getElementById("experience").getBoundingClientRect().top -
      document.getElementById("about").getBoundingClientRect().top,
  },
  {
    id: "education",
    picture: "assets/pictures/books.jpg",
    bounds:
      document.getElementById("education").getBoundingClientRect().top -
      document.getElementById("about").getBoundingClientRect().top,
  },
  {
    id: "skills",
    picture: "assets/pictures/tools.jpg",
    bounds:
      document.getElementById("skills").getBoundingClientRect().top -
      document.getElementById("about").getBoundingClientRect().top,
  },
  {
    id: "interests",
    picture: "assets/pictures/controller.jpg",
    bounds:
      document.getElementById("interests").getBoundingClientRect().top -
      document.getElementById("about").getBoundingClientRect().top,
  },
  {
    id: "projects",
    picture: "assets/pictures/hardhat.jpg",
    bounds:
      document.getElementById("projects").getBoundingClientRect().top -
      document.getElementById("about").getBoundingClientRect().top,
  },
  {
    id: "awards",
    picture: "assets/pictures/trophy.jpg",
    bounds:
      document.getElementById("awards").getBoundingClientRect().top -
      document.getElementById("about").getBoundingClientRect().top,
  },
];

window.addEventListener("scroll", () => {
  scrollY = window.pageYOffset || document.documentElement.scrollTop;
  let i = divBounds.length - 1;
  let currDiv = -1;
  while (i >= 0 && currDiv === -1) {
    if (scrollY >= divBounds[i].bounds) {
      currDiv = i;
    }
    i--;
  }
  if (currDiv != -1) {
    scrollDiff = scrollY - divBounds[currDiv].bounds;
    strength =
      currDiv === divBounds.length - 1
        ? 0
        : scrollDiff -
          (divBounds[currDiv + 1].bounds - divBounds[currDiv].bounds) / 4;
    strength = Math.min(strengthLimit, strength)
    img1.src = divBounds[currDiv].picture;
    img2.src = currDiv === divBounds.length - 1 ? divBounds[currDiv].picture : divBounds[currDiv + 1].picture;
  }
  console.log([
    scrollY,
    currDiv != -1 ? divBounds[currDiv].bounds : -1,
    currDiv,
    scrollDiff,
    strength,
  ]);
  blurRadius = strength < 0 ? 0 : Math.abs(strength) / 500; // Adjust divisor for blur amount
  if (strength < 0) {
    ctx.drawImage(drawSwirl(0, img1), 0, 0);
   } else {
    ctx.globalAlpha = (strengthLimit - strength) / strengthLimit
    ctx.drawImage(drawSwirl(-strength, img1), 0, 0);
    ctx.globalAlpha = (strength) / strengthLimit;
    ctx.drawImage(drawSwirl(strengthLimit - strength, img2, (strength) / strengthLimit), 0, 0);
    ctx.globalAlpha = 1.0
   }
});

function drawSwirl(offset, image) {
  const tempCanvas = document.createElement('canvas');
  tempCanvas.width = canvas.width;
  tempCanvas.height = canvas.height;
  const tempCtx = tempCanvas.getContext('2d');
  // Draw the image scaled and potentially blurred
  // tempCtx.filter = `blur(${blurRadius}px)`; // Apply blur
  tempCtx.drawImage(image, 0, 0); // Draw scaled image
  // tempCtx.filter = "none"; // Reset filter

  const imageData = tempCtx.getImageData(0, 0, canvas.width, canvas.height);
  let newData = imageData.data.slice(); // Pixel data (RGBA values)

  const centerX = canvas.width / 2;
  const centerY = canvas.height / 2;
  const radius = Math.min(centerX, centerY); // Swirl radius
  const strength = offset / 500; // Swirl strength (adjust this)

  for (let y = 0; y < canvas.height; y++) {
    for (let x = 0; x < canvas.width; x++) {
      const dx = x - centerX;
      const dy = y - centerY;
      const distance = Math.sqrt(dx * dx + dy * dy);

      if (distance < radius) {
        const angle = Math.atan2(dy, dx) + (strength * distance) / radius; // Swirl angle
        const newX = centerX + Math.cos(angle) * distance;
        const newY = centerY + Math.sin(angle) * distance;

        // Get the pixel color from the original image
        const originalX = Math.round(newX);
        const originalY = Math.round(newY);

        if (
          originalX >= 0 &&
          originalX < canvas.width &&
          originalY >= 0 &&
          originalY < canvas.height
        ) {
          const index = (originalY * canvas.width + originalX) * 4;
          const newIndex = (y * canvas.width + x) * 4;
          newData[index] = imageData.data[newIndex]; // R
          newData[index + 1] = imageData.data[newIndex + 1]; // G
          newData[index + 2] = imageData.data[newIndex + 2]; // B
          newData[index + 3] = imageData.data[newIndex + 3]; // A
        }
      }
    }
  }

  const newImageData = new ImageData(newData, canvas.width, canvas.height);

  tempCtx.putImageData(newImageData, 0, 0); // Update the canvas with the swirled image
  return tempCanvas
}
