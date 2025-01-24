import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export const api = {
  supabase,

  auth: {
    signIn: async (email: string, password: string) => {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      if (error) throw error;
      return data;
    },
    signOut: async () => {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
    }
  },

  schools: {
    getAll: async () => {
      const { data, error } = await supabase
        .from('schools')
        .select(`
          *,
          filieres (
            *,
            classes (
              *
            )
          )
        `);
      if (error) throw error;
      return data;
    }
  },

  students: {
    getByClassId: async (classId: number) => {
      const { data, error } = await supabase
        .from('students')
        .select('*')
        .eq('class_id', classId);
      if (error) throw error;
      return data;
    },

    updateAbsences: async (studentId: number, justifiedHours: number, unjustifiedHours: number) => {
      const { error } = await supabase
        .from('students')
        .update({
          justified_absences: justifiedHours,
          unjustified_absences: unjustifiedHours
        })
        .eq('id', studentId);
      if (error) throw error;
    }
  },

  inspectors: {
    getCurrentInspector: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return null;
      
      const { data, error } = await supabase
        .from('inspectors')
        .select('*, filiere:filieres(*)')
        .eq('email', user.email)
        .single();
      
      if (error) throw error;
      return data;
    }
  }
};