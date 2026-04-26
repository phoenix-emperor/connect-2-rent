import fs from 'fs'

const supabaseUrl = 'https://smdbmofqjqmkjglcjwws.supabase.co/rest/v1/'
const key = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNtZGJtb2ZxanFta2pnbGNqd3dzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzU0ODg1MzAsImV4cCI6MjA5MTA2NDUzMH0.vBAVDuo8TKjjlsRFWfSzEzwTebwpz_EikyW2H-fq8BM'

async function main() {
  const res = await fetch(supabaseUrl, {
    headers: {
      'apikey': key,
      'Authorization': `Bearer ${key}`
    }
  })
  const text = await res.text()
  fs.writeFileSync('schema.json', text)
  console.log("Wrote schema to schema.json")
}

main()
