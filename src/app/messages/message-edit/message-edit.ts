import { Component, ElementRef, EventEmitter, Output, ViewChild } from '@angular/core';
import { Message } from '../message.model';

@Component({
  selector: 'cms-message-edit',
  standalone: false,
  templateUrl: './message-edit.html',
  styleUrl: './message-edit.css',
})
export class MessageEdit {
  currentSender: string = 'Mitchell Brandt Bower';
  @Output() addMessageEvent = new EventEmitter<Message>();
  @ViewChild('subject') subjectElement: ElementRef;
  @ViewChild('msgText') msgTextElement: ElementRef;
  onSendMessage() {
    const subject = this.subjectElement.nativeElement.value;
    const msgText = this.msgTextElement.nativeElement.value;
    this.subjectElement.nativeElement.value = '';
    this.msgTextElement.nativeElement.value = '';
    const message = new Message(1, subject, msgText, this.currentSender);
    this.addMessageEvent.emit(message);
  }
  onClear() {
    this.subjectElement.nativeElement.value = '';
    this.msgTextElement.nativeElement.value = '';
  }
  onFormSubmit(event: SubmitEvent) {
    event.preventDefault();
  }
}
