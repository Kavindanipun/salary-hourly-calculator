
(() => {
  const money = new Intl.NumberFormat('en-AU', {
    style: 'currency', currency: 'AUD', maximumFractionDigits: 2
  });

  const $ = (id) => document.getElementById(id);
  const annualTab = $('annualTab');
  const hourlyTab = $('hourlyTab');
  const amountLabel = $('amountLabel');
  const amountHelp = $('amountHelp');
  const amountInput = $('amount');
  const primaryLabel = $('primaryLabel');
  const primaryResult = $('primaryResult');

  if (!amountInput) return;

  let mode = document.body.dataset.calcMode || 'annual';

  function safeNumber(value, fallback) {
    const n = Number(value);
    return Number.isFinite(n) && n > 0 ? n : fallback;
  }

  function setMode(nextMode) {
    mode = nextMode;
    document.body.dataset.calcMode = mode;
    const annual = mode === 'annual';
    annualTab.setAttribute('aria-selected', annual ? 'true' : 'false');
    hourlyTab.setAttribute('aria-selected', annual ? 'false' : 'true');
    amountLabel.textContent = annual ? 'Annual salary (AUD)' : 'Hourly rate (AUD)';
    amountHelp.textContent = annual ? 'Enter your gross annual salary before tax.' : 'Enter your gross hourly rate before tax.';
    primaryLabel.textContent = annual ? 'Estimated hourly rate' : 'Estimated annual salary';

    if (annual && Number(amountInput.value) < 1000) amountInput.value = 80000;
    if (!annual && Number(amountInput.value) > 1000) amountInput.value = 40;
    calculate();
  }

  function calculate() {
    const amount = safeNumber(amountInput.value, mode === 'annual' ? 80000 : 40);
    const hours = safeNumber($('hoursPerWeek').value, 38);
    const weeks = safeNumber($('weeksPerYear').value, 52);
    const days = safeNumber($('daysPerWeek').value, 5);

    const annual = mode === 'annual' ? amount : amount * hours * weeks;
    const hourly = mode === 'annual' ? amount / (hours * weeks) : amount;
    const weekly = annual / weeks;
    const fortnightly = weekly * 2;
    const monthly = annual / 12;
    const daily = weekly / days;

    primaryResult.textContent = money.format(mode === 'annual' ? hourly : annual);
    $('hourlyResult').textContent = money.format(hourly);
    $('dailyResult').textContent = money.format(daily);
    $('weeklyResult').textContent = money.format(weekly);
    $('fortnightlyResult').textContent = money.format(fortnightly);
    $('monthlyResult').textContent = money.format(monthly);
    $('annualResult').textContent = money.format(annual);
  }

  annualTab?.addEventListener('click', () => setMode('annual'));
  hourlyTab?.addEventListener('click', () => setMode('hourly'));
  ['amount','hoursPerWeek','weeksPerYear','daysPerWeek'].forEach(id => $(id)?.addEventListener('input', calculate));

  setMode(mode);
})();
