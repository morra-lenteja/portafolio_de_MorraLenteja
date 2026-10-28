const settingsEndpoint = 'https://script.google.com/macros/s/AKfycbx95HvpLApelv1FfJnkj9FJA_YP7rwnZ54ftq70LQvMgn7CYBluEHaSy7UWjJmLAcWIhQ/exec';
const supabaseUrl = 'https://yjqiedctppmnmhzilslr.supabase.co';
const supabaseKey = 'sb_publishable_hCxEnJpfE27prWTvIgmyXA_xQUe6JES';
async function loadSettings() {
  const response = await fetch(supabaseUrl + '/rest/v1/portfolio_settings?id=eq.1&select=config', {
    headers: { apikey: supabaseKey, Authorization: 'Bearer ' + supabaseKey },
    cache: 'no-store'
  });
  const rows = await response.json();
  if (!response.ok || !Array.isArray(rows) || rows.length !== 1 || !rows[0].config) throw new Error('No se pudo consultar la disponibilidad.');
  return rows[0].config;
}
function formatPackage(item) {
  const prices = [];
  if (item.mxn !== null && item.mxn !== undefined && item.mxn !== '') prices.push('$' + Number(item.mxn).toLocaleString('es-MX') + ' MXN');
  if (item.usd !== null && item.usd !== undefined && item.usd !== '') prices.push('$' + Number(item.usd).toLocaleString('en-US') + ' USD');
  return item.label + ' · ' + prices.join(' / ');
}
const defaultAnimated = { delivery: 'A convenir con la artista', packages: [{ label: '1 emote', mxn: null, usd: 8 }, { label: '3 emotes', mxn: null, usd: 15 }] };
