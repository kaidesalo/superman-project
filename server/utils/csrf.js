import crypto from 'crypto';

// CSRF protection for when the client and API live on different sites.
// The token is an HMAC of the login cookie, so it changes with every login and
// needs no database storage. The client gets it in the JSON response of
// login/register/me (another site can't read those responses because of CORS)
// and sends it back in the X-CSRF-Token header on every change request.
export const csrfTokenFor = (authToken) =>
  crypto.createHmac('sha256', process.env.JWT_SECRET).update(`csrf:${authToken}`).digest('hex');

export const isValidCsrfToken = (authToken, sentToken) => {
  if (typeof sentToken !== 'string') return false;
  const expected = Buffer.from(csrfTokenFor(authToken));
  const received = Buffer.from(sentToken);
  return expected.length === received.length && crypto.timingSafeEqual(expected, received);
};
