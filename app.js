const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => [...document.querySelectorAll(selector)];
const workArea = $("#work-area");
const infoDialog = $("#info-dialog");
let stage = 0;
let selectedProblem = "";
let selectedFeature = "";
let proposal = "";
let completed = false;
let toastTimer;

const choices = {
  problems: [
    { id: "Boost mood", title: "Option A · Boost mood", detail: "Need help noticing good moments" },
    { id: "Ease exam stress", title: "Option B · Ease exam stress", detail: "Feeling worried before a test" }
  ],
  features: [
    { id: "2-minute daily check-in", title: "2-minute daily check-in", detail: "One quick question about how the day feels" },
    { id: "5-minute task starter", title: "5-minute task starter", detail: "Turn one big goal into a tiny first action" }
  ],
  steps: [
    { label: "STEP 1 OF 3", title: "Pick one problem to solve.", description: "Choose what a student might need help with." },
    { label: "STEP 2 OF 3", title: "Pick one simple app feature.", description: "Choose one small thing the app could do." },
    { label: "STEP 3 OF 3", title: "Say how it helps.", description: "Write one sentence. Keep it simple." }
  ]
};

function helperMessage(action) {
  const messages = {
    0: {
      smaller: "Start with one thing: what would make today feel a little easier?",
      simple: 'Picture a quick pop-up: “What’s one small win you had today?”',
      example: 'Example: A quick pop-up asks, “What’s one small win you had today?” before opening your calendar. <button class="use-example" type="button" data-use-example>Use this idea</button>',
      quiz: '<strong>Quick check:</strong> Which idea could lift someone’s mood? <div class="quiz-options"><button type="button" data-quiz="right">Ask about one good moment</button><button type="button" data-quiz="wrong">Show every task at once</button></div>'
    },
    1: {
      smaller: "Choose one small action the app can do each day.",
      simple: 'A check-in could ask, “How are you feeling today?” and take two minutes.',
      example: 'Example: A 2-minute daily check-in asks one question, then offers one small next step.',
      quiz: '<strong>Quick check:</strong> Which sounds easier to start? <div class="quiz-options"><button type="button" data-quiz="right">One short question</button><button type="button" data-quiz="wrong">A long list of questions</button></div>'
    },
    2: {
      smaller: "Write just the helpful part: “It makes it easier to…”",
      simple: 'Say what the app does, then how it helps. Example: “It asks about one good moment to help students feel hopeful.”',
      example: 'Example: “My feature asks about one small win to help students feel more hopeful.”',
      quiz: '<strong>Quick check:</strong> What belongs in your sentence? <div class="quiz-options"><button type="button" data-quiz="right">What it does and how it helps</button><button type="button" data-quiz="wrong">Lots of complicated details</button></div>'
    },
    3: {
      smaller: "You’ve done it. Take a breath and enjoy your progress.",
      simple: "You picked a problem, chose a feature, and said how it helps.",
      example: "Your one-sentence idea is saved here so you can come back to it.",
      quiz: '<strong>Quick check:</strong> Did you build this idea yourself? <div class="quiz-options"><button type="button" data-quiz="right">Yes, one step at a time</button><button type="button" data-quiz="right">I had a little help</button></div>'
    }
  };
  return messages[stage][action];
}

function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[char]);
}

