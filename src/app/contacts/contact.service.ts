import { Injectable } from '@angular/core';
import { Contact } from './contact.model';
import { MOCKCONTACTS } from './MOCKCONTACTS';
import { Subject } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class ContactService {
  contactListChangedEvent = new Subject<Contact[]>();
  contacts: Contact[] = [];
  maxContactId: number;

  constructor(private http: HttpClient) {
    this.getContacts();
  }

  storeContacts() {
    const contacts = JSON.stringify(this.contacts);
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    const res = this.http.put(
      'https://mbbcms-5b2ac-default-rtdb.firebaseio.com/contacts.json',
      contacts,
      {
        headers,
      }
    );
    res.subscribe(
      // success
      () => {
        this.contactListChangedEvent.next(this.contacts.slice());
      },
      // error
      (error) => {
        console.log(error);
      }
    );
  }

  getContacts() {
    const res = this.http.get('https://mbbcms-5b2ac-default-rtdb.firebaseio.com/contacts.json');
    res.subscribe(
      // success method
      (contacts: Contact[]) => {
        this.contacts = contacts;
        this.maxContactId = this.getMaxId();
        this.contacts.sort((current, next) => {
          if (current.name < next.name) return -1;
          if (current.name > next.name) return 1;
          return 0;
        });
        this.contactListChangedEvent.next(this.contacts.slice());
      },
      // error method
      (error) => {
        console.log(error);
      }
    );
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
    this.storeContacts();
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
    this.storeContacts();
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
    this.storeContacts();
  }
}
