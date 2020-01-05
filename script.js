'use strict';

initFirebase();
getPoems();

const wrapper = document.getElementById('wrapper');
wrapper.addEventListener('scroll', scrollFn, false);
const content = document.getElementById('content');
const buttons = document.getElementById('buttons');
let poems = [];
let poemId;

let timeout;

function scrollFn() {
  if (timeout) {
		window.cancelAnimationFrame(timeout);
  }
  timeout = window.requestAnimationFrame(() => {
    const windowScroll = wrapper.scrollTop;
    const layers = document.getElementsByClassName('bg-layer');
    [...layers].forEach((el, i) => {
      const maxScale = i * 0.12 + 1;
      const scale = Math.min(maxScale, 1 + (windowScroll * (i + 1) / 500));
      el.style.transform = `scale(${scale})`;
    });
  });
}

function initFirebase() {
  const firebaseConfig = window.process.env.FIREBASE_CONFIG;
  firebase.initializeApp(firebaseConfig);
}

function getPoems() {
  const db = firebase.firestore();
  db.collection("poems").orderBy('created', 'asc').get().then((querySnapshot) => {
    poems = [];
    querySnapshot.forEach(doc => poems.push({id: doc.id, ...doc.data()}));
    const id = getUrlIdParam();
    if (!id) {
      loadPoems(poems)
    } else {
      loadPoem(poems.find(el => el.id === id));
    }


  });
}

function getUrlIdParam() {
  const search = window.location.search;
  const match = search && search.match(/\?id=([^&#]+)/);
  return match && match[1];
}

function loadPoems() {
  const ul = document.createElement('ul');
  poems.forEach(poem => {
    const li = document.createElement('li');
    li.innerText = poem.title;
    li.onclick = () => loadPoem(poem);
    ul.appendChild(li);
  })
  clean();
  content.appendChild(ul);
  buttons.style.display = 'none';
}

function loadPoem(poem) {
  poemId = poem.id;
  history.replaceState(null, null, `${window.location.pathname}?id=${poem.id}#main`);
  location.hash = '#main';
  const title = document.createElement('h2');
  title.innerHTML = poem.title;
  const p = document.createElement('p');
  p.innerHTML = poem.content.split('\\n').join('<br>');

  clean();
  content.appendChild(title);
  content.appendChild(p);
  buttons.style.display = 'block';
}

function clean() {
  while (content.firstChild) {
    content.firstChild.remove();
  }
}

function back() {
  loadPoems();
  window.history.replaceState(null, null, `${window.location.pathname}#main`);
}

function next() {
  const currentIndex = poems.findIndex(el => el.id === poemId);
  loadPoem(poems[currentIndex + 1] || poems[0]);
}
function prev() {
  const currentIndex = poems.findIndex(el => el.id === poemId);
  loadPoem(poems[currentIndex - 1] || poems[poems.length - 1]);
}