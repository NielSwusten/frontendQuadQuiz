import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, RouterLinkActive, RouterModule} from '@angular/router';
import {CommonModule} from '@angular/common';
import {Questions} from '../entities/questions';
import {AnswerCheck, AnswerResult, QuestionsService, QuizParams} from '../services/questions/questions.service';

@Component({
  selector: 'app-game',
  imports: [
    RouterLinkActive,
    RouterModule,
    CommonModule
  ],
  templateUrl: './game.html',
  standalone: true,
  styleUrl: './game.css'
})
export class Game implements OnInit {
  questions: Questions[] = [];
  currentQuestionIndex: number = 0;
  selectedAnswers: string[] = [];
  isLoading: boolean = true;
  error: string = '';
  timer: number = 30; // 30 seconden per vraag
  timerInterval: any;

  isCheckingAnswers: boolean = false;
  quizResults: AnswerResult[] = [];
  showResults: boolean = false;

  difficulty: string = 'easy'; // default

  constructor(private questionsService: QuestionsService,  private route: ActivatedRoute) {
  }

  ngOnInit() {
    this.route.params.subscribe(params => {
      if (params['difficulty']) {
        this.difficulty = params['difficulty'];
      }
      this.loadQuestions();
    });
  }

  loadQuestions() {
    this.isLoading = true;
    const quizParams: QuizParams = {

      difficulty: this.difficulty
    };

    this.questionsService.getQuestions(quizParams).subscribe({
      next: (data) => {
        this.questions = data;
        this.selectedAnswers = new Array(data.length).fill('');
        this.isLoading = false;
        this.startTimer();
      },
      error: (err) => {
        this.error = 'Failed to load questions';
        this.isLoading = false;
        console.error('Error loading questions:', err);
      }
    });
  }
  selectAnswer(answer: string) {
    this.selectedAnswers[this.currentQuestionIndex] = answer;

    // Check if this is the last question
    if (this.currentQuestionIndex === this.questions.length - 1) {
      this.finishQuiz();
    } else {
      this.nextQuestion();
    }
  }

  nextQuestion() {
    if (this.currentQuestionIndex < this.questions.length - 1) {
      this.currentQuestionIndex++;
      this.resetTimer();
    }
  }

  getCurrentQuestion(): Questions | null {
    return this.questions[this.currentQuestionIndex] || null;
  }

  startTimer() {
    this.timer = 30;
    this.timerInterval = setInterval(() => {
      this.timer--;
      if (this.timer <= 0) {
        this.nextQuestion();
      }
    }, 1000);
  }

  resetTimer() {
    clearInterval(this.timerInterval);
    this.startTimer();
  }

  finishQuiz() {
    clearInterval(this.timerInterval);
    this.isCheckingAnswers = true;

    const answersToCheck: AnswerCheck[] = this.questions.map((question, index) => ({
      questionId: question.id,
      selectedAnswer: this.selectedAnswers[index] || '' // Empty string if no answer selected
    }));

    console.log('Submitting answers:', answersToCheck);

    this.questionsService.checkAnswers(answersToCheck).subscribe({
      next: (results) => {
        this.quizResults = results;
        this.isCheckingAnswers = false;
        this.showResults = true;
        console.log('Quiz results:', results);

        const correctAnswers = results.filter(result => result.correct).length;
      },
      error: (err) => {
        this.isCheckingAnswers = false;
        this.error = 'Failed to check answers';
        console.error('Error checking answers:', err);
        alert('Error checking answers. Please try again.');
      }
    });
  }

  getScore(): number {
    return this.quizResults.filter(result => result.correct).length;
  }
  ngOnDestroy() {
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
    }
  }

  getDifficultyDisplay(): string {
    return this.difficulty.charAt(0).toUpperCase() + this.difficulty.slice(1);
  }
}
