import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

export type ViewType = 'home' | 'slides' | 'exercises' | 'history';

@Component({
  selector: 'app-header',
  imports: [CommonModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {
  @Input({ required: true }) activeView!: ViewType;
  @Output() viewChange = new EventEmitter<ViewType>();

  protected selectView(view: ViewType): void {
    this.viewChange.emit(view);
  }
}
