# Portfolio 2.0 — Production Readiness Plan

> Пошаговый план для агента-кодера. Каждый шаг — самостоятельная задача.  
> Изображения (сжатие) владелец заменит сам — в плане только код.

---

## Step 1 — Безопасность: санитизация input в Telegram API ✅ DONE

**Файл:** `api/contact.ts`

**Что сделать:**

- [x] Добавить функцию `escapeMarkdown(text: string): string` которая эскейпит символы Telegram MarkdownV2.
- [x] Переключить `parse_mode` с `'Markdown'` на `'MarkdownV2'`.
- [x] Обернуть все пользовательские данные (`name`, `phone`, `email`, `description`) в `escapeMarkdown()`.
- [x] Добавить валидацию длины полей (name <= 100, email <= 200, description <= 2000, phone <= 30) и вернуть 400 если превышено.

---

## Step 2 — Безопасность: rate limiting на /api/contact ✅ DONE

**Файл:** `api/contact.ts`

**Что сделать:**

- [x] Реализовать простой in-memory rate limiter на базе `Map<string, { count: number, resetAt: number }>` по IP-адресу.
- [x] IP получать из заголовка `x-forwarded-for` (стандарт Vercel Edge).
- [x] Лимит: максимум **3 запроса в 60 секунд** с одного IP.
- [x] При превышении — вернуть `429 Too Many Requests` с JSON `{ error: "Too many requests" }`.
- [x] Добавить cleanup старых записей при каждом запросе (удалять записи с истекшим `resetAt`).

> Примечание: in-memory Map работает per-edge-instance и сбрасывается при холодном старте, но для портфолио это достаточная защита. Если нужен production-grade — заменить на Upstash Redis ratelimit.

---

## Step 3 — Чистка vite.config.ts ✅ DONE

**Файл:** `vite.config.ts`

**Что сделать:**

- [x] Удалить ВСЕ алиасы кроме `'@': path.resolve(__dirname, './src')`.
- [x] Исправить отступы.

**Результат должен выглядеть так:**

```ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    extensions: [".js", ".jsx", ".ts", ".tsx", ".json"],
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    target: "esnext",
    outDir: "dist",
  },
  server: {
    port: 3000,
    open: false,
  },
});
```

---

## Step 4 — Фикс package.json ✅ DONE

**Файл:** `package.json`

**Что сделать:**

- [x] Изменить `"name": "Untitled"` на `"name": "izotov-portfolio"`.
- [x] Зафиксировать версию motion: `"motion": "^12.34.0"` (реальная версия из lock-файла).

---

## Step 5 — Ссылки: target="\_blank" + rel + aria-label ✅ DONE

**Файл:** `src/components/Contact.tsx`

**Что сделать:**

- [x] На всех трёх социальных ссылках (GitHub, LinkedIn, Telegram) добавить:
  - [x] `target="_blank"`
  - [x] `rel="noopener noreferrer"`
  - [x] `aria-label` с соответствующим текстом: `"GitHub"`, `"LinkedIn"`, `"Telegram"`

---

## Step 6 — Обновить sitemap.xml ✅ DONE

**Файл:** `public/sitemap.xml`

**Что сделать:**

- [x] Добавить все публичные роуты:
  - [x] `https://izotov.dev/lms-case-study`
  - [x] `https://izotov.dev/ai-saas-case-study`
  - [x] `https://izotov.dev/medtech-case-study`
- [x] Каждый с `<priority>0.8</priority>` и актуальной `<lastmod>` (2026-04-11).

---

## Step 7 — Динамический lang атрибут на <html> ✅ DONE

**Файл:** `src/i18n/index.tsx`

**Что сделать:**

- [x] В компоненте `LanguageProvider` добавить `useEffect`, который при смене `lang` обновляет `document.documentElement.lang`.
- [x] Маппинг языков: `en` -> `"en"`, `de` -> `"de"`, `ru` -> `"ru"` (совпадают, так что можно ставить напрямую).

---

## Step 8 — Перевод 404 страницы ✅ DONE

**Файл:** `src/i18n/translations.ts` + `src/components/NotFoundPage.tsx`

