const clearAll = document.querySelector(".clear-all");
const pickedColors = JSON.parse(localStorage.getItem("chosen-colors") || "[]");
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

const deleteColor = (color) => {
    const colorIndex = pickedColors.indexOf(color);
    if (colorIndex !== -1) {
        pickedColors.splice(colorIndex, 1);
        localStorage.setItem("chosen-colors", JSON.stringify(pickedColors));
        showColors();
    }
}

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
      document.querySelector('.most-recent-color').classList.remove('hide');

      generatePaletteFromColor(mostRecentColor);
    } else {
        document.querySelector('.most-recent-color').classList.add('hide');
        colorPalette.innerHTML = '';
        // colorPalette.classList.add("hide");
    }
}

showColors();

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

const clearAllColors = () =>{
    pickedColors.length=0;
    localStorage.setItem("chosen-colors",JSON.stringify(pickedColors));
    showColors();
}

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

clearAll.addEventListener("click", clearAllColors);

// Color Picker
document.querySelector("#color-button").addEventListener("click", activateEyeDropper);

// Toggle Recents 
toggleSection.addEventListener("click", toggleColorsSection);
toggleSection.addEventListener('mouseover', () => {
  toggleSection.style.backgroundColor = '#e9e9e9';
  toggleButton.style.backgroundColor = '#e9e9e9';
});
toggleSection.addEventListener('mouseout', () => {
  toggleSection.style.backgroundColor = '';
  toggleButton.style.backgroundColor = '';
});

// Toggle Color Palette
paletteSection.addEventListener("click", toggleColorPaletteSection);

paletteSection.addEventListener('mouseover', () => {
  paletteSection.style.backgroundColor = '#e9e9e9';
  paletteButton.style.backgroundColor = '#e9e9e9';
});
paletteSection.addEventListener('mouseout', () => {
  paletteSection.style.backgroundColor = '';
  paletteButton.style.backgroundColor = '';
});

exitButton.addEventListener('click', () => {
  window.close();
});

