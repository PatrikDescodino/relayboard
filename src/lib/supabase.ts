import { createClient as createSupabaseClient } from '@supabase/supabase-js';

// Helper function to check if we're on the client-side
function isClient() {
  return typeof window !== 'undefined';
}

// Get environment variables with runtime guards
function getSupabaseConfig() {
  if (isClient()) {
    // Client-side configuration
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    
    if (!url || !anonKey) {
      throw new Error(
        'Missing client-side Supabase environment variables. Please ensure NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY are set.'
      );
    }
    
    // Type narrowing - TypeScript now knows these are strings
    const supabaseUrl: string = url;
    const supabaseAnonKey: string = anonKey;
    
    return { supabaseUrl, supabaseAnonKey };
  } else {
    // Server-side configuration
    const url = process.env.SUPABASE_URL;
    const anonKey = process.env.SUPABASE_ANON_KEY;
    
    if (!url || !anonKey) {
      throw new Error(
        'Missing server-side Supabase environment variables. Please ensure SUPABASE_URL and SUPABASE_ANON_KEY are set.'
      );
    }
    
    // Type narrowing - TypeScript now knows these are strings
    const supabaseUrl: string = url;
    const supabaseAnonKey: string = anonKey;
    
    return { supabaseUrl, supabaseAnonKey };
  }
}

/**
 * Create a Supabase client instance
 * This client can be used for server-side operations
 */
export function createClient() {
  const { supabaseUrl, supabaseAnonKey } = getSupabaseConfig();
  
  return createSupabaseClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      persistSession: false, // Disable session persistence for server-side
      autoRefreshToken: false, // Disable auto refresh for server-side
    },
  });
}

/**
 * Create a Supabase client instance for browser/client-side usage
 * This enables session persistence and auto token refresh
 */
export function createBrowserClient() {
  const { supabaseUrl, supabaseAnonKey } = getSupabaseConfig();
  
  return createSupabaseClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
    },
  });
}

// Export default client for backwards compatibility
export default createClient();

// Database type definitions (extend as needed)
export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string;
          email: string;
          name?: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          email: string;
          name?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          name?: string;
          updated_at?: string;
        };
      };
      // Add more table definitions as needed
    };
    Views: {
      // Add view definitions as needed
    };
    Functions: {
      // Add function definitions as needed
    };
    Enums: {
      // Add enum definitions as needed
    };
  };
}
