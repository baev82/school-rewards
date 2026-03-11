# 🌟 School Rewards / Школьные награды

EN
A motivational grade reward system for parents and children.
Track grades, earn rewards, manage payouts — beautiful, mobile-friendly, multi-device.

RU
Мотивационная система поощрения школьных оценок.
Отслеживайте оценки, выплачивайте за оценки деньги, управляйте выплатами.

![PHP](https://img.shields.io/badge/PHP-8.x-777BB4) ![SQLite](https://img.shields.io/badge/SQLite-3-003B57) ![React](https://img.shields.io/badge/React-18-61DAFB) ![i18n](https://img.shields.io/badge/languages-15-orange)

---

## 🏗 Architecture / Архитектура

```
┌──────────────┐    /api/* (JSON)    ┌──────────────────┐
│  Browser     │ ◄────────────────► │  PHP Backend      │
│  React SPA   │                    │  api.php          │
│  Any device  │    /uploads/*      │       ↕            │
└──────────────┘ ◄────────────────► │  SQLite Database  │
                                    │  school_rewards.db│
                                    └──────────────────┘
```

- **Backend**: PHP 8.x + SQLite3 — one file `api.php`
- **Frontend**: React 18 SPA — one file `app.html`
- **Router**: `index.php` — PHP built-in server or Apache/Nginx
- **Data**: SQLite in `data/`, screenshots in `uploads/`

---
