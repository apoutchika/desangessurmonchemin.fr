import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // Si pas de mot de passe configuré, laisser passer
  const preprodPassword = process.env.PREPROD_PASSWORD;
  if (!preprodPassword) {
    return NextResponse.next();
  }

  // Vérifier si déjà authentifié via cookie
  const authCookie = request.cookies.get('preprod-auth');
  if (authCookie?.value === preprodPassword) {
    return NextResponse.next();
  }

  // Vérifier l'authentification Basic Auth
  const authHeader = request.headers.get('authorization');
  if (authHeader) {
    const auth = authHeader.split(' ')[1];
    const [user, pass] = Buffer.from(auth, 'base64').toString().split(':');
    
    if (pass === preprodPassword) {
      // Authentification réussie, créer un cookie
      const response = NextResponse.next();
      response.cookies.set('preprod-auth', preprodPassword, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 60 * 60 * 24, // 24 heures
      });
      return response;
    }
  }

  // Demander l'authentification
  return new NextResponse('Authentication required', {
    status: 401,
    headers: {
      'WWW-Authenticate': 'Basic realm="Preprod Access"',
    },
  });
}

// Protéger toutes les routes SAUF /coming-soon
export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - /coming-soon (et ses sous-chemins)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!coming-soon|_next/static|_next/image|favicon.ico).*)',
  ],
};
