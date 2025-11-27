# PRD: AI Workshop Site for SGAV

## Oversigt

En Angular-baseret workshop-site til et 2,5 timers kursus om brug af AI i kodning. Målgruppen er Angular-udviklere hos Slots- og Kulturstyrelsen (SGAV). Deltagerne har blandet erfaring med AI-kodning – nogle har prøvet det, andre slet ikke.

## Formål

- Understøtte en 30-35 minutters intro med slides
- Præsentere øvelser deltagerne kan vælge mellem
- Fungere som reference-materiale deltagerne kan vende tilbage til
- Demonstrere at sitet selv er bygget med AI (meta-touch)

---

## Domæne og deployment

**Domæne:** `ai-for-sgav.dk` (skal tjekkes/købes)

**Hosting:** Netlify
- Automatisk deploy fra GitHub repo
- Subdomæner til to versioner:
  - `live.ai-for-sgav.dk` – bygges live under workshop
  - `backup.ai-for-sgav.dk` – færdig version som sikkerhedsnet

---

## Tekniske beslutninger

| Beslutning | Valg | Begrundelse |
|------------|------|-------------|
| Framework | Angular (ren, uden UI-framework) | Matcher deltagernes stack, meta-touch |
| Styling | Simpel CSS, ingen framework | Minimerer kompleksitet |
| Content-styring | JSON-fil | Nemt at redigere, adskiller indhold fra kode |
| UI-framework | Ingen | Unødvendigt til denne simple app |

---

## Funktioner

### 1. Slide-visning (Principper)

**Formål:** Understøtte mundtlig præsentation af koncepter.

**Krav:**
- Tastatur-navigation (pil-taster: næste/forrige)
- Én slide synlig ad gangen
- Stor tekst med kun keywords synlig som standard
- Detaljetekst der kan foldes ud (til selvstudium bagefter)
- Progress-indikator
- Billede per slide (professionelt med kant)
- Fullscreen-venlig visning

**Antal slides:** 6-12 (fleksibelt, styret af JSON)

### 2. Øvelsesliste

**Formål:** Præsentere valgmuligheder grupperet efter sværhedsgrad.

**Krav:**
- Skjult under intro (kan vises når underviser er klar)
- Grupperet i sektioner efter sværhedsgrad
- Kort beskrivelse synlig, detaljer kan foldes ud
- Scroll-venlig listevisning (ikke slides)

### 3. Navigation

**Krav:**
- Tabs eller tydelig adskillelse: "Principper" | "Øvelser"
- Øvelser kan skjules/vises (toggle)

### 4. Rotating footer med Angular-jokes

**Formål:** Humoristisk element, viser ny joke ved hver sidevisning.

**Krav:**
- Tilfældig joke fra liste i JSON
- Kærlig drilleri af Angular (ikke ondsindet)
- Kort nok til footer-format

---

## Content-struktur (JSON)

```json
{
  "slides": [
    {
      "id": "careful-with-that-axe",
      "title": "Careful with that axe",
      "keywords": "AI forstærker det der allerede er der",
      "details": "Hvis I har stærke praksisser og god struktur, accelererer AI jer. Hvis ikke, accelererer den vejen mod kaos.",
      "image": "axe.jpg"
    }
  ],
  "exercises": [
    {
      "id": "hello-world",
      "title": "Hello World",
      "difficulty": "beginner",
      "shortDescription": "Få en simpel Angular-komponent til at køre med AI-hjælp.",
      "fullDescription": "Etablér at dit setup virker, og at du kan gå fra prompt til fungerende kode."
    }
  ],
  "angularJokes": [
    "OnInit, OnDestroy, OnPray, OnCry.",
    "Jeg elsker Angular. Stockholm-syndrom er også kærlighed."
  ]
}
```

---

## Slides-indhold

### Planlagte slides (kan justeres):

| Nr | Titel | Keywords | Billede-idé |
|----|-------|----------|-------------|
| 1 | De tre slags | Pixie dust, Troldmandens lærling, En ny verden | Tidlige biler der ligner hestevogne |
| 2 | Magic pixie dust | AI som feature i produktet | Glimmer/tryllestav |
| 3 | Troldmandens lærling | Fantastisk, men farligt uden forståelse | Mickey Mouse med koste / kaos |
| 4 | En helt ny verden | Vi forstår ikke hvad der kommer | Hestevogn → bil |
| 5 | Careful with that axe | AI forstærker det der allerede er der | Økse (Pink Floyd reference) |
| 6 | Struktur vs. kaos | God kodebase + AI = hurtigere. Dårlig + AI = hurtigere rod | Kontrast-billede |
| 7 | Det er fantastisk / Det virker ikke | Begge dele er sande | ? |
| 8 | Ingen er ekspert | Alle kan blive gode til det her | Tomt podium / spejl |
| 9 | Praktiske teknikker | Planlæg, byg kontekst, retry, feedback | ? |
| 10 | Hav det sjovt | Læring kræver frihed til at lege | Noget legende |

---

## Øvelser-indhold

### Start her (begynder)

**1. Hello World**
Få en simpel Angular-komponent til at køre med AI-hjælp. Etablér at dit setup virker, og at du kan gå fra prompt til fungerende kode.

