import { Component, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';
import { Contact } from '../contact.model';
import { ContactService } from '../contact.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'cms-contact-list',
  standalone: false,
  templateUrl: './contact-list.html',
  styleUrl: './contact-list.css',
})
export class ContactList implements OnInit, OnDestroy {
  contacts: Contact[] = [];
  subscription: Subscription;

  constructor(private contactService: ContactService) {}

  ngOnInit() {
    this.subscription = this.contactService.contactListChangedEvent.subscribe(
      (contactList: Contact[]) => {
        this.contacts = contactList;
      }
    );
    this.contacts = this.contactService.getContacts();
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
