import { Component, Input, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Exercise } from '../../models/content.model';

@Component({
  selector: 'app-exercise-item',
  imports: [CommonModule],
  templateUrl: './exercise-item.component.html',
  styleUrl: './exercise-item.component.css'
})
export class ExerciseItemComponent {
  @Input({ required: true }) exercise!: Exercise;

  // Signal to track expanded/collapsed state
  protected isExpanded = signal(false);

  protected toggleExpanded(): void {
    this.isExpanded.update(value => !value);
  }

  protected getDifficultyClass(): string {
    switch (this.exercise.difficulty) {
      case 'beginner':
        return 'difficulty-beginner';
      case 'intermediate':
        return 'difficulty-intermediate';
      case 'advanced':
        return 'difficulty-advanced';
      default:
        return '';
    }
  }

  protected getDifficultyLabel(): string {
    switch (this.exercise.difficulty) {
      case 'beginner':
        return 'Begynder';
      case 'intermediate':
        return 'Øvet';
      case 'advanced':
        return 'Avanceret';
      default:
        return this.exercise.difficulty;
    }
  }
}
