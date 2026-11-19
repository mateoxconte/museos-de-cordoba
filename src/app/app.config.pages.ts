import { ApplicationConfig } from "@angular/core";
import {
  provideRouter,
  withHashLocation,
  withInMemoryScrolling,
  withComponentInputBinding,
} from "@angular/router";
import { routes } from "./app.routes";

// GitHub Pages serves static files; hash URLs support direct links and reloads.
export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(
      routes,
      withHashLocation(),
      withComponentInputBinding(),
      withInMemoryScrolling({
        scrollPositionRestoration: "enabled",
        anchorScrolling: "enabled",
      }),
    ),
  ],
};
