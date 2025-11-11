import { Injectable } from '@angular/core';
import { Contact } from './contact.model';
import { MOCKCONTACTS } from './MOCKCONTACTS';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ContactService {
  contactListChangedEvent = new Subject<Contact[]>();
  contacts: Contact[] = [];
  maxContactId: number;

  constructor() {
    this.contacts = MOCKCONTACTS;
    this.maxContactId = this.getMaxId();
  }

  getContacts(): Contact[] {
    return this.contacts.slice();
  }

  getContact(id: string): Contact {
    for (let contact of this.contacts) {
      if (contact.id === id) {
        return contact;
      }
    }
    return null;
  }

  getMaxId(): number {
    let maxId = 0;
    this.contacts.forEach((contact: Contact) => {
      const currentId = parseInt(contact.id);
      if (currentId > maxId) {
        maxId = currentId;
      }
    });
    return maxId;
  }

  addContact(newContact: Contact) {
    if (newContact === undefined || newContact === null) {
      return;
    }

    this.maxContactId++;
    newContact.id = `${this.maxContactId}`;
    this.contacts.push(newContact);
    const contactsListClone = this.contacts.slice();

    this.contactListChangedEvent.next(contactsListClone);
  }

  updateContact(originalContact: Contact, newContact: Contact) {
    if (
      originalContact === null ||
      originalContact === undefined ||
      newContact === null ||
      newContact === undefined
    ) {
      return;
    }

    const pos = this.contacts.indexOf(originalContact);
    if (pos < 0) {
      return;
    }

    newContact.id = originalContact.id;
    this.contacts[pos] = newContact;
    const contactsListClone = this.contacts.slice();

    this.contactListChangedEvent.next(contactsListClone);
  }

  deleteContact(contact: Contact) {
    if (contact === undefined || contact == null) {
      return;
    }

    const pos = this.contacts.indexOf(contact);
    if (pos < 0) {
      return;
    }

    this.contacts.splice(pos, 1);
    const contactsListClone = this.contacts.slice();
    this.contactListChangedEvent.next(contactsListClone);
  }
}
