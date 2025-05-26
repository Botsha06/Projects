const display = document.getElementById("display");
const buttons = document.querySelectorAll("button");
const themeToggle = document.getElementById("themeToggle");
const soundToggle = document.getElementById("soundToggle");
const historyLog = document.getElementById("historyLog");
const historyList = document.getElementById("historyList");

let shiftMode = false;
let memory = 0;
let currentInput = "";
let soundEnabled = true;

const clickSound = new Audio("sounds/click.mp3");
const errorSound = new Audio("sounds/error.mp3");

function playSound(type = "click") {
  if (!soundEnabled) return;
  (type === "click" ? clickSound : errorSound).play();
}

function updateDisplay(value) {
  display.textContent = value;
}

function appendHistory(expression, result) {
  const entry = document.createElement("li");
  entry.textContent = `${expression} = ${result}`;
  historyList.prepend(entry);
}

buttons.forEach((btn) => {
  btn.addEventListener("click", () => {
    const fn = btn.getAttribute("data-fn");
    if (!fn) return;

    playSound();

    switch (fn) {
      case "C":
        currentInput = "";
        updateDisplay("0");
        break;

      case "⌫":
        currentInput = currentInput.slice(0, -1);
        updateDisplay(currentInput || "0");
        break;

      case "=":
        try {
          const expression = currentInput
            .replace(/π/g, Math.PI)
            .replace(/√(\d+(\.\d+)?)/g, "Math.sqrt($1)")
            .replace(/x²/g, "**2")
            .replace(/(\d+(\.\d+)?)%/g, "($1/100)")
            .replace(/log/g, "Math.log10")
            .replace(/sin/g, "Math.sin")
            .replace(/cos/g, "Math.cos")
            .replace(/tan/g, "Math.tan");

          const result = eval(expression);
          appendHistory(currentInput, result);
          currentInput = result.toString();
          updateDisplay(result);
        } catch {
          errorSound.play();
          updateDisplay("Error");
          currentInput = "";
        }
        break;

      case "history":
        historyLog.classList.toggle("hidden");
        break;

      case "MR":
        currentInput += memory.toString();
        updateDisplay(currentInput);
        break;

      case "M+":
        memory += parseFloat(display.textContent) || 0;
        break;

      case "M-":
        memory -= parseFloat(display.textContent) || 0;
        break;

      case "MC":
        memory = 0;
        break;

        default:
            const funcsWithParen = ["sin", "cos", "tan", "log"];
            if (funcsWithParen.includes(fn)) {
              currentInput += `${fn}(`;
            } else {
              currentInput += fn;
            }
            updateDisplay(currentInput);
            break;          
    }
  });
});

themeToggle.addEventListener("change", () => {
  document.body.classList.toggle("dark");
});

soundToggle.addEventListener("change", () => {
  soundEnabled = soundToggle.checked;
});

// Splash screen timeout
window.addEventListener("load", () => {
    setTimeout(() => {
      document.querySelector(".splash").classList.add("hidden");
      document.querySelector(".calculator").classList.remove("hidden");
    }, 2500); // 2.5 seconds delay
  });
  