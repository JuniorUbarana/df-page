const SUPABASE_URL = "https://lqxvieagnjskkbqvflfg.supabase.co";
const SUPABASE_ANON_KEY = "sb_publishable_I51NRM24LJBTdG4gpkTjFQ_p_v2FNLt";

// The supabase global is provided by the unpkg script tag
const { createClient } = window.supabase;
const supabaseClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

export default supabaseClient;
export { supabaseClient as supabase };
