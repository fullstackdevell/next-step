const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => [...document.querySelectorAll(selector)];
const workArea = $("#work-area");
const infoDialog = $("#info-dialog");
let stage = 0;
let selectedFramework = "PERMA";
let selectedFeature = "";
let firstThought = "";
let proposal = "";
let completed = false;
let toastTimer;

const copy = {
  frameworks: [
    { id: "PERMA", title: "PERMA", detail: "Notice positive moments" },
    { id: "Cognitive", title: "Learning", detail: "Help students focus" },
    { id: "Industrial", title: "Easy to use", detail: "Make check-ins simple" }
  ],
  features: [
    { id: "Short check-ins", title: "Short check-ins", detail: "One clear question, 2–5 minutes" },
    { id: "Reflective questions", title: "Reflective questions", detail: "Notice one good moment from today" }
  ],
  stageCopy: [
    { label: "STEP 1 OF 3 · A 5-MINUTE START", title: "What could help a student feel a little better?", description: "Choose an idea, then write one quick thought." },
    { label: "STEP 2 OF 3 · PICK ONE IDEA", title: "How should the app ask?", description: "Pick one simple way for students to check in." },
    { label: "STEP 3 OF 3 · MAKE IT YOURS", title: "Put your idea into words.", description: "Fill in the blanks. It doesn’t need to be perfect." }
  ]
};

function showToast(message) {
  const toast = $("#toast");
  toast.textContent = message;
  toast.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove("show"), 2400);
}

function showDialog(title, message) {
  $("#dialog-title").textContent = title;
  $("#dialog-copy").textContent = message;
  infoDialog.showModal();
}

function setHelper(message, extra = "") {
  $("#helper-content").innerHTML = `${message}${extra}`;
}

function helperMessage(action) {
  const messages = {
    0: {
      smaller: "Make it tiny: name one good moment from today.",
      simple: "A wellness app can ask a kind, easy question before showing your tasks.",
      example: 'Example: “What’s one small win from today?”',
      quiz: '<strong>Quick check:</strong> PERMA includes positive emotions. Which prompt fits? <div class="quiz-options"><button type="button" data-quiz="right">“Name one good moment.”</button><button type="button" data-quiz="wrong">“List every task due.”</button></div>'
    },
    1: {
      smaller: "Choose just one: a short question or a reflection.",
      simple: "Short check-ins are quick. Reflective questions help students notice how they feel.",
      example: 'Example: a one-minute prompt asks, “What went well today?”',
      quiz: '<strong>Quick check:</strong> Which option takes less time? <div class="quiz-options"><button type="button" data-quiz="right">One short question</button><button type="button" data-quiz="wrong">A long survey</button></div>'
    },
    2: {
      smaller: "Write only the first sentence for now.",
      simple: "Say what the app asks, then say how that could help.",
      example: 'Try: “My feature asks ___. It helps by ___.”',
      quiz: '<strong>Quick check:</strong> What should your idea include? <div class="quiz-options"><button type="button" data-quiz="right">A question and why it helps</button><button type="button" data-quiz="wrong">A complicated feature list</button></div>'
    },
    3: {
      smaller: "You’ve done it. Take a breath and notice your progress.",
      simple: "You chose an idea, picked a design, and wrote it in your own words.",
      example: "Your finished idea is saved here so you can come back to it.",
      quiz: '<strong>Quick check:</strong> Did you build this idea yourself? <div class="quiz-options"><button type="button" data-quiz="right">Yes, one step at a time</button><button type="button" data-quiz="right">I had a little help</button></div>'
    }
  };
  return messages[stage][action];
}

