let snowflakesCount = 200,
  baseCSS = "";
"undefined" != typeof SNOWFLAKES_COUNT && (snowflakesCount = SNOWFLAKES_COUNT),
  "undefined" != typeof BASE_CSS && (baseCSS = BASE_CSS);
let bodyHeightPx = null,
  pageHeightVh = null;
function setHeightVariables() {
  (bodyHeightPx = document.body.offsetHeight),
    (pageHeightVh = (100 * bodyHeightPx) / window.innerHeight);
}
function getSnowAttributes() {
  const e = document.getElementById("snow");
  snowflakesCount = Number(e?.dataset?.count || snowflakesCount);
}
function showSnow(e) {
  document.getElementById("snow").style.display = e ? "block" : "none";
}
function generateSnow(e = 200) {
  e -= 1;
  const n = document.getElementById("snow");
  n.innerHTML = "";
  for (let t = 0; t < e; t++) {
    let e = document.createElement("div");
    (e.className = "snowflake"), n.appendChild(e);
  }
}
function getOrCreateCSSElement() {
  let e = document.getElementById("psjs-css");
  return (
    e ||
    ((e = document.createElement("style")),
    (e.id = "psjs-css"),
    document.head.appendChild(e),
    e)
  );
}
function addCSS(e) {
  const n = getOrCreateCSSElement();
  (n.innerHTML = e), document.head.appendChild(n);
}
function randomInt(e = 100) {
  return Math.floor(Math.random() * e) + 1;
}
function randomIntRange(e, n) {
  return (
    (e = Math.ceil(e)),
    (n = Math.floor(n)),
    Math.floor(Math.random() * (n - e + 1)) + e
  );
}
function getRandomArbitrary(e, n) {
  return Math.random() * (n - e) + e;
}
function generateSnowCSS(e = 200) {
  let n = baseCSS;
  for (let t = 1; t < e; t++) {
    let e = 100 * Math.random(),
      o = 10 * Math.random(),
      a = e + o,
      r = e + o / 2,
      s = getRandomArbitrary(0.3, 0.8),
      d = s * pageHeightVh,
      l = Math.random(),
      i = randomIntRange(10, (pageHeightVh / 10) * 3),
      h = -1 * randomInt((pageHeightVh / 10) * 3);
    n += `\n      .snowflake:nth-child(${t}) {\n        opacity: ${Math.random()};\n        transform: translate(${e}vw, -10px) scale(${l});\n        animation: fall-${t} ${i}s ${h}s linear infinite;\n      }\n      @keyframes fall-${t} {\n        ${
      100 * s
    }% {\n          transform: translate(${a}vw, ${d}vh) scale(${l});\n        }\n        to {\n          transform: translate(${r}vw, ${pageHeightVh}vh) scale(${l});\n        }\n      }\n    `;
  }
  addCSS(n);
}
function createSnow() {
  setHeightVariables(),
    getSnowAttributes(),
    generateSnowCSS(snowflakesCount),
    generateSnow(snowflakesCount);
}
window.addEventListener("resize", createSnow),
  "undefined" != typeof module
    ? (module.exports = { createSnow: createSnow, showSnow: showSnow })
    : (window.onload = createSnow);
