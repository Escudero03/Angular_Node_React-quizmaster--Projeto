import { Component, OnInit, ViewChild, ElementRef, AfterViewChecked, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import * as React from 'react';
import { createRoot, Root } from 'react-dom/client';
import SurprisePanel from './react/SurprisePanel';
import quizz_questions from "../../assets/data/quizz_questions.json";

@Component({
  selector: 'app-quizz',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './quizz.component.html',
  styleUrls: ['./quizz.component.css']
})
export class QuizzComponent implements OnInit, AfterViewChecked {
  @ViewChild('reactContainer', { static: false }) reactContainer!: ElementRef;
  private reactRoot: Root | null = null;
  private hasRendered: boolean = false;

  title: string = "";
  questions: any;
  questionSelected: any;
  answers: string[] = [];
  answerSelected: string = "";
  questionIndex: number = 0;
  questionMaxIndex: number = 0;
  finished: boolean = false;

  constructor(private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    console.log("ngOnInit: Iniciando o quiz...");
    this.startQuiz();
  }

  ngAfterViewChecked() {
    console.log("ngAfterViewChecked: Verificando se deve renderizar...");
    console.log("Finished:", this.finished, "HasRendered:", this.hasRendered, "ReactContainer:", this.reactContainer);
    if (this.finished && !this.hasRendered && this.reactContainer) {
      console.log("ngAfterViewChecked: Condição satisfeita, chamando renderReactComponent...");
      this.renderReactComponent();
    } else if (this.finished && !this.reactContainer) {
      console.log("ngAfterViewChecked: reactContainer ainda não disponível!");
      this.cdr.detectChanges(); // Força a detecção de mudanças para atualizar o DOM
    }
  }

  playerChoose(value: string) {
    console.log("playerChoose: Opção escolhida:", value);
    this.answers.push(value);
    this.nextStep();
  }

  async nextStep() {
    console.log("nextStep: Avançando para a próxima pergunta...");
    this.questionIndex += 1;

    if (this.questionMaxIndex > this.questionIndex) {
      this.questionSelected = this.questions[this.questionIndex];
      console.log("Próxima pergunta selecionada:", this.questionSelected);
    } else {
      console.log("nextStep: Quiz finalizado!");
      const finalAnswer: string = await this.checkResult(this.answers);
      this.finished = true;
      this.answerSelected = quizz_questions.results[finalAnswer as keyof typeof quizz_questions.results];
      console.log("Resultado final:", this.answerSelected);
      setTimeout(() => {
        console.log("nextStep: Verificando container após atraso...");
        if (this.reactContainer) {
          console.log("nextStep: Container disponível, chamando renderReactComponent...");
          this.renderReactComponent();
        } else {
          console.log("nextStep: Container ainda não disponível mesmo após atraso!");
        }
      }, 100);
    }
  }

  async checkResult(answers: string[]) {
    console.log("checkResult: Calculando resultado com respostas:", answers);
    const result = answers.reduce((previous: string, current: string, i: number, arr: string[]) => {
      if (arr.filter(item => item === previous).length > arr.filter(item => item === current).length) {
        return previous;
      } else {
        return current;
      }
    }, answers[0] || ''); // Valor inicial padrão se o array estiver vazio
    console.log("Resultado calculado:", result);
    return result;
  }

  restartQuiz() {
    console.log("restartQuiz: Reiniciando o quiz...");
    this.finished = false;
    this.hasRendered = false;
    this.answers = [];
    this.questionIndex = 0;
    this.answerSelected = "";
    this.startQuiz();
    if (this.reactRoot) {
      console.log("restartQuiz: Desmontando React root...");
      this.reactRoot.unmount();
      this.reactRoot = null;
    }
  }

  startQuiz() {
    console.log("startQuiz: Carregando perguntas...");
    if (quizz_questions) {
      this.title = quizz_questions.title;
      this.questions = quizz_questions.questions;
      this.questionSelected = this.questions[this.questionIndex];
      this.questionMaxIndex = this.questions.length;
      this.finished = false;
      console.log("Índice atual:", this.questionIndex);
      console.log("Total de perguntas:", this.questionMaxIndex);
      console.log("Pergunta selecionada:", this.questionSelected);
    } else {
      console.error("Erro: quizz_questions não foi carregado!");
    }
  }

  renderReactComponent() {
    console.log("renderReactComponent: Tentando renderizar o React...");
    console.log("ReactContainer disponível:", this.reactContainer);
    if (this.finished && this.reactContainer) {
      console.log("Container encontrado:", this.reactContainer.nativeElement);
      const container = this.reactContainer.nativeElement;
      const resultsDiv = container.parentElement;
      if (resultsDiv) {
        console.log("Adicionando classe 'visible' ao quizz_results");
        resultsDiv.classList.add('visible');
      } else {
        console.log("resultsDiv não encontrado!");
      }
      if (!this.reactRoot) {
        console.log("Criando nova raiz React");
        this.reactRoot = createRoot(container);
      }
      setTimeout(() => {
        console.log("Renderizando SurprisePanel com resultado:", this.answerSelected);
        this.reactRoot!.render(
          React.createElement(SurprisePanel, {
            result: this.answerSelected,
            onRestart: () => this.restartQuiz()
          })
        );
        this.hasRendered = true;
        console.log("SurprisePanel renderizado com sucesso!");
      }, 300);
    } else {
      console.log("Condição não atendida. Finished:", this.finished, "Container:", this.reactContainer);
    }
  }
}