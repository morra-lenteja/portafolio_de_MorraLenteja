const form = document.querySelector('#contact-form');
const statusMessage = document.querySelector('#form-status');
const submitButton = form.querySelector('button[type="submit"]');
let canContact = false;
submitButton.disabled = true;
document.querySelector('.fallback').hidden = true;
loadSettings().then(config => {
  canContact = config.open === true;
  submitButton.disabled = !canContact;
  document.querySelector('.fallback').hidden = !canContact;
  if (!canContact) statusMessage.textContent = 'Las comisiones están cerradas por el momento.';
}).catch(() => {
  statusMessage.textContent = 'No se pudo consultar la disponibilidad. Inténtalo más tarde.';
});
const requestedService = new URLSearchParams(window.location.search).get('servicio');
if (requestedService === 'emotes' || requestedService === 'emotes-animados') {
  form.elements.service.value = 'Emotes';
  if (requestedService === 'emotes-animados') form.elements.message.value = 'Hola, me gustaría solicitar emotes animados.\n\n';
}
const CONTACT_ENDPOINT = settingsEndpoint;

form.addEventListener('submit', async event => {
  event.preventDefault();
  if (!canContact) return;
  if (!form.reportValidity()) return;
  const fields = new FormData(form);
  const data = Object.fromEntries(fields);
  data.name = data.name.trim();
  data.email = data.email.trim();
  data.message = data.message.trim();
  if (!data.name || !data.message) {
    statusMessage.textContent = 'Completa tu nombre y mensaje para continuar.';
    (data.name ? form.elements.message : form.elements.name).focus();
    return;
  }
  submitButton.disabled = true;
  submitButton.textContent = 'Enviando...';
  statusMessage.textContent = '';
  try {
    if (!CONTACT_ENDPOINT) throw new Error('not-configured');
    const response = await fetch(CONTACT_ENDPOINT, {
      method: 'POST',
      body: new URLSearchParams({
        nombre: data.name,
        email: data.email,
        servicio: data.service,
        mensaje: data.message,
        website: data.website
      })
    });
    const result = await response.json();
    if (!response.ok || result.success !== true) throw new Error('send-failed');
    form.reset();
    statusMessage.textContent = '¡Mensaje enviado! Gracias por compartir tu idea.';
    statusMessage.dataset.state = 'success';
  } catch (error) {
    statusMessage.textContent = error.message === 'not-configured'
      ? 'El formulario aún no está configurado. Puedes escribir a morra.lenteja@gmail.com.'
      : 'No se pudo enviar el mensaje. Inténtalo de nuevo o escribe a morra.lenteja@gmail.com.';
    statusMessage.dataset.state = 'error';
  } finally {
    submitButton.disabled = false;
    submitButton.textContent = 'Enviar mensaje ↗';
  }
});
