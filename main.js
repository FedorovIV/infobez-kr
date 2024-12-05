const encryptRSA = document.querySelector("#encryptRSA");
encryptRSA.querySelector(".getResult").onclick = (event) => {
  event.preventDefault();
  let n = +encryptRSA.querySelector("#encryptRSA-n").value;
  let e = +encryptRSA.querySelector("#encryptRSA-e").value;
  let m = +encryptRSA.querySelector("#encryptRSA-m").value;

  if (!(n && e && m)) {
    alert("Введите все значения");
    return;
  }

  let { result, calculations } = modularExponentiation(m, e, n);

  encryptRSA.querySelector(".result").querySelector("span").textContent =
    result;
  encryptRSA.querySelector(".solution").innerHTML =
    createHTMLFromCalculations(calculations);
};

const signRSA = document.querySelector("#signRSA");
signRSA.querySelector(".getResult").onclick = (event) => {
  event.preventDefault();
  let n = +signRSA.querySelector("#signRSA-n").value;
  let d = +signRSA.querySelector("#signRSA-d").value;
  let m = +signRSA.querySelector("#signRSA-m").value;

  if (!(n && d && m)) {
    alert("Введите все значения");
    return;
  }

  let { result, calculations } = modularExponentiation(m, d, n);

  signRSA.querySelector(".result").querySelector("span").textContent = result;
  signRSA.querySelector(".solution").innerHTML =
    createHTMLFromCalculations(calculations);
};

const decryptRSA = document.querySelector("#decryptRSA");
decryptRSA.querySelector(".getResult").onclick = (event) => {
  event.preventDefault();
  let n = +decryptRSA.querySelector("#decryptRSA-n").value;
  let e = +decryptRSA.querySelector("#decryptRSA-e").value;
  let c = +decryptRSA.querySelector("#decryptRSA-c").value;

  if (!(n && e && c)) {
    alert("Введите все значения");
    return;
  }
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

const encryptElGamal = document.querySelector("#encryptElGamal");
encryptElGamal.querySelector(".getResult").onclick = (event) => {
  event.preventDefault();
  let p = +encryptElGamal.querySelector("#encryptElGamal-p").value;
  let g = +encryptElGamal.querySelector("#encryptElGamal-g").value;
  let y = +encryptElGamal.querySelector("#encryptElGamal-y").value;
  let k = +encryptElGamal.querySelector("#encryptElGamal-k").value;
  let m = +encryptElGamal.querySelector("#encryptElGamal-m").value;

  if (!(p && g && y && k && m)) {
    alert("Введите все значения");
    return;
  }
  let solutionHTML = "";

  //Ищем a
  let {result:a, calculations:calculationsA} = modularExponentiation(g,k,p);
  solutionHTML += `a = g<sup>k</sup><i>mod</i>p<br>`
  solutionHTML += createHTMLFromCalculations(calculationsA);
  solutionHTML += `a = ${a}<br>`
  //Ищем b
  solutionHTML += `b = y<sup>k</sup>*M<i>mod</i>p<br>`
  let {result:firstPartB, calculations:calculationsB} = modularExponentiation(y,k,p);
  solutionHTML += 'Сначала найдём y<sup>k</sup><i>mod</i>p<br>'
  solutionHTML += createHTMLFromCalculations(calculationsB);
  let b = (firstPartB * m) % p;
  solutionHTML += `b = ${firstPartB}*${m}mod${p} = ${b}`

  encryptElGamal.querySelector(".result").querySelector("span").textContent = `a = ${a} b = ${b}`;
  encryptElGamal.querySelector(".solution").innerHTML = solutionHTML;
};

const signElGamal = document.querySelector("#signElGamal");
signElGamal.querySelector(".getResult").onclick = (event) => {
  event.preventDefault();
  let p = +signElGamal.querySelector("#signElGamal-p").value;
  let g = +signElGamal.querySelector("#signElGamal-g").value;
  let y = +signElGamal.querySelector("#signElGamal-y").value;
  let k = +signElGamal.querySelector("#signElGamal-k").value;
  let x = +signElGamal.querySelector("#signElGamal-x").value;
  let m = +signElGamal.querySelector("#signElGamal-m").value;

  if (!(p && g && y && k && x && m)) {
    alert("Введите все значения");
    return;
  }

  let solutionHTML = "";

  //Ищем a
  let {result:a, calculations:calculationsA} = modularExponentiation(g,k,p);
  solutionHTML += `a = g<sup>k</sup><i>mod</i>p<br>`
  solutionHTML += createHTMLFromCalculations(calculationsA);
  solutionHTML += `a = ${a}<br>`

  //Ищем b
  solutionHTML += `b = (m-xa)*k<sup>-1</sup><i>mod</i>(p-1)<br>`
  let inverseK = getMultiplicativeInverse(k, p-1)
  solutionHTML += `(m-xa)*k<sup>-1</sup><i>mod</i>(p-1) = ${m-x*a}*k<sup>-1</sup><i>mod</i>(p-1)<br>`
  solutionHTML += `k<sup>-1</sup><i>mod</i>(p-1) = ${inverseK}<br>`;
  let firstPartB = (m-x*a)*inverseK;
  solutionHTML+= `(m-x*a)*k<sup>-1</sup>=${firstPartB}<br>`;

  let b = ((firstPartB % (p-1)) + (p-1)) % (p-1);
  solutionHTML+= `${firstPartB}<i>mod</i>(p-1)=${b}<br>`;
  solutionHTML+= `b = ${b}<br>`;


  signElGamal.querySelector(".result").querySelector("span").textContent = `a = ${a} b = ${b}`;
  signElGamal.querySelector(".solution").innerHTML = solutionHTML;
};



const modularExp = document.querySelector("#modularExp");
modularExp.querySelector(".getResult").onclick = (event) => {
  event.preventDefault();
  let base = +modularExp.querySelector("#modularExp-base").value;
  let exponent = +modularExp.querySelector("#modularExp-exponent").value;
  let mod = +modularExp.querySelector("#modularExp-mod").value;

  
  if (!(base && exponent && mod)) {
    alert("Введите все значения");
    return;
  }


  let result, solutionHTML; 

  if (exponent == -1){
    console.log('pencil')
    result = getMultiplicativeInverse(base, mod);
  } else {
    plusEx = modularExponentiation(base, exponent, mod);
    result = plusEx.result;
    solutionHTML = createHTMLFromCalculations(plusEx.calculations);
  }


  modularExp.querySelector(".result").querySelector("span").textContent = result;
  modularExp.querySelector(".solution").innerHTML = solutionHTML ?? '';
};


