import assert from "node:assert/strict";
import { access, readFile } from "node:fs/promises";
import test from "node:test";

async function renderWorker() {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}`);
  const { default: worker } = await import(workerUrl.href);

  return worker.fetch(
    new Request("http://localhost/", { headers: { accept: "text/html" } }),
    { ASSETS: { fetch: async () => new Response("Not found", { status: 404 }) } },
    { waitUntil() {}, passThroughOnException() {} },
  );
}

test("Sites and Cloudflare worker renders the comic homepage", async () => {
  const response = await renderWorker();
  assert.equal(response.status, 200);
  assert.match(response.headers.get("content-type") ?? "", /^text\/html\b/i);

  const html = await response.text();
  assert.match(html, /<title>蓝莓谷异闻录｜第一季<\/title>/);
  assert.match(html, /皮影班最后一个观众/);
  assert.match(html, /收走所有故事的无名兽/);
  assert.doesNotMatch(html, /codex-preview|Your site is taking shape/);
});

test("Vercel build produces an independent static entry", async () => {
  const html = await readFile(
    new URL("../dist-vercel/index.html", import.meta.url),
    "utf8",
  );

  assert.match(html, /<title>蓝莓谷异闻录｜第一季<\/title>/);
  assert.match(html, /<div id="root"><\/div>/);
  assert.match(html, /type="module"/);
  assert.doesNotMatch(html, /%SITE_ORIGIN%/);
  assert.match(
    html,
    /https:\/\/blueberry-valley-tales\.littlezhangsan\.workers\.dev\/og\.png/,
  );
});

test("Vercel build contains every finished comic page", async () => {
  const checks = [];
  for (const edition of ["comics", "comics-original"]) {
    for (let chapter = 1; chapter <= 12; chapter += 1) {
      for (let page = 1; page <= 8; page += 1) {
        const chapterName = String(chapter).padStart(2, "0");
        const pageName = String(page).padStart(2, "0");
        checks.push(
          access(
            new URL(
              `../dist-vercel/${edition}/${chapterName}/${pageName}.webp`,
              import.meta.url,
            ),
          ),
        );
      }
    }
  }
  await Promise.all(checks);
});
