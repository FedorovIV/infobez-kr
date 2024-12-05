const checkPointForGroup = document.querySelector("#checkPointForGroup");
checkPointForGroup.querySelector(".getResult").onclick = (event) => {
  event.preventDefault();

  // Собираем данные из формы и преобразуем в числа
  let x = +checkPointForGroup.querySelector("#checkPointForGroup-x").value;
  let y = +checkPointForGroup.querySelector("#checkPointForGroup-y").value;
  let a = +checkPointForGroup.querySelector("#checkPointForGroup-a").value;
  let b = +checkPointForGroup.querySelector("#checkPointForGroup-b").value;
  let p = +checkPointForGroup.querySelector("#checkPointForGroup-p").value;

  if (!(x && y && a && b && p)) {
    alert("Введите все значения");
    return;
  }

  // Изначальная настройка
  let G = { x, y };
  let sum = G;
  let order = 1; // Считаем начальный порядок точки
  let allCalculations = [];
  let resultText = [];
  while (sum !== null) {
    order++; // Увеличиваем порядок при каждом новом сложении

    allCalculations.push(`Вычисляем ${order}G`);
    let { result, calculations } = addEllipsePoints(sum, G, a, p);
    resultText.push(
      `${order}G = ${result === null ? "O" : `(${result.x}, ${result.y})`}`
    );

    // Добавляем вывод вычислений
    allCalculations.push(...calculations);

    // Если результат сложения — точка на бесконечности, значит, нашли порядок точки
    if (result === null) {
      break;
    }

    // Обновляем "сумму"
    sum = result;
  }

  let { isGenerator, calculations } = IsGroupGenerator(order, p);
  resultText.push(
    `Точка G является ${isGenerator ? "" : "не"} генератором группы`
  );

  allCalculations.push(...calculations);
  // Выводим результат на страницу
  console.log(checkPointForGroup);
  checkPointForGroup.querySelector(".result").innerHTML =
    createHTMLFromCalculations(resultText);
  checkPointForGroup.querySelector(".solution").innerHTML =
    createHTMLFromCalculations(allCalculations);
};

const gost = document.querySelector("#gost");
gost.querySelector(".getResult").onclick = (event) => {
  event.preventDefault();

  // Собираем данные из формы и преобразуем в числа
  let m = +gost.querySelector("#gost-m").value;
  let a = +gost.querySelector("#gost-a").value;
  let b = +gost.querySelector("#gost-b").value;
  let p = +gost.querySelector("#gost-p").value;
  let x = +gost.querySelector("#gost-x").value;
  let y = +gost.querySelector("#gost-y").value;
  let n = +gost.querySelector("#gost-n").value;
  let u = +gost.querySelector("#gost-u").value;
  let v = +gost.querySelector("#gost-v").value;
  let k = +gost.querySelector("#gost-k").value;

  if (!(a && b && p && x && y && n && u && v && k)) {
    alert("Введите все значения");
    return;
  }

  let allCalculations = [];
  let resultText = [];

  //Ищем d перебором
  let G = { x, y };
  let sum = G;
  let order = 1;
  while (sum.x !== u || sum.y !== v) {
    order++;
    let { result, calculations } = addEllipsePoints(sum, G, a, p);
    if (result === null) {
      break;
    }
    sum = result;
    allCalculations.push(...calculations);
    allCalculations.push(
      `${order}G = ${result === null ? "O" : `(${result.x}, ${result.y})`}`
    );
  }

  let d = order; //d - закрытый ключ
  resultText.push(`Секретный ключ d = ${d}`);

  let { result: C, calculations: cCalc } = ellipseMultiply(G, k, a, b, p);
  allCalculations.push(...cCalc);
  resultText.push(`C = ${C.x} ${C.y}`);

  let r = mod(C.x, n);
  allCalculations.push(`r = C.x mod n = ${C.x} mod ${n} = ${r}`);
  if (r === 0) {
    alert("r = 0. Генерация случайного k и повтор.");
    return;
  }

  let e = mod(m, n);
  let s = mod(r * d + k * e, n);
  allCalculations.push(
    `s = (r*d + k*e) % n = ${r}*${d} + ${k}*${e}  % n = ${s}`
  );
  if (s === 0) {
    alert("s = 0. Генерация случайного k и повтор.");
    return;
  }

  resultText.push(`Электронная подпись: (r, s) = (${r}, ${s})`);

  // Выводим результат на страницу
  console.log(checkPointForGroup);
  gost.querySelector(".result").innerHTML =
    createHTMLFromCalculations(resultText);
  gost.querySelector(".solution").innerHTML =
    createHTMLFromCalculations(allCalculations);
};

