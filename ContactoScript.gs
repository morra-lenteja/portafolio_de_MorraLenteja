// El formulario consulta la disponibilidad pública de Supabase antes de enviar.
const SUPABASE_URL = 'https://yjqiedctppmnmhzilslr.supabase.co';
const SUPABASE_PUBLIC_KEY = 'sb_publishable_hCxEnJpfE27prWTvIgmyXA_xQUe6JES';
function result(success) {
  return ContentService.createTextOutput(JSON.stringify({ success: success })).setMimeType(ContentService.MimeType.JSON);
}
function commissionsOpen() {
  const response = UrlFetchApp.fetch(SUPABASE_URL + '/rest/v1/portfolio_settings?id=eq.1&select=config', {
    headers: { apikey: SUPABASE_PUBLIC_KEY, Authorization: 'Bearer ' + SUPABASE_PUBLIC_KEY },
    muteHttpExceptions: true
  });
  if (response.getResponseCode() !== 200) return false;
  const rows = JSON.parse(response.getContentText());
  return Array.isArray(rows) && rows.length === 1 && rows[0].config && rows[0].config.open === true;
}
function doPost(e) {
  try {
    const data = e.parameter || {};
    if (!commissionsOpen() || data.website) return result(false);
    const nombre = (data.nombre || '').trim();
    const email = (data.email || '').trim();
    const servicio = (data.servicio || '').trim();
    const mensaje = (data.mensaje || '').trim();
    if (!nombre || nombre.length > 120 || /[\r\n]/.test(nombre) ||
        !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || email.length > 254 ||
        !['Emotes', 'Art Commission', 'Diseño gráfico', 'Otro'].includes(servicio) ||
        !mensaje || mensaje.length > 1000) return result(false);
    const asunto = `Nuevo contacto desde Portfolio - ${nombre}`;
    const cuerpo = `Nombre: ${nombre}\nEmail: ${email}\nServicio: ${servicio}\n\nMensaje:\n${mensaje}`;
    GmailApp.sendEmail('morra.lenteja@gmail.com', asunto, cuerpo, { replyTo: email });
    return result(true);
  } catch (error) { return result(false); }
}
function doGet() { return ContentService.createTextOutput('Contacto de Morra Lenteja activo'); }
