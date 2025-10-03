import { redirect } from 'next/navigation';
import { createClient } from '@/utils/supabase/server';

export default async function Home() {
  const supabase = await createClient();
  
  const { data: { user } } = await supabase.auth.getUser();
  
  // Redirect authenticated users to dashboard
  if (user) {
    redirect('/dashboard');
  }
  
  // Redirect non-authenticated users to login
  redirect('/login');
}
