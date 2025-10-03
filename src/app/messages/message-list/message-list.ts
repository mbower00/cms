import { Component } from '@angular/core';
import { Message } from '../message.model';

@Component({
  selector: 'cms-message-list',
  standalone: false,
  templateUrl: './message-list.html',
  styleUrl: './message-list.css',
})
export class MessageList {
  messages: Message[] = [
    new Message(2, 'Happy B-Day!', 'Hello, just wishing you a happy birthday, son.', 'Dad'),
    new Message(
      3,
      'Sword Finished',
      'Hello, I am finally done forgeing the sword you ordered.',
      'Mr. Smith'
    ),
    new Message(
      4,
      'Tithing Settlement',
      'Hello, would you be able to meet with the bishop for tithing settlement this Sunday?',
      'Brother Jones'
    ),
  ];

  onAddMessage(message: Message) {
    this.messages.push(message);
  }
}
