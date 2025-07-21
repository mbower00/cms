import { Component, OnInit } from '@angular/core';
import { Message } from '../message.model';
import { MessageService } from '../message.service';
import { ContactService } from '../../contacts/contact.service';

@Component({
  selector: 'cms-message-list',
  templateUrl: './message-list.component.html',
  styleUrl: './message-list.component.css',
})
export class MessageListComponent implements OnInit {
  messages: Message[] = [];

  constructor(
    private messageService: MessageService,
    private contactService: ContactService
  ) {}

  ngOnInit() {
    this.contactService.getContacts();

    this.contactService.contactListChangedEvent.subscribe(() => {
      this.messages = this.messageService.getMessages();
    });

    this.messageService.messageChangedEvent.subscribe((messages: Message[]) => {
      console.log(messages);
      this.messages = messages;
    });
  }

  onAddMessage(message: Message) {
    this.messages.push(message);
  }
}
