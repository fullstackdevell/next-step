(() => {
  const flows = {
    hci: {
      name: "Psychology / HCI", heading: "Feature proposal", time: "About 5 minutes",
      assignment: "Read Designing evidence-based digital mental health check-ins in higher education and propose one evidence-based feature for a student wellness app",
      steps: [
        { title: "Choose a feature", progress: "Feature idea", prompt: "What feature could help a learner stay engaged during a difficult study task?", label: "Your feature idea", placeholder: "Describe one helpful feature…", mock: "Drawing on Designing evidence-based digital mental health check-ins in higher education (Westley et al., 2026), we propose an adaptive prompt feature that adjusts hint timing to each learner’s pace.", mockNote: "This adaptive feature is our proposal inspired by the paper. The study did not test adaptive hint timing.", simple: "Pick one thing the app could do to help someone keep going.", example: "If a learner pauses for a while, the app could offer one gentle hint. If they are moving along, it stays out of the way.", micro: "In two minutes, write one sentence that starts: ‘The app could help by…’", cue: /prompt|hint|feature|check[- ]?in|reminder|question/i, quiz: { question: "What is the main idea of your feature?", options: ["It changes a prompt to help the learner continue", "It completes the assignment for the learner", "It adds more instructions to every screen"], correct: 0, explanation: "A focused feature helps at the point of need while leaving the learner in charge." }, summary: "Feature idea" },
        { title: "Describe the benefit", progress: "User impact", prompt: "How could this feature affect the learner’s focus or effort?", label: "Possible user impact", placeholder: "Explain what may feel easier…", mock: "The feature may lower the effort needed to get unstuck and help learners return their attention to the task. We would test this effect rather than assume it.", simple: "Say what might feel easier for the person using the app.", example: "A short hint at the right moment may help someone continue without reading a long set of instructions.", micro: "Write one change a learner might notice after using the feature.", cue: /load|overwhelm|focus|attention|effort|engag|time|stress|easier/i, quiz: { question: "Which is a user impact you could investigate?", options: ["Whether learners feel more able to continue", "Whether the app uses more colors", "Whether the feature name is longer"], correct: 0, explanation: "Measure a change in the learner’s experience, such as focus or effort." }, summary: "User impact" },
        { title: "Plan a small test", progress: "Test plan", prompt: "How could you try the feature and check whether it helps?", label: "Your test plan", placeholder: "Name a small test…", mock: "We would test the prompt timing with a small student group and compare task completion and a short post-task effort rating over two weeks.", simple: "Describe a small trial and one thing you would watch for.", example: "Try the feature with a small group, then ask how hard it felt to get started.", micro: "Choose who would try the feature and what you would measure.", cue: /test|trial|measure|survey|week|completion|rate|time|compare|group/i, quiz: { question: "Which plan can show whether the feature helps?", options: ["Compare task progress and learner feedback", "Count the app’s buttons", "Ask only whether the colors look nice"], correct: 0, explanation: "A useful test checks task progress or how the learner experienced the task." }, summary: "Test plan" }
      ]
    },
    technical: {
      name: "Computer Science", heading: "Binary search walkthrough", time: "About 7 minutes",
      assignment: "Explain how binary search can find 23 in the sorted list [3, 8, 12, 17, 23, 31, 42].",
      steps: [
        { title: "Restate the goal", progress: "Goal", prompt: "What value are you looking for, and what is special about this list?", label: "Goal and key detail", placeholder: "State the target and list property…", mock: "Find the value 23 in the sorted list [3, 8, 12, 17, 23, 31, 42]. The sorted order lets us rule out half the remaining values at each comparison.", simple: "Say what number to find and notice that the list is already in order.", example: "It is like looking for a word in a dictionary: you open near the middle first.", micro: "Write the target number and one useful fact about the list.", cue: /23|sorted|order|target|find/i, quiz: { question: "What makes binary search suitable here?", options: ["The list is sorted", "The list has seven values", "The target is two digits"], correct: 0, explanation: "Binary search relies on sorted order to discard one side." }, summary: "Goal" },
        { title: "Check the middle value", progress: "First comparison", prompt: "Which value is in the middle, and how does it compare with 23?", label: "Middle value", placeholder: "Show the middle index or value…", mock: "With zero-based indexes, the middle index is 3 and the value is 17. Since 17 is less than 23, the target must be to its right.", simple: "Look at the center number. Is it smaller or bigger than 23?", example: "The center is 17. Because 23 is larger, ignore 17 and everything before it.", micro: "Circle the center value and compare it with 23.", cue: /17|middle|center|index|less|smaller|right/i, quiz: { question: "The middle value is 17. Which side can still contain 23?", options: ["The right side", "The left side", "Both sides equally"], correct: 0, explanation: "23 is greater than 17, so search only the right side." }, summary: "First comparison" },
        { title: "Narrow the search", progress: "Next range", prompt: "After ruling out the left side, what values remain to check?", label: "Remaining range", placeholder: "List the remaining values…", mock: "The remaining range is [23, 31, 42]. Its middle value is 31. Since 23 is less than 31, the next range is [23].", simple: "Keep only the part where the answer could still be.", example: "After removing 3, 8, 12, and 17, check 23, 31, and 42. Their middle is 31.", micro: "Write just the numbers that could still be the answer.", cue: /23|31|42|range|remain|right|left/i, quiz: { question: "For [23, 31, 42], the middle is 31. Where is 23?", options: ["To the left", "To the right", "It is 31"], correct: 0, explanation: "23 is smaller than 31, so keep the left portion." }, summary: "Remaining range" },
        { title: "Write the search logic", progress: "Logic", prompt: "In plain language, what should the search repeat after each comparison?", label: "Search logic", placeholder: "Describe the loop without writing full code…", mock: "Keep a low and high boundary. Check the middle, then move one boundary past it to keep only the side that could contain the target. Stop when the target is found or no values remain.", simple: "Keep checking the middle and cross out the half that cannot contain the answer.", example: "If middle is too small, move the low boundary right. If it is too large, move the high boundary left.", micro: "Write one sentence for what happens when the middle is too small.", cue: /low|high|boundary|middle|half|repeat|stop|side/i, quiz: { question: "If the middle value is too small, what changes?", options: ["Move the lower boundary to the right", "Move the upper boundary to the left", "Search the same range again"], correct: 0, explanation: "Discard the middle and everything smaller by moving the lower boundary up." }, summary: "Search logic" },
        { title: "Check an edge case", progress: "Edge case", prompt: "What should happen if the target is missing or the list is empty?", label: "Edge case", placeholder: "Describe a case and expected result…", mock: "If the list is empty, the search stops immediately and reports that 23 was not found. If the target is absent, the boundaries eventually cross and produce the same not-found result.", simple: "Think about what the program should say when there is nothing to find.", example: "Try an empty list or search for 99. The search should stop and report ‘not found’.", micro: "Pick one input where 23 is absent and write the expected result.", cue: /empty|absent|missing|not found|cross|99|stop/i, quiz: { question: "When should the search report ‘not found’?", options: ["When the search range becomes empty", "Whenever the middle is not the target", "Before checking the list"], correct: 0, explanation: "Keep narrowing the range; report not found when there is nowhere left to search." }, summary: "Edge case" }
      ]
    },
    creative: {
      name: "Music History / English", heading: "Band history essay", time: "About 6 minutes",
      assignment: "Write a short essay on the history of your favourite band, using two turning points and reliable sources.",
      steps: [
        { title: "Choose your band and angle", progress: "Essay focus", prompt: "Which band will you write about, and what part of its history interests you?", label: "Band and focus", placeholder: "Name a band and an angle…", mock: "I’ll write about Queen, focusing on how the band’s changing sound and major live performances helped it reach new audiences.", simple: "Pick a band and one thing about its story you want to explain.", example: "You could focus on how a band’s sound changed after a new member joined.", micro: "Write the band’s name and finish: ‘I want to explore…’", cue: /queen|band|artist|music|sound|audience|focus|story/i, quiz: { question: "What makes a useful essay focus?", options: ["One clear angle about the band’s history", "A list of every song", "A personal rating with no explanation"], correct: 0, explanation: "A focused angle gives the essay a point to explain." }, summary: "Essay focus" },
        { title: "Pick two turning points", progress: "Key moments", prompt: "Which two moments could show how the band changed over time?", label: "Two key moments", placeholder: "List two moments to research…", mock: "I’ll look at the release of A Night at the Opera in 1975 and Queen’s performance at Live Aid in 1985 as two moments that shaped the band’s public story.", simple: "Choose two important moments that help tell the story.", example: "A first album and a major concert can show both how a band began and how its audience grew.", micro: "Jot down two dates or events you could check.", cue: /1975|1985|album|concert|live|moment|event|turning|release/i, quiz: { question: "What should a turning point do in the essay?", options: ["Show a meaningful change in the band’s story", "Fill space between paragraphs", "Replace the essay’s main idea"], correct: 0, explanation: "Choose moments that help explain change over time." }, summary: "Key moments" },
        { title: "Find reliable evidence", progress: "Sources", prompt: "What sources could help verify the dates and explain why these moments mattered?", label: "Sources to check", placeholder: "Name reliable source types…", mock: "I’ll check the band’s official archive for dates, then compare those details with a reputable music-history publication or a contemporary interview.", simple: "Find sources you can trust and check important facts in more than one place.", example: "Use an official archive to confirm a date, then a music magazine interview to understand the context.", micro: "Write down one source to find and the fact you’ll verify.", cue: /source|archive|interview|verify|reliable|official|publication|date|fact/i, quiz: { question: "Which is strongest for checking a release date?", options: ["An official record checked against a reputable article", "An unsourced social post", "A guess from memory"], correct: 0, explanation: "Reliable sources and cross-checking help keep the essay accurate." }, summary: "Sources" },
        { title: "Shape the essay", progress: "Draft plan", prompt: "How will your main idea connect the two moments into one short essay?", label: "Thesis or opening sentence", placeholder: "Draft one sentence that links the moments…", mock: "Queen’s growing success came from pairing bold musical experimentation with memorable live performances, as seen in the release of A Night at the Opera and the band’s Live Aid set.", simple: "Write one sentence that connects your two moments and says what they show.", example: "‘The band found a wider audience by changing its sound and putting on ambitious live shows.’", micro: "Start with: ‘These two moments show that…’", cue: /because|show|change|sound|audience|success|thesis|moment/i, quiz: { question: "What should the opening idea do?", options: ["Connect the moments to one main point", "List sources without a claim", "Retell every detail at once"], correct: 0, explanation: "A clear claim gives the details a shared purpose." }, summary: "Essay opening" }
      ]
    }
  };

  const storage = { classes: "next-step-user-classes-v1", homework: "next-step-homework-v2" };
  const defaults = Object.entries(flows).map(([flowId, flow]) => ({ id: flowId, name: flow.name, assignment: flow.assignment, flowId }));
  const readJSON = (key, fallback) => { try { const value = JSON.parse(localStorage.getItem(key) || "null"); return value ?? fallback; } catch { return fallback; } };
  let customClasses = readJSON(storage.classes, []);
  if (!Array.isArray(customClasses)) customClasses = [];
  let homework = readJSON(storage.homework, []);
  if (!Array.isArray(homework)) homework = [];
  if (homework.length === 0) {
    const earlierEntries = readJSON("next-step-completed-proposals-v1", []);
    if (Array.isArray(earlierEntries) && earlierEntries.length) {
      homework = earlierEntries.map((entry) => ({ ...entry, course: "Psychology / HCI", flowId: "hci" }));
      try { localStorage.setItem(storage.homework, JSON.stringify(homework)); } catch { /* Keep the migrated entries in this page session. */ }
    }
  }
  let activeClass = null;
  let activeFlow = null;
  let activeStep = 0;
  let currentTask = "";
  let uploadedFileName = "";
  let responses = [];
  let storageUnavailable = false;

  const $ = (id) => document.getElementById(id);
  const taskInput = $("task-input");
  const responseInput = $("step-response");
  const feedback = $("step-feedback");
  const taskFeedback = $("task-entry-feedback");
  const classSelect = $("class-select");

  function allClasses() { return [...defaults, ...customClasses]; }
  function persist(key, value) {
    try { localStorage.setItem(key, JSON.stringify(value)); }
    catch { storageUnavailable = true; $("library-storage-label").textContent = "Saved until this page closes"; }
  }

  function renderClassOptions(selectedId = "") {
    classSelect.replaceChildren(new Option("Choose a class…", ""));
    allClasses().forEach((item) => classSelect.add(new Option(item.name, item.id)));
    classSelect.value = selectedId;
  }

  function updatePath() {
    const list = $("path-list");
    list.replaceChildren();
    if (!activeFlow) {
      $("path-caption").textContent = "Choose a class to preview its steps";
      $("path-count").textContent = "0 steps";
      return;
    }
    $("path-caption").textContent = activeFlow.name;
    $("path-count").textContent = `${activeFlow.steps.length} steps`;
    activeFlow.steps.forEach((step, index) => {
      const item = document.createElement("li");
      const done = index < activeStep || ($("completion-card").hidden === false && index <= activeStep);
      const current = index === activeStep && !done && !$("workflow-card").hidden;
      item.className = `flex items-center gap-3 rounded-xl border px-3 py-3 ${done ? "border-emerald-400/15 bg-emerald-400/[0.04]" : current ? "border-fuchsia-400/25 bg-fuchsia-500/[0.07]" : "border-white/[0.05] bg-[#1f1f23]/60"}`;
      const number = document.createElement("span");
      number.className = `grid h-7 w-7 shrink-0 place-items-center rounded-full border text-xs font-bold ${done ? "border-emerald-300/30 bg-emerald-400/10 text-emerald-200" : current ? "border-fuchsia-300/30 bg-fuchsia-500/15 text-fuchsia-200" : "border-zinc-700 text-zinc-500"}`;
      number.textContent = done ? "✓" : String(index + 1);
      const text = document.createElement("span"); text.className = "min-w-0 flex-1";
      const title = document.createElement("span"); title.className = `block text-xs ${current || done ? "font-bold text-white" : "font-semibold text-zinc-300"}`; title.textContent = step.progress;
      const sub = document.createElement("span"); sub.className = "mt-0.5 block text-[11px] text-zinc-500"; sub.textContent = step.title;
      text.append(title, sub);
      const status = document.createElement("span"); status.className = `text-[10px] font-semibold ${done ? "text-emerald-300" : current ? "text-fuchsia-200" : "text-zinc-600"}`; status.textContent = done ? "DONE" : current ? "NOW" : "";
      item.append(number, text, status); list.append(item);
    });
  }

  function selectClass(id, fillAssignment = false) {
    activeClass = allClasses().find((item) => item.id === id) || null;
    activeFlow = activeClass ? flows[activeClass.flowId] : null;
    classSelect.value = activeClass?.id || "";
    if (activeClass && fillAssignment) taskInput.value = activeClass.assignment;
    updatePath();
    taskFeedback.hidden = true;
  }

  classSelect.addEventListener("change", () => selectClass(classSelect.value));
  document.querySelectorAll("[data-demo-class]").forEach((button) => button.addEventListener("click", () => selectClass(button.dataset.demoClass, true)));

  $("add-class-toggle").addEventListener("click", () => { $("add-class-form").hidden = !$("add-class-form").hidden; });
  $("cancel-class").addEventListener("click", () => { $("add-class-form").hidden = true; $("class-form-feedback").hidden = true; });
  $("save-class").addEventListener("click", () => {
    const name = $("new-class-name").value.trim();
    const assignment = $("new-class-task").value.trim();
    if (!name || !assignment) { $("class-form-feedback").textContent = "Add a class name and assignment prompt."; $("class-form-feedback").hidden = false; return; }
    const flowId = $("new-class-flow").value;
    const item = { id: `class-${Date.now()}`, name, assignment, flowId };
    customClasses.push(item);
    persist(storage.classes, customClasses);
    renderClassOptions(item.id);
    selectClass(item.id);
    $("new-class-name").value = "";
    $("add-class-form").hidden = true;
    $("class-form-feedback").hidden = true;
  });

  $("upload-task-button").addEventListener("click", () => $("task-file-input").click());
  async function loadPdfText(file) {
    if (!window.pdfjsLib) await new Promise((resolve, reject) => {
      const script = document.createElement("script"); script.src = "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js";
      script.onload = resolve; script.onerror = () => reject(new Error("Couldn’t load the PDF reader. Paste the assignment text instead.")); document.head.append(script);
    });
    window.pdfjsLib.GlobalWorkerOptions.workerSrc = "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js";
    const pdf = await window.pdfjsLib.getDocument({ data: await file.arrayBuffer() }).promise;
    const pages = [];
    for (let i = 1; i <= Math.min(pdf.numPages, 12); i += 1) pages.push((await (await pdf.getPage(i)).getTextContent()).items.map((x) => x.str).join(" "));
    return pages.join("\n\n").trim();
  }
  $("task-file-input").addEventListener("change", async (event) => {
    const file = event.target.files?.[0]; if (!file) return;
    uploadedFileName = file.name; $("upload-status").textContent = `Reading ${file.name}…`; taskFeedback.hidden = true;
    try {
      const content = file.type === "application/pdf" || file.name.toLowerCase().endsWith(".pdf") ? await loadPdfText(file) : await file.text();
      if (!content) throw new Error("No selectable text found. Paste the task text to continue.");
      taskInput.value = content.slice(0, 30000); $("upload-status").textContent = `${file.name} added${content.length > 30000 ? " · first 30,000 characters loaded" : ""}`;
    } catch (error) { uploadedFileName = ""; $("upload-status").textContent = "PDF or text files supported"; taskFeedback.textContent = error.message; taskFeedback.hidden = false; }
  });

  $("start-task-button").addEventListener("click", () => {
    if (!activeClass || !activeFlow) { taskFeedback.textContent = "Choose a class first so we can use the right workflow."; taskFeedback.hidden = false; classSelect.focus(); return; }
    currentTask = taskInput.value.trim();
    if (!currentTask) { taskFeedback.textContent = "Paste or upload an assignment to get started."; taskFeedback.hidden = false; taskInput.focus(); return; }
    activeStep = 0; responses = Array(activeFlow.steps.length).fill(""); taskFeedback.hidden = true;
    $("task-panel").hidden = true; $("workflow-card").hidden = false; $("path-card").hidden = false; $("completion-card").hidden = true;
    renderStep(); $("workflow-heading").scrollIntoView({ behavior: "smooth", block: "start" });
  });

  function renderStep() {
    const step = activeFlow.steps[activeStep];
    $("workflow-course").textContent = activeFlow.name;
    $("workflow-heading").textContent = activeFlow.heading;
    $("step-time").textContent = activeFlow.time;
    $("progress-label").textContent = `Step ${activeStep + 1} of ${activeFlow.steps.length}: ${step.progress}`;
    const bars = $("progress-bars"); bars.replaceChildren();
    activeFlow.steps.forEach((_, index) => { const bar = document.createElement("span"); bar.className = `h-1.5 flex-1 rounded-full ${index <= activeStep ? "bg-fuchsia-400" : "bg-zinc-700"}`; bars.append(bar); });
    $("step-number").textContent = String(activeStep + 1); $("step-title").textContent = step.title; $("step-prompt").textContent = step.prompt;
    $("response-label").textContent = step.label; responseInput.placeholder = step.placeholder; responseInput.value = responses[activeStep];
    $("submit-step").innerHTML = activeStep === activeFlow.steps.length - 1 ? 'Complete assignment <span aria-hidden="true">✓</span>' : 'Save step and continue <span aria-hidden="true">→</span>';
    $("action-output").hidden = true; $("action-output").textContent = "";
    document.querySelectorAll(".action-button").forEach((button) => button.setAttribute("aria-pressed", "false"));
    feedback.hidden = true; feedback.textContent = ""; updatePath();
  }

  responseInput.addEventListener("input", () => { if (responses.length) responses[activeStep] = responseInput.value; });
  $("autofill-button").addEventListener("click", () => {
    const step = activeFlow.steps[activeStep]; responseInput.value = step.mock; responses[activeStep] = step.mock; responseInput.focus();
    feedback.textContent = step.mockNote || "Demo answer added. Review it and submit this step."; feedback.hidden = false;
  });

  document.querySelectorAll("[data-action]").forEach((button) => button.addEventListener("click", () => {
    const step = activeFlow.steps[activeStep]; document.querySelectorAll(".action-button").forEach((item) => item.setAttribute("aria-pressed", "false")); button.setAttribute("aria-pressed", "true");
    $("action-output").textContent = ({ smaller: step.micro, example: step.example, explain: step.simple })[button.dataset.action]; $("action-output").hidden = false; $("action-output").classList.remove("fade-in"); void $("action-output").offsetWidth; $("action-output").classList.add("fade-in");
  }));

  function nextStepMessage(step, answer) {
    if (!step.cue) return "One piece done. Keep going at your own pace.";
    return step.cue.test(answer) ? "Good thinking. You have a useful detail to build on in the next step." : "One piece done. Add a concrete detail in the next step and keep going.";
  }
  $("submit-step").addEventListener("click", () => {
    responses[activeStep] = responseInput.value.trim();
    if (!responses[activeStep]) { feedback.textContent = "Add a few words first. A rough idea is a great start."; feedback.hidden = false; responseInput.focus(); return; }
    if (activeStep < activeFlow.steps.length - 1) {
      const message = nextStepMessage(activeFlow.steps[activeStep], responses[activeStep]); activeStep += 1; renderStep(); feedback.textContent = message; feedback.hidden = false; $("workflow-heading").scrollIntoView({ behavior: "smooth", block: "start" }); return;
    }
    finishAssignment();
  });

  function renderHomework() {
    const list = $("library-list"); list.replaceChildren();
    $("library-count").textContent = String(homework.length); $("library-empty").hidden = homework.length > 0;
    homework.forEach((entry, index) => {
      const item = document.createElement("li"); item.className = "rounded-xl border border-white/[0.07] bg-[#1f1f23] p-3";
      const details = document.createElement("details"); const summary = document.createElement("summary"); summary.className = "cursor-pointer list-none text-xs font-semibold text-zinc-200";
      const date = new Date(entry.completedAt); summary.textContent = `${entry.course} · ${Number.isNaN(date.getTime()) ? `Assignment ${homework.length - index}` : date.toLocaleDateString()}`;
      const task = document.createElement("p"); task.className = "mt-2 text-xs leading-5 text-zinc-400"; task.textContent = entry.task;
      details.append(summary, task);
      const flow = flows[entry.flowId];
      (entry.responses || []).forEach((response, responseIndex) => { const text = document.createElement("p"); text.className = "mt-2 border-l border-fuchsia-400/30 pl-2 text-xs leading-5 text-zinc-300"; text.textContent = `${flow?.steps[responseIndex]?.summary || `Step ${responseIndex + 1}`}: ${response}`; details.append(text); });
      const practice = document.createElement("button"); practice.type = "button"; practice.className = "mt-3 rounded-lg border border-fuchsia-400/25 px-3 py-2 text-xs font-semibold text-fuchsia-200 transition hover:bg-fuchsia-500/[0.08]"; practice.textContent = "Practice mock flashcards";
      practice.addEventListener("click", () => {
        try { sessionStorage.setItem("next-step-recall-flow", entry.flowId || "hci"); } catch { /* The recall page lets the user choose a mock deck. */ }
        window.location.href = "recall.html";
      });
      details.append(practice);
      item.append(details); list.append(item);
    });
  }

  function finishAssignment() {
    const record = { course: activeClass.name, flowId: activeClass.flowId, task: currentTask, fileName: uploadedFileName, responses: [...responses], completedAt: new Date().toISOString() };
    homework.unshift(record); persist(storage.homework, homework); renderHomework();
    const summary = $("proposal-summary"); summary.replaceChildren();
    activeFlow.steps.forEach((step, index) => { const item = document.createElement("li"); item.className = "rounded-xl border border-white/[0.07] bg-[#1f1f23] p-4"; const title = document.createElement("p"); title.className = "text-[11px] font-bold uppercase tracking-[.12em] text-fuchsia-300"; title.textContent = `${String(index + 1).padStart(2, "0")} · ${step.summary}`; const text = document.createElement("p"); text.className = "mt-2 text-sm leading-6 text-zinc-200"; text.textContent = responses[index]; item.append(title, text); summary.append(item); });
    $("completion-copy").textContent = `${activeClass.name} · ${activeFlow.steps.length} steps completed.`;
    $("workflow-card").hidden = true; $("completion-card").hidden = false; updatePath(); $("completion-card").scrollIntoView({ behavior: "smooth", block: "start" });
  }

  $("return-button").addEventListener("click", () => {
    activeClass = null; activeFlow = null; activeStep = 0; currentTask = ""; uploadedFileName = ""; responses = [];
    classSelect.value = ""; taskInput.value = ""; $("task-file-input").value = ""; $("upload-status").textContent = "PDF and text files supported";
    $("workflow-card").hidden = true; $("completion-card").hidden = true; $("task-panel").hidden = false; $("path-card").hidden = true; taskFeedback.hidden = true; updatePath(); window.scrollTo({ top: 0, behavior: "smooth" }); classSelect.focus({ preventScroll: true });
  });

  renderClassOptions(); renderHomework(); updatePath();
})();
