import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, map, tap, catchError, of } from 'rxjs';
import { Content, Slide, Exercise, BuildHistory, Commit } from '../models/content.model';

@Injectable({
  providedIn: 'root'
})
export class ContentLoaderService {
  private http = inject(HttpClient);
  private contentSubject = new BehaviorSubject<Content | null>(null);
  private buildHistorySubject = new BehaviorSubject<BuildHistory | null>(null);
  private loaded = false;
  private buildHistoryLoaded = false;

  // Observable for the entire content
  public content$: Observable<Content | null> = this.contentSubject.asObservable();

  // Observable for build history
  public buildHistory$: Observable<BuildHistory | null> = this.buildHistorySubject.asObservable();

  // Observable for commits only
  public commits$: Observable<Commit[]> = this.buildHistory$.pipe(
    map(buildHistory => buildHistory?.commits || [])
  );

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
    this.loadBuildHistory();
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
   * Load build history from assets/build-history.json
   * Uses caching to avoid multiple HTTP requests
   */
  private loadBuildHistory(): void {
    if (this.buildHistoryLoaded) {
      return;
    }

    this.http.get<BuildHistory>('/assets/build-history.json').pipe(
      tap(buildHistory => {
        this.buildHistoryLoaded = true;
        console.log('Build history loaded successfully:', buildHistory);
      }),
      catchError(error => {
        console.error('Error loading build history:', error);
        return of(null);
      })
    ).subscribe(buildHistory => {
      if (buildHistory) {
        this.buildHistorySubject.next(buildHistory);
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
   * Force reload build history (useful for development)
   */
  public reloadBuildHistory(): void {
    this.buildHistoryLoaded = false;
    this.loadBuildHistory();
  }

  /**
   * Get current content snapshot (not reactive)
   */
  public getCurrentContent(): Content | null {
    return this.contentSubject.value;
  }

  /**
   * Get current build history snapshot (not reactive)
   */
  public getCurrentBuildHistory(): BuildHistory | null {
    return this.buildHistorySubject.value;
  }
}
