(() => {
  const $ = (id) => document.getElementById(id);
  const decks = {
    hci: {
      title: "Psychology / HCI · Digital check-ins",
      chunks: [
        { title: "Short check-ins", cards: [
          { question: "How long are the StudentPulse check-ins described in the paper?", answer: "The check-ins are designed to take about 2–5 minutes.", plain: "They’re designed to be quick, around two to five minutes.", example: "Think of a short weather check before leaving home: quick enough to finish, useful for deciding what to do next." },
          { question: "How are the check-in questions presented?", answer: "One question appears at a time, with clear instructions.", plain: "The app asks one clear question, then moves to the next.", example: "It’s like a short conversation. You answer one question before someone asks another." }
        ] },
        { title: "Supporting attention", cards: [
          { question: "Why keep a digital check-in brief and focused?", answer: "Brief, focused check-ins are designed to support attention and make the interaction easier to complete.", plain: "A short check-in gives the learner one small thing to focus on.", example: "A short reminder is easier to act on than a long list of instructions when you’re busy." },
          { question: "What can immediate feedback do for a learner?", answer: "It lets the learner know their response was received and gives them a useful next cue.", plain: "The app responds right after you answer, so you know what happens next.", example: "Like a message saying ‘Saved’ after you submit a form, it confirms the action worked." }
        ] },
        { title: "Designing manageable steps", cards: [
          { question: "How can showing one prompt at a time reduce clutter?", answer: "It limits how much the learner needs to process at once and keeps attention on the current question.", plain: "Show just the current question so the whole task doesn’t arrive at once.", example: "A recipe that shows one cooking step at a time can feel easier to follow than a wall of directions." }
        ] }
      ]
    },
    technical: {
      title: "Computer Science · Binary search",
      chunks: [
        { title: "What binary search needs", cards: [
          { question: "What must be true about a list before binary search can usefully narrow it?", answer: "The list must be sorted so comparisons tell us which half can be ruled out.", plain: "The values need to be in order, so we can safely cross out half.", example: "A dictionary is alphabetized. Finding a word lets you know which side of the page to search next." },
          { question: "What value is binary search looking for in the demo list?", answer: "It is looking for 23 in [3, 8, 12, 17, 23, 31, 42].", plain: "The target number is 23.", example: "If you’re looking for a specific book, the target is the title you want to find." }
        ] },
        { title: "Use the middle", cards: [
          { question: "What is the middle value in [3, 8, 12, 17, 23, 31, 42]?", answer: "The middle value is 17.", plain: "Start by checking 17, the value in the center.", example: "Open a dictionary near the middle first instead of reading every page from the beginning." },
          { question: "If the target is 23 and the middle is 17, which side can be ruled out?", answer: "The values at or below 17 can be ruled out. Continue on the right side.", plain: "Because 23 is bigger than 17, look to the right.", example: "If the word you want comes after the words on the open page, keep the later pages." }
        ] },
        { title: "Narrow and check", cards: [
          { question: "What should the search do after each middle-value comparison?", answer: "Keep only the half that could still contain the target, then check that smaller range.", plain: "Cross out the half that can’t contain the answer and check the middle of what’s left.", example: "Like a number guessing game: each higher-or-lower clue cuts down the possible range." },
          { question: "When should binary search report that a target was not found?", answer: "When the remaining search range is empty and no value matched the target.", plain: "If there are no values left to check, say the target isn’t in the list.", example: "If you’ve checked every possible shelf in the narrowed section, you can report the book isn’t there." }
        ] }
      ]
    },
    creative: {
      title: "Music History · Band essay",
      chunks: [
        { title: "Focus the story", cards: [
          { question: "What makes a strong focus for a short band-history essay?", answer: "A clear angle about how or why the band’s story changed, supported by selected events.", plain: "Choose one point about the band’s history that you can explain with a few moments.", example: "A short documentary follows one theme in an artist’s career instead of listing everything they ever did." },
          { question: "What is a turning point in a band’s history?", answer: "A moment that marks a meaningful change, such as a new sound, a major release, or a performance that reaches a wider audience.", plain: "It’s an event after which something important changes.", example: "A local band gets invited to a large festival. That show could change who hears its music." }
        ] },
        { title: "Choose useful evidence", cards: [
          { question: "Why use two turning points in the essay?", answer: "Two selected moments can show change over time and give the main idea concrete support.", plain: "Two moments help show how the band changed, rather than just saying it changed.", example: "Compare an early small show with a later tour to show how an audience grew." },
          { question: "How can you check a date or detail about the band?", answer: "Check a reliable source, such as an official archive, and compare important facts with another reputable source.", plain: "Look it up somewhere trustworthy, then check it against another reliable source.", example: "Check a concert date in the band’s archive and confirm it in a music publication." }
        ] },
        { title: "Build the essay idea", cards: [
          { question: "What should a thesis do in a short history essay?", answer: "It should make one clear point and show how the selected moments support that point.", plain: "The thesis tells the reader what your examples will show.", example: "A museum label gives one main idea, then uses a few objects to help explain it." }
        ] }
      ]
    }
  };

  let selectedId = "";
  let activeDeck = null;
  let cards = [];
  let cardIndex = 0;
  let ratings = { again: 0, some: 0, got: 0 };
  let cardResults = [];
  let attemptNumber = 0;
  let sessionSaved = false;
  let history = [];
  let historyStorageUnavailable = false;
  const historyKey = "next-step-recall-sessions-v1";

  function readHistory() {
    if (historyStorageUnavailable) return history;
    try { const saved = JSON.parse(localStorage.getItem(historyKey) || "[]"); return Array.isArray(saved) ? saved : []; }
    catch { return history; }
  }

  function selectDeck(id) {
    selectedId = id; activeDeck = decks[id];
    document.querySelectorAll("[data-mock-set]").forEach((button) => {
      const selected = button.dataset.mockSet === id;
      button.setAttribute("aria-pressed", String(selected));
      button.classList.toggle("mock-set-selected", selected);
    });
    $("deck-selected").textContent = `${activeDeck.title} selected · ${activeDeck.chunks.reduce((total, chunk) => total + chunk.cards.length, 0)} prepared cards.`;
    $("generate-plan").disabled = false;
    $("plan-panel").hidden = true; $("review-panel").hidden = true; $("done-panel").hidden = true;
  }

  function renderHistory() {
    const list = $("history-list"); list.replaceChildren();
    history = readHistory();
    $("history-count").textContent = String(history.length);
    $("history-empty").hidden = history.length > 0;
    history.slice(0, 10).forEach((session) => {
      const item = document.createElement("li"); item.className = "rounded-xl border border-white/[0.06] bg-[#1f1f23] px-3 py-3";
      const title = document.createElement("p"); title.className = "text-xs font-semibold text-zinc-200";
      const date = new Date(session.completedAt); title.textContent = `${session.source} · Attempt ${session.attempt || 1} · ${Number.isNaN(date.getTime()) ? "Completed" : date.toLocaleString()}`;
      const stats = document.createElement("p"); stats.className = "mt-1 text-xs leading-5 text-zinc-500"; stats.textContent = `${session.total} cards · ${session.got} knew it · ${session.some} partly remembered · ${session.again} to revisit`;
      const miniChart = document.createElement("div"); miniChart.className = "mt-2 flex h-2 overflow-hidden rounded-full bg-zinc-700"; miniChart.setAttribute("aria-hidden", "true");
      [{ count: session.got, color: "bg-emerald-400" }, { count: session.some, color: "bg-amber-300" }, { count: session.again, color: "bg-rose-400" }].forEach((part) => { const bar = document.createElement("span"); bar.className = `h-full ${part.color}`; bar.style.width = `${session.total ? (part.count / session.total) * 100 : 0}%`; miniChart.append(bar); });
      item.append(title, stats, miniChart);
      if (session.cardResults?.length) {
        const disclosure = document.createElement("details"); disclosure.className = "mt-3 border-t border-white/[0.06] pt-2";
        const toggle = document.createElement("summary"); toggle.className = "cursor-pointer text-xs font-semibold text-fuchsia-200"; toggle.textContent = "See card-by-card results";
        const reviews = document.createElement("ul"); reviews.className = "mt-2 space-y-2";
        session.cardResults.forEach((result) => {
          const row = document.createElement("li"); row.className = "rounded-lg bg-[#27272a] p-2.5";
          const state = document.createElement("p"); state.className = `text-[10px] font-bold uppercase tracking-wide ${result.rating === "again" ? "text-rose-200" : result.rating === "some" ? "text-amber-200" : "text-emerald-200"}`;
          state.textContent = result.rating === "again" ? "Needs another look" : result.rating === "some" ? "Partly remembered" : "Knew it";
          const question = document.createElement("p"); question.className = "mt-1 text-xs font-semibold text-zinc-200"; question.textContent = `${result.topic}: ${result.question}`;
          row.append(state, question);
          if (result.answer) { const answer = document.createElement("p"); answer.className = "mt-1 text-xs leading-5 text-zinc-400"; answer.textContent = `Review this answer: ${result.answer}`; row.append(answer); }
          reviews.append(row);
        });
        disclosure.append(toggle, reviews); item.append(disclosure);
      }
      list.append(item);
    });
  }

  function renderPlan() {
    const list = $("plan-list"); list.replaceChildren(); cards = [];
    activeDeck.chunks.forEach((chunk, chunkIndex) => {
      const item = document.createElement("li"); item.className = "flex items-start gap-3 rounded-xl border border-white/[0.06] bg-[#1f1f23]/70 px-3 py-3";
      const number = document.createElement("span"); number.className = "grid h-7 w-7 shrink-0 place-items-center rounded-full border border-fuchsia-300/20 bg-fuchsia-500/10 text-xs font-semibold text-fuchsia-200"; number.textContent = String(chunkIndex + 1);
      const copy = document.createElement("span"); copy.className = "min-w-0 flex-1";
      const title = document.createElement("span"); title.className = "block text-xs font-semibold text-zinc-200"; title.textContent = `${chunk.title} · about 3–5 min`;
      const note = document.createElement("span"); note.className = "mt-1 block text-xs leading-5 text-zinc-500"; note.textContent = `${chunk.cards.length} prepared ${chunk.cards.length === 1 ? "card" : "cards"} on this idea.`;
      copy.append(title, note); item.append(number, copy); list.append(item);
      chunk.cards.forEach((card) => cards.push({ ...card, topic: chunk.title }));
    });
    $("plan-heading").textContent = `${activeDeck.title} · your study plan`;
    $("plan-summary").textContent = `${activeDeck.chunks.length} manageable chunks with ${cards.length} prepared flashcards. You can finish one chunk at a time.`;
    $("plan-panel").hidden = false; $("review-panel").hidden = true; $("done-panel").hidden = true;
    $("plan-panel").scrollIntoView({ behavior: "smooth", block: "start" });
  }

  function renderCard() {
    const card = cards[cardIndex];
    $("review-heading").textContent = activeDeck.title;
    $("review-progress").textContent = `Card ${cardIndex + 1} of ${cards.length}`;
    $("review-progress-bar").style.width = `${Math.round((cardIndex / cards.length) * 100)}%`;
    $("rating-progress").textContent = `Reviewed ${cardIndex} of ${cards.length} · ${ratings.got} knew it · ${ratings.some} partly remembered · ${ratings.again} to revisit`;
    $("card-topic").textContent = card.topic; $("card-question").textContent = card.question; $("card-answer").textContent = card.answer;
    $("card-answer-wrap").hidden = true; $("card-help-controls").hidden = true; $("card-help-output").hidden = true; $("card-help-output").textContent = "";
    $("self-rating").hidden = true; $("reveal-answer").hidden = false;
  }

  function renderResultsChart() {
    const chart = $("results-chart"); chart.replaceChildren();
    const categories = [{ key: "got", label: "Knew it", color: "bg-emerald-400" }, { key: "some", label: "Partly remembered", color: "bg-amber-300" }, { key: "again", label: "Needs another look", color: "bg-rose-400" }];
    chart.setAttribute("aria-label", categories.map((category) => `${category.label}: ${ratings[category.key]}`).join(". "));
    categories.forEach((category) => {
      const row = document.createElement("div"); row.className = "grid grid-cols-[9rem_minmax(0,1fr)_2rem] items-center gap-3";
      const label = document.createElement("p"); label.className = "text-xs text-zinc-400"; label.textContent = category.label;
      const track = document.createElement("div"); track.className = "h-3 overflow-hidden rounded-full bg-zinc-700";
      const bar = document.createElement("div"); bar.className = `h-full rounded-full ${category.color} transition-all`; bar.style.width = `${Math.round((ratings[category.key] / cards.length) * 100)}%`; track.append(bar);
      const count = document.createElement("p"); count.className = "text-right text-xs font-bold text-zinc-200"; count.textContent = String(ratings[category.key]);
      row.append(label, track, count); chart.append(row);
    });
  }

  function saveSession() {
    if (sessionSaved) return; sessionSaved = true;
    const record = { completedAt: new Date().toISOString(), source: activeDeck.title, attempt: attemptNumber, total: cards.length, ...ratings,
      cardResults: cardResults.map((result) => ({ ...result, answer: result.rating === "got" ? "" : result.answer })) };
    history = [record, ...readHistory()].slice(0, 50);
    try { localStorage.setItem(historyKey, JSON.stringify(history)); }
    catch { historyStorageUnavailable = true; $("history-storage").textContent = "Session results available until this page closes"; }
    renderHistory();
  }

  document.querySelectorAll("[data-mock-set]").forEach((button) => button.addEventListener("click", () => selectDeck(button.dataset.mockSet)));
  $("generate-plan").addEventListener("click", () => {
    if (!activeDeck) return;
    attemptNumber = 0; cardResults = []; sessionSaved = false; renderPlan();
  });
  $("start-review").addEventListener("click", () => {
    attemptNumber = 1; cardIndex = 0; ratings = { again: 0, some: 0, got: 0 }; cardResults = []; sessionSaved = false;
    $("plan-panel").hidden = true; $("done-panel").hidden = true; $("review-panel").hidden = false; renderCard();
    $("review-panel").scrollIntoView({ behavior: "smooth", block: "start" });
  });
  $("reveal-answer").addEventListener("click", () => {
    $("card-answer-wrap").hidden = false; $("card-help-controls").hidden = false; $("self-rating").hidden = false; $("reveal-answer").hidden = true;
  });
  $("explain-card").addEventListener("click", () => { $("card-help-output").textContent = `In easy words: ${cards[cardIndex].plain}`; $("card-help-output").hidden = false; });
  $("example-card").addEventListener("click", () => { $("card-help-output").textContent = `A real-life example: ${cards[cardIndex].example}`; $("card-help-output").hidden = false; });
  document.querySelectorAll("[data-rating]").forEach((button) => button.addEventListener("click", () => {
    const rating = button.dataset.rating; ratings[rating] += 1;
    cardResults[cardIndex] = { topic: cards[cardIndex].topic, question: cards[cardIndex].question, rating, answer: cards[cardIndex].answer };
    cardIndex += 1;
    if (cardIndex < cards.length) { renderCard(); return; }
    $("review-progress-bar").style.width = "100%"; saveSession(); renderResultsChart();
    $("rating-progress").textContent = `Reviewed all ${cards.length} cards · ${ratings.got} knew it · ${ratings.some} partly remembered · ${ratings.again} to revisit`;
    $("review-result").textContent = `You reviewed ${cards.length} cards: ${ratings.got} remembered, ${ratings.some} partly remembered, and ${ratings.again} to revisit.`;
    const canRetry = attemptNumber < 2; $("review-again").hidden = !canRetry; $("attempt-limit-note").hidden = canRetry;
    $("review-panel").hidden = true; $("done-panel").hidden = false; $("done-panel").scrollIntoView({ behavior: "smooth", block: "start" });
  }));
  $("review-again").addEventListener("click", () => {
    if (attemptNumber >= 2) return;
    attemptNumber += 1; cardIndex = 0; ratings = { again: 0, some: 0, got: 0 }; cardResults = []; sessionSaved = false;
    $("done-panel").hidden = true; $("review-panel").hidden = false; renderCard(); $("review-panel").scrollIntoView({ behavior: "smooth", block: "start" });
  });
  $("new-plan-button").addEventListener("click", () => { $("done-panel").hidden = true; $("review-panel").hidden = true; $("plan-panel").hidden = true; $("deck-panel").scrollIntoView({ behavior: "smooth", block: "start" }); });

  try {
    const requestedFlow = sessionStorage.getItem("next-step-recall-flow");
    if (requestedFlow && decks[requestedFlow]) selectDeck(requestedFlow);
    sessionStorage.removeItem("next-step-recall-flow");
    sessionStorage.removeItem("next-step-recall-seed");
  } catch { /* The user can choose a mock deck from this page. */ }
  renderHistory();
})();
