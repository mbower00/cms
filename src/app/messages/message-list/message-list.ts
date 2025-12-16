import { Component, OnDestroy, OnInit } from '@angular/core';
import { Message } from '../message.model';
import { MessageService } from '../message.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'cms-message-list',
  standalone: false,
  templateUrl: './message-list.html',
  styleUrl: './message-list.css',
})
export class MessageList implements OnInit, OnDestroy {
  messages: Message[] = [];
  subscription: Subscription;

  constructor(private messageService: MessageService) {}

  onAddMessage(message: Message) {
    this.messages.push(message);
  }

  ngOnInit() {
    this.subscription = this.messageService.messageChangedEvent.subscribe((messages: Message[]) => {
      this.messages = messages;
    });
    this.messageService.getMessages();
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
