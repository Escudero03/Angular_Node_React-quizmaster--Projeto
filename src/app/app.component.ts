import { Component } from '@angular/core';
import { QuizzComponent } from './quizz/quizz.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [QuizzComponent], // Importa o QuizzComponent
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'quiz-app';
}