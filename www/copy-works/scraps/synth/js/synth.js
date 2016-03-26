var ctx;

var keyMap = {
	65 : 261.63,
	83 : 293.66,
	68 : 329.63,
	70 : 349.23,
	71 : 392,
	72 : 440,
	74 : 493.88,
	75 : 523.25
}

var keysPressed = 0;

if (typeof AudioContext !== "undefined") {
    ctx = new AudioContext();
} else if (typeof webkitAudioContext !== "undefined") {
    ctx = new webkitAudioContext();
}

var oscillator = ctx.createOscillator();
oscillator.type = 'sawtooth';
oscillator.frequency.value = 300;
oscillator.start();

var lfo = ctx.createOscillator();
lfo.type = 'sine';
lfo.frequency.value = 100;
lfo.start();

var lfo2 = ctx.createOscillator();
lfo2.type = 'sine';
lfo2.frequency.value = 1;
lfo2.start();

var lfoGain = ctx.createGain();
lfoGain.gain.value = 1000;

var modulator = ctx.createGain();
lfo.connect(modulator.gain);

var filter = ctx.createBiquadFilter();
filter.type = 'lowpass';
filter.frequency.value = 1000;

var gate = ctx.createGain();
gate.gain.value = 0;

var masterVolume = ctx.createGain();
masterVolume.gain.value = 1;

var analyser = ctx.createAnalyser();

oscillator.connect(modulator);
modulator.connect(filter);
filter.connect(gate);
gate.connect(masterVolume);
masterVolume.connect(analyser);
analyser.connect(ctx.destination);

lfo2.connect(lfoGain);
lfoGain.connect(filter.frequency);

window.addEventListener('keydown', function(e) {
	if (keyMap[e.keyCode]) {
		oscillator.frequency.value = keyMap[e.keyCode];

		keysPressed++;

		if (keysPressed > 0) {
			gate.gain.value = 0.3;
		}
	}

	if (e.keyCode == 32) {
		gate.gain.value = 0;
		keysPressed = 0;
	}
});

window.addEventListener('keyup', function(e) {
	if (keyMap[e.keyCode]) {
		keysPressed--;
		if (keysPressed == 0) {
			gate.gain.value = 0;
		}
	}
});

window.addEventListener('mousedown', function(e) {
	window.mouseDown = true;
}); 

window.addEventListener('mouseup', function(e) {
	window.mouseDown = false;
})

window.addEventListener('mousemove', function(e) {
	if (window.mouseDown) {
		var x = e.clientX / window.innerWidth,
				y = e.clientY / window.innerHeight;

		lfo.frequency.value = 200 * x;
		lfo2.frequency.value = 20 * y;
 
		document.querySelector('#x').style.top = e.clientY + 'px';
		document.querySelector('#y').style.left = e.clientX + 'px';
		document.querySelector('#target').style.top = e.clientY + 'px';
		document.querySelector('#target').style.left = e.clientX + 'px';
	}
});

var vis = document.querySelector('#vis');
vis.style.width = '100%';
vis.style.height = '100vh';
vis.style.position = 'absolute';
vis.width = window.innerWidth;
vis.height = window.innerHeight;
vis.style.zIndex = -5;

visCtx = vis.getContext('2d');

function draw() {
	window.requestAnimationFrame(draw);
	var bufferLength = analyser.frequencyBinCount;
	var dataArray = new Float32Array(bufferLength);
	analyser.getFloatFrequencyData(dataArray);

	visCtx.fillStyle = 'rgb(255, 255, 255)';
  visCtx.fillRect(0, 0, window.innerWidth, window.innerHeight);

	visCtx.strokeStyle = '#000';
	visCtx.lineWidth = 2;

	visCtx.beginPath();

	slice = window.innerWidth / bufferLength;
	for (var i = 0; i < bufferLength; ++i) {
		visCtx.lineTo(i * slice, -dataArray[i] + (window.innerHeight/2));
	}

	visCtx.stroke();

}
draw();