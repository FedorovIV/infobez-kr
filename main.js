const encryptRSA = document.querySelector("#encryptRSA");
encryptRSA.querySelector(".getResult").onclick = (event) => {
  event.preventDefault();
  let n = encryptRSA.querySelector("#encryptRSA-n").value;
  let e = encryptRSA.querySelector("#encryptRSA-e").value;
  let m = encryptRSA.querySelector("#encryptRSA-m").value;

  if (!(n && e && m)) alert("Введите все значения");

  let { result, calculations } = modularExponentiation(m, e, n);

  encryptRSA.querySelector(".result").querySelector("span").textContent =
    result;
  encryptRSA.querySelector(".solution").innerHTML =
    createHTMLFromCalculations(calculations);
};

const signRSA = document.querySelector("#signRSA");
signRSA.querySelector(".getResult").onclick = (event) => {
  event.preventDefault();
  let n = signRSA.querySelector("#signRSA-n").value;
  let d = signRSA.querySelector("#signRSA-d").value;
  let m = signRSA.querySelector("#signRSA-m").value;

  if (!(n && d && m)) alert("Введите все значения");

  let { result, calculations } = modularExponentiation(m, d, n);

  signRSA.querySelector(".result").querySelector("span").textContent = result;
  signRSA.querySelector(".solution").innerHTML =
    createHTMLFromCalculations(calculations);
};

const decryptRSA = document.querySelector("#decryptRSA");
decryptRSA.querySelector(".getResult").onclick = (event) => {
  event.preventDefault();
  let n = decryptRSA.querySelector("#decryptRSA-n").value;
  let e = decryptRSA.querySelector("#decryptRSA-e").value;
  let c = decryptRSA.querySelector("#decryptRSA-c").value;

  if (!(n && e && c)) alert("Введите все значения");

  let solutionHTML = "";
  //Раскладываем n на два простых числа
  let { p, q } = getPrimeDivisors(n);
  solutionHTML += `Раскладываем n на два простых числа p, q:${p}, ${q}<br>`;

  //Вычисляем значение функции Эйлера
  let eilerFunc = (p - 1) * (q - 1);
  solutionHTML += `Значение функции Эйлера phi = (p-1)(q-1):${eilerFunc}<br>`;

  //Вычисляем секретную экспоненту
  let d = getMultiplicativeInverse(e, eilerFunc);
  solutionHTML += `Секретная экспонента d (d*e=1 mod (phi)):${d}<br>`;

  //Расшифруем значение с помощью закрытого ключа
  let {result, calculations} = modularExponentiation(c, d, n);
  solutionHTML += `m = c<sup>d</sup><i>mod</i>n = ${result} <br>`;
  solutionHTML += createHTMLFromCalculations(calculations);
  decryptRSA.querySelector(".result").querySelector("span").textContent = result;
  decryptRSA.querySelector(".solution").innerHTML = solutionHTML;
};

function createHTMLFromCalculations(calculations) {
  let result = "";
  calculations.forEach((element) => {
    result += element + "<br>";
  });
  return result;
}

function modularExponentiation(base, exponent, mod) {
  let result = 1;
  let calculations = [];
  base = base % mod;

  while (exponent > 0) {
    calculations.push(`exponent:${exponent}, base:${base}, result:${result}`);
    // Если exponent нечетный, умножаем результат на base
    if (exponent % 2 === 1) {
      result = (result * base) % mod;
    }
    // exponent становится четным
    exponent = Math.floor(exponent / 2);
    // Умножаем base на себя
    base = (base * base) % mod;
  }
  calculations.push(`exponent:${exponent}, base:${base}, result:${result}`);

  return { result, calculations };
}

function getPrimeDivisors(n) {
  for (let i = 2; i < n; i++) {
    if (n % i === 0) {
      let p = i,
        q = n / i;
      return { p, q };
    }
  }
}

function getMultiplicativeInverse() {}

function extendedGCD(a, b) {
  if (b === 0) {
    return { gcd: a, x: 1, y: 0 };
  }

  const { gcd, x: x1, y: y1 } = extendedGCD(b, a % b);

  const x = y1; // Coefficient for a
  const y = x1 - Math.floor(a / b) * y1; // Coefficient for b

  return { gcd, x, y };
}

function getMultiplicativeInverse(a, n) {
  const { gcd, x } = extendedGCD(a, n);
  if (gcd !== 1) {
    throw new Error(
      `Обратное число не существует, так как GCD(${a}, ${n}) = ${gcd}`
    );
  }

  // x может быть отрицательным, поэтому добавляем n, чтобы получить положительный результат.
  return ((x % n) + n) % n;
}
