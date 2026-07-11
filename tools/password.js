export function init() {
  var passOutput = document.getElementById('pass-output');
  var passCopyBtn = document.getElementById('pass-copy-btn');
  var passLength = document.getElementById('pass-length');
  var passLengthVal = document.getElementById('pass-length-val');
  var passGenerateBtn = document.getElementById('pass-generate-btn');
  var passFeedback = document.getElementById('pass-feedback');

  var passUpper = document.getElementById('pass-upper');
  var passLower = document.getElementById('pass-lower');
  var passNumbers = document.getElementById('pass-numbers');
  var passSymbols = document.getElementById('pass-symbols');

  var charSets = {
    upper: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
    lower: 'abcdefghijklmnopqrstuvwxyz',
    numbers: '0123456789',
    symbols: '!@#$%^&*()_+-=[]{}|;:,.<>?'
  };

  passLength.addEventListener('input', function () {
    passLengthVal.textContent = passLength.value;
  });

  // Prevent unchecking all toggles
  var toggles = [passUpper, passLower, passNumbers, passSymbols];
  toggles.forEach(function (cb) {
    cb.addEventListener('change', function () {
      var anyChecked = toggles.some(function (t) { return t.checked; });
      if (!anyChecked) {
        cb.checked = true;
      }
    });
  });

  function generatePassword() {
    var pool = '';
    if (passUpper.checked) pool += charSets.upper;
    if (passLower.checked) pool += charSets.lower;
    if (passNumbers.checked) pool += charSets.numbers;
    if (passSymbols.checked) pool += charSets.symbols;

    if (pool.length === 0) return '';

    var len = parseInt(passLength.value, 10);
    var arr = new Uint32Array(len);
    crypto.getRandomValues(arr);

    var result = '';
    for (var i = 0; i < len; i++) {
      result += pool[arr[i] % pool.length];
    }
    return result;
  }

  passGenerateBtn.addEventListener('click', function () {
    var pw = generatePassword();
    passOutput.textContent = pw;
    passFeedback.textContent = '';
  });

  passCopyBtn.addEventListener('click', function () {
    var text = passOutput.textContent;
    if (!text || text === 'Tap Generate') return;

    navigator.clipboard.writeText(text).then(function () {
      passFeedback.textContent = 'Copied!';
      setTimeout(function () { passFeedback.textContent = ''; }, 1500);
    }).catch(function () {
      passFeedback.textContent = 'Copy failed — try selecting manually';
    });
  });
}
