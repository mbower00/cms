import { Component, OnDestroy, OnInit } from '@angular/core';
import { Contact } from './contact.model';
import { ContactService } from './contact.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'cms-contacts',
  standalone: false,
  templateUrl: './contacts.html',
  styleUrl: './contacts.css',
})
export class Contacts implements OnInit, OnDestroy {
  selectedContact: Contact;
  loaded = false
  subscription: Subscription

  constructor(private contactService: ContactService) { }

  ngOnInit() {
    this.subscription = this.contactService.isLoaded.subscribe(() => {
      this.loaded = true
    })
  }

  ngOnDestroy() {
    this.subscription.unsubscribe()
  }
}
