import { Injectable } from '@angular/core';
import { fromEvent, Observable, Subject } from 'rxjs';
import { filter, map, takeUntil } from 'rxjs/operators';

export type NavigationDirection = 'next' | 'previous';

@Injectable({
  providedIn: 'root'
})
export class KeyboardNavigationService {
  private navigationSubject = new Subject<NavigationDirection>();
  private destroy$ = new Subject<void>();
  private isListening = false;

  // Observable that emits navigation direction
  public navigation$: Observable<NavigationDirection> = this.navigationSubject.asObservable();

  constructor() {
    this.startListening();
  }

  /**
   * Start listening for keyboard events
   */
  public startListening(): void {
    if (this.isListening) {
      return;
    }

    this.isListening = true;

    fromEvent<KeyboardEvent>(document, 'keydown')
      .pipe(
        takeUntil(this.destroy$),
        filter(event => event.key === 'ArrowLeft' || event.key === 'ArrowRight'),
        map(event => {
          // Prevent default scroll behavior
          event.preventDefault();
          return event.key === 'ArrowRight' ? 'next' : 'previous';
        })
      )
      .subscribe(direction => {
        this.navigationSubject.next(direction);
      });
  }

  /**
   * Stop listening for keyboard events
   */
  public stopListening(): void {
    this.isListening = false;
    this.destroy$.next();
  }

  /**
   * Manually trigger navigation (useful for button clicks)
   */
  public navigate(direction: NavigationDirection): void {
    this.navigationSubject.next(direction);
  }
}
