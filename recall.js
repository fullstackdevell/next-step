(() => {
  const $ = (id) => document.getElementById(id);
  const material = $("material-input");
  const error = $("material-error");
  const sampleNotes = `Active recall means trying to retrieve information from memory without looking at the source. After an attempt, checking the answer gives useful feedback.\n\nSpaced practice means returning to information after some time has passed. Short, repeated sessions let learners notice what they remember and what needs another review.\n\nBreaking a large topic into smaller chunks gives each study session one clear focus. A learner can finish one chunk before moving on to the next.\n\nA flashcard works best when the front asks one focused question and the back gives a short, checkable answer. Reviewing a card means trying to remember first, then checking the answer.`;
  let chunks = [];
  let cards = [];
  let cardIndex = 0;
  let ratings = { again: 0, some: 0, got: 0 };
  let cardResults = [];
  let attemptNumber = 0;
  let sourceLabel = "Pasted study material";
  let sessionSaved = false;
  let savedSessions = [];
  let historyStorageUnavailable = false;

  function readSessions() {
    if (historyStorageUnavailable) return savedSessions;
    try {
      const value = JSON.parse(localStorage.getItem("next-step-recall-sessions-v1") || "[]");
      return Array.isArray(value) ? value : [];
    } catch { return savedSessions; }
  }

  function renderHistory() {
    const list = $("history-list"); const sessions = readSessions();
    list.replaceChildren(); $("history-count").textContent = String(sessions.length); $("history-empty").hidden = sessions.length > 0;
    sessions.slice(0, 10).forEach((session) => {
      const item = document.createElement("li"); item.className = "rounded-xl border border-white/[0.06] bg-[#1f1f23] px-3 py-3";
      const title = document.createElement("p"); title.className = "text-xs font-semibold text-zinc-200";
      const date = new Date(session.completedAt); title.textContent = `${session.source} · Attempt ${session.attempt || 1} · ${Number.isNaN(date.getTime()) ? "Completed" : date.toLocaleString()}`;
      const details = document.createElement("p"); details.className = "mt-1 text-xs leading-5 text-zinc-500";
      details.textContent = `${session.total} ${session.total === 1 ? "card" : "cards"} · ${session.got} knew it · ${session.some} partly remembered · ${session.again} to revisit`;
      item.append(title, details); list.append(item);
      const miniChart = document.createElement("div"); miniChart.className = "mt-2 flex h-2 overflow-hidden rounded-full bg-zinc-700"; miniChart.setAttribute("aria-label", "Session self-rating distribution");
      [{ count: session.got, color: "bg-emerald-400" }, { count: session.some, color: "bg-amber-300" }, { count: session.again, color: "bg-rose-400" }].forEach((part) => {
        const bar = document.createElement("span"); bar.className = `${part.color} h-full`; bar.style.width = `${session.total ? (part.count / session.total) * 100 : 0}%`; miniChart.append(bar);
      });
      item.append(miniChart);
      const reviews = session.cardResults || [];
      if (reviews.length) {
        const disclosure = document.createElement("details"); disclosure.className = "mt-3 border-t border-white/[0.06] pt-2";
        const toggle = document.createElement("summary"); toggle.className = "cursor-pointer text-xs font-semibold text-fuchsia-200"; toggle.textContent = "See card-by-card results";
        const reviewList = document.createElement("ul"); reviewList.className = "mt-2 space-y-2";
        reviews.forEach((review) => {
          const row = document.createElement("li"); row.className = "rounded-lg bg-[#27272a] p-2.5";
          const status = document.createElement("p"); status.className = `text-[10px] font-bold uppercase tracking-wide ${review.rating === "again" ? "text-rose-200" : review.rating === "some" ? "text-amber-200" : "text-emerald-200"}`;
          status.textContent = review.rating === "again" ? "Needs another look" : review.rating === "some" ? "Partly remembered" : "Knew it";
          const question = document.createElement("p"); question.className = "mt-1 text-xs font-semibold text-zinc-200"; question.textContent = `${review.topic}: ${review.question}`;
          row.append(status, question);
          if (review.answer) { const answer = document.createElement("p"); answer.className = "mt-1 text-xs leading-5 text-zinc-400"; answer.textContent = `From your notes: ${review.answer}`; row.append(answer); }
          reviewList.append(row);
        });
        disclosure.append(toggle, reviewList); item.append(disclosure);
      }
    });
  }

  function saveSessionResult() {
    if (sessionSaved) return;
    sessionSaved = true;
    const result = { completedAt: new Date().toISOString(), source: sourceLabel, attempt: attemptNumber, total: cards.length, ...ratings,
      cardResults: cardResults.map((review) => ({ ...review, answer: review.rating === "got" ? "" : review.answer.slice(0, 420) })) };
    savedSessions = [result, ...readSessions()].slice(0, 50);
    try { localStorage.setItem("next-step-recall-sessions-v1", JSON.stringify(savedSessions)); }
    catch { historyStorageUnavailable = true; $("history-storage").textContent = "Session results available until this page closes"; }
    renderHistory();
  }

  try {
    const seed = sessionStorage.getItem("next-step-recall-seed");
    if (seed) { material.value = seed; sourceLabel = "Saved homework proposal"; $("material-status").textContent = "Saved proposal loaded from Homework."; sessionStorage.removeItem("next-step-recall-seed"); }
  } catch { /* Pasting material remains available if session storage is blocked. */ }

  material.addEventListener("input", () => { sourceLabel = "Pasted study material"; });

  $("load-demo-notes").addEventListener("click", () => {
    material.value = sampleNotes;
    sourceLabel = "Sample study notes";
    $("material-status").textContent = "Sample study notes loaded.";
    error.hidden = true;
  });

  $("upload-material").addEventListener("click", () => $("material-file").click());
  async function readPdf(file) {
    if (!window.pdfjsLib) await new Promise((resolve, reject) => {
      const script = document.createElement("script"); script.src = "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js";
      script.onload = resolve; script.onerror = () => reject(new Error("Couldn’t load the PDF reader. Paste the text instead.")); document.head.append(script);
    });
    window.pdfjsLib.GlobalWorkerOptions.workerSrc = "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js";
    const pdf = await window.pdfjsLib.getDocument({ data: await file.arrayBuffer() }).promise;
    const pages = [];
    for (let page = 1; page <= Math.min(pdf.numPages, 20); page += 1) pages.push((await (await pdf.getPage(page)).getTextContent()).items.map((item) => item.str).join(" "));
    return pages.join("\n\n").trim();
  }
  $("material-file").addEventListener("change", async (event) => {
    const file = event.target.files?.[0]; if (!file) return;
    sourceLabel = file.name;
    $("material-status").textContent = `Reading ${file.name}…`; error.hidden = true;
    try {
      const text = file.type === "application/pdf" || file.name.toLowerCase().endsWith(".pdf") ? await readPdf(file) : await file.text();
      if (!text) throw new Error("This file has no selectable text. Paste notes or use a text-based PDF.");
      material.value = text.slice(0, 30000);
      $("material-status").textContent = `${file.name} added${text.length > 30000 ? " · first 30,000 characters loaded" : ""}`;
    } catch (reason) { $("material-status").textContent = "PDF and text files supported"; error.textContent = reason.message || "Couldn’t read that file."; error.hidden = false; }
  });

  function sentenceList(text) {
    const parts = text.match(/[^.!?]+(?:[.!?]+|$)/g) || [text];
    return parts.map((part) => part.replace(/\s+/g, " ").trim()).filter(Boolean);
  }

  function makeChunks(text) {
    const paragraphs = text.replace(/\r/g, "").split(/\n+/).map((part) => part.trim()).filter(Boolean);
    let units = paragraphs.flatMap(sentenceList).flatMap((unit) => {
      if (unit.length <= 500) return [unit];
      const words = unit.split(/\s+/); const pieces = [];
      for (let index = 0; index < words.length; index += 65) pieces.push(words.slice(index, index + 65).join(" "));
      return pieces;
    });
    const groups = []; let current = [];
    for (const unit of units) {
      const length = current.join(" ").length + unit.length;
      if (current.length >= 2 || length > 480) { groups.push(current.join(" ")); current = []; }
      current.push(unit);
    }
    if (current.length) groups.push(current.join(" "));
    return groups.length ? groups : [text.trim()];
  }

  function makeQuestion(chunk, index) {
    const firstSentence = sentenceList(chunk)[0] || chunk;
    const stop = new Set("about after again also among another any are because been before being between both but can could did does each from have into its itself just more most much must only other our out over same should some such than that the their them then there these they this those through under until very was were what when where which while who will with would your you learner learners study material information section topic idea notes means using use used".split(" "));
    const terms = firstSentence.toLowerCase().match(/[a-z][a-z'-]{3,}/g) || [];
    const candidate = terms.filter((word) => !stop.has(word)).sort((a, b) => b.length - a.length)[0];
    if (candidate) return `Without looking, what does “${candidate}” mean or do in this section?`;
    return `What is the main idea in chunk ${index + 1}?`;
  }

  function makeEasyWords(chunk) {
    const plainTerms = [
      [/active recall/gi, "trying to remember without looking"],
      [/spaced practice/gi, "reviewing again after a break"],
      [/retrieve information/gi, "bring information back to mind"],
      [/cognitive load/gi, "mental effort"],
      [/engagement/gi, "staying involved"],
      [/scaffolding/gi, "helpful steps or hints"],
      [/evidence/gi, "facts that support an idea"],
      [/verify/gi, "check that something is true"],
      [/turning point/gi, "a moment when things changed"]
    ];
    let plain = (sentenceList(chunk)[0] || chunk).replace(/\s+/g, " ");
    plainTerms.forEach(([term, replacement]) => { plain = plain.replace(term, replacement); });
    return plain.length > 300 ? `${plain.slice(0, 297)}…` : plain;
  }

  function makeRealExample(text) {
    if (/binary search|sorted list|middle value|array/i.test(text)) return "Imagine looking for a word in a dictionary. You open near the middle, then keep only the half where the word could be.";
    if (/band|album|concert|music|song|audience/i.test(text)) return "Imagine a fan telling a friend how a band changed over time, using an early album and a later concert as examples.";
    if (/memory|recall|flashcard|study|chunk|remember/i.test(text)) return "Imagine a friend asking you one question from class while your notes are closed. You try to answer, then check the notes together.";
    if (/source|evidence|verify|fact|date/i.test(text)) return "Imagine checking the date of a concert. You compare the band’s own archive with a trusted news report before writing it down.";
    if (/hint|prompt|learner|app|check-in/i.test(text)) return "Imagine a map app offering one clear direction when you pause at a confusing junction, then letting you continue on your own.";
    return "Imagine explaining this idea to a classmate using a familiar moment from everyday life. The example should keep the same meaning as your notes.";
  }

  $("generate-plan").addEventListener("click", () => {
    const text = material.value.trim();
    if (!text) { error.textContent = "Paste or upload study material first."; error.hidden = false; material.focus(); return; }
    chunks = makeChunks(text.slice(0, 30000));
    sessionSaved = false; attemptNumber = 0; cardResults = [];
    cards = chunks.map((chunk, index) => ({ chunk, question: makeQuestion(chunk, index), plain: makeEasyWords(chunk), example: makeRealExample(chunk), label: `Chunk ${index + 1}` }));
    const plan = $("plan-list"); plan.replaceChildren();
    chunks.forEach((chunk, index) => {
      const item = document.createElement("li"); item.className = "flex items-start gap-3 rounded-xl border border-white/[0.06] bg-[#1f1f23]/70 px-3 py-3";
      const number = document.createElement("span"); number.className = "grid h-7 w-7 shrink-0 place-items-center rounded-full border border-fuchsia-300/20 bg-fuchsia-500/10 text-xs font-semibold text-fuchsia-200"; number.textContent = String(index + 1);
      const copy = document.createElement("span"); copy.className = "min-w-0 flex-1";
      const title = document.createElement("span"); title.className = "block text-xs font-semibold text-zinc-200"; title.textContent = `Chunk ${index + 1} · about 3–5 min`;
      const excerpt = document.createElement("span"); excerpt.className = "mt-1 block text-xs leading-5 text-zinc-500"; excerpt.textContent = chunk.length > 150 ? `${chunk.slice(0, 147)}…` : chunk;
      copy.append(title, excerpt); item.append(number, copy); plan.append(item);
    });
    $("plan-summary").textContent = `${chunks.length} small ${chunks.length === 1 ? "chunk" : "chunks"} from your material. Review them in short sessions and pause whenever you need.`;
    $("material-error").hidden = true; $("plan-panel").hidden = false; $("review-panel").hidden = true; $("done-panel").hidden = true;
    $("plan-panel").scrollIntoView({ behavior: "smooth", block: "start" });
  });

  function renderCard() {
    const card = cards[cardIndex];
    $("review-progress").textContent = `Card ${cardIndex + 1} of ${cards.length}`;
    $("review-progress-bar").style.width = `${Math.round((cardIndex / cards.length) * 100)}%`;
    $("rating-progress").textContent = `Reviewed ${cardIndex} of ${cards.length} · ${ratings.got} knew it · ${ratings.some} partly remembered · ${ratings.again} to revisit`;
    $("card-topic").textContent = card.label;
    $("card-question").textContent = card.question;
    $("card-answer").textContent = card.chunk;
    $("card-answer-wrap").hidden = true; $("card-help-controls").hidden = true; $("card-help-output").hidden = true; $("card-help-output").textContent = "";
    $("self-rating").hidden = true; $("reveal-answer").hidden = false;
  }

  function renderResultsChart() {
    const chart = $("results-chart"); chart.replaceChildren();
    const categories = [
      { key: "got", label: "Knew it", color: "bg-emerald-400" },
      { key: "some", label: "Partly remembered", color: "bg-amber-300" },
      { key: "again", label: "Needs another look", color: "bg-rose-400" }
    ];
    categories.forEach((category) => {
      const row = document.createElement("div"); row.className = "grid grid-cols-[9rem_minmax(0,1fr)_2rem] items-center gap-3";
      const label = document.createElement("p"); label.className = "text-xs text-zinc-400"; label.textContent = category.label;
      const track = document.createElement("div"); track.className = "h-3 overflow-hidden rounded-full bg-zinc-700";
      const bar = document.createElement("div"); bar.className = `h-full rounded-full ${category.color} transition-all`;
      bar.style.width = `${Math.round((ratings[category.key] / cards.length) * 100)}%`; track.append(bar);
      const count = document.createElement("p"); count.className = "text-right text-xs font-bold text-zinc-200"; count.textContent = String(ratings[category.key]);
      row.append(label, track, count); chart.append(row);
    });
  }

  $("start-review").addEventListener("click", () => {
    attemptNumber = 1; cardIndex = 0; ratings = { again: 0, some: 0, got: 0 }; cardResults = []; sessionSaved = false;
    $("plan-panel").hidden = true; $("done-panel").hidden = true; $("review-panel").hidden = false; renderCard();
    $("review-panel").scrollIntoView({ behavior: "smooth", block: "start" });
  });
  $("reveal-answer").addEventListener("click", () => {
    $("card-answer-wrap").hidden = false; $("card-help-controls").hidden = false; $("self-rating").hidden = false; $("reveal-answer").hidden = true;
  });
  $("explain-card").addEventListener("click", () => {
    $("card-help-output").textContent = `In easy words: ${cards[cardIndex].plain}`;
    $("card-help-output").hidden = false;
  });
  $("example-card").addEventListener("click", () => {
    $("card-help-output").textContent = `A real-life example: ${cards[cardIndex].example} This example is an analogy to help you picture the idea.`;
    $("card-help-output").hidden = false;
  });
  document.querySelectorAll("[data-rating]").forEach((button) => button.addEventListener("click", () => {
    const rating = button.dataset.rating; ratings[rating] += 1;
    cardResults[cardIndex] = { topic: cards[cardIndex].label, question: cards[cardIndex].question, rating, answer: cards[cardIndex].chunk };
    cardIndex += 1;
    if (cardIndex < cards.length) { renderCard(); return; }
    $("review-progress-bar").style.width = "100%";
    saveSessionResult();
    renderResultsChart();
    $("rating-progress").textContent = `Reviewed all ${cards.length} cards · ${ratings.got} knew it · ${ratings.some} partly remembered · ${ratings.again} to revisit`;
    $("review-result").textContent = `You reviewed ${cards.length} small ${cards.length === 1 ? "chunk" : "chunks"}: ${ratings.got} remembered, ${ratings.some} partly remembered, and ${ratings.again} to revisit. You can repeat the cards that need another look in your next short session.`;
    const canRetry = attemptNumber < 2;
    $("review-again").hidden = !canRetry; $("attempt-limit-note").hidden = canRetry;
    $("review-panel").hidden = true; $("done-panel").hidden = false; $("done-panel").scrollIntoView({ behavior: "smooth", block: "start" });
  }));
  $("review-again").addEventListener("click", () => {
    if (attemptNumber >= 2) return;
    attemptNumber += 1; cardIndex = 0; ratings = { again: 0, some: 0, got: 0 }; cardResults = []; sessionSaved = false; $("done-panel").hidden = true; $("review-panel").hidden = false; renderCard();
    $("review-panel").scrollIntoView({ behavior: "smooth", block: "start" });
  });
  $("new-plan-button").addEventListener("click", () => {
    $("done-panel").hidden = true; $("review-panel").hidden = true; $("plan-panel").hidden = true;
    $("material-panel").scrollIntoView({ behavior: "smooth", block: "start" }); material.focus({ preventScroll: true });
  });

  renderHistory();
})();
