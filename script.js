const JOURNEY_DURATION_MS = 5 * 60 * 1000;

const landing = document.getElementById("landing");
const journey = document.getElementById("journey");
const finalScene = document.getElementById("final");
const enterBtn = document.getElementById("enterBtn");
const audioToggle = document.getElementById("audioToggle");
const petalsLayer = document.querySelector(".petals");
const heartsLayer = document.querySelector(".hearts");

let audioContext;
let masterGain;
let isAudioOn = false;

function swapScene(from, to) {
  from.classList.remove("active");
  setTimeout(() => {
    to.classList.add("active");
  }, 450);
}

function createAmbientAudio() {
  if (audioContext) return;

  audioContext = new AudioContext();
  masterGain = audioContext.createGain();
  masterGain.gain.value = 0;
  masterGain.connect(audioContext.destination);

  const chordFrequencies = [174.61, 220, 261.63, 329.63];

  chordFrequencies.forEach((freq, idx) => {
    const oscillator = audioContext.createOscillator();
    const gain = audioContext.createGain();
    const lfo = audioContext.createOscillator();
    const lfoGain = audioContext.createGain();

    oscillator.type = "sine";
    oscillator.frequency.value = freq;

    lfo.type = "sine";
    lfo.frequency.value = 0.07 + idx * 0.02;
    lfoGain.gain.value = 5 + idx * 1.8;

    lfo.connect(lfoGain);
    lfoGain.connect(oscillator.frequency);

    gain.gain.value = 0.028;
    oscillator.connect(gain);
    gain.connect(masterGain);

    oscillator.start();
    lfo.start();
  });
}

function toggleAudio() {
  createAmbientAudio();

  if (audioContext.state === "suspended") {
    audioContext.resume();
  }

  isAudioOn = !isAudioOn;
  const target = isAudioOn ? 0.45 : 0;

  masterGain.gain.cancelScheduledValues(audioContext.currentTime);
  masterGain.gain.linearRampToValueAtTime(target, audioContext.currentTime + 0.8);

  audioToggle.textContent = isAudioOn ? "🔊 Music on" : "🔇 Unmute music";
  audioToggle.setAttribute("aria-pressed", String(isAudioOn));
}

function spawnFallingElements(layer, className, count) {
  for (let i = 0; i < count; i += 1) {
    const item = document.createElement("span");
    item.className = className;
    item.style.left = `${Math.random() * 100}%`;
    item.style.animationDuration = `${6 + Math.random() * 8}s`;
    item.style.animationDelay = `${Math.random() * 6}s`;
    item.style.opacity = `${0.45 + Math.random() * 0.4}`;
    layer.append(item);
  }
}

function beginJourney() {
  swapScene(landing, journey);

  setTimeout(() => {
    swapScene(journey, finalScene);
    spawnFallingElements(petalsLayer, "petal", 26);
    spawnFallingElements(heartsLayer, "heart", 18);
  }, JOURNEY_DURATION_MS);
}

enterBtn.addEventListener("click", beginJourney);
audioToggle.addEventListener("click", toggleAudio);
