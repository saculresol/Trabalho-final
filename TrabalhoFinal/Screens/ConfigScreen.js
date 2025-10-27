import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = 'https://japjjntjoimcywydogiu.supabase.co'
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImphcGpqbnRqb2ltY3l3eWRvZ2l1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjE1NDY4MTcsImV4cCI6MjA3NzEyMjgxN30.ZjlqXA98BMujOgBEicbSQ5Wz3XNs-xW6fb1FqMDWrzw'

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
