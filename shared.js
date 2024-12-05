function createHTMLFromCalculations(calculations) {
  let result = "";
  calculations.forEach((element) => {
    result += element + "<br>";
  });
  return result;
}

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

function extendedGCD(a, b, calculations = []) {
  if (b === 0) {
    return { gcd: a, x: 1, y: 0 };
  }

  calculations.push(`gcd(${a}, ${b}) = gcd(${b}, ${a % b})`);
  const { gcd, x: x1, y: y1 } = extendedGCD(b, a % b, calculations);

  const x = y1; // Coefficient for a
  const y = x1 - Math.floor(a / b) * y1; // Coefficient for b

  return { gcd, x, y, calculations };
}

function getMultiplicativeInverse(a, n) {
  a = (a + n) % n;
  const { gcd, x } = extendedGCD(a, n);
  if (gcd !== 1) {
    throw new Error(
      `Обратное число не существует, так как GCD(${a}, ${n}) = ${gcd}`
    );
  }

  // x может быть отрицательным, поэтому добавляем n, чтобы получить положительный результат.
  return ((x % n) + n) % n;
}

function addEllipsePoints(point1, point2, a, p) {
  let calculations = ["-----------------------"];
  // Если одна из точек является точкой на бесконечности, возвращаем другую точку
  if (point1 === null) return { result: point2, calculations };
  if (point2 === null) return { result: point1, calculations };

  let x1 = point1.x,
    y1 = point1.y;
  let x2 = point2.x,
    y2 = point2.y;

  calculations.push(`Складываем точки (${x1}, ${y1}) и (${x2}, ${y2})`);
  // Проверка, инверсны если точки равны
  if (x1 === x2 && y1 === p - y2) {
    calculations.push("Точки инверсны");
    return { result: null, calculations: calculations }; // Нулевая точка (точка на бесконечности)
  }

  let slope;
  if (x1 === x2 && y1 === y2) {
    // Случай удвоения точки
    slope = (3 * x1 ** 2 + a) * getMultiplicativeInverse(2 * y1, p);
    calculations.push(
      `Удвоение точки L = (3 * x1 ** 2 + a) * getMultiplicativeInverse(2 * y1, p) = ${
        3 * x1 ** 2 + a
      }*${getMultiplicativeInverse(2 * y1, p)} = ${slope}`
    );
  } else {
    // Случай обычного сложения
    slope = (y2 - y1) * getMultiplicativeInverse((x2 - x1 + p) % p, p);
    calculations.push(
      `Обычное сложение L = (y2 - y1) * getMultiplicativeInverse(x2 - x1, p) = ${
        y2 - y1
      }*${getMultiplicativeInverse(x2 - x1, p)} = ${slope}`
    );
  }
  slope = slope % p;
  calculations.push(`L = ${slope}`);
  let x3 = (slope ** 2 - x1 - x2) % p;
  let y3 = (slope * (x1 - x3) - y1) % p;

  // Приводим к положительным значениям (если результат был отрицательным)
  x3 = (x3 + p) % p;
  y3 = (y3 + p) % p;

  calculations.push(
    `x3 = (slope ** 2 - x1 - x2) % p = (${slope} ** 2 - ${x1} - ${x2}) % ${p} = ${x3}`
  );
  calculations.push(
    `y3 = (slope * (x1 - x3) - y1) % p = (${slope} * (${x1} - ${x3}) - ${y1}) % ${p} = ${y3}`
  );

  return { result: { x: x3, y: y3 }, calculations: calculations };
}

function IsGroupGenerator(numElInGroup, p) {
  let calculations = [];

  calculations.push(
    `Проверяем, является ли точка генератором группы. Используя неравенство Холла: (sqrt(p)-1)^2 < |F| < (sqrt(p)+1)^2`
  );

  let sqrtP = Math.sqrt(p);
  let lowerBound = (sqrtP - 1) ** 2;
  let upperBound = (sqrtP + 1) ** 2;
  calculations.push(
    `(${sqrtP.toFixed(3)} - 1)^2 = ${lowerBound.toFixed(3)}, (${sqrtP.toFixed(
      3
    )} + 1)^2 = ${upperBound.toFixed(3)}`
  );

  return {
    calculations,
    isGenerator: numElInGroup > lowerBound && numElInGroup < upperBound,
  };
}

function ellipseMultiply(P, k, a, b, p) {
  let R = null; // Начнем с точки "на бесконечности"
  let calculations = []; // Для детализации вычислений
  calculations.push("-----------------------");
  calculations.push(`Умножаем точку (${P.x}, ${P.y}) на ${k}`);

  while (k > 0) {
    // Проверяем младший бит числа k
    if (k & 1) {
      let { result, calculations: calc } = addEllipsePoints(R, P, a, p);
      R = result; // Добавляем точку P к результату
      calculations.push(
        `Добавляем точку (${P.x}, ${P.y}) к результату (${R.x}, ${R.y})`
      );
      calculations.push(...calc);
    }

    // Удваиваем точку P
    calculations.push(`Удваиваем точку (${P.x}, ${P.y})`);
    let { result, calculations: calc } = addEllipsePoints(P, P, a, p);
    calculations.push(...calc);
    P = result;

    // Переходим к следующему биту k, сдвигая влево
    k = k >> 1;
  }
  calculations.push(`Результат умножения: (${R.x}, ${R.y})`);
  calculations.push("-----------------------");

  return { result: R, calculations };
}

function mod(a, b) {
  return ((a % b) + b) % b;
}
