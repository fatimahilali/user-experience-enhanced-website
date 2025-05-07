// Importeer het Express-framework vanuit de node_modules map (via npm geïnstalleerd)
import express from 'express'

// Importeer de Liquid templating engine (ook via npm geïnstalleerd)
import { Liquid } from 'liquidjs'

// Initialiseer een nieuwe Express-applicatie.....
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




// Route-handler voor de hoofdpagina ('/')
app.get('/', async function (request, response) {
    // Haal de data op van de Directus API
    const apiResponse = await fetch('https://fdnd-agency.directus.app/items/fabrique_art_objects?fields=*,image.id,image.width,image.height');
    const apiResponseJSON = await apiResponse.json();
  
    // Render de Liquid-template en geef de data mee
    response.render('index.liquid', { artworks: apiResponseJSON.data });
  });
  



// Deze route laat de detailpagina van een specifiek kunstwerk zien
app.get('/detail/:id', async (req, res) => {
  // Haal het ID van het kunstwerk uit de URL (bijvoorbeeld: /detail/5)
  const artworkId = req.params.id;

  // Controleer of de gebruiker Arabisch als taal heeft gekozen (?lang=ar)
  // Als er niets is opgegeven of iets anders, gebruik dan Engels als standaard
  const lang = req.query.lang === 'ar' ? 'ar' : 'en';

  // Kies de juiste veldnamen op basis van de gekozen taal
  // Voor Arabisch gebruik je 'titleAR' en 'summaryAR'
  // Voor Engels gebruik je 'title' en 'summary'
  const titleField = lang === 'ar' ? 'titleAR' : 'title';
  const summaryField = lang === 'ar' ? 'summaryAR' : 'summary';

  // Stel de velden samen die je nodig hebt uit de API
  const fields = `${titleField},${summaryField},image.id,image.width,image.height,slug`;
    
  try {
    // Vraag de data van het kunstwerk op via de Directus API
    const response = await fetch(
      `https://fdnd-agency.directus.app/items/fabrique_art_objects/${artworkId}?fields=${fields}`
    );

    // Zet de reactie van de API om naar JSON zodat je ermee kunt werken
    const json = await response.json();

    // Haal de daadwerkelijke kunstwerkgegevens uit het JSON-object
    const data = json.data;

    // Als er geen gegevens gevonden zijn, toon dan een 404-pagina
    if (!data) {
      return res.status(404).render('404.liquid');
    }

    // Stuur de juiste gegevens naar de detailpagina om te tonen
    res.render('detail.liquid', {
      artwork: {
        title: data[titleField],     // De juiste titel afhankelijk van de taal
        summary: data[summaryField], // De juiste samenvatting afhankelijk van de taal
        image: data.image,           // De afbeelding van het kunstwerk
        slug: data.slug,             // De slug (voor in de URL)
        language: lang               // De gekozen taal
      }
    });

  } catch (error) {
    // Als er iets misgaat, toon een foutmelding in de browser
    console.error(error);
    res.status(500).send("Er ging iets mis bij het ophalen van het kunstwerk.");
  }
});






// Stel het poortnummer in waarop de server moet draaien (voorkeur via omgeving, anders 8000)
app.set('port', process.env.PORT || 8000)

// Start de server en toon in de console op welk adres hij draait
app.listen(app.get('port'), function () {
  console.log(`Application started on http://localhost:${app.get('port')}`)
})
