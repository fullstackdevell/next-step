const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => [...document.querySelectorAll(selector)];

const taskField = $("#task-input");
const plan = $("#plan");
let activeStep = 0;
let responses = ["", "", ""];
let attachedFile = "";
let toastTimer;

const stepContent = [
  {
    label: "STEP 1 · PICK ONE CORE IDEA",
    title: "What’s one clear idea from the material?",
    prompt: "Write a few words about the idea you want to build on.",
    placeholder: "One idea I noticed…",
    simple: "Pick one point from the reading that could make an app easier to use.",
    example: "Example: Show one clear question at a time."
  },
  {
    label: "STEP 2 · SKETCH ONE FEATURE",
    title: "What simple feature could use that idea?",
    prompt: "It can be a small tool, a question, or a screen.",
    placeholder: "My feature could…",
    simple: "Think of one feature that uses the idea to make studying easier.",
    example: "Example: A study app asks what course you’re working on, then shows one next action."
  },
  {
    label: "STEP 3 · SUM IT UP",
    title: "Explain your idea in two sentences.",
    prompt: "Say what the feature does and how it could help.",
    placeholder: "My feature… It could help by…",
    simple: "Sentence one: what it does. Sentence two: why that helps.",
    example: "Example: The app shows one next action. This helps people focus instead of sorting a long task list."
  }
];

function showToast(message) {
  const toast = $("#toast");
  toast.textContent = message;
  toast.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove("show"), 2300);
}

function attachFile(name) {
  attachedFile = name;
  $("#file-name").textContent = name;
  $("#attached-file").hidden = false;
}

function updateProgress() {
  const percent = Math.round(activeStep / 3 * 100);
  $("#progress-number").textContent = `${percent}%`;
  $("#progress-bar").style.width = `${percent}%`;
  [0, 1, 2].forEach((index) => {
    const row = $(`#step-row-${index}`);
    row.classList.toggle("done", index < activeStep);
    row.classList.toggle("active", index === activeStep && activeStep < 3);
    $(`#step-state-${index}`).textContent = index < activeStep ? "Done" : index === activeStep && activeStep < 3 ? "Now" : "";
    row.querySelector(".step-number").textContent = index < activeStep ? "✓" : String(index + 1);
  });
}

function renderStep() {
  updateProgress();
  const finished = activeStep >= 3;
  const responseField = $("#response-input");
  const helperButtons = $$("[data-helper]");
  const doneButton = $("#done-button");

  if (finished) {
    $("#active-kicker").textContent = "ALL DONE";
    $("#active-title").textContent = "You made a start. Nice work.";
    $("#active-prompt").textContent = "Your three steps are complete. Come back to your notes whenever you’re ready.";
    responseField.hidden = true;
    $(".response-note").hidden = true;
    doneButton.hidden = true;
    helperButtons.forEach((button) => { button.disabled = true; });
    $("#hint").hidden = true;
    $("#encouragement-title").textContent = "You did it — your first draft is taking shape!";
    $("#encouragement-copy").textContent = "Three small steps, all yours.";
    $("#encouragement").hidden = false;
    return;
  }

  const item = stepContent[activeStep];
  $("#active-kicker").textContent = item.label;
  $("#active-title").textContent = item.title;
  $("#active-prompt").textContent = item.prompt;
  responseField.hidden = false;
  responseField.placeholder = item.placeholder;
  responseField.value = responses[activeStep];
  $(".response-note").hidden = false;
  doneButton.hidden = false;
  helperButtons.forEach((button) => { button.disabled = false; button.classList.remove("selected"); });
  $("#hint").hidden = true;
  $("#encouragement").hidden = activeStep === 0;
  if (activeStep > 0) {
    $("#encouragement-title").textContent = activeStep === 1 ? "One small step done — you’ve got this!" : "Clear progress! One last step.";
    $("#encouragement-copy").textContent = activeStep === 1 ? "Now sketch one feature idea." : "Your idea is nearly ready to share.";
  }
}

function sentenceCount(text) {
  return (text.trim().match(/[.!?](?:\s|$)/g) || []).length;
}

$("#demo-task-button").addEventListener("click", () => {
  taskField.value = "Read paper and propose 1 feature idea for a study app.";
  taskField.focus();
  showToast("Sample task loaded. You can edit it before you begin.");
});

$("#demo-pdf-button").addEventListener("click", () => {
  attachFile("Westley_et_al_2026.pdf");
  showToast("Sample PDF attached for the demo.");
});

$("#upload-button").addEventListener("click", () => $("#file-input").click());
$("#file-input").addEventListener("change", (event) => {
  const file = event.target.files?.[0];
  if (file) {
    attachFile(file.name);
    showToast("Assignment attached.");
  }
});

$("#remove-file").addEventListener("click", () => {
  attachedFile = "";
  $("#attached-file").hidden = true;
  $("#file-input").value = "";
  showToast("Attachment removed.");
});

$("#breakdown-button").addEventListener("click", () => {
  if (!taskField.value.trim() && !attachedFile) {
    taskField.focus();
    showToast("Type your task or attach a file to get started.");
    return;
  }
  plan.hidden = false;
  $("#breakdown-button").innerHTML = 'Steps ready <span>✓</span>';
  activeStep = 0;
  responses = ["", "", ""];
  renderStep();
  plan.scrollIntoView({ behavior: "smooth", block: "start" });
});

$$("[data-helper]").forEach((button) => button.addEventListener("click", () => {
  const item = stepContent[activeStep];
  const hint = $("#hint");
  hint.textContent = button.dataset.helper === "simple" ? item.simple : item.example;
  hint.hidden = false;
  $$("[data-helper]").forEach((helper) => helper.classList.toggle("selected", helper === button));
}));

$("#response-input").addEventListener("input", (event) => {
  responses[activeStep] = event.target.value;
});

$("#done-button").addEventListener("click", () => {
  const response = $("#response-input").value.trim();
  if (!response) {
    $("#response-input").focus();
    showToast("Add a few words before marking this step done.");
    return;
  }
  if (activeStep === 2 && sentenceCount(response) < 2) {
    $("#response-input").focus();
    showToast("Add one more short sentence to finish your summary.");
    return;
  }
  responses[activeStep] = response;
  activeStep += 1;
  renderStep();
  showToast(activeStep < 3 ? "One small step done — you’ve got this!" : "You did it — all three steps are done!");
  if (activeStep < 3) $("#active-title").scrollIntoView({ behavior: "smooth", block: "center" });
});