function renderStep() {
  const complete = stage === 3;
  const visibleStage = complete ? 3 : stage;
  const content = $("#active-content");

  if (complete) {
    $("#active-label").textContent = "ALL 3 STEPS DONE";
    $("#active-title").textContent = "Look at what you made.";
    $("#active-description").textContent = "You turned a big assignment into a clear idea, one step at a time.";
    content.innerHTML = `<div class="finished-note"><span>✦</span><div><strong>${escapeHtml(selectedFeature)}</strong><p>${escapeHtml(proposal)}</p></div></div><button class="review-button" id="review-button" type="button">Review my idea</button>`;
    $("#active-citation").hidden = true;
    $("#continue-button").hidden = true;
  } else {
    const current = copy.stageCopy[stage];
    $("#active-label").textContent = current.label;
    $("#active-title").textContent = current.title;
    $("#active-description").textContent = current.description;
    $("#active-citation").hidden = false;
    $("#continue-button").hidden = false;
    $("#continue-button").innerHTML = `<span>${stage === 2 ? "Finish my idea" : "Save this step"}</span><b>→</b>`;

    if (stage === 0) {
      const choices = copy.frameworks.map((item) => `<button class="idea-choice ${selectedFramework === item.id ? "selected" : ""}" type="button" data-framework="${item.id}" aria-pressed="${selectedFramework === item.id}"><span class="radio-mark"></span><span><strong>${item.title}</strong><small>${item.detail}</small></span></button>`).join("");
      content.innerHTML = `<div class="choice-list" role="group" aria-label="Pick one idea from the paper">${choices}</div><label class="response-label" for="first-thought">YOUR QUICK THOUGHT</label><textarea class="response-box" id="first-thought" placeholder="For example, ask about one small win…" aria-label="Write one quick thought">${escapeHtml(firstThought)}</textarea>`;
    } else if (stage === 1) {
      const choices = copy.features.map((item) => `<button class="idea-choice ${selectedFeature === item.id ? "selected" : ""}" type="button" data-feature="${item.id}" aria-pressed="${selectedFeature === item.id}"><span class="radio-mark"></span><span><strong>${item.title}</strong><small>${item.detail}</small></span></button>`).join("");
      content.innerHTML = `<div class="choice-list" role="group" aria-label="Choose a check-in style">${choices}</div>`;
    } else {
      content.innerHTML = `<label class="response-label" for="proposal-draft">YOUR TWO SENTENCES</label><textarea class="draft-box" id="proposal-draft" placeholder="My feature asks [your question]. It helps students [how it helps]." aria-label="Write your two sentence idea">${escapeHtml(proposal)}</textarea><button class="scaffold-button" id="scaffold-button" type="button">Add the sentence starter</button>`;
    }
  }

  updateProgress(visibleStage);
  setHelper(complete ? helperMessage("simple") : "One small win can be enough to get started.");
}

function updateProgress(activeStage = stage) {
  const count = completed ? 3 : Math.min(activeStage, 3);
  const percent = Math.round(count / 3 * 100);
  $("#progress-number").textContent = `${percent}%`;
  $("#progress-bar").style.width = `${percent}%`;
  const messages = ["A few small steps. You can do this.", "One small step done — you’ve got this!", "Clarity unlocked! Ready for your 5-minute action?", "You did it — your idea is taking shape!"];
  $("#progress-message").textContent = messages[Math.min(count, 3)];
  [1, 2, 3].forEach((index) => {
    const item = $(`#track-${["one", "two", "three"][index - 1]}`);
    item.classList.toggle("complete", index <= count);
    item.classList.toggle("current", !completed && index === activeStage + 1 && activeStage < 3);
    item.querySelector("span").textContent = index <= count ? "✓" : String(index);
  });
  const encouragement = $("#encouragement");
  encouragement.hidden = count === 0;
  if (count > 0) {
    const titles = ["", "One small step done — you’ve got this!", "Clarity unlocked!", "You did it — your idea is taking shape!"];
    const subtitles = ["", "Your first thought is saved. Ready for the next?", "You picked a clear direction. One last step!", "You turned a big task into your own idea."];
    $("#encouragement-title").textContent = titles[count];
    $("#encouragement-copy").textContent = subtitles[count];
    $("#encouragement-next").hidden = count === 3;
  }
}

function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[char]);
}

function openSourceNote() {
  const title = stage === 0 ? "A positive prompt can help" : stage === 1 ? "Small check-ins are easier to start" : "You’re using ideas from the paper";
  const message = stage === 0
    ? "Westley et al. describe PERMA on page 5. It includes positive emotions, like noticing a good moment. Their examples include reflective questions for students."
    : stage === 1
      ? "Table 1 on page 5 describes short check-ins that take 2–5 minutes and ask one clear question at a time."
      : "The paper discusses clear, short check-ins and positive reflection. You’re using those ideas to shape your own suggestion.";
  showDialog(title, message);
}

