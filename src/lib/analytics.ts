import { supabase } from './supabase';

/**
 * Daily-rotating visitor ID based on browser fingerprint.
 * Privacy-friendly: rotates every day so visitors can't be tracked long-term.
 */
async function generateVisitorId(): Promise<string> {
  const raw = [
    navigator.language,
    screen.width,
    screen.height,
    screen.colorDepth,
    Intl.DateTimeFormat().resolvedOptions().timeZone,
    new Date().toISOString().slice(0, 10), // YYYY-MM-DD rotates daily
  ].join('|');

  const encoder = new TextEncoder();
  const data = encoder.encode(raw);
  const hash = await crypto.subtle.digest('SHA-256', data);
  return Array.from(new Uint8Array(hash))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

function getSessionId(): string {
  let id = sessionStorage.getItem('analytics_session_id');
  if (!id) {
    id = crypto.randomUUID();
    sessionStorage.setItem('analytics_session_id', id);
  }
  return id;
}

function getDeviceType(): 'mobile' | 'tablet' | 'desktop' {
  const ua = navigator.userAgent;
  if (/tablet|ipad|playbook|silk/i.test(ua)) return 'tablet';
  if (/mobile|iphone|ipod|android|blackberry|opera mini|iemobile/i.test(ua)) return 'mobile';
  return 'desktop';
}

export async function trackPageView(path: string): Promise<void> {
  try {
    const [visitorId, sessionId] = await Promise.all([
      generateVisitorId(),
      Promise.resolve(getSessionId()),
    ]);

    await supabase.from('page_views').insert({
      page_path: path,
      referrer: document.referrer || null,
      device_type: getDeviceType(),
      user_agent: navigator.userAgent,
      visitor_id: visitorId,
      session_id: sessionId,
    });
  } catch {
    // Fire-and-forget — never break the app for analytics
  }
}
