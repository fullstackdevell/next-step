# Next Step

A small front-end prototype that turns class assignments into guided steps and study material into active-recall flashcards. It includes three demo workflows, custom class setup, step-specific examples, and a local homework library.

## Run locally

Open `index.html` in a browser, or serve this folder with a local static server:

```sh
python3 -m http.server 4173
```

Then visit `http://localhost:4173`.

The app uses Tailwind CSS and Google Fonts from their CDNs. PDF text extraction loads PDF.js on demand. Custom classes and completed homework save in browser storage when available.

## Project files

- `index.html` contains the page structure.
- `styles.css` contains small custom styles and accessibility states.
- `app.js` contains demo workflows, interactions, and local storage logic.
- `recall.html` and `recall.js` contain the separate study-plan and flashcard experience.