const addEllPoints = document.querySelector("#addEllPoints");
addEllPoints.querySelector(".getResult").onclick = (event) => {
  event.preventDefault();

  // Собираем данные из формы и преобразуем в числа
  let a = +addEllPoints.querySelector("#addEllPoints-a").value;
  let b = +addEllPoints.querySelector("#addEllPoints-b").value;
  let x1 = +addEllPoints.querySelector("#addEllPoints-x1").value;
  let y1 = +addEllPoints.querySelector("#addEllPoints-y1").value;
  let x2 = +addEllPoints.querySelector("#addEllPoints-x2").value;
  let y2 = +addEllPoints.querySelector("#addEllPoints-y2").value;
  let p = +addEllPoints.querySelector("#addEllPoints-p").value;

  if (!(a && b && x1 && y1 && x2 && y2)) {
    alert("Введите все значения");
    return;
  }

  let point1 = { x: x1, y: y1 };
  let point2 = { x: x2, y: y2 };
  let { result, calculations } = addEllipsePoints(point1, point2, a, p);

  // Выводим результат на страницу
  console.log(checkPointForGroup);
  addEllPoints.querySelector(".result").innerHTML = createHTMLFromCalculations([
    `({${x1}, ${y1}}) + ({${x2}, ${y2}}) = ${
      result === null ? "O" : `(${result.x}, ${result.y})`
    }`,
  ]);
  Я;
  addEllPoints.querySelector(".solution").innerHTML =
    createHTMLFromCalculations(calculations);
};

const secretDiffiMulti = document.querySelector("#secretDiffiMul");
secretDiffiMulti.querySelector(".getResult").onclick = (event) => {
  event.preventDefault();

  // Собираем данные из формы и преобразуем в числа
  let g = +secretDiffiMulti.querySelector("#secretDiffiMul-g").value;
  let p = +secretDiffiMulti.querySelector("#secretDiffiMul-p").value;
  let a = +secretDiffiMulti.querySelector("#secretDiffiMul-a").value;
  let b = +secretDiffiMulti.querySelector("#secretDiffiMul-b").value;

  if (!(g && p && a && b)) {
    alert("Введите все значения");
    return;
  }

  let allCalculations = [];
  let resultText = [];

  allCalculations.push(`Найдём закрытый ключ Алисы`);
  allCalculations.push(`Перебором находим число x, при котором g^x mod p = a`);

  let x = 1;
  let gx = mod(g, p);

  while (gx !== a) {
    x++;
    let modExp = modularExponentiation(g, x, p);
    gx = modExp.result;
    allCalculations.push(...modExp.calculations);
    allCalculations.push(`g^${x} mod p = ${gx}`);
  }

  resultText.push(`Закрытый ключ Алисы x = ${x}`);
  let modExp = modularExponentiation(b, x, p);
  resultText.push(`Cеансовый ключ = b^x mod p = ${modExp.result}`);
  allCalculations.push(`Cеансовый ключ = b^x mod p = ${modExp.result}`);
  allCalculations.push(...modExp.calculations);

  // Выводим результат на страницу
  console.log(checkPointForGroup);
  secretDiffiMulti.querySelector(".result").innerHTML =
    createHTMLFromCalculations(resultText);
  secretDiffiMulti.querySelector(".solution").innerHTML =
    createHTMLFromCalculations(allCalculations);
};

const secretDiffiEllipse = document.querySelector("#secretDiffiEllipse");
secretDiffiEllipse.querySelector(".getResult").onclick = (event) => {
  event.preventDefault();

  // Собираем данные из формы и преобразуем в числа
  let a = +secretDiffiEllipse.querySelector("#secretDiffiEllipse-a").value;
  let b = +secretDiffiEllipse.querySelector("#secretDiffiEllipse-b").value;
  let u = +secretDiffiEllipse.querySelector("#secretDiffiEllipse-u").value;
  let v = +secretDiffiEllipse.querySelector("#secretDiffiEllipse-v").value;
  let x = +secretDiffiEllipse.querySelector("#secretDiffiEllipse-x").value;
  let y = +secretDiffiEllipse.querySelector("#secretDiffiEllipse-y").value;
  let p = +secretDiffiEllipse.querySelector("#secretDiffiEllipse-p").value;

  if (!(a && b && u && v && x && y && p)) {
    alert("Введите все значения");
    return;
  }

  let allCalculations = [];
  let resultText = [];

  let G = { x, y };
  let k = a * b;
  allCalculations.push(`S = (a*b)G = ${k}G`);
  let { result: S, calculations } = ellipseMultiply(G, k, u, v, p);

  allCalculations.push(...calculations);
  allCalculations.push(`S = (${S.x}, ${S.y})`);
  resultText.push(`S = (${S.x}, ${S.y})`);

  // Выводим результат на страницу
  console.log(checkPointForGroup);
  secretDiffiEllipse.querySelector(".result").innerHTML =
    createHTMLFromCalculations(resultText);
  secretDiffiEllipse.querySelector(".solution").innerHTML =
    createHTMLFromCalculations(allCalculations);
};
