const assert = require("node:assert/strict"),
  fs = require("node:fs"),
  path = require("node:path");
const { chromium } = require(process.env.PLAYWRIGHT_MODULE || "playwright");
(async () => {
  const browser = await chromium.launch({ headless: true });
  try {
    for (const width of [1440, 390, 320]) {
      const context = await browser.newContext({
        viewport: { width, height: 900 },
        isMobile: width < 651,
        hasTouch: width < 651,
      });
      const built = path.resolve(
        __dirname,
        "../dist",
      );
      await context.route("**/*", async (route) => {
        let file = decodeURIComponent(
          new URL(route.request().url()).pathname,
        ).replace(/^\/+/, "");
        if (!path.extname(file)) file = "index.html";
        file = path.resolve(built, file);
        if (!file.startsWith(built + path.sep) || !fs.existsSync(file))
          return route.fulfill({ status: 404, body: "Not found" });
        const mime = {
          ".html": "text/html; charset=utf-8",
          ".js": "application/javascript",
          ".css": "text/css",
          ".png": "image/png",
          ".jpg": "image/jpeg",
        };
        return route.fulfill({
          body: fs.readFileSync(file),
          contentType: mime[path.extname(file)] || "application/octet-stream",
        });
      });
      const page = await context.newPage();
      page.setDefaultTimeout(12000);
      const errors = [];
      page.on("pageerror", (e) => errors.push(e.message));
      await page.goto("http://127.0.0.1:4300/noticias");
      await page.locator("app-card").first().waitFor();
      const nav = page.getByRole("navigation", {
        name: "Navegación principal",
      });
      if (width < 651) {
        const menu = page.getByRole("button", {
          name: "Abrir menú de navegación",
        });
        await menu.waitFor();
        await nav.waitFor({state: "hidden"}); assert.equal(await nav.isVisible(), false);
        await menu.focus();
        await page.keyboard.press("Enter");
        await nav.waitFor();
        assert.equal(
          await page.locator(".menu-toggle").getAttribute("aria-expanded"),
          "true",
        );
        await page.locator(".menu-toggle").focus();
        await page.keyboard.press("Tab");
        assert.equal(
          await page.evaluate(() => document.activeElement.textContent.trim()),
          "Inicio",
        );
        await page.keyboard.press("Escape");
        await page.waitForFunction(
          () =>
            document
              .querySelector(".menu-toggle")
              .getAttribute("aria-expanded") === "false",
        );
        await nav.waitFor({state: "hidden"}); assert.equal(await nav.isVisible(), false);
        assert(
          await page
            .locator(".menu-toggle")
            .evaluate((el) => document.activeElement === el),
        );
        await page.locator(".menu-toggle").click();
        await nav
          .getByRole("link", { name: "Directorio", exact: true })
          .click();
        await page.waitForURL("**/directorio");
        await nav.waitFor({state: "hidden"}); assert.equal(await nav.isVisible(), false);
        await page.locator(".menu-toggle").click();
        await nav.getByRole("link", { name: "Noticias", exact: true }).click();
        await page.waitForURL("**/noticias");
      } else {
        assert.equal(await nav.getByRole("link").count(), 5);
        assert.equal(await page.locator(".menu-toggle").isVisible(), false);
      }
      await page.evaluate(() => window.scrollTo(0, 700));
      await page.waitForTimeout(100);
      const box = await page.locator(".site-navigation").boundingBox();
      assert(
        box.y >= -1 && box.y <= 1,
        "Navbar must stick: " + JSON.stringify(box),
      );
      assert(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= innerWidth + 1,
        ),
      );
      if (width < 651) {
        await page.locator(".menu-toggle").click();
        await nav.waitFor();
        await page
          .getByRole("heading", {
            name: "Una nueva mirada al arte cordobés",
            exact: true,
          })
          .click();
        await page.waitForURL("**/noticias/nueva-mirada-arte-cordobes");
        await nav.waitFor({state: "hidden"}); assert.equal(await nav.isVisible(), false);
        await page.locator(".menu-toggle").click();
        await nav.getByRole("link", { name: "Admin", exact: true }).click();
        await page.waitForURL("**/admin");
        await page
          .getByRole("heading", {
            name: "¡Hola, Cristian! ¿Qué novedades hay hoy?",
          })
          .waitFor();
        await page.goto("http://127.0.0.1:4300/noticias");
        const card = await page
          .locator(".editorial-card")
          .first()
          .boundingBox();
        assert(card.height < 230, "Compact cards must retain a modest height");
        await page.locator(".menu-toggle").click();
        await page.locator("footer").click();
        await nav.waitFor({state: "hidden"}); assert.equal(await nav.isVisible(), false);
      }
      if (process.env.SCREENSHOTS) {
        await page.emulateMedia({ reducedMotion: "reduce" });
        await page.locator("img").evaluateAll(async (imgs) => {
          await Promise.all(
            imgs.map((i) => {
              i.loading = "eager";
              return i.decode().catch(() => {});
            }),
          );
        });
        await page.evaluate(() => window.scrollTo(0, 0));
        await page.screenshot({
          path: path.join(
            process.env.SCREENSHOTS,
            "news-compact-" + width + ".png",
          ),
          fullPage: true,
        });
        await page.evaluate(() => window.scrollTo(0, 600));
        if (width < 651) await page.locator(".menu-toggle").click();
        await page.screenshot({
          path: path.join(
            process.env.SCREENSHOTS,
            "sticky-nav-" + width + ".png",
          ),
        });
      }
      await page.emulateMedia({ reducedMotion: "reduce" });
      if (width < 651)
        assert.equal(
          await page
            .locator(".hamburger i")
            .first()
            .evaluate((el) => getComputedStyle(el).transitionDuration),
          "0s",
        );
      assert.deepEqual(errors, []);
      console.log(
        width +
          "px: sticky navbar, responsive menu, keyboard, navigation, compact cards and overflow OK",
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


