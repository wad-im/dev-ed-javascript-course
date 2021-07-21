const colorDivs = document.querySelectorAll('.color')
const generateBtn = document.querySelector('.generate')
const sliders = document.querySelectorAll('input[type="range"]')
const currentHexes = document.querySelectorAll('.color h2')
const popup = document.querySelector('.copy-container')
const adjustButton = document.querySelectorAll('.adjust')
const closeAdjustments = document.querySelectorAll('.close-adjustment')
const lockButton = document.querySelectorAll('.lock')
const slidersContainer = document.querySelectorAll('.sliders')
let initialColors;
let savedPalettes = [];

// event listeners
sliders.forEach(slider => {
    slider.addEventListener('input', hslControls)
})
colorDivs.forEach((div, index) => {
    div.addEventListener('change', ()=> {
        updateTextUI(index)
    })
})
currentHexes.forEach(hex => {
    hex.addEventListener('click', ()=>{
        copyToClipBoard(hex)
    })
})
popup.addEventListener('transitionend', ()=>{
    const popupBox = popup.children[0]
    popupBox.classList.remove('active')
    popup.classList.remove('active')
})
adjustButton.forEach((button, index)=>{
    button.addEventListener('click', ()=>{
        openAdjustmentPanel(index)
    })
})
closeAdjustments.forEach((button, index)=>{
    button.addEventListener('click', ()=>{
        closeAdjustmentPanel(index)
    })
})
lockButton.forEach((button, index)=>{
    button.addEventListener('click', ()=>{
        lockColor(index)
    })
})
generateBtn.addEventListener('click', randomColor)


// color generator

function generateHex(){
    const hexColor = chroma.random()
    return hexColor;
}

function randomColor(){
    initialColors = [];
    colorDivs.forEach((div, index) => {
        const hexText = div.children[0]
        const randomColor = generateHex()
        if(div.classList.contains('locked')){
            initialColors.push(hexText.innerText)
            return
        } else {
            initialColors.push(chroma(randomColor).hex())
        }
        

        div.style.backgroundColor = randomColor
        hexText.innerText = randomColor;
        checkTextContrast(randomColor, hexText)
        const color = chroma(randomColor)
        const sliders = div.querySelectorAll('.sliders input')
        const hue = sliders[0]
        const brightness = sliders[1]
        const saturation = sliders[2]

        colorizeSliders(color, hue, brightness, saturation)
    })
    resetInputs()
    adjustButton.forEach((button, index)=>{
        lockButton[index]
        checkTextContrast(initialColors[index], button)
        checkTextContrast(initialColors[index], lockButton[index])
    })
}

function checkTextContrast(color, text){
    const luminance = chroma(color).luminance()
    if (luminance > 0.5){
        text.style.color = "black"
    } else {
        text.style.color = "white"
    }
}

function colorizeSliders(color, hue, brightness, saturation){
    const noSat = color.set('hsl.s', 0)
    const fullSat = color.set('hsl.s', 1)
    const scaleSat = chroma.scale([noSat,color,fullSat])
    saturation.style.backgroundImage = `linear-gradient(to right, ${scaleSat(0)}, ${scaleSat(1)})`
    const midBright = color.set('hsl.l', 0.5)
    const scaleBrightness = chroma.scale(['black', midBright, 'white'])
    brightness.style.backgroundImage = `linear-gradient(to right, ${scaleBrightness(0)}, ${scaleBrightness(0.5)}, ${scaleBrightness(1)})`
    hue.style.backgroundImage = `linear-gradient(to right, rgb(204, 75, 75), rgb(204,204 ,75),rgb(75, 204, 75),rgb(75, 204, 204),rgb(75,75,204),rgb(204,75,204),rgb(204,75,75))`;
}

function hslControls(e){
    const index =
        e.target.getAttribute('data-bright') || 
        e.target.getAttribute('data-sat') || 
        e.target.getAttribute('data-hue')
    let sliders = e.target.parentElement.querySelectorAll('input[type="range"]');
    const hue = sliders[0]
    const brightness = sliders[1]
    const saturation = sliders[2]
    const bgColor = initialColors[index]
    let color = chroma(bgColor).set('hsl.s', saturation.value).set('hsl.l', brightness.value).set('hsl.h', hue.value)
    colorDivs[index].style.backgroundColor = color;
    colorizeSliders(color, hue, brightness, saturation)
}

function updateTextUI(index){
    const activeDiv = colorDivs[index]
    const color = chroma(activeDiv.style.backgroundColor)
    const textHex = activeDiv.querySelector('h2')
    const icons = activeDiv.querySelectorAll('.controls button')
    textHex.innerText = color.hex()
    checkTextContrast(color, textHex)
    for(icon of icons){
        checkTextContrast(color, icon)
    }
}  

function resetInputs(){
    const sliders = document.querySelectorAll('.sliders input')
    sliders.forEach(slider => {
        if(slider.name === 'hue'){
            const hueColor = initialColors[slider.getAttribute('data-hue')]
            const hueValue = chroma(hueColor).hsl()[0]
            slider.value = Math.floor(hueValue);
        }
        if(slider.name === 'brightness'){
            const brightColor = initialColors[slider.getAttribute('data-bright')]
            const brightValue = chroma(brightColor).hsl()[2]
            slider.value = Math.floor(brightValue*100) / 100;
        }
        if(slider.name == 'saturation'){
            const satColor = initialColors[slider.getAttribute('data-sat')]
            const satValue = chroma(satColor).hsl()[1]
            slider.value = Math.floor(satValue*100)/100;
        }
    })
}

