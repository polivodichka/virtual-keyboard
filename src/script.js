import 'normalize.css';
import './style/style.scss';

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

const currentKeyboard = {};
let keysOnPage;

async function getData() {
  const keyboardData = 'assets/keyboard.json';
  const res = await fetch(keyboardData);
  const data = await res.json();

  return data;
}

// fill current info about keys and add them on page if it necessary
// reusable function
function changeCurrentKeyboard(language) {
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
      } else {
        document.getElementById(key.eventCode).innerHTML = key.character;
      }
      currentKeyboard[key.eventCode] = key;

      keysOnPage = [...document.querySelectorAll('.keyboard div')];
    });
  });
}

changeCurrentKeyboard(activeLang);
