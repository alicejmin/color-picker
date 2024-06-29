// DOM elements
const clearAll = document.querySelector(".clear-all");
const pickedColors = JSON.parse(localStorage.getItem("chosen-colors") || "[]");
const mostRecent = document.querySelector('.most-recent-color');
const mostRecentColorRect = document.getElementById("most-recent-color-rect");
const mostRecentColorValue = document.getElementById("most-recent-color-value");
const toggleSection = document.querySelector(".toggle");
const toggleButton = document.querySelector("#toggle-button");
const pickedColorsSection = document.querySelector(".chosen-colors");
const recentsGrid = document.querySelector(".recents-grid");
const exitButton = document.getElementById('exit-button')
const paletteSection = document.querySelector('.palette-toggle');
const paletteButton = document.querySelector('#palette-toggle-button');
const colorPalette = document.querySelector(".color-palette");

/* 
Generate color palettes based on the provided color 
*/
const generatePaletteFromColor = (color) => {
  const baseColor = tinycolor(color);
  const palettes = {
    "Split Complementary": baseColor.splitcomplement(),
    "Triadic": baseColor.triad(),
    "Tetradic": baseColor.tetrad(),
    "Monochromatic": baseColor.monochromatic(),
  };

  displayPalette(palettes);
};

/**
 * Display the generated color palette in the UI
 * @param {Object} palettes - Object containing palette types and their colors
 */
const displayPalette = (palettes) => {
  colorPalette.innerHTML = ''; // Clear previous palette

  for (const [paletteName, colors] of Object.entries(palettes)) {
      const paletteContainer = document.createElement('div');
      paletteContainer.classList.add('palette-container');

      colors.forEach(color => {
          const colorBox = document.createElement('div');
          colorBox.style.backgroundColor = tinycolor(color).toHexString();
          const colorString = tinycolor(color).toHexString();
          colorBox.addEventListener("click", () => copyColor(colorString, colorBox));
          colorBox.classList.add('palette-color');
          paletteContainer.appendChild(colorBox);
      });

      colorPalette.appendChild(paletteContainer);
  }
};

/**
 * Copy a color value to the clipboard and show a copied message
 * @param {string} colorValue - The color value to copy
 * @param {HTMLElement} container - The container to display the copied message
 */
const copyColor = (colorValue, container) => {
  try{
    navigator.clipboard.writeText(colorValue);
    const textElement = document.createElement("span");
    textElement.innerText = "Copied!";
    textElement.classList.add("copied-message");
    recentsGrid.appendChild(textElement);
    container.appendChild(textElement);

    setTimeout(() => {
        recentsGrid.removeChild(textElement);
    }, 1000);
  } catch{
      console.error('Could not copy text: ');
  }
}

/**
 * Show picked colors in the UI
 */
const showColors = () => {
    recentsGrid.innerHTML = ""; 

    pickedColors.forEach((color) => {
      const colorElement = document.createElement("div");
      colorElement.classList.add("color");

      const colorBox = document.createElement("div");
      colorBox.classList.add("rect");
      colorBox.style.background = color;

      const colorText = document.createElement("span");
      colorText.classList.add("value");
      colorText.textContent = color;

      colorElement.appendChild(colorBox);
      colorElement.appendChild(colorText);

      colorElement.addEventListener("click", () => copyColor(color));
      recentsGrid.appendChild(colorElement);
    });

    if (pickedColors.length > 0) {
      
      const mostRecentColor = pickedColors[pickedColors.length - 1];
      mostRecentColorRect.style.background = mostRecentColor;
      mostRecentColorValue.textContent = mostRecentColor;
      mostRecent.classList.remove('hide');

      generatePaletteFromColor(mostRecentColor);
      mostRecentColorRect.addEventListener("click", () => copyColor(mostRecentColor, mostRecentColorRect));
      mostRecentColorValue.addEventListener("click", () => copyColor(mostRecentColor, mostRecentColorValue));  
    } else {
        mostRecent.classList.add('hide');
        colorPalette.innerHTML = '';
    }
    
}

// Initial display
showColors();

/**
 * Activate the EyeDropper tool to pick a color from the screen
 */
const activateEyeDropper = async () =>{
    try{
        const eyeDropper = new EyeDropper();
        const { sRGBHex } = await eyeDropper.open();
        navigator.clipboard.writeText(sRGBHex);

        if (!pickedColors.includes(sRGBHex)){
            pickedColors.push(sRGBHex);
            localStorage.setItem("chosen-colors", JSON.stringify(pickedColors));
        }

        showColors();
    } catch(error){
        console.log(error)
    }
}

/**
 * Clear all recent colors and update the UI
 */
const clearAllColors = () => {
    pickedColors.length=0;
    localStorage.setItem("chosen-colors",JSON.stringify(pickedColors));
    showColors();
}

/**
 * Clear the most recent color and update the UI
 */
const clearRecent = () => {
  mostRecent.classList.add('hide');
  colorPalette.innerHTML = '';
}

/**
 * Icon Animation -- Color Palette Section
 */
const toggleColorsSection = () => {
  pickedColorsSection.classList.toggle("hide");
  if (pickedColorsSection.classList.contains("hide")) {
    toggleButton.classList.remove("rotate-90");
    toggleButton.classList.add("rotate-0");
  } else {
    toggleButton.classList.remove("rotate-0");
    toggleButton.classList.add("rotate-90");
  }
}

/**
 * Icon Animation -- Color Palette Section
 */
const toggleColorPaletteSection = () => {
  colorPalette.classList.toggle("hide");
  if (colorPalette.classList.contains("hide")) {
    paletteButton.classList.remove("rotate-90");
    paletteButton.classList.add("rotate-0");
  } else {
    paletteButton.classList.remove("rotate-0");
    paletteButton.classList.add("rotate-90");
  }
};

/* Event listeners */

// Clear All
clearAll.addEventListener("click", clearAllColors);

// Clear most recent color 
document.querySelector(".clear-recent").addEventListener("click", clearRecent);

// Activate EyeDropper
document.querySelector("#color-button").addEventListener("click", activateEyeDropper);

// Toggle visibility of picked colors 
toggleSection.addEventListener("click", toggleColorsSection);
toggleSection.addEventListener('mouseover', () => {
  toggleSection.style.backgroundColor = '#e9e9e9';
  toggleButton.style.backgroundColor = '#e9e9e9';
});
toggleSection.addEventListener('mouseout', () => {
  toggleSection.style.backgroundColor = '';
  toggleButton.style.backgroundColor = '';
});

// Toggle visibility of color palette 
paletteSection.addEventListener("click", toggleColorPaletteSection);
paletteSection.addEventListener('mouseover', () => {
  paletteSection.style.backgroundColor = '#e9e9e9';
  paletteButton.style.backgroundColor = '#e9e9e9';
});
paletteSection.addEventListener('mouseout', () => {
  paletteSection.style.backgroundColor = '';
  paletteButton.style.backgroundColor = '';
});

// Close window
exitButton.addEventListener('click', () => {
  window.close();
});

