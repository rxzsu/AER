// scripts/build-ui.ts — быстрая проверка UI без полного билда движка.
// Запуск: bun scripts/build-ui.ts [--check]
const root = import.meta.dir + "/..";

const patches = ["src/zen/theme/aer-theme.css", "drafts/browser-xhtml.patch"];

let failed = 0;
for (const p of patches) {
  const f = Bun.file(`${root}/${p}`);
  if (!(await f.exists())) {
    console.error(`[aer/ui] missing: ${p}`);
    failed++;
    continue;
  }
  const text = await f.text();
  if (text.length < 10) {
    console.error(`[aer/ui] empty: ${p}`);
    failed++;
    continue;
  }
  console.log(`[aer/ui] ok: ${p} (${text.length} bytes)`);
}

const checkOnly = Bun.argv.includes("--check");

if (failed > 0) {
  console.error(`[aer/ui] FAILED (${failed})`);
  process.exit(1);
}
console.log(
  checkOnly ? "[aer/ui] check passed" : "[aer/ui] build-ui mvp passed (full build via `bun run build`)",
);
