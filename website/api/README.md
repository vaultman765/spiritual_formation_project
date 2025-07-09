# 📖 Mental Prayer Project – API Reference

This document provides an overview of the REST API for the Mental Prayer Project backend. It is powered by Django REST Framework (DRF) and structured for use by frontend components.

---

## 🔹 Base URL

All endpoints are prefixed with:

```
/api/
```

---

## 📚 1. Arcs API (`/api/arcs/`)

### 🔸 List All Arcs
```
GET /api/arcs/
```
Returns basic metadata for all arcs, ordered by `arc_number`.

### 🔸 Retrieve One Arc
```
GET /api/arcs/<arc_id>/
```
Returns full metadata for a specific arc (e.g. `arc_love_of_god`).

### 🔸 Filter by arc_id
```
GET /api/arcs/?arc_id=arc_passion_of_christ
```

### 🔸 Extra: Arcs with Tags
```
GET /api/arcs/with-tags/
```
Returns:
```json
[
  {
    "arc_id": "arc_love_of_god",
    "arc_title": "...",
    "tags": [
      { "name": "trust", "category": "virtue" },
      ...
    ]
  },
  ...
]
```

### 🔸 Extra: Arcs Grouped by Tag
```
GET /api/arcs/by-tag/
```
Returns:
```json
{
  "suffering": ["arc_passion_of_christ", "arc_love_of_neighbor"],
  ...
}
```

---

## 🗓 2. Meditation Days API (`/api/days/`)

### 🔸 Summary of All Days
```
GET /api/days/
```
Returns:
```json
[
  {
    "master_day_number": 1,
    "arc_day_number": 1,
    "arc_id": "arc_love_of_god",
    "arc_title": "...",
    "day_title": "...",
    "tags": { "virtue": ["trust"], "structure": ["smpf"] }
  },
  ...
]
```

### 🔸 All Days in an Arc
```
GET /api/days/?arc_id=arc_passion_of_christ
```

### 🔸 One Day by Master Number
```
GET /api/days/?master_day_number=64
```

### 🔸 One Day by Arc + Arc Day Number
```
GET /api/days/?arc_id=arc_love_of_god&arc_day_number=3
```

### Returns full day metadata:
```json
{
  "master_day_number": 64,
  "arc_day_number": 3,
  "arc_id": "arc_love_of_god",
  "arc_title": "...",
  "day_title": "...",
  "primary_reading": { "title": "...", "reference": "...", "url": "..." },
  "secondary_readings": [ ... ],
  "meditative_points": [ "...", "...", "..." ],
  "ejaculatory_prayer": "...",
  "colloquy": "...",
  "resolution": "...",
  "tags": { "virtue": [...], "structure": [...], ... }
}
```

---

## 🏷 3. Tags API (`/api/tags/`)

### 🔸 List All Tags
```
GET /api/tags/
```
Returns all canonical tags with name and category.

### 🔸 Arcs Grouped by Tag
```
GET /api/tags/arcs-by-tag/
```
Returns:
```json
{
  "humility": ["arc_love_of_neighbor", "arc_litany_sacred_heart"],
  ...
}
```

---

## 🧠 Notes

- `arc_id` is the primary unique identifier for all arcs.
- Tags are grouped by category (`virtue`, `structure`, `typological`, etc.).
- All tag values are lowercase and drawn from `tag_bank.yaml`.

---

## 📦 Future Additions (Planned)

- `/api/tags/<tag_name>/` → show full list of arcs/days with that tag
- `/api/arc/<arc_id>/days/` → optional list endpoint per arc
- `/api/days/today/` → dynamic day fetch

---

Made with ❤️ by the Mental Prayer Project.