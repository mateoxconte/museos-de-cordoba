const fs = require("node:fs"),
  path = require("node:path"),
  assert = require("node:assert/strict");
const { chromium } = require(process.env.PLAYWRIGHT_MODULE || "playwright");
const base = "http://127.0.0.1:4300";
async function setup(browser, width, reducedMotion = "no-preference") {
  const c = await browser.newContext({
    viewport: { width, height: 844 },
    isMobile: width <= 850,
    hasTouch: width <= 850,
    reducedMotion,
  });
  const root = path.resolve(__dirname, "../dist");
  await c.route("**/*", (r) => {
    let f = decodeURIComponent(new URL(r.request().url()).pathname).replace(
      /^\/+/,
      "",
    );
    if (!path.extname(f)) f = "index.html";
    f = path.resolve(root, f);
    if (!f.startsWith(root + path.sep) || !fs.existsSync(f))
      return r.fulfill({ status: 404, body: "Not found" });
    const mime = {
      ".html": "text/html; charset=utf-8",
      ".js": "application/javascript",
      ".css": "text/css",
      ".png": "image/png",
      ".jpg": "image/jpeg",
    };
    return r.fulfill({
      contentType: mime[path.extname(f)] || "application/octet-stream",
      body: fs.readFileSync(f),
    });
  });
  return c;
}
(async () => {
  const browser = await chromium.launch({ headless: true });
  try {
    for (const width of [1440, 768, 390, 320]) {
      const c = await setup(browser, width);
      const p = await c.newPage();
      p.setDefaultTimeout(12000);
      const errors = [];
      p.on("pageerror", (e) => errors.push(e.message));
      await p.goto(base);
      await p
        .getByRole("heading", {
          name: "La cultura de Córdoba, de museo en museo",
          exact: true,
        })
        .waitFor();
      assert.equal(await p.locator("video").count(), 0);
      assert.equal(await p.locator(".entrance-hero.play-entrance").count(), 1);
      const sample = await p.locator(".entrance-hero").evaluate((hero) => {
        const a = hero.getAnimations({ subtree: true });
        a.forEach((x) => {
          x.pause();
          x.currentTime = 0;
        });
        const visual = hero.querySelector(".hero-visual");
        const initial = getComputedStyle(visual).clipPath;
        const side = getComputedStyle(hero).getPropertyValue("--arch-side");
        const outline = getComputedStyle(
          hero.querySelector(".arch-outline"),
        ).pointerEvents;
        a.forEach((x) => (x.currentTime = 700));
        const middle = getComputedStyle(visual).clipPath;
        const duration = Math.max(
          ...a.map((x) => {
            const t = x.effect.getTiming();
            return Number(t.duration) + Number(t.delay);
          }),
        );
        return { initial, middle, duration, side, outline };
      });
      assert.notEqual(sample.initial, sample.middle);
      assert(sample.duration >= 2500 && sample.duration <= 2800);
      assert.equal(sample.outline, "none");
      if (width <= 650) assert.equal(sample.side.trim(), "33%");
      if (process.env.SCREENSHOTS) {
        await p
          .locator(".entrance-hero")
          .evaluate((h) =>
            h
              .getAnimations({ subtree: true })
              .forEach((a) => (a.currentTime = 100)),
          );
        await p.screenshot({
          path: path.join(
            process.env.SCREENSHOTS,
            "home-arch-" + width + ".png",
          ),
        });
      }
      await p.locator(".entrance-hero").evaluate(async (h) => {
        const a = h.getAnimations({ subtree: true });
        a.forEach((x) => {
          x.currentTime = 0;
          x.play();
        });
        await Promise.all(a.map((x) => x.finished));
      });
      assert.equal(
        await p
          .locator(".hero-title")
          .evaluate((e) => getComputedStyle(e).opacity),
        "1",
      );
      const button = await p
        .getByRole("button", { name: "Explorá museos" })
        .boundingBox();
      assert(
        button.y + button.height < 844,
        "CTA should be visible at " + width,
      );
      const hero = await p.locator(".entrance-hero").boundingBox();
      assert(Math.abs(hero.width - width) < 2, "Full-width photo");
      assert(
        await p.evaluate(
          () => document.documentElement.scrollWidth <= innerWidth + 1,
        ),
      );
      if (process.env.SCREENSHOTS) {
        await p.screenshot({
          path: path.join(
            process.env.SCREENSHOTS,
            "home-redesign-" + width + ".png",
          ),
          fullPage: true,
        });
      }
      await p.getByRole("button", { name: "Explorá museos" }).click();
      await p.waitForFunction(() => {
        const y = document
          .getElementById("museum-search")
          .getBoundingClientRect().y;
        const bottom = document
          .querySelector(".site-navigation")
          .getBoundingClientRect().bottom;
        return y >= bottom && y <= bottom + 45;
      });
      assert(
        await p
          .locator("#museum-search")
          .evaluate((e) => document.activeElement === e),
      );
      assert(
        Math.abs((await p.locator(".site-navigation").boundingBox()).y) < 1,
      );
      await p
        .getByLabel("Localidad", { exact: true })
        .selectOption("Alta Gracia");
      await p
        .getByLabel("Tipo de museo", { exact: true })
        .selectOption("Ciencias naturales");
      await p.getByRole("button", { name: "Buscar museos" }).click();
      await p.waitForURL("**/directorio?*");
      await p
        .getByRole("link", { name: "Ver ficha: Museo de Ciencias Naturales" })
        .waitFor();
      assert.equal(
        await p.getByLabel("Localidad", { exact: true }).inputValue(),
        "Alta Gracia",
      );
      assert.equal(
        await p.getByLabel("Tipo de museo", { exact: true }).inputValue(),
        "Ciencias naturales",
      );
      assert.equal(await p.locator("app-card").count(), 1);
      if (width <= 850) {
        await p
          .getByRole("button", { name: "Abrir menú de navegación" })
          .click();
        await p
          .getByRole("navigation", { name: "Navegación principal" })
          .getByRole("link", { name: "Inicio", exact: true })
          .click();
        await p.locator("#site-menu").waitFor({ state: "hidden" });
      } else
        await p
          .locator("#site-menu")
          .getByRole("link", { name: "Inicio", exact: true })
          .click();
      await p.waitForURL(base + "/");
      await p.locator(".entrance-hero").waitFor();
      assert.equal(await p.locator(".play-entrance").count(), 0);
      assert.equal(
        await p
          .locator(".entrance-hero")
          .evaluate((e) => e.getAnimations({ subtree: true }).length),
        0,
      );
      await p.locator(".home-content app-card .text-link").first().click();
      await p.waitForURL("**/noticias/*");
      await p.locator(".compact-brand").click();
      await p.locator(".entrance-hero").waitFor();
      assert.equal(await p.locator(".play-entrance").count(), 0);
      await p
        .getByLabel("Correo electrónico", { exact: true })
        .fill("demo@ejemplo.com");
      await p.getByRole("button", { name: "Suscribirme" }).click();
      await p
        .getByText("¡Listo! Completaste la suscripción de prueba.")
        .waitFor();
      if (width <= 850) {
        await p
          .getByRole("button", { name: "Abrir menú de navegación" })
          .click();
        await p.keyboard.press("Escape");
        await p.locator("#site-menu").waitFor({ state: "hidden" });
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
      assert.deepEqual(errors, []);
      await c.close();
      console.log(
        width +
          "px: arco CSS 2,6s, sin repetición, CTA visible, buscador filtrado, menú y newsletter OK",
      );
      const reduced = await setup(browser, width, "reduce");
      const rp = await reduced.newPage();
      await rp.goto(base);
      await rp.locator(".hero-title").waitFor();
      assert.equal(
        await rp
          .locator(".hero-visual")
          .evaluate((e) => getComputedStyle(e).clipPath),
        "none",
      );
      assert.equal(await rp.locator(".arch-outline").isVisible(), false);
      assert.equal(
        await rp
          .locator(".hero-title")
          .evaluate((e) => getComputedStyle(e).opacity),
        "1",
      );
      assert.equal(
        await rp
          .locator(".entrance-hero")
          .evaluate((e) => e.getAnimations({ subtree: true }).length),
        0,
      );
      await reduced.close();
    }
  } finally {
    await browser.close();
  }
})().catch((e) => {
  console.error(e);
  process.exit(1);
});
