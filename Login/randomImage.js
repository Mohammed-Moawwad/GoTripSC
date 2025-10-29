document.addEventListener("DOMContentLoaded", function () {
  const images = [
    "Photos/pexels-sulimansallehi-2162891.jpg",
    "Photos/pexels-stefanstefancik-127905.jpg",
    "Photos/pexels-nubikini-386009.jpg",
    "Photos/istockphoto-1440399157-612x612.jpg",
  ];

  // Get a random image from the array
  const randomImage = images[Math.floor(Math.random() * images.length)];

  // Find the left side image and update its src
  const leftSideImage = document.querySelector(
    ".hidden.md\\:block.bg-blue-500 img"
  );
  if (leftSideImage) {
    leftSideImage.src = randomImage;
  }
});
