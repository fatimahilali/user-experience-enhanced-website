// Importeer het Express-framework vanuit de node_modules map (via npm geïnstalleerd)
import express from 'express'

// Importeer de Liquid templating engine (ook via npm geïnstalleerd)
import { Liquid } from 'liquidjs'

// Initialiseer een nieuwe Express-applicatie
const app = express()

// Maakt het mogelijk om data uit formulieren (POST-requests) uit te lezen
app.use(express.urlencoded({ extended: true }))

// Maak de 'public' map beschikbaar voor statische bestanden zoals CSS, JS, afbeeldingen en fonts
app.use(express.static('public'))

// Stel Liquid in als de template engine
const engine = new Liquid()
app.engine('liquid', engine.express())

// Stel de map in waar de Liquid templates zich bevinden
app.set('views', './views')

// Stel het poortnummer in waarop de server moet draaien (voorkeur via omgeving, anders 8000)
app.set('port', process.env.PORT || 8000)

// Start de server en toon in de console op welk adres hij draait
app.listen(app.get('port'), function () {
  console.log(`Application started on http://localhost:${app.get('port')}`)
})
