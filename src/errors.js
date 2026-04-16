import { supabase } from './supabase';

let lastAutoTicket = 0;

export const logErrorToSupabase = async (error, source = 'js') => {
  if (!supabase) return;
  try {
    const ua = navigator.userAgent || '';
    const url = window.location.href;
    const msg = String(error?.message || error || 'Unknown error').slice(0, 2000);
    const userEmail = supabase.auth?.getUser
      ? (await supabase.auth.getUser())?.data?.user?.email || null
      : null;
    await supabase.from('error_logs').insert({
      message: msg,
      stack: String(error?.stack || '').slice(0, 4000),
      source,
      url,
      user_agent: ua.slice(0, 500),
      user_email: userEmail,
      created_at: new Date().toISOString(),
    });
    if (source !== 'test' && Date.now() - lastAutoTicket > 1800000) {
      lastAutoTicket = Date.now();
      const ticketEmail = userEmail || 'anonymous@siteready.at';
      await supabase.from('support_requests').insert({
        email: ticketEmail,
        subject: '[Auto] Frontend-Fehler',
        message: `Automatisch erkannter Fehler:\n\n${msg}\n\nSeite: ${url}\nBrowser: ${ua.slice(0, 200)}`,
        status: 'offen',
      });
    }
  } catch (e) {
    /* silent */
  }
};

if (typeof window !== 'undefined') {
  window.addEventListener('error', (ev) => {
    logErrorToSupabase(ev.error || ev.message, 'window.onerror');
  });
  window.addEventListener('unhandledrejection', (ev) => {
    logErrorToSupabase(ev.reason, 'unhandledrejection');
  });
}
