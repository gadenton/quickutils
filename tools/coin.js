export function init() {
  var coinBtn = document.getElementById('coin-btn');
  var coinInner = coinBtn.querySelector('.coin-inner');
  var coinResult = document.getElementById('coin-result');
  var isFlipping = false;

  var sessionHeads = 0;
  var sessionTails = 0;

  var lifetimeHeads = parseInt(localStorage.getItem('coinLifetimeHeads') || '0', 10);
  var lifetimeTails = parseInt(localStorage.getItem('coinLifetimeTails') || '0', 10);

  function updateStats() {
    document.getElementById('session-heads').textContent = sessionHeads;
    document.getElementById('session-tails').textContent = sessionTails;
    document.getElementById('session-total').textContent = sessionHeads + sessionTails;

    document.getElementById('lifetime-heads').textContent = lifetimeHeads;
    document.getElementById('lifetime-tails').textContent = lifetimeTails;
    document.getElementById('lifetime-total').textContent = lifetimeHeads + lifetimeTails;
  }

  // Initial update
  updateStats();

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

      if (isHeads) {
        sessionHeads++;
        lifetimeHeads++;
      } else {
        sessionTails++;
        lifetimeTails++;
      }

      localStorage.setItem('coinLifetimeHeads', lifetimeHeads.toString());
      localStorage.setItem('coinLifetimeTails', lifetimeTails.toString());

      updateStats();

      isFlipping = false;
    }, 600);
  });
}
