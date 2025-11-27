import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ContentLoaderService } from '../../../services/content-loader.service';
import { CommitListItem } from '../commit-list-item/commit-list-item';
import { Observable } from 'rxjs';
import { Commit, BuildHistory } from '../../../models/content.model';

@Component({
  selector: 'app-build-history-container',
  imports: [CommonModule, CommitListItem],
  templateUrl: './build-history-container.html',
  styleUrl: './build-history-container.css',
})
export class BuildHistoryContainer {
  private contentLoader = inject(ContentLoaderService);

  protected commits$: Observable<Commit[]> = this.contentLoader.commits$;
  protected buildHistory$: Observable<BuildHistory | null> = this.contentLoader.buildHistory$;
}
