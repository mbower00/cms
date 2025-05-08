import {
  Component,
  ElementRef,
  EventEmitter,
  Output,
  ViewChild,
} from '@angular/core';
import { Message } from '../message.model';

@Component({
  selector: 'cms-message-edit',
  templateUrl: './message-edit.component.html',
  styleUrl: './message-edit.component.css',
})
export class MessageEditComponent {
  currentSender: string = 'Mitchell Brandt Bower';
  @ViewChild('subject') subjectElementRef: ElementRef;
  @ViewChild('msgText') msgTextElementRef: ElementRef;
  @Output() addMessageEvent = new EventEmitter<Message>();

  onSendMessage() {
    const subject = this.subjectElementRef.nativeElement.value;
    const msgText = this.msgTextElementRef.nativeElement.value;
    const message = new Message(1, subject, msgText, this.currentSender);
    this.addMessageEvent.emit(message);
  }
  onClear() {
    this.subjectElementRef.nativeElement.value = '';
    this.msgTextElementRef.nativeElement.value = '';
  }
}
