import { Component, Input, OnInit } from '@angular/core';
import { Message } from '../message.model';
import { ContactService } from '../../contacts/contact.service';

@Component({
  selector: 'cms-message-item',
  templateUrl: './message-item.component.html',
  styleUrl: './message-item.component.css',
})
export class MessageItemComponent implements OnInit {
  messageSender: string;
  @Input() message: Message;

  constructor(private contactService: ContactService) {}

  ngOnInit() {
    const contact = this.contactService.getContact(this.message.sender);
    this.messageSender = contact.name;
  }
}
