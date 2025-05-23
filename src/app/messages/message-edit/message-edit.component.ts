import {
  Component,
  ElementRef,
  EventEmitter,
  Output,
  ViewChild,
} from '@angular/core';
import { Message } from '../message.model';
import { MessageService } from '../message.service';

@Component({
  selector: 'cms-message-edit',
  templateUrl: './message-edit.component.html',
  styleUrl: './message-edit.component.css',
})
export class MessageEditComponent {
  currentSenderId: string = '12';
  @ViewChild('subject') subjectElementRef: ElementRef;
  @ViewChild('msgText') msgTextElementRef: ElementRef;
  @Output() addMessageEvent = new EventEmitter<Message>();

  constructor(private messageService: MessageService) {}

  onSendMessage() {
    const subject = this.subjectElementRef.nativeElement.value;
    const msgText = this.msgTextElementRef.nativeElement.value;
    const message = new Message('200', subject, msgText, this.currentSenderId);
    this.messageService.addMessage(message);
  }
  onClear() {
    this.subjectElementRef.nativeElement.value = '';
    this.msgTextElementRef.nativeElement.value = '';
  }
  onSubmit(event: SubmitEvent) {
    event.preventDefault();
  }
}
