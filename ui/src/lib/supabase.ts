import { createClient } from '@supabase/supabase-js';
//These are public keys - it is ok to expose them
const supabaseUrl = 'https://ifttixldfwyxglgsuepe.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlmdHRpeGxkZnd5eGdsZ3N1ZXBlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjIxMTUwMzAsImV4cCI6MjA3NzY5MTAzMH0.F6j111raNUsK8toCj5wysWKSC201nypJNoJGn4EXUIA';

export const supabase = createClient(supabaseUrl, supabaseAnonKey); 