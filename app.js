const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => [...document.querySelectorAll(selector)];

const taskField = $("#task-input");
const plan = $("#plan");
let selectedScenario = "";
let activeStep = 0;
let responses = ["", "", ""];
let attachedFile = "";
let toastTimer;

const scenarios = {
  hci: {
    task: "Write a feature proposal based on Westley et al. (2026).",
    steps: [
      { name: "Pick 1 core idea from the material", label: "STEP 1 · PICK AN IDEA", title: "What’s one useful idea from the paper?", prompt: "Pick one point that could make an app easier to use.", placeholder: "One idea from the paper…", mock: "Short prompts can make an app easier to use.", simple: "Pick one point from the reading that feels useful.", example: "Example: Show one clear question at a time." },
      { name: "Sketch or write 1 simple feature idea", label: "STEP 2 · SKETCH A FEATURE", title: "What feature could use that idea?", prompt: "Think of one small feature and what it would do.", placeholder: "My feature could…", mock: "A study app could show one task at a time.", simple: "Think of one small thing the app could do.", example: "Example: Show one study task at a time, then reveal the next." },
      { name: "Write a 2-sentence summary", label: "STEP 3 · SUM IT UP", title: "Explain your idea in two sentences.", prompt: "Say what the feature does and why it could help.", placeholder: "My feature… It could help by…", mock: "Based on Westley et al. (2026), my feature shows one study task at a time. This helps learners focus without sorting through a long list.", simple: "Sentence one: what it does. Sentence two: why it helps.", example: "Example: My feature shows one task at a time. This helps learners focus on what to do next.", minSentences: 2 }
    ]
  },
  cs: {
    task: "Solve a coding problem, like Two Sum or array traversal.",
    steps: [
      { name: "Identify the input and goal", label: "STEP 1 · UNDERSTAND THE PROBLEM", title: "What goes in, and what should come out?", prompt: "Write the goal in plain language.", placeholder: "The problem asks me to…", mock: "Find two numbers that add up to the target.", simple: "Name the information you get and what answer you need.", example: "Example: Input is a list of numbers and a target. Output is the pair that adds up to it." },
      { name: "Plan the solution steps", label: "STEP 2 · PLAN YOUR APPROACH", title: "What steps could solve it?", prompt: "Write a short plan or a few lines of code.", placeholder: "First, I would…", mock: "Store each number in a map. For each value, check if target - value is already there.\n\nif (seen.has(target - n)) return [seen.get(target - n), i];", simple: "Explain the loop or steps before worrying about perfect code.", example: "Example: Check each number, remember it, and look for the number that completes the target." },
      { name: "Summarize the solution", label: "STEP 3 · SUM IT UP", title: "Explain your solution in two sentences.", prompt: "Say how it works and why it solves the problem.", placeholder: "My solution… It works because…", mock: "I scan the list once and save each number with its index. A map helps me find the matching pair quickly.", simple: "Sentence one: what your code does. Sentence two: why it works.", example: "Example: I check each number against the target. Saving numbers as I go helps me find the matching pair quickly.", minSentences: 2 }
    ]
  },
  english: {
    task: "Analyze a character’s motivation in a short essay.",
    steps: [
      { name: "Pick 1 clue from the text", label: "STEP 1 · FIND A CLUE", title: "What moment gives you a clue?", prompt: "Pick one action or line from the story.", placeholder: "One moment that stands out…", mock: "The character lies to protect their sister.", simple: "Choose one thing the character says or does.", example: "Example: The character gives up something they want to help a friend." },
      { name: "Explain what the clue shows", label: "STEP 2 · CONNECT THE CLUE", title: "What does that moment tell you?", prompt: "Write what the character may want or care about.", placeholder: "This suggests the character…", mock: "It suggests that loyalty matters more to them than being accepted.", simple: "Ask yourself: what does this choice show they care about?", example: "Example: Giving up a prize to help a friend may show that loyalty matters most." },
      { name: "Write a short thesis", label: "STEP 3 · STATE YOUR IDEA", title: "Write your main point in one sentence.", prompt: "Say what motivates the character and give your reason.", placeholder: "The character is motivated by…", mock: "The character’s lie is an act of loyalty: by protecting her sister, she shows that family matters more to her than social approval.", simple: "Name what the character wants, then connect it to your clue.", example: "Example: The character acts out of loyalty, as shown when they risk their reputation to help a friend.", minSentences: 1 }
    ]
  }
};

function showToast(message) {
  const toast = $("#toast");
  toast.textContent = message;
  toast.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove("show"), 2300);
}

function currentScenario() {
  return scenarios[selectedScenario] || null;
}

function resetPlan() {
  activeStep = 0;
  responses = ["", "", ""];
  plan.hidden = true;
  $("#breakdown-button").innerHTML = 'Break it down <span>→</span>';
  $("#completion-card").hidden = true;
  $("#active-step").hidden = false;
  $("#encouragement").hidden = true;
  $("#hint").hidden = true;
  $("#response-input").value = "";
  $("#progress-number").textContent = "0%";
  $("#progress-bar").style.width = "0%";
}

