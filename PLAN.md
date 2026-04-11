# Portfolio 2.0 — Production Readiness Plan

> Пошаговый план для агента-кодера. Каждый шаг — самостоятельная задача.  
> Изображения (сжатие) владелец заменит сам — в плане только код.

---

## Step 1 — Безопасность: санитизация input в Telegram API

**Файл:** `api/contact.ts`

**Что сделать:**
- Добавить функцию `escapeMarkdown(text: string): string` которая эскейпит символы `_`, `*`, `` ` ``, `[`, `]`, `(`, `)`, `~`, `>`, `#`, `+`, `-`, `=`, `|`, `{`, `}`, `.`, `!` — все спецсимволы Telegram MarkdownV2.
- Переключить `parse_mode` с `'Markdown'` на `'MarkdownV2'` (более строгий и предсказуемый).
- Обернуть все пользовательские данные (`name`, `phone`, `email`, `description`) в `escapeMarkdown()` перед вставкой в текст сообщения.
- Добавить базовую валидацию длины полей (name <= 100, email <= 200, description <= 2000, phone <= 30) и вернуть 400 если превышено.

---

## Step 2 — Безопасность: rate limiting на /api/contact

**Файл:** `api/contact.ts`

**Что сделать:**
- Реализовать простой in-memory rate limiter на базе `Map<string, { count: number, resetAt: number }>` по IP-адресу.
- IP получать из заголовка `x-forwarded-for` (стандарт Vercel Edge).
- Лимит: максимум **3 запроса в 60 секунд** с одного IP.
- При превышении — вернуть `429 Too Many Requests` с JSON `{ error: "Too many requests" }`.
- Добавить cleanup старых записей при каждом запросе (удалять записи с истекшим `resetAt`).

> Примечание: in-memory Map работает per-edge-instance и сбрасывается при холодном старте, но для портфолио это достаточная защита. Если нужен production-grade — заменить на Upstash Redis ratelimit.

---

## Step 3 — Чистка vite.config.ts

**Файл:** `vite.config.ts`

**Что сделать:**
- Удалить ВСЕ алиасы кроме `'@': path.resolve(__dirname, './src')`. Все `@radix-ui/*`, `vaul`, `sonner`, `recharts`, `react-resizable-panels`, `react-hook-form`, `react-day-picker`, `lucide-react@*`, `input-otp`, `embla-carousel-react`, `cmdk`, `class-variance-authority`, `next-themes@*` — это мусор от shadcn/ui, ни один из этих пакетов не используется с версионным алиасом.
- Исправить отступы (сейчас `resolve`, `build`, `server` имеют лишний уровень вложенности внутри `defineConfig`).

**Результат должен выглядеть так:**
```ts
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import path from 'path';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    extensions: ['.js', '.jsx', '.ts', '.tsx', '.json'],
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  build: {
    target: 'esnext',
    outDir: 'dist',
  },
  server: {
    port: 3000,
    open: false,
  },
});
```

---

## Step 4 — Фикс package.json

**Файл:** `package.json`

**Что сделать:**
- Изменить `"name": "Untitled"` на `"name": "izotov-portfolio"`.
- Зафиксировать версию motion: заменить `"motion": "*"` на конкретную версию. Посмотреть текущую установленную версию через `npm ls motion` или в `package-lock.json` и зафиксировать её с префиксом `^` (например `"motion": "^12.6.3"` — подставить реальную версию из lock-файла).

---

## Step 5 — Ссылки: target="_blank" + rel + aria-label

**Файл:** `src/components/Contact.tsx`

**Что сделать:**
- На всех трёх социальных ссылках (GitHub, LinkedIn, Telegram) в строках ~83-91 добавить:
  - `target="_blank"`
  - `rel="noopener noreferrer"`
  - `aria-label` с соответствующим текстом: `"GitHub"`, `"LinkedIn"`, `"Telegram"`

---

## Step 6 — Обновить sitemap.xml

**Файл:** `public/sitemap.xml`

