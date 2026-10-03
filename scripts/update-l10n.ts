// scripts/update-l10n.ts — заглушка: фиксируем хеш l10n для воспроизводимости.
// Запуск: bun scripts/update-l10n.ts
const root = import.meta.dir + "/..";
await Bun.$`mkdir -p ${root}/build/firefox-cache`.quiet();
await Bun.write(`${root}/build/firefox-cache/l10n-last-commit-hash`, "ff157-mvp\n");
console.log("[aer/l10n] pinned mvp hash");
