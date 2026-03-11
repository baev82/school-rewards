# 🌟 School Rewards / Школьные награды
Установка докер - смотри INSTALL.md

For Docker — see INSTALL.md


RU
School Rewards — это веб-приложение для родителей и детей, позволяющее отслеживать успеваемость, начислять и управлять баллами(рублями) за оценки, вести сообщения и управлять школьными задачами. Система помогает мотивировать ребёнка и упрощает контроль над его учебными достижениями.

---

⚡ Основные возможности для детей:

- Вход через PIN-код — безопасный доступ к аккаунту ребёнка.
- Просмотр баланса — сколько заработано и сколько уже выплачено.
- История оценок — отображение оценок с пометкой «на проверке» или «подтверждено».
- Система ToDo — планирование домашних заданий и дел с датами.
- Сообщения от родителей — получать мотивационные и важные сообщения.
- Настройка темы — выбор цветовой схемы интерфейса.

Для родителей (Админка):

- Добавление и управление детьми — PIN, имя и учебный год. (до 10 классов или разных детей)
- Добавление оценок — указание предмета, даты, комментариев и скриншота.
- Подтверждение оценок — проверка оценок и начисление/вычитание баллов.
- Выплаты — фиксирование денежных вознаграждений за оценки.
- Управление школьными предметами — добавление или удаление предметов.
- Настройки стоимости оценок — можно настроить вознаграждения за разные оценки.
- Сообщения детям — отправка мотивационных или информативных сообщений.
- Бэкап и восстановление данных — резервное копирование и очистка базы.

---

🖥 Интерфейс

Приложение имеет чистый и современный интерфейс с акцентом на удобство пользователя и визуализацию баланса и достижений. Цветовая схема настраивается для каждого ребёнка.

---

EN
🌟 School Rewards

School Rewards is a web application for parents and children that allows tracking academic performance, managing and awarding points (rubles) for grades, sending messages, and managing school tasks. The system helps motivate children and simplifies the monitoring of their academic achievements.

⚡ Key features for children:

- PIN code login — secure access to the child's account.
- Balance overview — see how much has been earned and how much has been paid out.
- Grade history — view grades marked as “Pending” or “Confirmed.”
- ToDo system — plan homework and tasks with dates.
- Messages from parents — receive motivational and important messages.
- Theme settings — choose the interface color scheme.

For parents (Admin panel):

- Add and manage children — PIN, name, and school year (up to 10 classes or multiple children).
- Add grades — specify subject, date, comments, and attach a screenshot.
- Confirm grades — review grades and add or deduct points.
- Payments — record monetary rewards for grades.
- Manage school subjects — add or remove subjects.
- Grade value settings — configure rewards for different grades.
- Messages to children — send motivational or informational messages.
- Backup and restore — data backup and database cleanup.

![School Rewards](https://github.com/baev82/school-rewards/blob/main/screenshots/En.png?raw=true) 


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

![PHP](https://img.shields.io/badge/PHP-8.x-777BB4) ![SQLite](https://img.shields.io/badge/SQLite-3-003B57) ![React](https://img.shields.io/badge/React-18-61DAFB) ![i18n](https://img.shields.io/badge/languages-15-orange)

- **Backend**: PHP 8.x + SQLite3 — one file `api.php`
- **Frontend**: React 18 SPA — one file `app.html`
- **Router**: `index.php` — PHP built-in server or Apache/Nginx
- **Data**: SQLite in `data/`, screenshots in `uploads/`

---

## 🌍 15 Languages & Grading Systems (15 языков)

| Language | Flag | Grades | Currency |
|----------|------|--------|----------|
| Русский | 🇷🇺 | 5,4,3,2 | ₽ |
| English | 🇺🇸 | A,B,C,D,F | $ |
| 中文 | 🇨🇳 | 优良中差 | ¥ |
| हिन्दी | 🇮🇳 | A+,A,B,C,F | ₹ |
| Español | 🇪🇸 | Sobresaliente–Insuf. | € |
| العربية | 🇸🇦 | ممتاز–راسب (RTL) | ر.س |
| Français | 🇫🇷 | /20 scale | € |
| বাংলা | 🇧🇩 | GPA A+–F | ৳ |
| Português | 🇧🇷 | 0-10 | R$ |
| Italiano | 🇮🇹 | 1-10 | € |
| 日本語 | 🇯🇵 | 秀優良可不可 | ¥ |
| Deutsch | 🇩🇪 | 1-6 (1=best) | € |
| Tiếng Việt | 🇻🇳 | Giỏi–Kém | ₫ |
| Türkçe | 🇹🇷 | Pekiyi–Başarısız | ₺ |
| 한국어 | 🇰🇷 | 수우미양가 | ₩ |

Default subjects (all languages): Mathematics, Biology, Literature, History, Foreign Language

---

## 🔐 Default PINs (настройки для входа)

| Role | PIN |
|------|-----|
| Child | `1234` |
| Parent | `0000` |

---

## 📁 Structure

```
school-rewards/
├── index.php         # Router (SPA + API + uploads)
├── api.php           # REST API (PHP + SQLite)
├── app.html          # React SPA frontend
├── favicon.svg       # App icon
├── data/             # SQLite database (auto-created)
├── uploads/          # Screenshot files
├── README.md
├── INSTALL.md
├── Dockerfile
└── docker-compose.yml
```

## 📄 License: MIT — [github.com/baev82/school-rewards](https://github.com/baev82/school-rewards)

