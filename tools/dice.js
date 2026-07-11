export function init() {
  var diceTypeRow = document.getElementById('dice-type-row');
  var diceCountRow = document.getElementById('dice-count-row');
  var diceRollBtn = document.getElementById('dice-roll-btn');
  var diceResults = document.getElementById('dice-results');
  var diceSum = document.getElementById('dice-sum');
  var diceSides = 4;
  var diceCount = 1;

  function setupSegRow(row, callback) {
    row.addEventListener('click', function (e) {
      var btn = e.target.closest('.seg-btn');
      if (!btn) return;
      row.querySelector('.active').classList.remove('active');
      btn.classList.add('active');
      callback(btn);
    });
  }

  setupSegRow(diceTypeRow, function (btn) {
    diceSides = parseInt(btn.dataset.sides, 10);
  });

  setupSegRow(diceCountRow, function (btn) {
    diceCount = parseInt(btn.dataset.count, 10);
  });

  diceRollBtn.addEventListener('click', function () {
    var rolls = [];
    for (var i = 0; i < diceCount; i++) {
      rolls.push(Math.floor(Math.random() * diceSides) + 1);
    }

    diceResults.innerHTML = '';
    rolls.forEach(function (val, idx) {
      var el = document.createElement('div');
      el.className = 'die-result';
      el.textContent = val;
      el.style.animationDelay = (idx * 0.08) + 's';
      diceResults.appendChild(el);
    });

    var total = rolls.reduce(function (a, b) { return a + b; }, 0);
    diceSum.textContent = diceCount > 1 ? 'Total: ' + total : '';
  });
}
