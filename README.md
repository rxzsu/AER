# AER Browser

Gecko-браузер (форк Firefox 157, модель Zen), Windows-only. Весь билд на CI.
Стек тулчейна репо: **Bun 1.4.2 + TypeScript 7.0.2**.

## Как это устроено

- Не форкаем весь `mozilla-central` в git. Храним только:
  - `surfer.json` — версия Firefox + брендинг,
  - `src/browser/**/*.patch` — точечные патчи движка,
  - `src/zen/**` — наш UI (custom theme, startup, будущие vertical tabs / workspaces),
  - `prefs/aer/*.yaml` — дефолтные префы,
  - `configs/windows/mozconfig` — флаги сборки.
- `bun run init` скачивает Firefox 157 в `engine/`, накатывает брендинг и наши файлы.
- `bun run build` собирает через `mach` (как Zen через Surfer).

## Требования (Windows)

- [MozillaBuild](https://ftp.mozilla.org/pub/mozilla.org/mozilla/libraries/win32/MozillaBuildSetup-latest.exe) + VS2022 "Desktop development with C++"
- Bun **1.4.2** (`powershell -c "irm bun.sh/install.ps1 | iex"`, затем `bun --version`)
- Rust stable, Python 3.14.8, Git, 7-Zip, ~30GB свободно
- TypeScript **7.0.2** ставится сам через `bun install` (devDependency)

## Быстрый старт

```powershell
bun install
bun run lint        # быстрая проверка UI без движка
bunx tsc --noEmit   # TS 7.0.2 typecheck
bun run init        # скачать Firefox + накатить AER (долго, ~10-30 мин)
bun run build       # полный билд движка (1-3 часа)
```

Пересборка только UI (без C++/Rust):

```powershell
bun run build:ui
```

Сброс движка:

```powershell
bun run reset-ff
```

## CI

Воркфлоу `windows-build` запускается **только вручную**: Actions → windows-build → Run workflow.
Опция `clean: true` сбрасывает `engine/` и качает Firefox заново.

- `ui-check` — Bun 1.4.2 + `tsc --noEmit` + `bun run lint` (без движка).
- `build-windows` — полный Gecko-билд на `windows-2022` (там VS2022 под Firefox 157).

Кеш слоёный (первый прогон греет, дальше переиспользуется):

- `sccache` — объектные файлы компилятора, главная экономия пересборок;
- `ff-source-157-*` — исходники `engine/` без `obj-*` (артефакты сборки в лимит кеша 10GB не влезут);
- `cargo-*` — реестр cargo для Rust-частей;
- `bun-*` — JS-зависимости по `bun.lock`.

Артефакт: `aer-browser-windows` (zip установщика из `engine/obj-*/dist/`).

## Структура

```
surfer.json            версия Firefox + бренд
configs/               mozconfig (common + windows)
branding/aer/          имя/иконки/ID приложения
src/browser/**.patch   минимальные патчи (держи хаки маленькими!)
src/zen/               наш UI: AerStartup, тема, будущие модули
prefs/aer/             дефолтные префы (yaml -> aer-prefs.js)
scripts/*.ts           тулчейн на Bun (import/build-ui/l10n)
.github/workflows/     CI: ui-check + windows build
```
