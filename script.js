const commonPasswords = [
  "123456", "123456789", "password", "qwerty", "abc123",
  "111111", "123123", "password123", "admin", "welcome", "letmein"
];

const specialCharacters = "!@#$%^&*()_+-=[]{};:,.?/";

const passwordInput = document.getElementById("password");
const toggleBtn = document.getElementById("toggleBtn");
const resultElement = document.getElementById("result");
const strengthBar = document.getElementById("strengthBar");
const checksList = document.getElementById("checksList");
const feedbackList = document.getElementById("feedbackList");
const suggestionsList = document.getElementById("suggestionsList");
const generatedPasswords = document.getElementById("generatedPasswords");

toggleBtn.addEventListener("click", () => {
  const isPassword = passwordInput.type === "password";
  passwordInput.type = isPassword ? "text" : "password";
  toggleBtn.textContent = isPassword ? "Hide" : "Show";
});

function setList(element, items) {
  element.innerHTML = "";
  items.forEach(item => {
    const li = document.createElement("li");
    li.textContent = item;
    element.appendChild(li);
  });
}

function generateStrongPasswords(password, count = 3) {
  let base = password.replace(/[^a-zA-Z0-9]/g, "");
  if (base.length < 5) base = "SecurePass";

  const suggestions = [];
  for (let i = 0; i < count; i++) {
    const randomUpper = String.fromCharCode(65 + Math.floor(Math.random() * 26));
    const randomLower = String.fromCharCode(97 + Math.floor(Math.random() * 26));
    const randomNumber = Math.floor(Math.random() * 90 + 10);
    const randomSpecial = specialCharacters[Math.floor(Math.random() * specialCharacters.length)];
    suggestions.push(base.slice(0, 5) + randomUpper + randomNumber + randomSpecial + randomLower);
  }
  return suggestions;
}

function checkPassword() {
  const password = passwordInput.value.trim();

  if (!password) {
    resultElement.textContent = "Strength: Please enter a password first";
    resultElement.style.color = "#facc15";
    strengthBar.style.width = "0%";
    strengthBar.style.background = "#facc15";
    setList(checksList, ["No checks yet."]);
    setList(feedbackList, ["Password cannot be empty."]);
    setList(suggestionsList, ["Enter a password to start the analysis."]);
    setList(generatedPasswords, []);
    return;
  }

  let score = 0;
  const feedback = [];
  const suggestions = [];
  const checks = [];

  const lengthOk = password.length >= 8;
  const hasLower = /[a-z]/.test(password);
  const hasUpper = /[A-Z]/.test(password);
  const hasDigit = /\d/.test(password);
  const hasSpecial = /[!@#$%^&*()_+\-=\[\]{};:,.?/]/.test(password);
  const isCommon = commonPasswords.includes(password.toLowerCase());

  if (lengthOk) { score++; checks.push("Length is 8 characters or more: PASS"); }
  else { checks.push("Length is 8 characters or more: FAIL"); feedback.push("Password is too short."); suggestions.push("Use at least 8 characters."); }

  if (hasLower) { score++; checks.push("Contains lowercase letters: PASS"); }
  else { checks.push("Contains lowercase letters: FAIL"); feedback.push("No lowercase letters found."); suggestions.push("Add lowercase letters (a-z)."); }

  if (hasUpper) { score++; checks.push("Contains uppercase letters: PASS"); }
  else { checks.push("Contains uppercase letters: FAIL"); feedback.push("No uppercase letters found."); suggestions.push("Add uppercase letters (A-Z)."); }

  if (hasDigit) { score++; checks.push("Contains numbers: PASS"); }
  else { checks.push("Contains numbers: FAIL"); feedback.push("No numbers found."); suggestions.push("Add numbers (0-9)."); }

  if (hasSpecial) { score++; checks.push("Contains special characters: PASS"); }
  else { checks.push("Contains special characters: FAIL"); feedback.push("No special characters found."); suggestions.push("Add special characters like ! @ # $."); }

  if (isCommon) {
    checks.push("Not a common password: FAIL");
    feedback.push("This password is too common and easy to guess.");
    suggestions.push("Avoid common passwords such as 123456 or password.");
    score = Math.max(score - 2, 0);
  } else {
    checks.push("Not a common password: PASS");
  }

  let strength = "";
  let color = "";
  let width = "";

  if (score <= 2) {
    strength = "Weak ❌";
    color = "#ef4444";
    width = "33%";
  } else if (score <= 4) {
    strength = "Medium ⚠️";
    color = "#f59e0b";
    width = "66%";
  } else {
    strength = "Strong ✅";
    color = "#22c55e";
    width = "100%";
  }

  if (feedback.length === 0) feedback.push("Good password structure.");
  if (suggestions.length === 0) suggestions.push("No changes needed.");

  resultElement.textContent = "Strength: " + strength;
  resultElement.style.color = color;
  strengthBar.style.width = width;
  strengthBar.style.background = color;

  setList(checksList, checks);
  setList(feedbackList, feedback);
  setList(suggestionsList, suggestions);

  if (strength !== "Strong ✅") {
    setList(generatedPasswords, generateStrongPasswords(password));
  } else {
    setList(generatedPasswords, ["Your current password is already strong."]);
  }
}

passwordInput.addEventListener("input", checkPassword);