function setScenario(value, fillTask = true) {
  selectedScenario = value;
  resetPlan();
  if (fillTask) taskField.value = currentScenario()?.task || "";
  if (value) updateStepNames();
}

function updateStepNames() {
  const scenario = currentScenario();
  if (!scenario) return;
  scenario.steps.forEach((step, index) => {
    $(`#step-name-${index}`).textContent = step.name;
  });
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
  const scenario = currentScenario();
  if (!scenario) return;
  updateProgress();
  const finished = activeStep >= 3;
  const responseField = $("#response-input");

  if (finished) {
    $("#active-step").hidden = true;
    $("#completion-card").hidden = false;
    $("#encouragement").hidden = true;
    return;
  }

  const step = scenario.steps[activeStep];
  $("#active-step").hidden = false;
  $("#completion-card").hidden = true;
  $("#active-kicker").textContent = step.label;
  $("#active-title").textContent = step.title;
  $("#active-prompt").textContent = step.prompt;
  responseField.placeholder = step.placeholder;
  responseField.value = responses[activeStep];
  $("#hint").hidden = true;
  $("#encouragement").hidden = activeStep === 0;
  if (activeStep > 0) {
    $("#encouragement-title").textContent = activeStep === 1 ? "One small step done — you’ve got this!" : "Clear progress! One last step.";
    $("#encouragement-copy").textContent = activeStep === 1 ? "Now sketch your solution." : "Your idea is nearly ready to share.";
  }
}

function sentenceCount(text) {
  return (text.trim().match(/[.!?](?:\s|$)/g) || []).length;
}

function fillTaskMock() {
  if (!selectedScenario) {
    $("#course-select").value = "hci";
    setScenario("hci");
  } else {
    taskField.value = currentScenario().task;
  }
  taskField.focus();
}

$("#course-select").addEventListener("change", (event) => {
  setScenario(event.target.value);
  if (event.target.value) showToast("Task set up. Add a file or break it down.");
});

$("#demo-task-button").addEventListener("click", () => {
  $("#course-select").value = "hci";
  setScenario("hci", false);
  taskField.value = "Read paper and propose 1 feature idea for a study app.";
  taskField.focus();
  showToast("Sample task loaded. You can edit it before you begin.");
});

$("#demo-pdf-button").addEventListener("click", () => {
  if (!selectedScenario) {
    $("#course-select").value = "hci";
    setScenario("hci");
  }
  attachFile("Westley_et_al_2026.pdf");
  showToast("Sample PDF attached for the demo.");
});

$("#task-autofill").addEventListener("click", fillTaskMock);
$("#response-autofill").addEventListener("click", () => {
  const scenario = currentScenario();
  if (!scenario || activeStep >= 3) return;
  const field = $("#response-input");
  field.value = scenario.steps[activeStep].mock;
  responses[activeStep] = field.value;
  field.focus();
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
  if (!selectedScenario) {
    $("#course-select").focus();
    showToast("Choose a class or task first.");
    return;
  }
  if (!taskField.value.trim() && !attachedFile) {
    taskField.focus();
    showToast("Type your task or attach a file to get started.");
    return;
  }
  plan.hidden = false;
  $("#breakdown-button").innerHTML = 'Steps ready <span>✓</span>';
  activeStep = 0;
  responses = ["", "", ""];
  updateStepNames();
  renderStep();
  plan.scrollIntoView({ behavior: "smooth", block: "start" });
});

$$(`[data-helper]`).forEach((button) => button.addEventListener("click", () => {
  const scenario = currentScenario();
  if (!scenario || activeStep >= 3) return;
  const step = scenario.steps[activeStep];
  const hint = $("#hint");
  hint.textContent = button.dataset.helper === "simple" ? step.simple : step.example;
  hint.hidden = false;
  $$(`[data-helper]`).forEach((helper) => helper.classList.toggle("selected", helper === button));
}));

$("#response-input").addEventListener("input", (event) => {
  responses[activeStep] = event.target.value;
});

$("#done-button").addEventListener("click", () => {
  const scenario = currentScenario();
  const response = $("#response-input").value.trim();
  if (!response) {
    $("#response-input").focus();
    showToast("Add a few words before marking this step done.");
    return;
  }
  const minimum = scenario.steps[activeStep].minSentences || 1;
  if (sentenceCount(response) < minimum) {
    $("#response-input").focus();
    showToast(minimum === 2 ? "Add one more short sentence to finish your summary." : "Finish your thought before marking it done.");
    return;
  }
  responses[activeStep] = response;
  activeStep += 1;
  renderStep();
  showToast(activeStep < 3 ? "One small step done — you’ve got this!" : "Task complete — you built momentum!");
  if (activeStep < 3) $("#active-title").scrollIntoView({ behavior: "smooth", block: "center" });
});

$("#return-button").addEventListener("click", () => {
  $("#course-select").value = "";
  selectedScenario = "";
  taskField.value = "";
  attachedFile = "";
  $("#attached-file").hidden = true;
  $("#file-input").value = "";
  resetPlan();
  $("#course-select").focus();
  window.scrollTo({ top: 0, behavior: "smooth" });
  showToast("Ready for another task.");
});
