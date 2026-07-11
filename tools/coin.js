export function init() {
  var coinBtn = document.getElementById('coin-btn');
  var coinInner = coinBtn.querySelector('.coin-inner');
  var coinResult = document.getElementById('coin-result');
  var isFlipping = false;

  coinBtn.addEventListener('click', function () {
    if (isFlipping) return;
    isFlipping = true;

    var isHeads = Math.random() < 0.5;

    // Remove previous state
    coinInner.classList.remove('show-tails');
    coinInner.style.animation = 'none';
    coinInner.offsetHeight; // force reflow

    if (isHeads) {
      coinInner.style.animation = 'coinFlip 0.6s ease-in-out forwards';
    } else {
      coinInner.style.animation = 'coinFlipToTails 0.6s ease-in-out forwards';
    }

    coinResult.textContent = '';

    setTimeout(function () {
      coinInner.style.animation = '';
      coinInner.classList.toggle('show-tails', !isHeads);
      coinResult.textContent = isHeads ? 'Heads!' : 'Tails!';
      isFlipping = false;
    }, 600);
  });
}
