# Feedback API – Testdokumentation

## Übersicht

Diese Dokumentation beschreibt die automatisierten API-Tests für den Feedback-Endpunkt. Ziel der Tests ist es, die korrekte Verarbeitung von gültigen und ungültigen Eingaben sowie das erwartete HTTP-Statuscode-Verhalten der API zu verifizieren.

Alle Tests sind als Postman-Collection organisiert und können über den Postman Collection Runner oder die Postman CLI (`newman`) ausgeführt werden.

---

## Testumgebung

| Parameter | Wert |
|---|---|
| Basis-URL | `http://localhost:3000/` |
| Protokoll | HTTP |
| Content-Type | `application/json` |
| Authentifizierung | Keine |
| Testframework | Postman (JavaScript / `pm.*`) |

---

## Testfälle

---

### 1 – Erfolgreiche Anfrage

#### TC-01: POST – Gültiges Feedback

| Feld | Wert |
|---|---|
| **Methode** | `POST` |
| **URL** | `http://localhost:3000/` |
| **Ziel** | Verifiziert, dass ein vollständig gültiges Feedback-Objekt korrekt gespeichert wird |

**Request Body:**
```json
{
  "name": "Max Mustermann",
  "email": "max@example.com",
  "message": "Sehr guter Service!",
  "created_at": "2026-11-06T13:00:00Z"
}
```

**Erwartetes Verhalten:**

| # | Testname | Erwartung |
|---|---|---|
| 1 | Status code ist 200 oder 201 | `pm.response.code` ist `200` oder `201` |
| 2 | Antwort enthält gespeichertes Feedback | Response-Body enthält die Felder `name`, `email`, `message` |
| 3 | Name stimmt mit gesendeten Daten überein | `jsonData.name === "Max Mustermann"` |
| 4 | Antwortzeit unter 500ms | `pm.response.responseTime < 500` |

---

### 2 – Ungültige Eingaben

#### TC-02: POST – Ungültige E-Mail

| Feld | Wert |
|---|---|
| **Methode** | `POST` |
| **URL** | `http://localhost:3000/` |
| **Ziel** | Verifiziert, dass eine syntaktisch ungültige E-Mail-Adresse abgelehnt wird |

**Request Body:**
```json
{
  "name": "Max Mustermann",
  "email": "keine-gueltige-email",
  "message": "Test Nachricht",
  "created_at": "2026-11-06T13:00:00Z"
}
```

**Erwartetes Verhalten:**

| # | Testname | Erwartung |
|---|---|---|
| 1 | Status code ist 400 (Bad Request) | `pm.response.code === 400` |
| 2 | Fehlermeldung ist vorhanden | Response-Body enthält `error` oder `message` |
| 3 | Antwort enthält Hinweis auf ungültige E-Mail | Response-Text enthält das Wort `"email"` (case-insensitive) |

---

### 3 – Fehlende Daten

#### TC-03: POST – Pflichtfelder fehlen

| Feld | Wert |
|---|---|
| **Methode** | `POST` |
| **URL** | `http://localhost:3000/` |
| **Ziel** | Verifiziert, dass fehlende Pflichtfelder (`name`, `message`) zu einem Fehler führen |

**Request Body:**
```json
{
  "email": "max@example.com"
}
```

**Erwartetes Verhalten:**

| # | Testname | Erwartung |
|---|---|---|
| 1 | Status code ist 400 (Bad Request) | `pm.response.code === 400` |
| 2 | Fehlermeldung ist vorhanden | Response-Body enthält `error` oder `message` |
| 3 | Antwort ist nicht leer | `pm.response.text()` ist nicht leer |

---

### 4 – Nicht vorhandene Ressource

#### TC-04: POST – Falscher Endpoint

| Feld | Wert |
|---|---|
| **Methode** | `POST` |
| **URL** | `http://localhost:3000/feedbacks/99999` |
| **Ziel** | Verifiziert, dass ein Aufruf auf einen nicht existierenden Endpunkt korrekt mit 404 beantwortet wird |

**Request Body:**
```json
{
  "name": "Max Mustermann",
  "email": "max@example.com",
  "message": "Test",
  "created_at": "2026-11-06T13:00:00Z"
}
```

**Erwartetes Verhalten:**

| # | Testname | Erwartung |
|---|---|---|
| 1 | Status code ist 404 (Not Found) | `pm.response.code === 404` |
| 2 | Fehlermeldung für nicht gefundene Ressource | Response-Text ist nicht leer |

---

### 5 – Fehlerhafte Parameter

#### TC-05: POST – Falscher Datentyp

| Feld | Wert |
|---|---|
| **Methode** | `POST` |
| **URL** | `http://localhost:3000/` |
| **Ziel** | Verifiziert, dass falsche Datentypen (z. B. Zahl statt String) abgelehnt werden |

**Request Body:**
```json
{
  "name": 12345,
  "email": true,
  "message": null,
  "created_at": "kein-datum"
}
```

**Erwartetes Verhalten:**

| # | Testname | Erwartung |
|---|---|---|
| 1 | Status code ist 400 oder 422 | `pm.response.code` ist `400` oder `422` |
| 2 | Fehlermeldung bei falschen Datentypen | Response-Body enthält `error` oder `message` |

---

### 6 – HTTP Statuscodes

#### TC-06: POST – Leerer Body

| Feld | Wert |
|---|---|
| **Methode** | `POST` |
| **URL** | `http://localhost:3000/` |
| **Ziel** | Verifiziert, dass ein leerer JSON-Body (`{}`) nicht als gültige Anfrage akzeptiert wird |

**Request Body:**
```json
{}
```

**Erwartetes Verhalten:**

| # | Testname | Erwartung |
|---|---|---|
| 1 | Status code ist ein gültiger HTTP-Fehlercode | `pm.response.code` ist `400`, `422` oder `500` |
| 2 | Status code ist nicht 200 oder 201 | `pm.response.code` ist weder `200` noch `201` |
| 3 | Content-Type Header ist vorhanden | `Content-Type`-Header ist nicht `null` |
| 4 | Antwort enthält Fehlerbeschreibung | Response-Text ist nicht leer |

---

## Zusammenfassung der Testabdeckung

| TC | Testfall | Methode | Endpunkt | Erwarteter Statuscode | Anzahl Tests |
|---|---|---|---|---|---|
| TC-01 | Gültiges Feedback | POST | `/` | 200 / 201 | 4 |
| TC-02 | Ungültige E-Mail | POST | `/` | 400 | 3 |
| TC-03 | Pflichtfelder fehlen | POST | `/` | 400 | 3 |
| TC-04 | Falscher Endpoint | POST | `/feedbacks/99999` | 404 | 2 |
| TC-05 | Falscher Datentyp | POST | `/` | 400 / 422 | 2 |
| TC-06 | Leerer Body | POST | `/` | 400 / 422 / 500 | 4 |
| | **Gesamt** | | | | **18** |

### Abgedeckte Testbereiche

- **Happy Path:** Erfolgreiche Verarbeitung gültiger Daten
- **Validierung:** E-Mail-Format, Pflichtfelder, Datentypen
- **Routing:** Nicht existierende Endpunkte
- **HTTP-Semantik:** Korrekte Statuscodes und Response-Bodies
- **Performance:** Antwortzeit-Schwellenwert (< 500 ms)

---

> Dieses Dokument wurde automatisch auf Basis der Postman-Collection **„Feedback API Tests"** generiert.
