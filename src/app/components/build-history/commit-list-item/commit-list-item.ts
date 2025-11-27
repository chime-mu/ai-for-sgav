import { Component, Input, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Commit } from '../../../models/content.model';

@Component({
  selector: 'app-commit-list-item',
  imports: [CommonModule],
  templateUrl: './commit-list-item.html',
  styleUrl: './commit-list-item.css',
})
export class CommitListItem {
  @Input() commit!: Commit;

  protected expanded = signal(false);
}
