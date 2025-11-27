import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, map, tap, catchError, of } from 'rxjs';
import { Content, Slide, Exercise } from '../models/content.model';

@Injectable({
  providedIn: 'root'
})
export class ContentLoaderService {
  private http = inject(HttpClient);
  private contentSubject = new BehaviorSubject<Content | null>(null);
  private loaded = false;

  // Observable for the entire content
  public content$: Observable<Content | null> = this.contentSubject.asObservable();

  // Observable for slides only
  public slides$: Observable<Slide[]> = this.content$.pipe(
    map(content => content?.slides || [])
  );

  // Observable for exercises only
  public exercises$: Observable<Exercise[]> = this.content$.pipe(
    map(content => content?.exercises || [])
  );

  // Observable for jokes only
  public jokes$: Observable<string[]> = this.content$.pipe(
    map(content => content?.angularJokes || [])
  );

  constructor() {
    this.loadContent();
  }

  /**
   * Load content from assets/content.json
   * Uses caching to avoid multiple HTTP requests
   */
  private loadContent(): void {
    if (this.loaded) {
      return;
    }

    this.http.get<Content>('/assets/content.json').pipe(
      tap(content => {
        this.loaded = true;
        console.log('Content loaded successfully:', content);
      }),
      catchError(error => {
        console.error('Error loading content:', error);
        return of(null);
      })
    ).subscribe(content => {
      if (content) {
        this.contentSubject.next(content);
      }
    });
  }

  /**
   * Force reload content (useful for development)
   */
  public reloadContent(): void {
    this.loaded = false;
    this.loadContent();
  }

  /**
   * Get current content snapshot (not reactive)
   */
  public getCurrentContent(): Content | null {
    return this.contentSubject.value;
  }
}
