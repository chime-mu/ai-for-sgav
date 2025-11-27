import { Injectable, inject } from '@angular/core';
import { BehaviorSubject, Observable, combineLatest, map } from 'rxjs';
import { ContentLoaderService } from './content-loader.service';
import { Slide } from '../models/content.model';

@Injectable({
  providedIn: 'root'
})
export class SlidesStateService {
  private contentLoader = inject(ContentLoaderService);

  // Current slide index (0-based)
  private currentIndexSubject = new BehaviorSubject<number>(0);

  // Observable for current index
  public currentIndex$: Observable<number> = this.currentIndexSubject.asObservable();

  // Observable for total number of slides
  public totalSlides$: Observable<number> = this.contentLoader.slides$.pipe(
    map(slides => slides.length)
  );

  // Observable for current slide object
  public currentSlide$: Observable<Slide | null> = combineLatest([
    this.contentLoader.slides$,
    this.currentIndex$
  ]).pipe(
    map(([slides, index]) => slides[index] || null)
  );

  /**
   * Navigate to next slide
   */
  public next(): void {
    const slides = this.contentLoader.getCurrentContent()?.slides || [];
    const currentIndex = this.currentIndexSubject.value;

    if (currentIndex < slides.length - 1) {
      this.currentIndexSubject.next(currentIndex + 1);
    }
  }

  /**
   * Navigate to previous slide
   */
  public previous(): void {
    const currentIndex = this.currentIndexSubject.value;

    if (currentIndex > 0) {
      this.currentIndexSubject.next(currentIndex - 1);
    }
  }

  /**
   * Go to specific slide by index
   */
  public goToSlide(index: number): void {
    const slides = this.contentLoader.getCurrentContent()?.slides || [];

    if (index >= 0 && index < slides.length) {
      this.currentIndexSubject.next(index);
    }
  }

  /**
   * Reset to first slide
   */
  public reset(): void {
    this.currentIndexSubject.next(0);
  }

  /**
   * Get current index snapshot (not reactive)
   */
  public getCurrentIndex(): number {
    return this.currentIndexSubject.value;
  }
}
