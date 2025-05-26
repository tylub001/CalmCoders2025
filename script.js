const hearts = document.querySelectorAll(".heart");

hearts.forEach((heart) => {
  heart.addEventListener("click", function () {
    heart.classList.toggle("unliked");
    heart.classList.toggle("filled");
    if (heart.classList.contains("filled")) {
      heart.textContent = "❤️";
    } else {
      heart.textContent = "♡";
    }
  });
});

const quotes = [
  '"You are the sky. Everything else is just the weather." — Pema Chodron',

  '"Deep breathing brings deep thinking, and shallow breathing brings shallow thinking." – Elsie Lincoln Benedict',

  '"The best way to predict the future is to create it." — Peter Drucker',

  '"Meditation is the secret of all growth in spiritual life and knowledge." – James Allen',

  '"With the new day comes new strength and new thoughts." — Eleanor Roosevelt',

  '"Life is not the amount of breaths you take. It’s the moments that take your breath away." - Hitch (2005)',

  '"One small positive thought can change your whole day." — Zig Ziglar',
  '"May the force be with you"',
  '"Never go to a doctor whose office plants have died." — Erma Bombeck',
  '"Houston, we have a problem." — Apollo 13 (1995)',
  '"A day without laughter is a day wasted." — Charlie Chaplin',
  '"To infinity, and beyond!" — Buzz Lightyear',
  '"Just keep swimming." — Dory, Finding Nemo (2003)',
  '"Doubt kills more dreams than failure ever will." — Suzy Kassem',
];

document.querySelector(".quote__button").addEventListener("click", function () {
  const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
  document.querySelector(".modal__quote").textContent = randomQuote;
  document.querySelector(".modal").classList.add("show");
});

document
  .querySelector(".modal__close-btn")
  .addEventListener("click", function () {
    document.querySelector(".modal").classList.remove("show");
  });

const circle = document.getElementById("breathingCircle");
const modes = document.querySelectorAll(".guided__mode");

const breathingPatterns = {
  focus: {
    inhale: 4000,
    hold: 4000,
    exhale: 4000,
    messages: ["In Hale", "Hold", "Exhale"],
  },
  balanced: {
    inhale: 4000,
    hold: 7000,
    exhale: 8000,
    messages: ["In Hale", "Hold", "Exhale"],
  },
  relax: {
    inhale: 6000,
    hold: 2000,
    exhale: 7000,
    messages: ["In Hale", "Hold", "Exhale"],
  },
};

let currentMode = "focus";
let currentPhase = 0;
let exerciseTimer;
let animationInterval;
let selectedDuration = 60000;
let activeTimeout = null;
let isRunning = false;
let countdownTimeouts = [];
let modeTextTimeout;
let autoStopTimeout;

// document.addEventListener("DOMContentLoaded", function () {
//   const circle = document.querySelector(".breathing-circle");
//   circle.textContent = "Choose a Mode";
// });

function updateBreathing() {
  const circle = document.querySelector(".breathing-circle");
  const pattern = breathingPatterns[currentMode];
  circle.textContent = pattern.messages[currentPhase];

  if (currentPhase === 0) {
    circle.style.transform = "scale(1.5)";
    circle.style.transition = `transform ${pattern.inhale}ms ease-in`;
  } else if (currentPhase === 1) {
    circle.style.transform = "scale(1.5)";
    circle.style.transition = "none";
  } else {
    circle.style.transform = "scale(1)";
    circle.style.transition = `transform ${pattern.exhale}ms ease-out`;
  }
}

function startBreathingCycle() {
  clearTimeout(modeTextTimeout);
  clearTimeout(autoStopTimeout);

  autoStopTimeout = setTimeout(() => {
    stopBreathingCycle();
    const circle = document.querySelector(".breathing-circle");
    circle.textContent = "Session timed out";
  }, 360000);

  const circle = document.querySelector(".breathing-circle");
  circle.setAttribute("data-countdown", "true");
  circle.textContent = "3";
  countdownTimeouts.push(
    setTimeout(() => {
      circle.textContent = "2";
      countdownTimeouts.push(
        setTimeout(() => {
          circle.textContent = "1";
          countdownTimeouts.push(
            setTimeout(() => {
              circle.removeAttribute("data-countdown");
              isRunning = true;
              currentPhase = 0;
              exerciseTimer = setTimeout(() => {
                stopBreathingCycle();
                circle.textContent = "Session Complete";
              }, selectedDuration * 1000);
              runPhase();
            }, 1000)
          );
        }, 1000)
      );
    }, 1000)
  );
}

function runPhase() {
  if (!isRunning) return;

  const pattern = breathingPatterns[currentMode];

  if (currentPhase >= 3) {
    currentPhase = 0;
  }

  updateBreathing();

  const durations = [pattern.inhale, pattern.hold, pattern.exhale];
  const duration = durations[currentPhase];

  activeTimeout = setTimeout(() => {
    currentPhase++;
    runPhase();
  }, duration);
}

modes.forEach((mode) => {
  mode.addEventListener("click", function () {
    currentMode = this.getAttribute("data-mode");
    modes.forEach((m) => m.classList.remove("active"));
    this.classList.add("active");
    startBreathingCycle();
  });
});

const durationButtons = document.querySelectorAll(".duration-btn");
durationButtons.forEach((button) => {
  button.addEventListener("click", function () {
    selectedDuration = parseInt(this.getAttribute("data-duration"));
    durationButtons.forEach((btn) => btn.classList.remove("active"));
    this.classList.add("active");
  });
});

const stopButton = document.querySelector('[onclick="stopBreathingCycle()"]');
stopButton.addEventListener("click", () => {
  stopBreathingCycle();
});

function stopBreathingCycle() {
  clearTimeout(modeTextTimeout);
  clearTimeout(autoStopTimeout);

  const circle = document.querySelector(".breathing-circle");

  if (exerciseTimer) {
    clearTimeout(exerciseTimer);
  }
  if (activeTimeout) {
    clearTimeout(activeTimeout);
  }

  countdownTimeouts.forEach((timeout) => clearTimeout(timeout));
  countdownTimeouts = [];

  circle.removeAttribute("data-countdown");

  isRunning = false;
  currentPhase = 0;

  circle.classList.remove("blinking");
  circle.classList.remove("inhale");
  circle.classList.remove("exhale");
  circle.classList.remove("hold");

  circle.style.transform = "scale(1)";
  circle.style.transition = "transform 500ms ease-out";

  circle.textContent = "BreatheWell";

  modeTextTimeout = setTimeout(() => {
    circle.textContent = "Choose a Mode";
  }, 5000);
}
