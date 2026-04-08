

const supabaseUrl = 'https://smdbmofqjqmkjglcjwws.supabase.co/rest/v1/?apikey=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNtZGJtb2ZxanFta2pnbGNqd3dzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzU0ODg1MzAsImV4cCI6MjA5MTA2NDUzMH0.vBAVDuo8TKjjlsRFWfSzEzwTebwpz_EikyW2H-fq8BM'

async function main() {
  const res = await fetch(supabaseUrl)
  const json = await res.json()
  console.log("AVAILABLE TABLES:")
  console.log(Object.keys(json.definitions))
}

main()
