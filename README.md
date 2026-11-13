# Backend Doku – Feedback-Formular

In dieser Doku beschreibe ich, wie ich das Backend für das Feedback-Formular meiner Website aufgebaut habe. Das Backend nimmt Feedback (Name, E-Mail, Nachricht) entgegen und speichert es in einer SQLite-Datenbank.

## Verwendete Technologien

- Node.js
- Express
- better-sqlite3 (SQLite)
- cors

## Schritt 1: Projekt erstellen

Ordner anlegen und ein neues Node-Projekt starten:

```bash
cd tymur_website_backend
npm init -y
```

Danach die Pakete installieren:

```bash
npm install express cors better-sqlite3
```

## Schritt 2: Ordnerstruktur

Ich habe das Backend in Schichten aufgeteilt (Controller / Service / Repository), damit jede Datei nur eine Aufgabe hat.

```
src/
  server.js
  db.js
  routes/
    routes.js
  controllers/
    controller.js
  services/
    service.js
  repositories/
    repository.js
```

| Datei | Aufgabe |
|-------|---------|
| server.js | Server starten, Middleware einbinden |
| db.js | Verbindung zur Datenbank |
| routes.js | Pfade zuordnen |
| controller.js | Request lesen, Antwort senden |
| service.js | Daten prüfen (Validierung) |
| repository.js | SQL-Befehle |

## Schritt 3: Datenbank (db.js)

Hier wird die Datenbank geöffnet und die Tabelle `feedback` erstellt, falls sie noch nicht existiert.

```js
const Database = require("better-sqlite3");

const db = new Database("database.db");

db.exec(`
    CREATE TABLE IF NOT EXISTS feedback (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        email TEXT NOT NULL,
        message TEXT NOT NULL,
        created_at TEXT NOT NULL
    )
`);

module.exports = db;
```

## Schritt 4: Repository (repository.js)

Das Repository ist die einzige Datei, die SQL enthält. Es speichert einen neuen Eintrag in der Datenbank.

```js
const db = require("../db");

function create({ name, email, message }) {
    return db.prepare(`
        INSERT INTO feedback (name, email, message, created_at)
        VALUES (?, ?, ?, datetime('now'))
    `).run(name, email, message);
}

module.exports = { create };
```

Die Werte werden mit `?` übergeben und nicht direkt in den SQL-String geschrieben. So ist man vor SQL-Injection geschützt.

## Schritt 5: Service (service.js)

Der Service prüft, ob die Daten stimmen, bevor sie gespeichert werden. Er kennt weder `req` noch `res`.

```js
const feedbackRepository = require("../repositories/repository.js");

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function createFeedback({ name, email, message }) {
    if (typeof name != "string" || typeof email != "string" || typeof message != "string") {
        const err = new Error("name, email and message should be of type string!");
        err.status = 400;
        throw err;
    }

    if (!name || !email || !message) {
        const err = new Error("name, email and message are required");
        err.status = 400;
        throw err;
    }
    
    if (!EMAIL_REGEX.test(email)) {
        const err = new Error("Invalid email address");
        err.status = 400;
        throw err;
    }

    return feedbackRepository.create({ name, email, message });
}

module.exports = { createFeedback };
```

Geprüft wird:
- Sind alle Felder ausgefüllt?
- Hat die E-Mail ein gültiges Format?

Bei einem Fehler wird ein Error mit Status 400 geworfen.

## Schritt 6: Controller (controller.js)

Der Controller liest den Request, ruft den Service auf und schickt die passende Antwort zurück.

```js
const service = require("../services/service");

function createFeedback(req, res) {
    try {
        service.createFeedback(req.body);
        res.status(201).json({ success: true });
    } catch (error) {
        if (error.status === 400) {
            return res.status(400).json({ error: error.message });
        }
        console.error(error);
        res.status(500).json({ error: "Database error" });
    }
}

module.exports = { createFeedback };
```

Statuscodes:
- `201` → erfolgreich gespeichert
- `400` → falsche Eingabe
- `500` → Fehler auf dem Server / in der Datenbank

## Schritt 7: Route (routes.js)

Die Route sagt, welche Funktion bei welchem Pfad aufgerufen wird.

```js
const express = require("express");
const controller = require("../controllers/controller");

const router = express.Router();

router.post("/", controller.createFeedback);

module.exports = router;
```

## Schritt 8: Server (server.js)

Zum Schluss kommt alles in `server.js` zusammen. Hier wird nur noch eingerichtet und gestartet.

```js
const express = require("express");
const cors = require("cors");
const routes = require("./routes/routes");

const app = express();

app.use(cors());
app.use(express.json());
app.use("/api/feedback", routes);

app.listen(3000, () => {
    console.log("Server running on http://localhost:3000");
});
```

- `cors()` erlaubt Anfragen vom Frontend
- `express.json()` macht den JSON-Body in `req.body` lesbar

## Schritt 9: Starten und testen

Server starten:

```bash
node src/server.js
```

## Ablauf einer Anfrage

```
Client → server.js → Route → Controller → Service → Repository → Datenbank
```

Die Antwort geht denselben Weg wieder zurück zum Client. Jede Schicht kennt nur die nächste.
