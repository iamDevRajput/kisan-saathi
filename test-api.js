const req = await fetch('http://localhost:3001/api/wiki/recommend', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    district: "Meerut",
    soilType: "loamy",
    irrigation: "canal",
    landArea: "5",
    budget: "low",
    season: "Rabi",
    language: "en"
  })
})
const res = await req.json()
console.log(res)
