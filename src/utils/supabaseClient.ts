import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://rxumcvafxdiqrygxyxmo.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJ4dW1jdmFmeGRpcXJ5Z3h5eG1vIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDgxNTkwMzYsImV4cCI6MjA2MzczNTAzNn0.l-GzQozeT2m_Gf7QBJW1gSqxufpnl0WV_k3UvVHsYPg';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Vérifie si le site est online (Netlify)
export async function isOnline(): Promise<boolean> {
  try {
    // On teste un endpoint public (robots.txt)
    const res = await fetch('/robots.txt', { cache: 'no-store' });
    return res.ok;
  } catch {
    return false;
  }
}
