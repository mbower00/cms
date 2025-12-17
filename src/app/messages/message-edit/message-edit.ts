import { Component, ElementRef, EventEmitter, Output, ViewChild } from '@angular/core';
import { Message } from '../message.model';
import { MessageService } from '../message.service';

@Component({
  selector: 'cms-message-edit',
  standalone: false,
  templateUrl: './message-edit.html',
  styleUrl: './message-edit.css',
})
export class MessageEdit {
  currentSender: string = '101';
  disabled: string
  @ViewChild('subject') subjectElement: ElementRef;
  @ViewChild('msgText') msgTextElement: ElementRef;

  constructor(private messageService: MessageService) { }

  onSendMessage() {
    const subject = this.subjectElement.nativeElement.value;
    const msgText = this.msgTextElement.nativeElement.value;
    this.subjectElement.nativeElement.value = '';
    this.msgTextElement.nativeElement.value = '';
    this.disabled = ''
    const message = new Message('0', subject, msgText, this.currentSender);
    this.messageService.addMessage(message);
  }
  onClear() {
    this.subjectElement.nativeElement.value = '';
    this.msgTextElement.nativeElement.value = '';
    this.disabled = ''
  }
  onFormSubmit(event: SubmitEvent) {
    event.preventDefault();
  }
}