function copyToClipBoard(hex){
    const el = document.createElement('textarea')
    el.value = hex.innerText;
    document.body.appendChild(el)
    el.select()
    document.execCommand('copy')
    document.body.removeChild(el);

    const popupBox = popup.children[0]
    popup.classList.add('active')
    popupBox.classList.add('active')
}

function openAdjustmentPanel(index){
    slidersContainer[index].classList.toggle('active')
}
function closeAdjustmentPanel(index){
    slidersContainer[index].classList.remove('active')
}

function lockColor(index) {
    colorDivs[index].classList.toggle("locked");
    lockButton[index].children[0].classList.toggle("fa-lock-open");
    lockButton[index].children[0].classList.toggle("fa-lock");
}

const saveButton = document.querySelector('.save')
const submitSave = document.querySelector('.submit-save')
const closeSave = document.querySelector('.close-save')
const saveContainer = document.querySelector('.save-container')
const saveInput = document.querySelector('.save-container input')
const libraryContainer = document.querySelector('.library-container')
const libaryButton = document.querySelector('.library')
const closeLibraryButton = document.querySelector('.close-library')

saveButton.addEventListener('click', openPalette)
closeSave.addEventListener('click', closePalette)
submitSave.addEventListener('click', savePalette)
libaryButton.addEventListener('click', openLibrary)
closeLibraryButton.addEventListener('click', closeLibrary)

function openPalette(e) {
    const popup = saveContainer.children[0]
    saveContainer.classList.add('active')
    popup.classList.add('active')
}
function closePalette(e){
    const popup = saveContainer.children[0]
    saveContainer.classList.remove('active')
    popup.classList.remove('active')
}
function savePalette(e){
    saveContainer.classList.remove('active')
    popup.classList.remove('active')
    const name = saveInput.value
    const colors = [];
    currentHexes.forEach(hex => {
        colors.push(hex.innerText)
    })

    let paletteNr
    const paletteObjects = JSON.parse(localStorage.getItem('palettes'))
    if (paletteObjects){
        paletteNr = paletteObjects.length
    } else {
        paletteNr = savedPalettes.length
    }
    const paletteObj = {name, colors, nr: paletteNr}
    savedPalettes.push(paletteObj);
    saveToLocal(paletteObj)
    saveInput.value = ''

    const palette = document.createElement('div')
    palette.classList.add('custom-palette')
    const title = document.createElement('h4')
    title.innerText = paletteObj.name
    const preview = document.createElement('div')
    preview.classList.add('small-preview')
    paletteObj.colors.forEach(smallColor =>{
        const smallDiv = document.createElement('div')
        smallDiv.style.backgroundColor = smallColor;
        preview.appendChild(smallDiv)
    })
    const paletteButton = document.createElement('button')
    paletteButton.classList.add('pick-palette-button')
    paletteButton.classList.add(paletteObj.nr)
    paletteButton.innerText = 'Select'

    paletteButton.addEventListener('click', e => {
        closeLibrary()
        const paletteIndex = e.target.classList[1]
        initialColors = []
        savedPalettes[paletteIndex].colors.forEach((color, index) => {
            initialColors.push(color)
            colorDivs[index].style.backgroundColor = color
            const text = colorDivs[index].children[0]
            checkTextContrast(color, text)
            updateTextUI(index)
        })
        resetInputs()
    })

    palette.appendChild(title)
    palette.appendChild(preview)
    palette.appendChild(paletteButton)
    libraryContainer.children[0].appendChild(palette)
}

function saveToLocal(paletteObj){
    let localPalettes
    if (localStorage.getItem('palettes')=== null){
        localPalettes = [];
    } else {
        localPalettes = JSON.parse(localStorage.getItem('palettes'))
    }
    localPalettes.push(paletteObj)
    localStorage.setItem('palettes', JSON.stringify(localPalettes))
}

function openLibrary(){
    const popup = libraryContainer.children[0]
    libraryContainer.classList.add('active')
    popup.classList.add('active')
}
function closeLibrary(){
    const popup = libraryContainer.children[0]
    libraryContainer.classList.remove('active')
    popup.classList.remove('active')
}

function getLocal(){
    if(localStorage.getItem('palettes')=== null )  {
        localPalettes = [];
    } else {
        const paletteObjects = JSON.parse(localStorage.getItem('palettes'))
        savedPalettes = [...paletteObjects]
        paletteObjects.forEach(paletteObj => {
            const palette = document.createElement('div')
    palette.classList.add('custom-palette')
    const title = document.createElement('h4')
    title.innerText = paletteObj.name
    const preview = document.createElement('div')
    preview.classList.add('small-preview')
    paletteObj.colors.forEach(smallColor =>{
        const smallDiv = document.createElement('div')
        smallDiv.style.backgroundColor = smallColor;
        preview.appendChild(smallDiv)
    })
    const paletteButton = document.createElement('button')
    paletteButton.classList.add('pick-palette-button')
    paletteButton.classList.add(paletteObj.nr)
    paletteButton.innerText = 'Select'

    paletteButton.addEventListener('click', e => {
        closeLibrary()
        const paletteIndex = e.target.classList[1]
        initialColors = []
        paletteObjects[paletteIndex].colors.forEach((color, index) => {
            initialColors.push(color)
            colorDivs[index].style.backgroundColor = color
            const text = colorDivs[index].children[0]
            checkTextContrast(color, text)
            updateTextUI(index)
        })
        resetInputs()
    })

    palette.appendChild(title)
    palette.appendChild(preview)
    palette.appendChild(paletteButton)
    libraryContainer.children[0].appendChild(palette)
        })
    }
}

getLocal()
randomColor()