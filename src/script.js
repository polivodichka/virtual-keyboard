import 'normalize.css';
import './style/style.scss';

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
