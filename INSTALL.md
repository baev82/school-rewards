---

git clone https://github.com/BaevVladimir/school-rewards.git

cd school-rewards

docker compose up -d --build

---
Open / Откройте: http://localhost:3001

Default PINs / PIN-коды: Child 1234, Parent 0000

---

docker compose up -d            # Start

docker compose down             # Stop

docker compose logs -f          # Logs

docker compose up -d --build    # Rebuild

---

Data: ./data/school_rewards.db, screenshots: ./uploads/

---

Debug URL: http://localhost:3001/api/debug
