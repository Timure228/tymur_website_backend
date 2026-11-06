# API-Tests 

## Erfolgreiche Anfragen

Eine ordentliche Anfrage. POST-Request an http://localhost:3000/api/feedback

body: {
  "name": "Max Mustermann",
  "email": "max@example.com",
  "message": "Sehr gut!",
  "created_at": "2026-11-06T13:00:00Z"
}

## Ungültige Eingabe

Die Email-Adresse ist ungültig. POST-Request an http://localhost:3000/api/feedback

body: {
  "name": "Max Mustermann",
  "email": "keine-gueltige-email",
  "message": "Test Nachricht",
  "created_at": "2026-11-06T13:00:00Z"
}

## Fehlende Daten

Alle Felder ausser Email fehlen. POST-Request an http://localhost:3000/api/feedback

body: {
  "email": "max@example.com"
}

## Nicht vorhandene Ressource

Falscher Endpoint angefragt. POST-Request an http://localhost:3000/feedbacks/99999

body: {
  "name": "Max Mustermann",
  "email": "max@example.com",
  "message": "Test",
  "created_at": "2026-11-06T13:00:00Z"
}

## Falscher Datentyp

JSON enthält falsche Datentypen
