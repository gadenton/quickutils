export function init() {
  var numMin = document.getElementById('num-min');
  var numMax = document.getElementById('num-max');
  var numGenerateBtn = document.getElementById('num-generate-btn');
  var numResult = document.getElementById('num-result');

  numGenerateBtn.addEventListener('click', function () {
    var min = parseInt(numMin.value, 10);
    var max = parseInt(numMax.value, 10);

    if (isNaN(min) || isNaN(max)) {
      numResult.textContent = '?';
      return;
    }

    if (min > max) {
      var temp = min;
      min = max;
      max = temp;
      numMin.value = min;
      numMax.value = max;
    }

    var result = Math.floor(Math.random() * (max - min + 1)) + min;

    // Re-trigger animation
    numResult.classList.remove('pop');
    numResult.offsetHeight;
    numResult.classList.add('pop');
    numResult.textContent = result;
  });
}
