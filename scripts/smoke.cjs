const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const { chromium } = require(process.env.PLAYWRIGHT_MODULE || "playwright");
const base = process.env.DEMO_URL || "http://127.0.0.1:4300";
(async () => {
  const browser = await chromium.launch({ headless: true });
  for (const mobile of [false, true]) {
    const context = await browser.newContext({
      viewport: mobile
        ? { width: 390, height: 844 }
        : { width: 1440, height: 1000 },
      isMobile: mobile,
      hasTouch: mobile,
    });
    if (process.env.STATIC_DEMO) {
      const built = path.resolve(
        __dirname,
        "../dist",
      );
      await context.route("**/*", async (route) => {
        const url = new URL(route.request().url());
        let relative = decodeURIComponent(url.pathname).replace(/^\/+/, "");
        if (!path.extname(relative)) relative = "index.html";
        const file = path.resolve(built, relative);
        if (!file.startsWith(built + path.sep) || !fs.existsSync(file)) {
          await route.fulfill({ status: 404, body: "Not found" });
          return;
        }
        const mime = {
          ".html": "text/html; charset=utf-8",
          ".js": "application/javascript",
          ".css": "text/css",
          ".jpg": "image/jpeg",
          ".png": "image/png",
        };
        await route.fulfill({
          status: 200,
          contentType: mime[path.extname(file)] || "application/octet-stream",
          body: fs.readFileSync(file),
        });
      });
    }
    const page = await context.newPage();
    const errors = [];
    const openNavigation = async () => {
      if (mobile && !(await page.locator("#site-menu").isVisible()))
        await page
          .getByRole("button", { name: "Abrir menú de navegación" })
          .click();
    };
    page.on("pageerror", (e) => errors.push(e.message));
    await page.goto(base);
    await page
      .getByRole("heading", {
        name: "Una nueva mirada al arte cordobés",
        exact: true,
      })
      .click();
    await page.waitForURL("**/noticias/nueva-mirada-arte-cordobes");
    await page.getByRole("link", { name: "← Volver a noticias" }).click();
    await page.getByRole("button", { name: "Patrimonio", exact: true }).click();
    await page
      .getByRole("searchbox", { name: "Buscar una noticia" })
      .fill("originarias");
    await page.waitForTimeout(300);
    assert.equal(await page.locator("app-card").count(), 1);
    await page
      .getByRole("link", {
        name: "Leer nota: Piezas originarias vuelven a exhibirse en Córdoba",
      })
      .click();
    await page.getByRole("link", { name: "← Volver a noticias" }).click();
    await page.waitForTimeout(200);
    assert.equal(await page.getByRole("searchbox").inputValue(), "originarias");
    assert.equal(
      await page
        .getByRole("button", { name: "Patrimonio", exact: true })
        .getAttribute("aria-pressed"),
      "true",
    );
    await page.getByRole("searchbox").fill("zzzzzz");
    await page.waitForTimeout(200);
    assert.equal(
      await page
        .getByRole("heading", { name: "No encontramos esa noticia" })
        .count(),
      1,
    );
    await page.getByRole("button", { name: "Ver todas las noticias" }).click();
    await openNavigation();
    await page
      .locator("#site-menu")
      .getByRole("link", { name: "Inicio", exact: true })
      .click();
    await page
      .getByLabel("Localidad", { exact: true })
      .selectOption("Alta Gracia");
    await page.getByRole("button", { name: "Buscar museos" }).click();
    await page.waitForURL("**/directorio?localidad=*");
    await page.waitForFunction(
      () => document.querySelector("#city")?.value === "Alta Gracia",
    );
    assert.equal(
      await page.getByLabel("Localidad", { exact: true }).inputValue(),
      "Alta Gracia",
    );
    assert.equal(await page.locator("app-card").count(), 2);
    await page
      .getByRole("link", { name: "Ver ficha: Museo de Ciencias Naturales" })
      .click();
    await page
      .getByRole("heading", { name: "Información para tu visita" })
      .waitFor();
    await page.getByRole("link", { name: "← Volver al directorio" }).click();
    await page.waitForFunction(
      () => document.querySelector("#city")?.value === "Alta Gracia",
    );
    assert.equal(
      await page.getByLabel("Localidad", { exact: true }).inputValue(),
      "Alta Gracia",
    );
    await page.getByRole("button", { name: "Limpiar filtros" }).click();
    await page.waitForTimeout(150);
    assert.equal(await page.locator("app-card").count(), 6);
    await page.getByLabel("Buscar por nombre").fill("ceramica");
    await page.getByRole("button", { name: "Buscar", exact: true }).click();
    await page.waitForTimeout(150);
    assert.equal(await page.locator("app-card").count(), 1);
    await page
      .getByLabel("Localidad", { exact: true })
      .selectOption("Alta Gracia");
    await page.getByRole("button", { name: "Buscar", exact: true }).click();
    await page
      .getByRole("heading", { name: "No encontramos museos con estos filtros" })
      .waitFor();
    await page.getByRole("button", { name: "Ver todos los museos" }).click();
    await openNavigation();
    await page
      .locator("#site-menu")
      .getByRole("link", { name: "Newsletter", exact: true })
      .click();
    await page.getByRole("link", { name: "Leer edición de ejemplo" }).click();
    await page
      .getByRole("heading", { name: "Volver a mirar, cerca de casa" })
      .waitFor();
    await page.getByRole("link", { name: "← Volver al Newsletter" }).click();
    await page
      .getByLabel("Correo electrónico", { exact: true })
      .fill("correo-invalido");
    await page.getByRole("button", { name: "Suscribirme" }).click();
    await page.getByRole("alert").waitFor({ state: "visible" });
    await page
      .getByLabel("Correo electrónico", { exact: true })
      .fill("cristian@ejemplo.com");
    await page.getByRole("button", { name: "Suscribirme" }).click();
    await page
      .getByText("¡Listo! Completaste la suscripción de prueba.")
      .waitFor();
    assert.equal(
      await page.getByLabel("Correo electrónico", { exact: true }).inputValue(),
      "",
    );
    assert.equal(await page.evaluate(() => localStorage.length), 0);
    await openNavigation();
    await page
      .locator("#site-menu")
      .getByRole("link", { name: "Inicio", exact: true })
      .click();
    await page
      .getByLabel("Correo electrónico", { exact: true })
      .fill("inicio@ejemplo.com");
    await page.getByRole("button", { name: "Suscribirme" }).click();
    await page
      .getByText("¡Listo! Completaste la suscripción de prueba.")
      .waitFor();
    for (const route of [
      "/",
      "/noticias",
      "/directorio",
      "/newsletter",
      "/noticias/muestra-en-familia",
      "/directorio/ciencias-naturales",
      "/newsletter/edicion-de-ejemplo",
    ]) {
      await page.goto(base + route);
      await page.locator("h1").waitFor();
      await page.waitForTimeout(100);
      assert(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= innerWidth + 1,
        ),
        "Horizontal overflow: " + route,
      );
      const broken = await page
        .locator("img")
        .evaluateAll((imgs) =>
          imgs.filter((i) => !i.complete || !i.naturalWidth).map((i) => i.src),
        );
      assert.deepEqual(broken, [], "Broken images: " + route);
      if (
        process.env.SCREENSHOTS &&
        ["/noticias", "/directorio", "/newsletter"].includes(route)
      ) {
        await page.screenshot({
          path:
            process.env.SCREENSHOTS +
            "/" +
            (mobile ? "mobile" : "desktop") +
            route.replaceAll("/", "-") +
            ".png",
          fullPage: true,
        });
      }
    }
    await page.goto(base);
    await page.locator("main").focus();
    await page.keyboard.press("Tab");
    assert(
      await page.evaluate(() => document.activeElement?.tagName === "BUTTON"),
    );
    await openNavigation();
    await page
      .locator("#site-menu")
      .getByRole("link", { name: "Noticias", exact: true })
      .focus();
    await page.keyboard.press("Enter");
    await page.waitForURL("**/noticias");
    assert.equal(
      await page
        .locator("#site-menu")
        .getByRole("link", {
          name: "Noticias",
          exact: true,
          includeHidden: true,
        })
        .getAttribute("aria-current"),
      "page",
    );
    await page.emulateMedia({ reducedMotion: "reduce" });
    assert.equal(
      await page
        .locator("app-noticias")
        .evaluate((el) => getComputedStyle(el).animationName),
      "none",
    );
    await page.goto(base + "/newsletter");
    await page
      .getByLabel("Correo electrónico", { exact: true })
      .fill("movimiento@ejemplo.com");
    await page.getByRole("button", { name: "Suscribirme" }).click();
    assert.equal(
      await page
        .locator(".success svg path")
        .evaluate((el) => getComputedStyle(el).strokeDashoffset),
      "0px",
    );
    assert.deepEqual(errors, []);
    console.log(
      (mobile ? "Móvil 390px" : "Escritorio 1440px") +
        ": recorridos y accesibilidad básica OK",
    );
    if (process.env.SCREENSHOTS) {
      await page.goto(base);
      await page.screenshot({
        path:
          process.env.SCREENSHOTS +
          "/" +
          (mobile ? "mobile" : "desktop") +
          ".png",
        fullPage: true,
      });
    }
    await context.close();
  }
  await browser.close();
  console.log("Todos los recorridos pasaron.");
})().catch((e) => {
  console.error(e);
  process.exit(1);
});

