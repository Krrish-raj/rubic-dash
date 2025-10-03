import { NextResponse } from 'next/server';
import { type NextRequest } from 'next/server';
import { createClient } from '@/utils/supabase/server';

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get('code');
  const next = searchParams.get('next') ?? '/dashboard';

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    
    if (!error) {
      // Use the configured site URL instead of origin to ensure consistency
      const redirectUrl = `${process.env.NEXT_PUBLIC_SITE_URL}${next}`;
      const response = NextResponse.redirect(redirectUrl);
      
      // Set minimal headers to avoid nginx "too big header" error
      response.headers.delete('x-middleware-rewrite');
      response.headers.delete('x-middleware-next');
      
      return response;
    }
  }

  // Return the user to an error page with instructions
  const errorUrl = `${process.env.NEXT_PUBLIC_SITE_URL}/error?message=${encodeURIComponent('Authentication failed. Please try again.')}`;
  const response = NextResponse.redirect(errorUrl);
  
  // Set minimal headers to avoid nginx "too big header" error
  response.headers.delete('x-middleware-rewrite');
  response.headers.delete('x-middleware-next');
  
  return response;
}

