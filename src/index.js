import FontColorPredictor from './FontColorPredictor'
const TEXT = `Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.`

const predictor = new FontColorPredictor()
function getRandomColor() {
  var letters = '0123456789ABCDEF';
  var color = '#';
  for (var i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}

function hexToRgb(hex) {
  var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? [
      parseInt(result[1], 16) / 255.,
      parseInt(result[2], 16) / 255.,
      parseInt(result[3], 16) / 255.
  ] : null;
}

class Panel {
  constructor(fontColor, y) {
    const panel = document.createElement('div')
  
    panel.style.width = '400px'
    panel.style.height = '400px'
    panel.style.color = fontColor
    panel.style.float = 'left'
    panel.style.marginLeft = '20px' 
    panel.style.overflow = 'hidden'
    panel.style.padding = '10px'
    panel.innerHTML = TEXT
    panel.addEventListener('click', () => {
      this.selected = true
    })
    document.body.append(panel)
    this.ele = panel    
  }
  
  append(parentDom) {
    parentDom.append(this.ele)
  }

  changeBackground(bgcolor) {
    this.bgcolor = bgcolor
    this.selected = false
    this.ele.style.background = bgcolor
  }

  getColor() {
    return hexToRgb(this.bgcolor)
  }
}


const blackFontPanel = new Panel('#000')
const whiteFontPanel = new Panel('#fff')

const changePanelBackground = () => {
  const bgColor = getRandomColor()
  blackFontPanel.changeBackground(bgColor)
  whiteFontPanel.changeBackground(bgColor)  

  if (predictor.isTrained) {
    const [b, w]= predictor.predict(hexToRgb(bgColor))

    if(b > w) {
      blackFontPanel.ele.style.border = '4px solid #000'
      whiteFontPanel.ele.style.border = '0px solid #000'
    } else {
      blackFontPanel.ele.style.border = '0px solid #000'
      whiteFontPanel.ele.style.border = '4px solid #000'
    }
  }
}


const dataset = {
  xs: [],
  ys: []
}

changePanelBackground()

blackFontPanel.ele.addEventListener('click', () => {
  blackFontPanel.selected = true
  
  const color = blackFontPanel.getColor()
  dataset.xs.push(color)
  dataset.ys.push([1, 0])

  changePanelBackground()
})

whiteFontPanel.ele.addEventListener('click', () => {
  whiteFontPanel.selected = true
  const color = whiteFontPanel.getColor()
  dataset.xs.push(color)
  dataset.ys.push([0, 1])  
  changePanelBackground()
})

const trainButton = document.createElement('div')
trainButton.innerText = 'Train'
trainButton.style.fontFamily = 'sans-serif'
trainButton.style.padding = '4px'
trainButton.style.fontSize = '30px'
trainButton.style.margin = '10px 10px 0px 10px'
trainButton.style.borderRadius = '10px'
trainButton.style.display = 'initial'
trainButton.style.cursor = 'pointer'
trainButton.addEventListener('click', () => {
  trainButton.innerHTML = 'tranning...'
  predictor.learning(dataset).then(() => {
    predictor.isTrained = true
    trainButton.innerHTML = 'trained'
    trainButton.style.cursor = ''
  })
})

document.body.appendChild(trainButton)