import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Exercise } from '../../models/content.model';
import { ExerciseItemComponent } from './exercise-item.component';

@Component({
  selector: 'app-exercise-category',
  imports: [CommonModule, ExerciseItemComponent],
  templateUrl: './exercise-category.component.html',
  styleUrl: './exercise-category.component.css'
})
export class ExerciseCategoryComponent {
  @Input({ required: true }) category!: string;
  @Input({ required: true }) exercises!: Exercise[];
}
