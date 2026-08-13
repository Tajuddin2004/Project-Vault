import { jwtDecode } from 'jwt-decode';

let scriptLoaded = false;

export function loadGoogleScript() {
  return new Promise((resolve, reject) => {
    if (scriptLoaded || (window.google && window.google.accounts)) {
      scriptLoaded = true;
      return resolve(window.google);
    }

    const script = document.createElement('script');
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.defer = true;
    script.onload = () => {
      scriptLoaded = true;
      resolve(window.google);
    };
    script.onerror = (err) => reject(err);
    document.head.appendChild(script);
  });
}

export async function promptGoogleSignIn(clientId, onSuccess, onError) {
  try {
    const google = await loadGoogleScript();
    if (!google || !google.accounts) {
      throw new Error('Google Sign-In library failed to load.');
    }

    const effectiveClientId = clientId || '884441003366-sg3ii04bv2p6gcioa2j6gff2l5jjcfmh.apps.googleusercontent.com';

    // Use OAuth2 Token Client which ALWAYS opens the popup on explicit click (bypassing Google One-Tap suppression/cooldown)
    if (google.accounts.oauth2) {
      const tokenClient = google.accounts.oauth2.initTokenClient({
        client_id: effectiveClientId,
        scope: 'email profile openid',
        callback: async (tokenResponse) => {
          if (tokenResponse.error) {
            onError(new Error(tokenResponse.error_description || tokenResponse.error));
            return;
          }
          if (tokenResponse.access_token) {
            try {
              // Fetch user profile from Google UserInfo API
              const profileRes = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
                headers: { Authorization: `Bearer ${tokenResponse.access_token}` },
              });
              const profile = await profileRes.json();
              onSuccess({
                email: profile.email,
                name: profile.name || '',
                picture: profile.picture || '',
                googleId: profile.sub,
                accessToken: tokenResponse.access_token,
              });
            } catch (err) {
              onError(err);
            }
          }
        },
      });

      tokenClient.requestAccessToken({ prompt: 'select_account' });
      return;
    }

    // Fallback ID token prompt
    google.accounts.id.initialize({
      client_id: effectiveClientId,
      callback: (response) => {
        if (response.credential) {
          const decoded = jwtDecode(response.credential);
          onSuccess({
            email: decoded.email,
            name: decoded.name || '',
            picture: decoded.picture || '',
            googleId: decoded.sub,
          });
        }
      },
    });

    google.accounts.id.prompt();
  } catch (err) {
    onError(err);
  }
}
