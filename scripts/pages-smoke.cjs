const fs = require("node:fs"),
  path = require("node:path"),
  assert = require("node:assert/strict");
const { chromium } = require(process.env.PLAYWRIGHT_MODULE || "playwright");
(async () => {
  const browser = await chromium.launch({ headless: true });
  try {
    for (const width of [1440, 390]) {
      const context = await browser.newContext({
        viewport: { width, height: 844 },
        reducedMotion: "reduce",
        isMobile: width < 651,
        hasTouch: width < 651,
      });
      const missing = [],
        errors = [];
      const prefix = "/museos-de-cordoba/";
      const root = path.resolve(__dirname, "../dist");
      await context.route("**/*", (r) => {
        const u = new URL(r.request().url());
        let relative = u.pathname;
        if (!relative.startsWith(prefix)) {
          missing.push(relative);
          return r.fulfill({ status: 404, body: "Not found" });
        }
        relative = relative.slice(prefix.length) || "index.html";
        const file = path.resolve(root, relative);
        if (!file.startsWith(root + path.sep) || !fs.existsSync(file)) {
          missing.push(relative);
          return r.fulfill({ status: 404, body: "Not found" });
        }
        const types = {
          ".html": "text/html; charset=utf-8",
          ".js": "application/javascript",
          ".css": "text/css",
          ".jpg": "image/jpeg",
          ".png": "image/png",
        };
        return r.fulfill({
          body: fs.readFileSync(file),
          contentType: types[path.extname(file)] || "application/octet-stream",
        });
      });
      const p = await context.newPage();
      p.on("pageerror", (e) => errors.push(e.message));
      const base = "https://pages.local" + prefix;
      await p.goto(base);
      await p
        .getByRole("heading", {
          name: "La cultura de Córdoba, de museo en museo",
          exact: true,
        })
        .waitFor();
      const checkImages = async () => {
        await p.locator("img").evaluateAll(async (imgs) => {
          await Promise.all(
            imgs.map(async (i) => {
              i.loading = "eager";
              await i.decode().catch(() => {});
            }),
          );
        });
        await p.waitForFunction(() =>
          Array.from(document.images).every(
            (i) => i.getAttribute("src") && i.complete && i.naturalWidth > 0,
          ),
        );
        assert.deepEqual(
          await p
            .locator("img")
            .evaluateAll((imgs) =>
              imgs.filter((i) => !i.naturalWidth).map((i) => i.src),
            ),
          [],
        );
      };
      await checkImages();
      await p.getByRole("button", { name: "Explorá museos" }).click();
      await p
        .getByLabel("Localidad", { exact: true })
        .selectOption("Alta Gracia");
      await p.getByRole("button", { name: "Buscar museos" }).click();
      await p.waitForURL("**/#/directorio?*");
      await p
        .getByRole("link", { name: "Ver ficha: Museo de Ciencias Naturales" })
        .click();
      await p.waitForURL("**/#/directorio/ciencias-naturales?*");
      await checkImages();
      await p.reload();
      await p
        .getByRole("heading", {
          name: "Museo de Ciencias Naturales",
          exact: true,
        })
        .waitFor();
      await p.goto(base + "#/admin");
      await p
        .getByRole("heading", {
          name: "¡Hola, Cristian! ¿Qué novedades hay hoy?",
        })
        .waitFor();
      await p.reload();
      await p
        .getByRole("link", { name: "Crear noticia", exact: false })
        .waitFor();
      const url = p.url();
      await p.locator(".skip").focus();
      await p.keyboard.press("Enter");
      assert.equal(p.url(), url);
      assert(
        await p
          .locator("#contenido")
          .evaluate((e) => document.activeElement === e),
      );
      await p
        .getByRole("link", { name: "Crear noticia", exact: false })
        .click();
      await p.getByRole("heading", { name: "Editor de noticia" }).waitFor();
      await checkImages();
      for (const route of [
        "noticias",
        "newsletter",
        "newsletter/edicion-de-ejemplo",
      ]) {
        await p.goto(base + "#/" + route);
        await p.locator("h1").waitFor();
        await checkImages();
      }
      if (width < 651) {
        await p
          .getByRole("button", { name: "Abrir menú de navegación" })
          .click();
        await p
          .locator("#site-menu")
          .getByRole("link", { name: "Admin", exact: true })
          .click();
        await p
          .getByRole("heading", {
            name: "¡Hola, Cristian! ¿Qué novedades hay hoy?",
          })
          .waitFor();
      }
      assert.deepEqual(missing, []);
      assert.deepEqual(errors, []);
      assert(
        await p.evaluate(
          () => document.documentElement.scrollWidth <= innerWidth + 1,
        ),
      );
      console.log(
        width +
          "px: Pages en subcarpeta, imágenes, rutas hash, recarga, buscador, accesibilidad y Admin OK",
      );
      await context.close();
    }
  } finally {
    await browser.close();
  }
})().catch((e) => {
  console.error(e);
  process.exit(1);
});
