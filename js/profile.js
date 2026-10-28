const emotes = [
 ...['Hehe.png','LentejaHi.png','LentejaLove_.png','LentejaPat.png','LentejaWhat_.png','LentejitaAngry1.png','LentejitaRaid.gif','OuO.png','corazon500.png','enojada500.png','gun.png','party500.png','sasoneja_love.png'].map(n => `assets/Emotes_twitch/Mejores Trabajos/${n}`),
 ...['Baritas-de-Luz.gif','Comiendo.png','Cool.png','Molesto.gif','Musica.gif','Nova-Bits.gif','Triste.gif','WTF.png'].map(n => `assets/Clientes/NovaStark_7/${n}`)
];
const art = [['Personajes VTuber',['assets/ibispaint/Personajes VTuber/f1.png','assets/ibispaint/Personajes VTuber/f2.png']],['Personajes Originales',['assets/ibispaint/Personajes Originales/lenti4.png','assets/ibispaint/Personajes Originales/Coneja 2.png']],['Ilustraciones',['assets/ibispaint/Ilustraciones/ana dibujo.png','assets/ibispaint/Ilustraciones/Feliz 1.png']],['Comisión para Mervill28',['assets/Clientes/Mervill28/PHOTO-2026-07-15-10-10-32.jpg']]];
const designs = [['Discord Server',['5 sin título_20210903013718.png','53 sin título_20211112185841.png','54 sin título_20211112203652.png','6 sin título_20210903131815.png'].map(n => `assets/photoshop/Discord Server/${n}`)],['Streams',['22 sin título_20220518211738.png','22 sin título_20220518190135.png'].map(n => `assets/photoshop/Streams/${n}`)],['YouTube Videos',['100_playeras_dijeron.png','MINIATURA XILONEN.png','miniatura_fortnite_1.png','miniatura_fortnite_2.png','tinder_.png'].map(n => `assets/photoshop/YouTube Videos/${n}`)]];
const viewer=document.querySelector('#viewer');
function imageButton(src,label){const button=document.createElement('button');button.className='artwork';button.type='button';button.setAttribute('aria-label','Ampliar '+label);const img=document.createElement('img');img.src=src;img.alt=label;img.loading='lazy';button.append(img);button.addEventListener('click',()=>{viewer.querySelector('img').src=src;viewer.querySelector('img').alt=label;viewer.querySelector('p').textContent=label;viewer.showModal()});return button}
const emoteDialog = document.querySelector('#emote-dialog');
let currentEmoteAnimated = false;
const emoteDescriptions = {
  Hehe: 'Una reacción divertida para el chat.',
  LentejaHi: 'Un saludo para dar la bienvenida a la comunidad.',
  LentejaLove_: 'Una expresión de amor y cariño.',
  LentejaPat: 'Un gesto de cariño para acompañar al chat.',
  LentejaWhat_: 'Una expresión de confusión y sorpresa.',
  LentejitaAngry1: 'Una reacción de enojo para el chat.',
  LentejitaRaid: 'Una animación para celebrar una raid.',
  OuO: 'Una expresión de sorpresa para la comunidad.',
  corazon500: 'Una reacción llena de cariño.',
  enojada500: 'Una expresión de molestia para el chat.',
  gun: 'Una reacción de acción para la comunidad.',
  party500: 'Una expresión para celebrar con el chat.',
  sasoneja_love: 'Una expresión de cariño inspirada en Sasoneja.',
  'Baritas-de-Luz': 'Una animación brillante para la comunidad.',
  Comiendo: 'Una reacción de comida para el chat.',
  Cool: 'Una expresión con actitud para el canal.',
  Molesto: 'Una reacción animada de molestia.',
  Musica: 'Una animación musical para el chat.',
  'Nova-Bits': 'Una animación para celebrar bits.',
  Triste: 'Una expresión animada de tristeza.',
  WTF: 'Una reacción de sorpresa e incredulidad.'
};
emotes.forEach(src => {
  const name = src.split('/').pop().replace(/\.[^.]+$/, '');
  const animated = /\.gif$/i.test(src);
  const button = document.createElement('button');
  button.className = 'artwork';
  button.type = 'button';
  button.setAttribute('aria-label', `Ver detalles del emote ${name}`);
  const img = document.createElement('img');
  img.src = src;
  img.alt = `Emote ${name}`;
  img.loading = 'lazy';
  button.append(img);
  button.addEventListener('click', () => {
    const preview = emoteDialog.querySelector('.emote-detail-image');
    preview.src = src;
    preview.alt = `Emote ${name}`;
    emoteDialog.querySelector('#emote-detail-title').textContent = name.replace(/_/g, ' ');
    emoteDialog.querySelector('.emote-kind').textContent = animated ? 'EMOTE ANIMADO ✦' : 'EMOTE ESTÁTICO ✦';
    emoteDialog.querySelector('.emote-detail-description').textContent = emoteDescriptions[name] || 'Emote creado para la comunidad.';
    currentEmoteAnimated = animated;
    emoteDialog.querySelector('.emote-commission').hidden = false;
    emoteDialog.showModal();
  });
  document.querySelector('#emote-grid').append(button);
});
function renderGroups(id,groups){const root=document.querySelector(id);groups.forEach(([name,images])=>{const group=document.createElement('div');group.className='group';const title=document.createElement('h3');title.textContent=name;const grid=document.createElement('div');grid.className='art-grid';images.forEach((src,i)=>grid.append(imageButton(src,name+' '+(i+1))));group.append(title,grid);root.append(group)})}
renderGroups('#art-groups',art);renderGroups('#design-groups',designs);viewer.querySelector('button').addEventListener('click',()=>viewer.close());viewer.addEventListener('click',e=>{if(e.target===viewer)viewer.close()});

