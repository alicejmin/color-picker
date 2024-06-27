const colorButton = document.querySelector("#color-button");
const colorList = document.querySelector(".recents");
const clearAll = document.querySelector(".clear-all");
const pickedColors= JSON.parse(localStorage.getItem("chosen-colors") || "[]");
const toggleSection = document.querySelector(".toggle");
const toggleButton = document.querySelector("#toggle-button");
const pickedColorsSection = document.querySelector(".chosen-colors");
const recentsGrid = document.querySelector(".recents-grid");
const exitButton = document.getElementById('exit-button')

const copyColor = (colorValue) => {
  try{
    navigator.clipboard.writeText(colorValue);
    const textElement = document.createElement("span");
    textElement.innerText = "Copied";
    textElement.classList.add("slide-out");
    recentsGrid.appendChild(textElement);

    setTimeout(() => {
        recentsGrid.removeChild(textElement);
    }, 1000);
  } catch{
      console.error('Could not copy text: ');
  }
    // const textElement = document.createElement("span");

    // navigator.clipboard.writeText(colorValue);
    // textElement.innerText = "Copied";
    // textElement.classList.add("slide-out");
    // recentsGrid.appendChild(textElement);
    
    // const textElement = e.querySelector(".value");
    // navigator.clipboard.writeText(colorValue);
    // textElement.innerText = "copied";
    // textElement.classList.add("slide-out");

    // setTimeout(() => {
    //     textElement.innerText = colorValue;
    //     textElement.classList.remove("slide-out");
    // }, 1000);
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
    recentsGrid.innerHTML = ""; // Clear the grid first

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
}

showColors();

const activateEyeDropper = async () =>{
    try{
        const eyeDropper = new EyeDropper();
        //sRGBHex A string representing the selected color, in hexadecimal sRGB format 
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


clearAll.addEventListener("click", clearAllColors);
colorButton.addEventListener("click", activateEyeDropper);
toggleSection.addEventListener("click", toggleColorsSection);

toggleSection.addEventListener('mouseover', () => {
  toggleSection.style.backgroundColor = '#e9e9e9';
  toggleButton.style.backgroundColor = '#e9e9e9';
});
toggleSection.addEventListener('mouseout', () => {
  toggleSection.style.backgroundColor = '';
  toggleButton.style.backgroundColor = '';
});

exitButton.addEventListener('click', () => {
  window.close();
});

