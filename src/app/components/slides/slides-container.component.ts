import { Component, inject, OnInit, OnDestroy, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SlidesStateService } from '../../services/slides-state.service';
import { KeyboardNavigationService } from '../../services/keyboard-navigation.service';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-slides-container',
  imports: [CommonModule],
  templateUrl: './slides-container.component.html',
  styleUrl: './slides-container.component.css'
})
export class SlidesContainerComponent implements OnInit, OnDestroy {
  protected slidesState = inject(SlidesStateService);
  private keyboardNav = inject(KeyboardNavigationService);
  private destroy$ = new Subject<void>();

  // Observables for template
  protected currentSlide$ = this.slidesState.currentSlide$;
  protected currentIndex$ = this.slidesState.currentIndex$;
  protected totalSlides$ = this.slidesState.totalSlides$;

  // Track if current slide image loaded successfully
  protected imageLoaded = signal(true);

  ngOnInit(): void {
    // Subscribe to keyboard navigation events
    this.keyboardNav.navigation$
      .pipe(takeUntil(this.destroy$))
      .subscribe(direction => {
        if (direction === 'next') {
          this.slidesState.next();
        } else {
          this.slidesState.previous();
        }
      });

    // Reset image loaded state when slide changes
    this.currentIndex$
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this.imageLoaded.set(true);
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  // Manual navigation methods for button clicks
  protected goNext(): void {
    this.slidesState.next();
  }

  protected goPrevious(): void {
    this.slidesState.previous();
  }

  // Image load handlers
  protected onImageError(): void {
    this.imageLoaded.set(false);
  }

  protected onImageLoad(): void {
    this.imageLoaded.set(true);
  }
}