const commissionDialog = document.querySelector('#commission-dialog');
const animatedCommissionDialog = document.querySelector('#animated-commission-dialog');
document.querySelectorAll('[data-open-commission]').forEach(button => button.addEventListener('click', () => commissionDialog.showModal()));
document.querySelectorAll('[data-open-animated]').forEach(button => button.addEventListener('click', () => animatedCommissionDialog.showModal()));
commissionDialog.querySelector('.commission-close').addEventListener('click', () => commissionDialog.close());
commissionDialog.addEventListener('click', event => { if (event.target === commissionDialog) commissionDialog.close(); });
animatedCommissionDialog.querySelector('.commission-close').addEventListener('click', () => animatedCommissionDialog.close());
animatedCommissionDialog.addEventListener('click', event => { if (event.target === animatedCommissionDialog) animatedCommissionDialog.close(); });

const profileTabs = [...document.querySelectorAll('.profile-tabs [role="tab"]')];
function selectProfileTab(selected) {
  profileTabs.forEach(tab => {
    const active = tab === selected;
    tab.setAttribute('aria-selected', String(active));
    tab.tabIndex = active ? 0 : -1;
    document.getElementById(tab.getAttribute('aria-controls')).hidden = !active;
  });
}
emoteDialog.querySelector('.emote-close').addEventListener('click', () => emoteDialog.close());
emoteDialog.addEventListener('click', event => { if (event.target === emoteDialog) emoteDialog.close(); });
emoteDialog.querySelector('.emote-commission').addEventListener('click', () => {
  emoteDialog.close();
  selectProfileTab(document.querySelector('#tab-commissions'));
  document.querySelector('#tab-commissions').scrollIntoView({ behavior: 'smooth', block: 'start' });
  (currentEmoteAnimated ? animatedCommissionDialog : commissionDialog).showModal();
});
profileTabs.forEach((tab, index) => {
  tab.addEventListener('click', () => selectProfileTab(tab));
  tab.addEventListener('keydown', event => {
    let next;
    if (event.key === 'ArrowRight') next = (index + 1) % profileTabs.length;
    else if (event.key === 'ArrowLeft') next = (index - 1 + profileTabs.length) % profileTabs.length;
    else if (event.key === 'Home') next = 0;
    else if (event.key === 'End') next = profileTabs.length - 1;
    else return;
    event.preventDefault();
    selectProfileTab(profileTabs[next]);
    profileTabs[next].focus();
  });
});

