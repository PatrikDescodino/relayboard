import { createClient as createSupabaseClient } from '@supabase/supabase-js';

// Get environment variables with fallbacks
const supabaseUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    'Missing Supabase environment variables. Please ensure SUPABASE_URL and SUPABASE_ANON_KEY are set.'
  );
}

/**
 * Create a Supabase client instance
 * This client can be used for server-side operations
 */
export function createClient() {
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
      workflows: {
        Row: {
          id: string;
          user_id: string;
          name: string;
          description?: string;
          status: 'active' | 'inactive' | 'draft';
          webhook_id?: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          name: string;
          description?: string;
          status?: 'active' | 'inactive' | 'draft';
          webhook_id?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          name?: string;
          description?: string;
          status?: 'active' | 'inactive' | 'draft';
          webhook_id?: string;
          updated_at?: string;
        };
      };
      runs: {
        Row: {
          id: string;
          workflow_id: string;
          user_id: string;
          status: 'running' | 'completed' | 'failed' | 'paused';
          trigger_type?: string;
          inputs?: any;
          outputs?: any;
          error?: string;
          started_at: string;
          completed_at?: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          workflow_id: string;
          user_id: string;
          status?: 'running' | 'completed' | 'failed' | 'paused';
          trigger_type?: string;
          inputs?: any;
          outputs?: any;
          error?: string;
          started_at?: string;
          completed_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          workflow_id?: string;
          user_id?: string;
          status?: 'running' | 'completed' | 'failed' | 'paused';
          trigger_type?: string;
          inputs?: any;
          outputs?: any;
          error?: string;
          completed_at?: string;
          updated_at?: string;
        };
      };
      approvals: {
        Row: {
          id: string;
          run_id: string;
          token: string;
          status: 'pending' | 'approved' | 'rejected';
          message?: string;
          approved_by?: string;
          created_at: string;
          approved_at?: string;
        };
        Insert: {
          id?: string;
          run_id: string;
          token: string;
          status?: 'pending' | 'approved' | 'rejected';
          message?: string;
          approved_by?: string;
          created_at?: string;
          approved_at?: string;
        };
        Update: {
          id?: string;
          run_id?: string;
          token?: string;
          status?: 'pending' | 'approved' | 'rejected';
          message?: string;
          approved_by?: string;
          approved_at?: string;
        };
      };
    };
  };
}
