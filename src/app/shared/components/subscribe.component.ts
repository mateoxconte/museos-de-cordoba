import { Component, input, signal } from "@angular/core";
import { FormControl, ReactiveFormsModule, Validators } from "@angular/forms";
@Component({
  selector: "app-subscribe",
  imports: [ReactiveFormsModule],
  template: `<form
    (submit)="submit($event)"
    novalidate
    [class.compact]="compact()"
  >
    <div class="email-field">
      <label [for]="fieldId">Correo electrónico</label
      ><input
        [id]="fieldId"
        type="email"
        autocomplete="email"
        placeholder="Tu correo"
        [formControl]="email"
        [attr.aria-invalid]="email.touched && email.invalid"
        [attr.aria-describedby]="fieldId + '-help'"
      />
    </div>
    <button class="button" type="submit">
      Suscribirme <span aria-hidden="true">→</span>
    </button>
    <div class="form-feedback" [id]="fieldId + '-help'">
      <p
        class="error"
        role="alert"
        [hidden]="!(email.touched && email.invalid)"
      >
        Ingresá un correo válido, por ejemplo nombre@correo.com.
      </p>
      <div role="status" aria-live="polite">
        @if (done()) {
          <p class="success">
            <svg viewBox="0 0 32 32" aria-hidden="true">
              <circle cx="16" cy="16" r="14" />
              <path d="m9 16 5 5 9-10" /></svg
            >¡Listo! Completaste la suscripción de prueba.
          </p>
        }
      </div>
      <small
        >Prueba de la demo: no guardamos tu correo ni enviamos mensajes.</small
      >
    </div>
  </form>`,
})
export class SubscribeComponent {
  static nextId = 0;
  fieldId = "correo-" + SubscribeComponent.nextId++;
  compact = input(false);
  done = signal(false);
  email = new FormControl("", {
    nonNullable: true,
    validators: [
      Validators.required,
      Validators.email,
      Validators.pattern(/^[^\s@]+@[^\s@]+\.[^\s@]+$/),
    ],
  });
  submit(event: Event) {
    event.preventDefault();
    this.email.markAsTouched();
    if (this.email.invalid) {
      this.done.set(false);
      document.getElementById(this.fieldId)?.focus();
      return;
    }
    this.email.reset();
    this.done.set(true);
  }
}