**2. Byg en formular**
Lav en formular med validering. Simpelt nok til at du kan blive færdig, komplekst nok til at du ser hvordan AI håndterer rigtige krav.

### Test og kvalitet

**3. Byg en test-suite**
Tag eksisterende kode (din egen eller udleveret) og få AI til at generere tests. Evaluér bagefter: Fangede den edge cases? Forstod den intentionen?

**4. Find fejlene**
Du får kode med fejl. Brug AI til at finde og rette dem. Bonus: Hvordan prompter du for at få brugbar debugging-hjælp i stedet for bare "her er ny kode"?

### Den virkelige verden

**5. Opgrader til Angular 19**
Tag et ældre Angular-projekt og brug AI til at hjælpe med migrering. Her er AI stærk—og her bryder den selvsikkert ting.

**6. Dokumentér det her**
Tag udokumenteret kode og generér dokumentation. Evaluér bagefter: Er den præcis? Brugbar? Ville en ny udvikler faktisk forstå koden ud fra det her?

### Ødelæg ting (med vilje)

**7. Code Roast**
Få AI til at gennemgå og håne din kode (eller udleveret kode). Vend det så om: Indsæt bevidste fejl og se om AI fanger dem.

**8. Den grimmeste UI der virker**
Byg den mest visuelt forfærdelige brugerflade du kan—men den skal virke og bestå tilgængelighedstjek. Absurd begrænsning, overraskende lærerigt.

### For de ambitiøse

**9. Prompt-par**
Arbejd i par. Én prompter, den anden evaluerer og beslutter hvad I gør med outputtet. Byt roller halvvejs. Sammenlign noter om hvordan prompt-stil påvirker resultaterne.

**10. Gå agentic**
Sæt Playwright MCP op til automatiseret test, eller byg en simpel agent der udfører en opgave med flere trin. Kun hvis du er tryg ved det grundlæggende.

---

## Angular-jokes til footer

Genereres under workshoppen som del af live demo.

---

## Live demo-plan

**Formål:** Bygge rotating footer-komponenten live under workshop-intro.

**Forudsætninger:**
- Angular-projekt allerede oprettet (`ng new` kørt på forhånd)
- Dev server klar til at starte
- JSON-fil med jokes allerede på plads

**Demo-flow (5-7 minutter):**
1. Vis tomt Angular-projekt
2. Prompt: "Lav en footer-komponent der viser en tilfældig joke fra en liste"
3. Få kode, indsæt, vis resultat
4. Prompt: "Gør den pænere" eller "Tilføj animation"
5. Vis færdigt resultat

**Hvis det fejler:** Skift til backup-site og sig "Lad mig vise jer én jeg lavede i går"

---

## Workshop-struktur (2,5 timer)

| Tid | Sektion | Minutter |
|-----|---------|----------|
| 0:00 | Live demo (rotating footer) | 10 |
| 0:10 | De tre slags | 5 |
| 0:15 | Careful with that axe | 5 |
| 0:20 | Praktiske teknikker | 10 |
| 0:30 | Intro til øvelser | 5 |
| 0:35 | Øvelser (deltagerne arbejder) | 95 |
| 2:10 | Wrap-up og deling | 20 |
| 2:30 | Slut | |

---

## Deltagernes noter

**Beslutning:** Ingen tvungen struktur. Deltagerne bruger deres foretrukne format (Word, Markdown, Notion, whatever).

**Opfordring ved start:**
> "Åbn et dokument – hvad der virker for dig. Skriv løbende:
> - Hvad overraskede dig
> - Hvad virkede
> - Hvad virkede ikke
> - Hvad vil du prøve senere
>
> Til sidst tager vi 5 minutter til at tilføje én ting du faktisk vil gøre i næste uge."

---

## Billeder

**Stil:** Professionelt med en kant. Ikke kedelige stockfotos, men heller ikke useriøst.

**Kilder (prioriteret):**
1. AI-genereret (konsistent stil)
2. Unsplash/Pexels (gratis, royalty-free)
3. Simple ikoner som fallback

**Skal laves:**
- [ ] Tidlige biler / hestevogne
- [ ] Økse (Pink Floyd-reference)
- [ ] Troldmandens lærling / kaotiske koste
- [ ] Magic pixie dust / glimmer
- [ ] Struktur vs. kaos kontrast
- [ ] "Ingen er ekspert" visuel
- [ ] "Hav det sjovt" visuel

---

## Fil-struktur (forslag)

```
src/
  app/
    components/
      slides/
        slides.component.ts
        slides.component.html
        slides.component.css
      exercises/
        exercises.component.ts
        exercises.component.html
        exercises.component.css
      footer/
        footer.component.ts
        footer.component.html
        footer.component.css
    app.component.ts
    app.component.html
    app.component.css
  assets/
    content.json
    images/
      axe.jpg
      ...
```

---

## Næste skridt

1. Opret Angular-projekt
2. Implementer JSON-loading
3. Byg slide-komponent med tastatur-navigation
4. Byg øvelses-komponent med collapsible sektioner
5. Byg footer med rotating jokes
6. Find/generer billeder
7. Deploy til Netlify
8. Øv live demo 3-4 gange
9. Sæt backup-subdomain op
