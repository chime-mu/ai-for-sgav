import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ContentLoaderService } from '../../services/content-loader.service';
import { Exercise } from '../../models/content.model';
import { ExerciseCategoryComponent } from './exercise-category.component';
import { map, Observable } from 'rxjs';

interface ExercisesByCategory {
  category: string;
  exercises: Exercise[];
}

@Component({
  selector: 'app-exercises-container',
  imports: [CommonModule, ExerciseCategoryComponent],
  templateUrl: './exercises-container.component.html',
  styleUrl: './exercises-container.component.css'
})
export class ExercisesContainerComponent {
  private contentLoader = inject(ContentLoaderService);

  // Group exercises by category
  protected exercisesByCategory$: Observable<ExercisesByCategory[]> = this.contentLoader.exercises$.pipe(
    map(exercises => {
      // Create a map of categories to exercises
      const categoryMap = new Map<string, Exercise[]>();

      exercises.forEach(exercise => {
        const category = exercise.category || 'Andet';
        if (!categoryMap.has(category)) {
          categoryMap.set(category, []);
        }
        categoryMap.get(category)!.push(exercise);
      });

      // Convert to array for template
      return Array.from(categoryMap.entries()).map(([category, exs]) => ({
        category,
        exercises: exs
      }));
    })
  );
}
