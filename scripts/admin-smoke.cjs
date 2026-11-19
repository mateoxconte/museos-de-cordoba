const assert = require("node:assert/strict"),
  fs = require("node:fs"),
  path = require("node:path");
const { chromium } = require(process.env.PLAYWRIGHT_MODULE || "playwright");
const base = process.env.DEMO_URL || "http://127.0.0.1:4300";
(async () => {
  const browser = await chromium.launch({ headless: true });
  try {
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
          if (!file.startsWith(built + path.sep) || !fs.existsSync(file))
            return route.fulfill({ status: 404, body: "Not found" });
          const mime = {
            ".html": "text/html; charset=utf-8",
            ".js": "application/javascript",
            ".css": "text/css",
            ".jpg": "image/jpeg",
            ".png": "image/png",
          };
          return route.fulfill({
            status: 200,
            contentType: mime[path.extname(file)] || "application/octet-stream",
            body: fs.readFileSync(file),
          });
        });
      }
      const page = await context.newPage();
      page.setDefaultTimeout(12000);
      const errors = [];
      page.on("pageerror", (e) => errors.push(e.message));
      const waitText = async (text) =>
        page.getByText(text, { exact: true }).waitFor();
      const title = "Una nueva sala para descubrir Córdoba";
      await page.goto(base + "/admin");
      await page
        .getByRole("heading", {
          name: "¡Hola, Cristian! ¿Qué novedades hay hoy?",
        })
        .waitFor();
      await page
        .getByRole("link", { name: "Crear noticia", exact: false })
        .click();
      await page.getByRole("button", { name: "Publicar en la demo" }).click();
      await waitText("Completá el título.");
      await page.getByLabel("Título", { exact: false }).first().fill(title);
      await page
        .getByLabel("Resumen")
        .fill("Una invitación de prueba para descubrir nuestra cultura.");
      await page
        .getByLabel("Cuerpo")
        .fill(
          "Primer párrafo de la noticia de ejemplo.\n\nSegundo párrafo para descubrir el museo.",
        );
      await page.getByLabel("Imagen de portada").selectOption("arte");
      await page
        .getByRole("button", { name: "Guardar borrador", exact: true })
        .click();
      await waitText(
        "Borrador guardado. El portal conserva la última versión publicada.",
      );
      const editUrl = page.url();
      await page.goto(base + "/admin");
      await page.getByRole("heading", { name: "Actividad reciente" }).waitFor();
      await page.getByRole("link", { name: "Continuar borrador" }).click();
      assert.equal(
        await page.getByLabel("Título", { exact: false }).first().inputValue(),
        title,
      );
      await page
        .getByRole("button", { name: "Vista previa", exact: true })
        .click();
      await page
        .locator("#editor-preview")
        .getByRole("heading", { name: title, exact: true })
        .waitFor();
      assert(
        !JSON.parse(
          await page.evaluate(() =>
            localStorage.getItem("museos-cordoba-editorial-demo-v1"),
          ),
        ).notes[0].published,
      );
      await page.getByRole("button", { name: "Cerrar vista previa" }).click();
      await page.goto(base + "/noticias");
      assert.equal(
        await page.getByRole("heading", { name: title, exact: true }).count(),
        0,
      );
      await page.goto(editUrl);
      await page.getByRole("button", { name: "Publicar en la demo" }).click();
      await waitText("Noticia publicada en la demo.");
      await page.getByLabel("Destacar en Inicio").click();
      await waitText(
        "Inicio admite hasta 3 destacadas. Desmarcá una antes de elegir otra.",
      );
      assert.equal(
        await page.getByLabel("Destacar en Inicio").isChecked(),
        false,
      );
      await page.getByRole("link", { name: "← Volver a Noticias" }).click();
      const first = page.locator(".admin-row").filter({
        has: page.getByRole("heading", {
          name: "Una nueva mirada al arte cordobés",
          exact: true,
        }),
      });
      await first.getByLabel("Destacar en Inicio").uncheck();
      const created = page.locator(".admin-row").filter({
        has: page.getByRole("heading", { name: title, exact: true }),
      });
      await created.getByLabel("Destacar en Inicio").check();
      await page.goto(base);
      await page.getByRole("heading", { name: title, exact: true }).waitFor();
      await page.goto(base + "/noticias");
      await page.getByRole("link", { name: "Leer nota: " + title }).click();
      await page
        .getByText("Segundo párrafo para descubrir el museo.")
        .waitFor();
      // Published content remains intact when changes are only a draft.
      await page.goto(editUrl);
      await page.getByLabel("Resumen").fill("Resumen aún no publicado");
      await page
        .getByRole("button", { name: "Guardar borrador", exact: true })
        .click();
      await page.getByRole("link", { name: "Ver versión pública" }).click();
      await waitText(
        "Una invitación de prueba para descubrir nuestra cultura.",
      );
      assert.equal(
        await page
          .getByText("Resumen aún no publicado", { exact: true })
          .count(),
        0,
      );
      await page.goto(base + "/admin/newsletter/nueva");
      await page.getByRole("button", { name: "Simular envío" }).click();
      await waitText("Completá el asunto.");
      await page
        .getByLabel("Asunto", { exact: false })
        .fill("Una edición especial de Córdoba");
      await page
        .getByLabel("Título de la edición")
        .fill("Historias para descubrir");
      await page
        .getByLabel("Introducción")
        .fill("Bienvenidos a esta edición de prueba.");
      await page.getByLabel("Noticia publicada").selectOption({ label: title });
      await page
        .getByRole("button", { name: "Agregar noticia publicada", exact: true })
        .click();
      await page
        .getByRole("button", {
          name: "Agregar contenido exclusivo",
          exact: true,
        })
        .click();
      await page
        .getByLabel("Título del bloque 2")
        .fill("Una carta para nuestros lectores");
      const exclusive =
        "EXCLUSIVO: una reflexión inédita que vive solo en esta edición.";
      await page.getByLabel("Texto exclusivo 2").fill(exclusive);
      await page
        .getByRole("button", { name: "Subir bloque 2", exact: true })
        .click();
      assert.equal(
        await page
          .locator(".edition-block")
          .first()
          .getByLabel("Texto exclusivo 1")
          .inputValue(),
        exclusive,
      );
      await page
        .getByRole("button", {
          name: "Agregar contenido exclusivo",
          exact: true,
        })
        .click();
      await page
        .getByRole("button", { name: "Quitar bloque 3", exact: true })
        .click();
      await page
        .getByRole("button", { name: "Vista previa", exact: true })
        .click();
      const preview = page.locator("#editor-preview");
      await preview
        .getByRole("heading", { name: "Historias para descubrir" })
        .waitFor();
      await preview.getByText(exclusive, { exact: true }).waitFor();
      assert.equal(
        await preview
          .locator(".email-block")
          .first()
          .getByRole("heading")
          .innerText(),
        "Una carta para nuestros lectores",
      );
      await page.getByRole("button", { name: "Cerrar vista previa" }).click();
      await page
        .getByRole("button", { name: "Guardar borrador", exact: true })
        .click();
      await waitText("Borrador de newsletter guardado.");
      const editionUrl = page.url();
      await page.reload();
      await page.getByLabel("Asunto", { exact: false }).waitFor();
      assert.equal(
        await page.getByLabel("Texto exclusivo 1").inputValue(),
        exclusive,
      );
      await page.getByRole("button", { name: "Simular envío" }).click();
      await waitText("Envío simulado. No se envió ningún correo");
      await page.goto(base + "/admin");
      await waitText("Envío simulado");
      for (const url of ["/noticias", "/newsletter/edicion-de-ejemplo"]) {
        await page.goto(base + url);
        await page.locator("h1").waitFor();
        assert.equal(
          await page.getByText(exclusive, { exact: true }).count(),
          0,
        );
      }
      await page.goto(base + "/admin/directorio");
      await page
        .getByRole("link", {
          name: "Editar museo: Museo de Ciencias Naturales",
        })
        .click();
      const hours = "Lunes a sábado, de 9 a 20 h (demo)";
      await page.getByLabel("Horarios", { exact: true }).fill(hours);
      await page.getByRole("button", { name: "Guardar ficha" }).click();
      await waitText("Ficha actualizada en el directorio de la demo.");
      await page.getByRole("link", { name: "Ver ficha pública" }).click();
      await waitText(hours);
      await page.reload();
      await waitText(hours);
      // Check creating a museum, not only editing it.
      await page.goto(base + "/admin/directorio/nueva");
      for (const [label, value] of [
        ["Nombre del museo", "Museo de las Memorias"],
        ["Localidad", "Cosquín"],
        ["Tipo de museo", "Historia"],
        ["Dirección", "Calle de ejemplo 10"],
        ["Horarios", "De 10 a 18 h"],
        ["Descripción", "Una ficha nueva de ejemplo."],
        ["Contacto", "Recepción de la demo"],
      ])
        await page.getByLabel(label, { exact: true }).fill(value);
      await page.getByRole("button", { name: "Guardar ficha" }).click();
      await waitText("Ficha actualizada en el directorio de la demo.");
      await page.getByRole("link", { name: "Ver ficha pública" }).click();
      await page
        .getByRole("heading", { name: "Museo de las Memorias", exact: true })
        .waitFor();
      await page.goto(base + "/directorio");
      await page
        .getByLabel("Localidad", { exact: true })
        .selectOption("Cosquín");
      await page.getByRole("button", { name: "Buscar", exact: true }).click();
      await page
        .getByRole("link", { name: "Ver ficha: Museo de las Memorias" })
        .waitFor();
      for (const url of [
        "/admin",
        "/admin/noticias",
        editUrl.replace(base, ""),
        "/admin/newsletter",
        editionUrl.replace(base, ""),
        "/admin/directorio",
        "/admin/directorio/ciencias-naturales",
      ]) {
        await page.goto(base + url);
        await page.locator("h1").waitFor();
        assert(
          await page.evaluate(
            () => document.documentElement.scrollWidth <= innerWidth + 1,
          ),
          "overflow " + url,
        );
        const broken = await page
          .locator("img")
          .evaluateAll((imgs) =>
            imgs
              .filter((i) => !i.complete || !i.naturalWidth)
              .map((i) => i.src),
          );
        assert.deepEqual(broken, []);
      }
      await page.goto(base + "/noticias");
      await page
        .getByLabel("Buscar una noticia")
        .pressSequentially("originarias", { delay: 60 });
      await page.waitForTimeout(250);
      assert.equal(
        await page.getByLabel("Buscar una noticia").inputValue(),
        "originarias",
      );
      assert(
        await page
          .getByLabel("Buscar una noticia")
          .evaluate((el) => document.activeElement === el),
      );
      await page.emulateMedia({ reducedMotion: "reduce" });
      await page.goto(base + "/admin");
      assert.equal(
        await page
          .locator("app-admin-dashboard")
          .evaluate((el) => getComputedStyle(el).animationName),
        "none",
      );
      if (process.env.SCREENSHOTS) {
        await page.screenshot({
          path: path.join(
            process.env.SCREENSHOTS,
            mobile ? "admin-mobile.png" : "admin-desktop.png",
          ),
          fullPage: true,
        });
        await page.goto(editionUrl);
        await page
          .getByRole("button", { name: "Vista previa", exact: true })
          .click();
        await page.screenshot({
          path: path.join(
            process.env.SCREENSHOTS,
            mobile ? "admin-editor-mobile.png" : "admin-editor-desktop.png",
          ),
          fullPage: true,
        });
      }
      await page.goto(base + "/admin/noticias");
      await page
        .getByRole("heading", { name: "Noticias", exact: true })
        .waitFor();
      const featured = page.locator('input[type="checkbox"]:checked');
      while (await featured.count()) await featured.first().uncheck();
      await page.goto(base);
      await page
        .getByRole("heading", {
          name: "La cultura de Córdoba, de museo en museo",
          exact: true,
        })
        .waitFor();
      assert.equal(await page.locator(".hero").count(), 0);
      assert.deepEqual(errors, []);
      console.log(
        (mobile ? "Móvil" : "Escritorio") +
          ": borrador, publicación, destacados, newsletter mixto, orden, envío simulado, museos, persistencia y foco OK",
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

