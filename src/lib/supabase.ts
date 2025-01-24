import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Vérifie si les variables d'environnement sont des URLs valides
const isValidUrl = (url: string) => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

if (!supabaseUrl || !supabaseAnonKey || !isValidUrl(supabaseUrl)) {
  throw new Error(
    'Configuration Supabase manquante. Veuillez cliquer sur le bouton "Connect to Supabase" pour configurer la connexion.'
  );
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);