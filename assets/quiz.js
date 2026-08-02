/* REÚ Product Recommendation Quiz — non-medical, privacy-safe, no data stored by default. */
(function () {
  'use strict';
  var root = document.querySelector('[data-quiz]');
  if (!root) return;

  var steps = Array.prototype.slice.call(root.querySelectorAll('.quiz__step'));
  var progress = root.querySelector('[data-quiz-progress]');
  var progressLabel = root.querySelector('[data-quiz-progress-label]');
  var btnBack = root.querySelector('[data-quiz-back]');
  var btnNext = root.querySelector('[data-quiz-next]');
  var safetyBox = root.querySelector('[data-quiz-safety]');
  var resultStep = root.querySelector('[data-quiz-result]');
  var current = 0;
  var total = steps.length; // includes result step as last

  function questionSteps() { return steps.filter(function (s) { return !s.hasAttribute('data-quiz-result'); }); }

  function show(i) {
    steps.forEach(function (s, idx) { s.classList.toggle('is-active', idx === i); });
    current = i;
    var qCount = questionSteps().length;
    var pct = Math.min(100, Math.round(((Math.min(i, qCount)) / qCount) * 100));
    if (progress) progress.style.width = pct + '%';
    if (progressLabel) progressLabel.textContent = i < qCount ? ('Question ' + (i + 1) + ' of ' + qCount) : 'Your result';
    if (btnBack) btnBack.disabled = i === 0;
    var onResult = steps[i].hasAttribute('data-quiz-result');
    if (btnNext) btnNext.hidden = onResult;
    // focus management
    var focusTarget = steps[i].querySelector('input, button, a, h2, [tabindex]');
    if (focusTarget) { try { focusTarget.focus({ preventScroll: true }); } catch (e) {} }
    root.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  function stepAnswered(step) {
    var inputs = step.querySelectorAll('input[type="radio"], input[type="checkbox"]');
    if (inputs.length === 0) return true;
    // radio-required steps need a selection; checkbox (safety) is optional
    var isCheckbox = inputs[0].type === 'checkbox';
    if (isCheckbox) return true;
    return Array.prototype.some.call(inputs, function (i) { return i.checked; });
  }

  function updateSafety() {
    if (!safetyBox) return;
    var flagged = root.querySelector('input[data-safety]:checked');
    safetyBox.hidden = !flagged;
  }

  function tally() {
    var scores = {};
    root.querySelectorAll('input[data-goal]:checked').forEach(function (input) {
      var g = input.getAttribute('data-goal');
      var w = parseInt(input.getAttribute('data-weight') || '1', 10);
      scores[g] = (scores[g] || 0) + w;
    });
    var best = null, bestScore = -1;
    Object.keys(scores).forEach(function (g) { if (scores[g] > bestScore) { bestScore = scores[g]; best = g; } });
    return best;
  }

  function renderResult() {
    var goal = tally();
    var flavour = (root.querySelector('input[data-flavour]:checked') || {}).value || '';
    var blocks = resultStep.querySelectorAll('[data-result-goal]');
    var shown = false;
    blocks.forEach(function (b) {
      var match = b.getAttribute('data-result-goal') === goal;
      b.hidden = !match;
      if (match) shown = true;
    });
    var fallback = resultStep.querySelector('[data-result-fallback]');
    if (fallback) fallback.hidden = shown;
    var flavourNote = resultStep.querySelector('[data-flavour-note]');
    if (flavourNote) {
      if (flavour && flavour.toLowerCase() !== 'surprise me') { flavourNote.hidden = false; flavourNote.querySelector('[data-flavour-value]').textContent = flavour; }
      else { flavourNote.hidden = true; }
    }
  }

  root.addEventListener('change', function (e) {
    if (e.target.matches('input[data-safety]')) updateSafety();
    // auto-enable next when a radio is chosen
    if (btnNext) btnNext.disabled = !stepAnswered(steps[current]);
  });

  if (btnNext) btnNext.addEventListener('click', function () {
    if (!stepAnswered(steps[current])) return;
    var next = current + 1;
    if (steps[next] && steps[next].hasAttribute('data-quiz-result')) { renderResult(); }
    show(next);
  });
  if (btnBack) btnBack.addEventListener('click', function () { if (current > 0) show(current - 1); });

  var restart = root.querySelector('[data-quiz-restart]');
  if (restart) restart.addEventListener('click', function (e) {
    e.preventDefault();
    root.querySelectorAll('input').forEach(function (i) { i.checked = false; });
    updateSafety();
    show(0);
  });

  // init: hide the noscript-only fallback list, show interactive quiz
  var interactive = root.querySelector('[data-quiz-interactive]');
  if (interactive) interactive.hidden = false;
  var nojs = root.querySelector('[data-quiz-nojs]');
  if (nojs) nojs.hidden = true;

  show(0);
  if (btnNext) btnNext.disabled = !stepAnswered(steps[0]);
})();