**Что сделать:**
- Добавить все публичные роуты:
  - `https://izotov.dev/lms-case-study`
  - `https://izotov.dev/ai-saas-case-study`
  - `https://izotov.dev/medtech-case-study`
- Каждый с `<priority>0.8</priority>` и актуальной `<lastmod>` (использовать текущую дату).

---

## Step 7 — Динамический lang атрибут на <html>

**Файл:** `src/i18n/index.tsx`

**Что сделать:**
- В компоненте `LanguageProvider` добавить `useEffect`, который при смене `lang` обновляет `document.documentElement.lang`:
  ```ts
  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);
  ```
- Маппинг языков: `en` -> `"en"`, `de` -> `"de"`, `ru` -> `"ru"` (совпадают, так что можно ставить напрямую).

---

## Step 8 — Перевод 404 страницы

**Файл:** `src/i18n/translations.ts` + `src/components/NotFoundPage.tsx`

**Что сделать:**
1. В `translations.ts` добавить ключи для каждого языка (en/de/ru):
   ```
   notFound.title        — "Page Not Found" / "Seite nicht gefunden" / "Страница не найдена"
   notFound.subtitle     — "The requested route does not exist in this system." / "Die angeforderte Route existiert nicht." / "Запрашиваемый маршрут не существует в системе."
   notFound.back         — "Back to Home" / "Zurück zur Startseite" / "На главную"
   notFound.error_label  — "Error // 404" (одинаково для всех языков)
   ```
2. В `NotFoundPage.tsx`:
   - Импортировать `useLanguage` из `'../i18n'`.
   - Заменить хардкоженные строки на вызовы `t('notFound.title')`, `t('notFound.subtitle')`, `t('notFound.back')`, `t('notFound.error_label')`.

---

## Step 9 — Lazy loading роутов (code splitting)

**Файл:** `src/App.tsx`

**Что сделать:**
1. Заменить прямые импорты case study страниц на lazy:
   ```tsx
   import { lazy, Suspense } from 'react';
   
   const LmsPage = lazy(() => import('./components/LmsPage').then(m => ({ default: m.LmsPage })));
   const AiSaaSPage = lazy(() => import('./components/AiSaaSPage').then(m => ({ default: m.AiSaaSPage })));
   const CaseStudyPage = lazy(() => import('./components/CaseStudyPage').then(m => ({ default: m.CaseStudyPage })));
   const NotFoundPage = lazy(() => import('./components/NotFoundPage').then(m => ({ default: m.NotFoundPage })));
   ```
2. Удалить старые прямые импорты этих компонентов.
3. Обернуть `<AnimatedRoutes />` в `<Suspense>` с минимальным fallback:
   ```tsx
   <Suspense fallback={<div className="min-h-screen bg-black" />}>
     <AnimatedRoutes />
   </Suspense>
   ```

---

## Step 10 — Error Boundary

**Новый файл:** `src/components/ErrorBoundary.tsx`

**Что сделать:**
1. Создать class-based Error Boundary (React не поддерживает хуки для error boundaries):
   ```tsx
   import { Component, type ReactNode } from 'react';

   interface Props { children: ReactNode }
   interface State { hasError: boolean }

   export class ErrorBoundary extends Component<Props, State> {
     state: State = { hasError: false };

     static getDerivedStateFromError(): State {
       return { hasError: true };
     }

     render() {
       if (this.state.hasError) {
         return (
           <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center px-6">
             <p className="text-[10px] font-mono font-bold uppercase tracking-[0.4em] text-blue-500 mb-6">
               System Error
             </p>
             <h1 className="text-3xl font-black uppercase tracking-tighter mb-4">
               Something went wrong
             </h1>
             <button
               onClick={() => window.location.reload()}
               className="px-6 py-3 border border-white/10 text-[11px] font-mono font-bold uppercase tracking-widest text-white hover:bg-blue-600 hover:border-blue-600 transition-all duration-300"
             >
               Reload Page
             </button>
           </div>
         );
       }
       return this.props.children;
     }
   }
   ```
