import { Component, signal, inject, OnInit } from '@angular/core';
import { ContentLoaderService } from './services/content-loader.service';
import { SlidesContainerComponent } from './components/slides/slides-container.component';
import { ExercisesContainerComponent } from './components/exercises/exercises-container.component';
import { HeaderComponent, ViewType } from './components/header/header.component';

@Component({
  selector: 'app-root',
  imports: [SlidesContainerComponent, ExercisesContainerComponent, HeaderComponent],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App implements OnInit {
  private contentLoader = inject(ContentLoaderService);
  protected readonly title = signal('ai-for-sgav');
  protected activeView = signal<ViewType>('slides');

  ngOnInit(): void {
    // Test content loading
    this.contentLoader.content$.subscribe(content => {
      if (content) {
        console.log('Content loaded in AppComponent:', {
          slidesCount: content.slides.length,
          exercisesCount: content.exercises.length,
          jokesCount: content.angularJokes.length,
          metadata: content.metadata
        });
      }
    });
  }

  protected onViewChange(view: ViewType): void {
    this.activeView.set(view);
  }
}
