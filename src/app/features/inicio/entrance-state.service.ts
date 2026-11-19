import { Injectable } from "@angular/core";
@Injectable({ providedIn: "root" })
export class EntranceState {
  private visited = false;
  claim() {
    const animate = !this.visited;
    this.visited = true;
    return animate;
  }
}