function renderStep() {
  const finished = stage === 3;
  const content = $("#active-content");
  if (finished) {
    $("#active-label").textContent = "ALL 3 STEPS DONE";
    $("#active-title").textContent = "Look at what you made.";
    $("#active-description").textContent = "You turned a big task into one clear idea.";
    content.innerHTML = `<div class="finished-note"><span>✦</span><div><strong>${escapeHtml(selectedProblem)} · ${escapeHtml(selectedFeature)}</strong><p>${escapeHtml(proposal)}</p></div></div><button class="review-button" id="review-button" type="button">Review my sentence</button>`;
    $("#active-citation").hidden = true;
    $("#continue-button").hidden = true;
  } else {
    const current = choices.steps[stage];
    $("#active-label").textContent = current.label;
    $("#active-title").textContent = current.title;
    $("#active-description").textContent = current.description;
    $("#active-citation").hidden = false;
    $("#continue-button").hidden = false;
    $("#continue-button").innerHTML = `<span>${stage === 2 ? "Save my sentence" : "Save this step"}</span><b>→</b>`;
    if (stage === 0) {
      const options = choices.problems.map((item) => `<button class="idea-choice ${selectedProblem === item.id ? "selected" : ""}" type="button" data-problem="${item.id}" aria-pressed="${selectedProblem === item.id}"><span class="radio-mark"></span><span><strong>${item.title}</strong><small>${item.detail}</small></span></button>`).join("");
      content.innerHTML = `<div class="choice-list" role="group" aria-label="Pick one problem">${options}</div>`;
    } else if (stage === 1) {
      const options = choices.features.map((item) => `<button class="idea-choice ${selectedFeature === item.id ? "selected" : ""}" type="button" data-feature="${item.id}" aria-pressed="${selectedFeature === item.id}"><span class="radio-mark"></span><span><strong>${item.title}</strong><small>${item.detail}</small></span></button>`).join("");
      content.innerHTML = `<div class="choice-list" role="group" aria-label="Pick one app feature">${options}</div>`;
    } else {
      content.innerHTML = `<label class="response-label" for="proposal-draft">YOUR ONE SENTENCE</label><textarea class="draft-box" id="proposal-draft" placeholder="My feature helps students…" aria-label="Write one sentence about how the feature helps">${escapeHtml(proposal)}</textarea><button class="scaffold-button" id="scaffold-button" type="button">Give me a sentence starter</button>`;
    }
  }
  updateProgress();
  setHelper(finished ? helperMessage("simple") : "You only need to do one small thing at a time.");
}

function updateProgress() {
  const count = completed ? 3 : Math.min(stage, 3);
  const percent = Math.round(count / 3 * 100);
  $("#progress-number").textContent = `${percent}%`;
  $("#progress-bar").style.width = `${percent}%`;
  const messages = ["A few small steps. You can do this.", "One small step done — you’ve got this!", "Clear and simple. One last step!", "You did it — your idea is taking shape!"];
  $("#progress-message").textContent = messages[count];
  [1, 2, 3].forEach((index) => {
    const item = $(`#track-${["one", "two", "three"][index - 1]}`);
    item.classList.toggle("complete", index <= count);
    item.classList.toggle("current", !completed && index === stage + 1 && stage < 3);
    item.querySelector("span").textContent = index <= count ? "✓" : String(index);
  });
  const encouragement = $("#encouragement");
  encouragement.hidden = count === 0;
  if (count > 0) {
    const titles = ["", "One small step done — you’ve got this!", "Good choice! Your idea is taking shape.", "You did it — your idea is taking shape!"];
    const subtitles = ["", "Your problem is picked. What could help?", "One sentence to go!", "You turned a big task into your own idea."];
    $("#encouragement-title").textContent = titles[count];
    $("#encouragement-copy").textContent = subtitles[count];
    $("#encouragement-next").hidden = count === 3;
  }
}

function openSourceNote() {
  const title = stage === 0 ? "About the study" : "A small idea from the study";
  const message = stage === 0
    ? "This sample assignment uses a study about student check-ins. It describes short questions that can help students notice how they feel."
    : "The study describes check-ins that take 2–5 minutes and ask one clear question at a time.";
  showDialog(title, message);
}

function showDialog(title, message) {
  $("#dialog-title").textContent = title;
  $("#dialog-copy").textContent = message;
  infoDialog.showModal();
}

function showToast(message) {
  const toast = $("#toast");
  toast.textContent = message;
  toast.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove("show"), 2400);
}

function setHelper(message) {
  $("#helper-content").innerHTML = message;
}

$("#upload-button").addEventListener("click", () => {
  $("#file-ready").textContent = "Added for demo";
  $("#file-ready").classList.add("added");
  showToast("Sample study PDF is ready to use.");
});