$("#breakdown-button").addEventListener("click", () => {
  workArea.hidden = false;
  $("#breakdown-button").innerHTML = "<span>✓</span><span>Your plan is ready</span><b>→</b>";
  renderStep();
  workArea.scrollIntoView({ behavior: "smooth", block: "start" });
});

$("#help-button").addEventListener("click", () => showDialog("How Next Step works", "We break your assignment into three small actions. Use a hint if you need one, then save each step in your own words."));
$("#source-button").addEventListener("click", openSourceNote);
$("#active-citation").addEventListener("click", openSourceNote);
$("#dialog-close").addEventListener("click", () => infoDialog.close());
$("#dialog-done").addEventListener("click", () => infoDialog.close());
infoDialog.addEventListener("click", (event) => { if (event.target === infoDialog) infoDialog.close(); });

$("#active-content").addEventListener("click", (event) => {
  const framework = event.target.closest("[data-framework]");
  if (framework) {
    selectedFramework = framework.dataset.framework;
    renderStep();
    setHelper(`${escapeHtml(selectedFramework)} is your starting point. Now add one quick thought.`);
    return;
  }
  const feature = event.target.closest("[data-feature]");
  if (feature) {
    selectedFeature = feature.dataset.feature;
    renderStep();
    setHelper(`${escapeHtml(selectedFeature)} — a clear choice. Save it when you’re ready.`);
    return;
  }
  if (event.target.closest("#scaffold-button")) {
    const field = $("#proposal-draft");
    field.value = `My feature asks [your question]. It helps students [how it helps].`;
    field.focus();
    setHelper("Fill in each blank with your own idea. You can keep it simple.");
    return;
  }
  if (event.target.closest("#review-button")) {
    stage = 2;
    renderStep();
    $("#proposal-draft").focus();
  }
});

$("#active-content").addEventListener("input", (event) => {
  if (event.target.id === "first-thought") firstThought = event.target.value;
  if (event.target.id === "proposal-draft") proposal = event.target.value;
});

$("#continue-button").addEventListener("click", () => {
  if (stage === 0) {
    firstThought = $("#first-thought").value.trim();
    if (firstThought.length < 4) {
      $("#first-thought").focus();
      showToast("Add just one small thought to continue.");
      return;
    }
    stage = 1;
    selectedFeature = "";
  } else if (stage === 1) {
    if (!selectedFeature) {
      showToast("Pick the check-in idea that feels right.");
      return;
    }
    stage = 2;
  } else {
    proposal = $("#proposal-draft").value.trim();
    if (proposal.length < 25 || /\[[^\]]+\]/.test(proposal)) {
      $("#proposal-draft").focus();
      showToast("Fill in the blanks with your own idea first.");
      return;
    }
    stage = 3;
    completed = true;
  }
  renderStep();
  if (stage === 1) setHelper("Nice start! Pick one kind of check-in for your app.");
  if (stage === 2) setHelper("Clarity unlocked! Use these two blanks to shape your idea.");
  if (stage === 3) setHelper("You did it. Your idea is saved in your study space.");
  if (stage < 3) showToast(stage === 1 ? "One small step done — you’ve got this!" : "Clarity unlocked! Ready for your 5-minute action?");
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
  if (!answer) return;
  if (answer.dataset.quiz === "right") {
    setHelper("That’s right! A small, kind question can help someone notice what’s going well.");
  } else {
    setHelper("Not quite — try the answer that feels short and encouraging.");
  }
});

$("#helper-content").addEventListener("click", (event) => {
  if (event.target.closest("[data-use-example]")) {
    firstThought = "Ask the student to name one small win from today.";
    renderStep();
    const field = $("#first-thought");
    if (field) field.value = firstThought;
    setHelper("There you go — one idea to build on. You can change it any time.");
  }
});

// Make the example actionable while keeping the student's own wording optional.
$(".helper-actions").addEventListener("click", (event) => {
  const action = event.target.closest('[data-help="example"]');
  if (!action || stage !== 0) return;
  setHelper('Example: “What’s one small win from today?” <button class="use-example" type="button" data-use-example>Use this idea</button>');
});