let scrollFrame;
const updateProfileScroll = () => {
  scrollFrame = null;
  const progress = Math.min(1, Math.max(0, window.scrollY / 240));
  document.documentElement.style.setProperty('--scroll-progress', progress);
  document.documentElement.style.setProperty('--avatar-shrink', `${progress * (window.innerWidth <= 900 ? 25 : 40)}px`);
  document.documentElement.style.setProperty('--avatar-offset', `${progress * 20}px`);
};
window.addEventListener('scroll', () => {
  if (!scrollFrame) scrollFrame = requestAnimationFrame(updateProfileScroll);
}, { passive: true });
window.addEventListener('resize', updateProfileScroll);
updateProfileScroll();

const contactLinks = [...document.querySelectorAll('a[href^="contacto.html"]')];
let commissionsOpen = false;
function setAvailability(open, known) {
  commissionsOpen = open;
  document.querySelector('.welcome').textContent = known
    ? (open ? '✦  Comisiones abiertas · ¡Hablemos de tu proyecto!' : '✦  Comisiones cerradas por el momento')
    : '✦  Consultando disponibilidad de comisiones…';
  contactLinks.forEach(link => {
    link.setAttribute('aria-disabled', String(!open));
    link.classList.toggle('contact-disabled', !open);
    if (!open) link.setAttribute('tabindex', '-1'); else link.removeAttribute('tabindex');
  });
}
contactLinks.forEach(link => link.addEventListener('click', event => { if (!commissionsOpen) event.preventDefault(); }));
setAvailability(false, false);
loadSettings().then(config => {
  const validPackages = Array.isArray(config.packages) && config.packages.length;
  if (!validPackages) throw new Error('Configuración incompleta');
  const price = formatPackage(config.packages[0]);
  document.querySelector('.commission-copy .commission-price strong').textContent = price.replace(/^[^·]+·\s*/, '');
  document.querySelector('#commission-dialog .commission-price strong').textContent = price.replace(/^[^·]+·\s*/, '');
  const summary = document.querySelector('.commission-package');
  summary.replaceChildren();
  const list = document.querySelector('#commission-prices');
  list.replaceChildren();
  config.packages.forEach((item, index) => {
    if (index) summary.append(document.createElement('br'));
    summary.append(document.createTextNode(formatPackage(item)));
    const li = document.createElement('li'); li.textContent = formatPackage(item); list.append(li);
  });
  document.querySelector('#commission-delivery').textContent = config.delivery;
  const animated = config.animated || defaultAnimated;
  const animatedSection = document.querySelector('#animated-commission-section');
  const animatedPrice = formatPackage(animated.packages[0]).replace(/^[^·]+·\s*/, '');
  animatedSection.querySelector('.commission-price strong').textContent = animatedPrice;
  animatedCommissionDialog.querySelector('.commission-price strong').textContent = animatedPrice;
  const animatedSummary = animatedSection.querySelector('.commission-package');
  const animatedList = document.querySelector('#animated-prices');
  animatedSummary.replaceChildren();
  animatedList.replaceChildren();
  animated.packages.forEach((item, index) => {
    if (index) animatedSummary.append(document.createElement('br'));
    animatedSummary.append(document.createTextNode(formatPackage(item)));
    const li = document.createElement('li'); li.textContent = formatPackage(item); animatedList.append(li);
  });
  document.querySelector('#animated-delivery').textContent = animated.delivery;
  setAvailability(config.open === true, true);
}).catch(() => {
  document.querySelector('.welcome').textContent = '✦  No se pudo consultar la disponibilidad. Inténtalo más tarde.';
});
