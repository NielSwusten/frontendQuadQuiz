import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import {Questions} from '../../entities/questions';

export interface AnswerCheck {
  questionId: string;
  selectedAnswer: string;
}

export interface QuizParams {
  difficulty?: string;
}

export interface AnswerResult {
  questionId: string;
  correct: boolean;
  correctAnswer: string;
}
@Injectable({
  providedIn: 'root'
})
export class QuestionsService {

  url = `http://localhost:8080/api`;

  constructor(private httpClient: HttpClient) {
  }

  getQuestions(params?: QuizParams): Observable<Questions[]> {
    let httpParams = new HttpParams();

    if (params) {
      if (params.difficulty) {
        httpParams = httpParams.set('difficulty', params.difficulty);
      }
    }

    return this.httpClient.get<Questions[]>(`${this.url}/questions`, { params: httpParams });
  }

  checkAnswers(answers: AnswerCheck[]): Observable<AnswerResult[]> {
    return this.httpClient.post<AnswerResult[]>(`${this.url}/checkanswers`, answers);
  }


}

