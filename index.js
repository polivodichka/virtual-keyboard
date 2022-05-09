/******/ (function() { // webpackBootstrap
/******/ 	"use strict";
var __webpack_exports__ = {};



const link = document.createElement('link');
link.rel = 'icon';
link.href = 'assets/keyboard-key.png';
document.head.appendChild(link);

const preloader = document.createElement('div');
preloader.className = 'preloader';
document.body.append(preloader);

const preloaderPhrase = 'virtual keyboard';

for (let i = 0; i < preloaderPhrase.length; i += 1) {
  const spanPreloader = document.createElement('span');
  spanPreloader.className = `let${i + 1}`;
  spanPreloader.innerHTML = preloaderPhrase[i];

  preloader.append(spanPreloader);
}

window.addEventListener('load', () => {
  setTimeout(() => {
    document.body.classList.add('loaded_hiding');
    window.setTimeout(() => {
      document.body.classList.add('loaded');
      document.body.classList.remove('loaded_hiding');
    }, 300);
  }, 2300);
});

const shiftLeft = 'ShiftLeft';
const shiftRight = 'ShiftRight';

let activeLang = localStorage.getItem('lang') ? localStorage.getItem('lang') : 'ru';
localStorage.setItem('lang', activeLang);

const textarea = document.createElement('textarea');
textarea.cols = 91;
textarea.rows = 10;
textarea.wrap = '\n';
document.body.append(textarea);
setInterval(() => {
  textarea.focus();
}, 0);

const keyboard = document.createElement('div');
keyboard.className = 'keyboard';
document.body.append(keyboard);

let capsPressed = false;

const currentKeyboard = {};
let keysOnPage;

const apiUrl = 'https://api.unsplash.com/photos/random?query=spring&client_id=SalW8Y5HtJH8L9YTCULQjYNAchb4gPcj97rwz4yTgYM&orientation=landscape';

async function getBgImage() {
  try {
    const res = await fetch(apiUrl);
    const data = await res.json();
    document.body.style.backgroundImage = `url(${data.urls.raw})`;
  } catch {
    document.body.style.backgroundImage = 'url(\'../assets/images/aaron-burden-uyJ-osS2YQI-unsplash.jpg\')';
  }
}
getBgImage();

async function getData() {
  const keyboardData = 'assets/keyboard.json';
  const res = await fetch(keyboardData);
  const data = await res.json();

  return data;
}

// fill current info about keys and add them on page if it necessary
// reusable function
function changeCurrentKeyboard(language, shift = false) {
  getData().then((result) => {
    result[language].forEach((key) => {
      if (!document.getElementById(key.eventCode)) {
        const newKey = document.createElement('div');
        newKey.className = key.type;
        newKey.id = key.eventCode;
        newKey.innerHTML = key.character;

        keyboard.append(newKey);

        newKey.addEventListener('mousedown', () => {
          if (newKey.id === shiftLeft || newKey.id === shiftRight) textarea.dispatchEvent(new KeyboardEvent('keydown', { key: currentKeyboard[newKey.id].character, code: newKey.id, shiftKey: true }));
          else if (currentKeyboard[newKey.id].type === 'functional' || currentKeyboard[newKey.id].type === 'spacing') textarea.dispatchEvent(new KeyboardEvent('keydown', { key: currentKeyboard[newKey.id].character, code: newKey.id }));
          else textarea.dispatchEvent(new KeyboardEvent('keydown', { code: newKey.id }));
        });
        newKey.addEventListener('mouseup', () => {
          if (newKey.id === shiftLeft || shiftRight) textarea.dispatchEvent(new KeyboardEvent('keyup', { key: 'Shift', code: newKey.id, shiftKey: false }));
          else if (currentKeyboard[newKey.id].type === 'functional') textarea.dispatchEvent(new KeyboardEvent('keyup', { key: currentKeyboard[newKey.id].character, code: newKey.id }));
          else textarea.dispatchEvent(new KeyboardEvent('keyup', { code: newKey.id }));
        });
        keysOnPage = [...document.querySelectorAll('.keyboard div')];
      } else {
        document.getElementById(key.eventCode).innerHTML = key.character;
        if (shift) Shift(true, capsPressed);
        else if (capsPressed) CapsLock(capsPressed);
      }

      currentKeyboard[key.eventCode] = key;
      textarea.placeholder = activeLang === 'ru' ? 'Клавиатура создана в операционной системе Windows\nДля переключения языка комбинация: левыe ctrl + alt' : 'The keyboard was created in the Windows operating system\nCombination to switch the language: left ctrl + alt';
    });
  });
}

changeCurrentKeyboard(activeLang);

// add listeners for keys on keyboard (run once)
textarea.addEventListener('keydown', (e) => {
  document.getElementById(`${e.code === '' ? `${e.key}Right` : e.code}`).classList.add('active');

  if (e.code === 'CapsLock') {
    capsPressed = !capsPressed;
    CapsLock(capsPressed, e.shiftKey);
  } else if (e.key === 'Shift') Shift(e.shiftKey, capsPressed);
  else if (currentKeyboard[e.code].type === 'letter'
        || currentKeyboard[e.code].type === 'changable'
        || currentKeyboard[e.code].type === 'spacing') {
    // eslint-disable-next-line no-nested-ternary
    replaceCharacter(currentKeyboard[e.code].type === 'spacing' ? (
      // eslint-disable-next-line no-nested-ternary
      e.code === 'Enter' ? '\n'
        : e.code === 'Tab' ? '\t' : '')
      : document.getElementById(`${e.code}`).innerHTML, e);
  } else if (e.code === 'Backspace') Backspace(e);
  else if (e.code === 'Delete') Delete(e);
  else if (e.key === 'Alt' || e.key === 'Control') ControlAlt(e);
});
textarea.addEventListener('keyup', (e) => {
  setTimeout(() => {
    document.getElementById(`${e.code === '' ? `${e.key}Right` : e.code}`).classList.remove('active');
  }, 300);
  if (e.key === 'Shift') Shift(e.shiftKey, capsPressed);
});

// Replace the standard character with the desired one
// for all LETTERS and CHANGEABLE CHARACTERS
function replaceCharacter(newChar, e) {
  // get old data
  const start = e.target.selectionStart;
  const end = e.target.selectionEnd;
  const oldValue = e.target.value;

  // count new value and replace old value with te new one
  const newValue = oldValue.slice(0, start) + newChar + oldValue.slice(end);
  e.target.value = newValue;

  // move cursor
  e.target.selectionStart = start + 1;
  e.target.selectionEnd = e.target.selectionStart;

  e.preventDefault(); // отмена стандартного функционала кнопки
}

// ____________KEYS FUNCTIONS_____________

// CapsLock key
function CapsLock(caps, shift = false) {
  keysOnPage.forEach((key) => {
    if (currentKeyboard[key.id].type === 'letter') {
      if (caps) key.innerHTML = shift ? key.innerHTML.toLowerCase() : key.innerHTML.toUpperCase();
      else if (!caps) {
        key.innerHTML = shift ? key.innerHTML.toUpperCase() : key.innerHTML.toLowerCase();
      }
    }
  });
}

// Shift key
function Shift(shift, caps) {
  keysOnPage.forEach((key) => {
    if (currentKeyboard[key.id].type === 'letter' && caps) {
      key.innerHTML = shift ? key.innerHTML.toLowerCase() : key.innerHTML.toUpperCase();
    } else if (currentKeyboard[key.id].type === 'letter' && !caps) {
      key.innerHTML = shift ? key.innerHTML.toUpperCase() : key.innerHTML.toLowerCase();
    }
    if (currentKeyboard[key.id].type === 'changable') {
      key.innerHTML = shift ? currentKeyboard[key.id].shiftedCharacter
        : currentKeyboard[key.id].character;
    }
  });
}

// Alt and Ctrl keys
function ControlAlt(e) {
  if (e.ctrlKey && e.altKey) {
    activeLang = (activeLang === 'ru' ? 'en' : 'ru');
    localStorage.setItem('lang', activeLang);
    changeCurrentKeyboard(activeLang, e.shiftKey);
  }

  e.preventDefault();
}

// Backspace key
function Backspace(e) {
  // get old data
  const start = e.target.selectionStart;
  const end = e.target.selectionEnd;
  const oldValue = e.target.value;

  // count new value and replace old value with te new one
  const newValue = oldValue.slice(0, start === end ? start - 1 : start) + oldValue.slice(end);
  e.target.value = newValue;

  // move cursor
  e.target.selectionStart = start === end ? start - 1 : start;
  e.target.selectionEnd = e.target.selectionStart;

  e.preventDefault();
}

// Delete key
function Delete(e) {
  // get old data
  const start = e.target.selectionStart;
  const end = e.target.selectionEnd;
  const oldValue = e.target.value;

  if (!(oldValue.length > end)) return false;

  // count new value and replace old value with te new one
  const newValue = oldValue.slice(0, start) + oldValue.slice(end + 1);
  e.target.value = newValue;

  // move cursor
  e.target.selectionStart = start;
  e.target.selectionEnd = e.target.selectionStart;

  e.preventDefault();
}

/******/ })()
;
//# sourceMappingURL=index.js.map