$("#breakdown-button").addEventListener("click", () => {
  if (!$("#assignment-prompt").value.trim()) {
    $("#assignment-prompt").focus();
    showToast("Paste or type your assignment first.");
    return;
  }
  workArea.hidden = false;
  $("#breakdown-button").innerHTML = "<span>✓</span><span>Your steps are ready</span><b>→</b>";
  renderStep();
  workArea.scrollIntoView({ behavior: "smooth", block: "start" });
});

$("#help-button").addEventListener("click", () => showDialog("How Next Step works", "Paste your task or use the sample. Then solve one small part at a time, with simple examples when you need them."));
$("#source-button").addEventListener("click", openSourceNote);
$("#active-citation").addEventListener("click", openSourceNote);
$("#dialog-close").addEventListener("click", () => infoDialog.close());
$("#dialog-done").addEventListener("click", () => infoDialog.close());
infoDialog.addEventListener("click", (event) => { if (event.target === infoDialog) infoDialog.close(); });

$("#active-content").addEventListener("click", (event) => {
  const problem = event.target.closest("[data-problem]");
  if (problem) {
    selectedProblem = problem.dataset.problem;
    renderStep();
    setHelper(`${escapeHtml(selectedProblem)} — a clear place to start.`);
    return;
  }
  const feature = event.target.closest("[data-feature]");
  if (feature) {
    selectedFeature = feature.dataset.feature;
    renderStep();
    setHelper(`${escapeHtml(selectedFeature)} — simple and doable.`);
    return;
  }
  if (event.target.closest("#scaffold-button")) {
    const field = $("#proposal-draft");
    field.value = `My ${selectedFeature.toLowerCase()} helps students [say how it helps].`;
    field.focus();
    setHelper("Fill in the blank with your own idea.");
    return;
  }
  if (event.target.closest("#review-button")) {
    stage = 2;
    renderStep();
    $("#proposal-draft").focus();
  }
});

$("#active-content").addEventListener("input", (event) => {
  if (event.target.id === "proposal-draft") proposal = event.target.value;
});

$("#continue-button").addEventListener("click", () => {
  if (stage === 0) {
    if (!selectedProblem) {
      showToast("Pick one problem first.");
      return;
    }
    stage = 1;
  } else if (stage === 1) {
    if (!selectedFeature) {
      showToast("Pick one feature first.");
      return;
    }
    stage = 2;
  } else {
    proposal = $("#proposal-draft").value.trim();
    if (proposal.length < 12 || /\[[^\]]+\]/.test(proposal)) {
      $("#proposal-draft").focus();
      showToast("Finish the sentence in your own words first.");
      return;
    }
    stage = 3;
    completed = true;
  }
  renderStep();
  if (stage === 1) setHelper("One problem picked. Now choose one simple feature.");
  if (stage === 2) setHelper("Good choice! Now say how your feature helps.");
  if (stage === 3) setHelper("You did it. Your idea is saved here.");
  if (stage < 3) showToast(stage === 1 ? "One small step done — you’ve got this!" : "Good choice! One last step!");
  $("#active-title").scrollIntoView({ behavior: "smooth", block: "center" });
});

$("#encouragement-next").addEventListener("click", () => $("#active-title").scrollIntoView({ behavior: "smooth", block: "center" }));

$(".helper-actions").addEventListener("click", (event) => {
  const action = event.target.closest("[data-help]");
  if (!action) return;
  $$(".helper-actions button").forEach((button) => button.classList.toggle("active", button === action));
  setHelper(helperMessage(action.dataset.help));
});

$("#helper-content").addEventListener("click", (event) => {
  const answer = event.target.closest("[data-quiz]");
  if (answer) {
    setHelper(answer.dataset.quiz === "right" ? "That’s it! A small idea is easier to try." : "Try again. Look for the shorter, kinder option.");
    return;
  }
  if (event.target.closest("[data-use-example]")) {
    selectedProblem = "Boost mood";
    renderStep();
    setHelper("Good start — now save this step to continue.");
  }
});