**Что сделать:**

- [x] В `translations.ts` добавить ключи `notFound.*` для каждого языка (en/de/ru).
- [x] В `NotFoundPage.tsx`:
  - [x] Импортировать `useLanguage` из `'../i18n'`.
  - [x] Заменить хардкоженные строки на вызовы `t('notFound.title')`, `t('notFound.subtitle')`, `t('notFound.back')`, `t('notFound.error_label')`.

---

## Step 9 — Lazy loading роутов (code splitting) ✅ DONE

**Файл:** `src/App.tsx`

**Что сделать:**

- [x] Заменить прямые импорты case study страниц на lazy.
- [x] Удалить старые прямые импорты этих компонентов.
- [x] Обернуть `<AnimatedRoutes />` в `<Suspense>` с минимальным fallback.

---

## Step 10 — Error Boundary ✅ DONE

**Новый файл:** `src/components/ErrorBoundary.tsx`

**Что сделать:**

- [x] Создать class-based Error Boundary.
- [x] В `src/App.tsx` обернуть содержимое `App()` в `<ErrorBoundary>`.

---

## Step 11 — Чистка globals.css от неиспользуемых переменных ✅ DONE

**Файл:** `src/styles/globals.css`

**Что сделать:**

- [x] Удалены: `--popover`, `--card`, `--secondary`, `--muted`, `--accent`, `--destructive`, `--input`, `--switch-background`, `--chart-1..5`, `--sidebar*`.
- [x] Удалены соответствующие маппинги из `@theme inline`.
- [x] Удалены из `.dark {}`.
- [x] **Оставлены:** `--background`, `--foreground`, `--primary`, `--primary-foreground`, `--border`, `--radius`, `--font-size` — а также `--ring` (используется в `@apply border-border outline-ring/50`) и `--font-weight-medium`/`--font-weight-normal` (используются в base typography).

---

## Step 12 — GDPR: добавить страницу Impressum и Privacy Policy (Datenschutz) ✅ DONE

**Новые файлы:**

- `src/components/ImpressumPage.tsx`
- `src/components/DatenschutzPage.tsx`

**Изменить:** `src/App.tsx`, `src/components/Footer.tsx`

**Что сделать:**

- [x] Создать `ImpressumPage.tsx` — минимальная страница со структурой как у case study страниц (GrainTexture, навигация назад, тёмный фон). Контент — placeholder.
- [x] Создать `DatenschutzPage.tsx` — аналогичная структура. Контент — placeholder.
- [x] В `App.tsx` добавить lazy-loaded роуты: `/impressum` и `/datenschutz`.
- [x] В `Footer.tsx` добавить ссылки на эти страницы рядом с копирайтом.
- [x] Добавить эти роуты в `public/sitemap.xml`.

---

## Step 13 — Финальная проверка ✅ DONE

**Что сделать:**

- [x] Запустить `npm run build` — ✅ билд прошёл без ошибок и warnings.
- [ ] Запустить `npm run preview` и проверить все страницы (владелец проверит сам).

**Результат билда:**

- 2049 модулей трансформировано за 3.93s
- Lazy loading работает: `NotFoundPage`, `ImpressumPage`, `DatenschutzPage`, `LmsPage`, `AiSaaSPage`, `CaseStudyPage` — все в отдельных чанках
- Бандл: index 412.32 kB (gzip 129.56 kB), CSS 66.56 kB (gzip 10.70 kB)
- Никаких ошибок, никаких предупреждений

---

## Порядок выполнения

```
Step 1  → Санитизация Telegram API
Step 2  → Rate limiting
Step 3  → Чистка vite.config.ts
Step 4  → Фикс package.json
Step 5  → target="_blank" + aria-label
Step 6  → Sitemap
Step 7  → Динамический lang
Step 8  → Перевод 404
Step 9  → Lazy loading роутов
Step 10 → Error Boundary
Step 11 → Чистка CSS
Step 12 → GDPR страницы
Step 13 → Финальная проверка
```

Каждый шаг можно коммитить отдельно. Шаги 9 и 10 трогают один файл (`App.tsx`) — выполнять последовательно.