2. В `src/App.tsx` обернуть содержимое `App()` в `<ErrorBoundary>`:
   ```tsx
   export default function App() {
     return (
       <ErrorBoundary>
         <LanguageProvider>
           <ThemeProvider ...>
             <Suspense ...>
               <AnimatedRoutes />
             </Suspense>
           </ThemeProvider>
         </LanguageProvider>
       </ErrorBoundary>
     );
   }
   ```

---

## Step 11 — Чистка globals.css от неиспользуемых переменных

**Файл:** `src/styles/globals.css`

**Что сделать:**
- Удалить все CSS-переменные и соответствующие `@theme inline` маппинги, которые нигде в проекте не используются. А именно удалить:
  - `--popover`, `--popover-foreground`
  - `--card`, `--card-foreground`
  - `--secondary`, `--secondary-foreground`
  - `--muted`, `--muted-foreground`
  - `--accent`, `--accent-foreground`
  - `--destructive`, `--destructive-foreground`
  - `--input`, `--input-background`, `--switch-background`
  - `--ring`
  - `--chart-1` через `--chart-5`
  - `--sidebar` и все `--sidebar-*` переменные
  - `--font-weight-medium`, `--font-weight-normal`
- Удалить соответствующие строки из секции `.dark { }`.
- Удалить соответствующие маппинги из `@theme inline { }`.
- Оставить только: `--background`, `--foreground`, `--primary`, `--primary-foreground`, `--border`, `--radius`, `--font-size`.
- **Перед удалением** — сделать grep по проекту по каждой переменной чтобы подтвердить что она не используется. Если какая-то используется — оставить.

---

## Step 12 — GDPR: добавить страницу Impressum и Privacy Policy (Datenschutz)

**Новые файлы:**
- `src/components/ImpressumPage.tsx`
- `src/components/DatenschutzPage.tsx`

**Изменить:** `src/App.tsx`, `src/components/Footer.tsx`

**Что сделать:**
1. Создать `ImpressumPage.tsx` — минимальная страница со структурой как у case study страниц (GrainTexture, навигация назад, тёмный фон). Контент — placeholder текст (владелец заполнит сам):
   ```
   Angaben gemäß § 5 TMG:
   Oleksandr Izotov
   [Adresse]
   [Kontakt]
   ```
2. Создать `DatenschutzPage.tsx` — аналогичная структура. Контент — placeholder:
   ```
   Datenschutzerklärung
   [Placeholder — hier Datenschutzerklärung einfügen]
   ```
3. В `App.tsx` добавить lazy-loaded роуты:
   - `/impressum` -> `ImpressumPage`
   - `/datenschutz` -> `DatenschutzPage`
4. В `Footer.tsx` добавить ссылки на эти страницы рядом с копирайтом (используя `Link` из react-router-dom):
   - `Impressum` -> `/impressum`
   - `Datenschutz` -> `/datenschutz`
   Стиль: `text-[9px] font-mono text-gray-400 dark:text-zinc-600 uppercase tracking-widest hover:text-blue-500 transition-colors`.
5. Добавить эти роуты в `public/sitemap.xml`.

---

## Step 13 — Финальная проверка

**Что сделать:**
1. Запустить `npm run build` — убедиться что билд проходит без ошибок и warnings.
2. Запустить `npm run preview` и проверить:
   - Главная страница загружается.
   - Переключение языков работает (EN/DE/RU).
   - Контактная форма отправляется (или корректно показывает ошибку без бэкенда).
   - Все три case study страницы открываются.
   - 404 страница показывается на несуществующих роутах и переведена.
   - `/impressum` и `/datenschutz` открываются.
   - Ссылки в футере ведут на Impressum и Datenschutz.
   - Социальные ссылки открываются в новой вкладке.
3. Проверить что `document.documentElement.lang` обновляется при смене языка (через DevTools).

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
