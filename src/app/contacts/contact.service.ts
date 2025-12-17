import { Injectable } from '@angular/core';
import { Contact } from './contact.model';
import { Observable, Subject } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class ContactService {
  contactListChangedEvent = new Subject<Contact[]>();
  contacts: Contact[] = [];
  maxContactId: number;
  isLoaded: Observable<Object>;


  constructor(private http: HttpClient) {
    this.getContacts();
  }

  // storeContacts() {
  //   const contacts = JSON.stringify(this.contacts);
  //   const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
  //   const res = this.http.put(
  //     'https://mbbcms-5b2ac-default-rtdb.firebaseio.com/contacts.json',
  //     contacts,
  //     {
  //       headers,
  //     }
  //   );
  //   res.subscribe(
  //     // success
  //     () => {
  //       this.contactListChangedEvent.next(this.contacts.slice());
  //     },
  //     // error
  //     (error) => {
  //       console.log(error);
  //     }
  //   );
  // }

  getContacts() {
    const res = this.http.get('http://localhost:3000/contacts');
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
    this.isLoaded = res
  }

  getContact(id: string): Contact {
    for (let contact of this.contacts) {
      if (contact.id === id) {
        return JSON.parse(JSON.stringify(contact));
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

  // using code from Jeremy Troy Suchanski's comment on W11 Developer Forum
  sortAndSend() {
    this.contacts.sort((current, next) => {
      if (current.name < next.name) return -1;
      if (current.name > next.name) return 1;
      return 0;
    });
    this.contactListChangedEvent.next(this.contacts.slice());
  }

  addContact(contact: Contact) {
    if (!contact) {
      return
    }
    // make sure id of the new Contact is empty
    contact.id = ''
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' })

    // add to database
    this.http.post<{ message: string, data: Contact }>('http://localhost:3000/contacts', contact, { headers })
      .subscribe((responseData) => {
        // add new contact to contacts
        this.contacts.push(responseData.data)
        this.sortAndSend()
      })
  }


  updateContact(originalContact: Contact, newContact: Contact) {
    if (!originalContact || !newContact) {
      return
    }

    const pos = this.contacts.findIndex(c => c.id === originalContact.id)

    if (pos < 0) {
      return
    }

    // set the id of the new Contact to the id of the old Contact
    newContact.id = originalContact.id
    // newContact._id = originalContact._id

    console.log(originalContact, newContact)

    const headers = new HttpHeaders({ 'Content-Type': 'application/json' })

    // update database
    this.http.put('http://localhost:3000/contacts/' + originalContact.id, newContact, { headers })
      .subscribe((response: Response) => {
        this.contacts[pos] = newContact
        this.sortAndSend()
      })
  }

  deleteContact(contact: Contact) {
    if (!contact) {
      return
    }
    const pos = this.contacts.findIndex(d => d.id === contact.id)
    if (pos < 0) {
      return
    }
    // delete from database
    this.http.delete('http://localhost:3000/contacts/' + contact.id)
      .subscribe((response: Response) => {
        this.contacts.splice(pos, 1)
        this.sortAndSend()
      })
  }
}
