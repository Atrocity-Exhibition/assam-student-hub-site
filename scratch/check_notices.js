const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://qktomyipkzgdlexhkuqr.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFrdG9teWlwa3pnZGxleGhrdXFyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzkxNzUwMjQsImV4cCI6MjA5NDc1MTAyNH0.tqINFXcp52nPIqSCDYs-PfCEIYrv4VqbJf2-JTBlCMI';

const supabase = createClient(supabaseUrl, supabaseKey);

async function findSpecificNotice() {
  const { data, error } = await supabase
    .from('notices')
    .select('id, slug, title, category, metadata, description')
    .ilike('title', '%Kharupetia%')
    .limit(5);

  if (error) {
    console.error('Error fetching notices:', error);
    return;
  }

  console.log('Kharupetia College notice details:');
  console.log(JSON.stringify(data, null, 2));
}

findSpecificNotice();
