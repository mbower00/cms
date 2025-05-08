import { Component } from '@angular/core';
import { Message } from '../message.model';

@Component({
  selector: 'cms-message-list',
  templateUrl: './message-list.component.html',
  styleUrl: './message-list.component.css',
})
export class MessageListComponent {
  messages: Message[] = [
    new Message(
      2,
      'New product deployed!',
      'Mitchell, we would like to inform you that your new product "cms" has been deployed',
      'Render'
    ),
    new Message(
      3,
      'You could win millions!',
      'Hello friend! Reply to our message with your name, SSN, and bank information and you will be entered for a chance to win millions!',
      'Bot McScam'
    ),
    new Message(
      4,
      'Hello!',
      'Hi, Mitch! I hope your classes are going well this semester! Best of juck to you!',
      'Mom'
    ),
  ];

  onAddMessage(message: Message) {
    this.messages.push(message);
  }
}
