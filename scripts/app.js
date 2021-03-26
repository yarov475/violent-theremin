const appContents = document.querySelector('.app-contents');
const startMessage = document.querySelector('.start-message');
let isAppInit = false;
appContents.style.display = 'none';
window.addEventListener('keydown', init);
window.addEventListener('click', init);

function init() {
  if (isAppInit) {
    return;
  }

  appContents.style.display = 'block';
  document.body.removeChild(startMessage);

  // create web audio api context
  const AudioContext = window.AudioContext || window.webkitAudioContext;
  const audioCtx = new AudioContext();

  // create Oscillator and gain node
  const oscillator = audioCtx.createOscillator();
  const gainNode = audioCtx.createGain();

  // connect oscillator to gain node to speakers
  oscillator.connect(gainNode);
  gainNode.connect(audioCtx.destination);

  // create initial theremin frequency and volume values
  const WIDTH = window.innerWidth;
  const HEIGHT = window.innerHeight;

  const maxFreq = 30;
  const maxVol = 0.02;
  const initialVol = 0.001;
  oscillator.type = 'triangle';
  oscillator.frequency.value = 30;
  // set options for the oscillator
  oscillator.detune.value = 40; // value in cents
  oscillator.start(0);

  oscillator.onended = function() {
    console.log('Your tone has now stopped playing!');
  };

  gainNode.gain.value = initialVol;
  gainNode.gain.minValue = initialVol;
  gainNode.gain.maxValue = initialVol;

  // Mouse pointer coordinates
  let CurX;
  let CurY;
  // Get new mouse pointer coordinates when mouse is moved
  // then set new gain and pitch values
  document.onmousemove = updatePage;
  function updatePage(e) {
      KeyFlag = false;
      CurX = e.pageX;
      CurY = e.pageY;

      oscillator.frequency.value = (CurX/WIDTH) * maxFreq;
      var freq = (CurX/WIDTH) * maxFreq;
      gainNode.gain.value = (CurY/HEIGHT) * maxVol;
      var volume = (CurY/HEIGHT) * maxVol

      canvasDraw();
      console.log("x: "+CurX+"y: "+CurY  +"freq: "+freq + "volume: "+ volume);
      let pos = document.getElementById('pos');
      let vol = document.getElementById('vol');
      let freqShow = document.getElementById('freq');
     pos.innerHTML = " вертикаль: " + CurX+ "горизонталь: " + CurY;
    vol.innerHTML = "громкость = вертикаль: " + CurY;
    freqShow.innerHTML = "частота = горизонталь: "+ CurX;


  }




  // canvas visualization
  function random(number1,number2) {
    return number1 + (Math.floor(Math.random() * (number2 - number1)) + 1);
  }

  const canvas = document.querySelector('.canvas');
  const canvasCtx = canvas.getContext('2d');

  canvas.width = WIDTH;
  canvas.height = HEIGHT;

  function canvasDraw() {

      rX = CurX;
      rY = CurY;


    rC = Math.floor((gainNode.gain.value/maxVol)*30);

    canvasCtx.globalAlpha = 0.2;

    for (let i = 1; i <= 15; i = i+2) {
      canvasCtx.beginPath();
      let colorShow =      canvasCtx.fillStyle = 'rgb(' + 1+(i) + ',' + Math.floor((gainNode.gain.value/maxVol)*100) + ',' + Math.floor((oscillator.frequency.value/maxFreq)*100) + ')';
     canvasCtx.fillStyle = 'rgb(' + 1+(i) + ',' + Math.floor((gainNode.gain.value/maxVol)*200) + ',' + Math.floor((oscillator.frequency.value/maxFreq)*200) + ')';
      canvasCtx.arc(rX+random(0,50),rY+random(0,50),rC/2+i,(Math.PI/180)*0,(Math.PI/180)*360,false);
      canvasCtx.fill();
      canvasCtx.closePath();

      let color = document.getElementById('color');
      color.innerHTML = "цвет = частота / громкость: " + colorShow;

    }
  }



  isAppInit = true;
}
