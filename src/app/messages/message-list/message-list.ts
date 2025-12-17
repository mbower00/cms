import { Component, OnDestroy, OnInit } from '@angular/core';
import { Message } from '../message.model';
import { MessageService } from '../message.service';
import { Subscription } from 'rxjs';
import { ContactService } from '../../contacts/contact.service';

@Component({
  selector: 'cms-message-list',
  standalone: false,
  templateUrl: './message-list.html',
  styleUrl: './message-list.css',
})
export class MessageList implements OnInit, OnDestroy {
  messages: Message[] = [];
  subscription: Subscription;
  loadSubscription: Subscription
  loaded = false

  constructor(private messageService: MessageService, private contactService: ContactService) { }

  onAddMessage(message: Message) {
    this.messages.push(message);
  }

  ngOnInit() {
    this.subscription = this.messageService.messageChangedEvent.subscribe((messages: Message[]) => {
      this.messages = messages;
    });
    this.loadSubscription = this.contactService.isLoaded.subscribe(() => {
      this.messageService.getMessages()
    })
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
    this.loadSubscription.unsubscribe();
  }
}
