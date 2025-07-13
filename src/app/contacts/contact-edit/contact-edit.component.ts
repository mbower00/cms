import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Contact } from '../contact.model';
import { ContactService } from '../contact.service';
import { CdkDragDrop } from '@angular/cdk/drag-drop';

@Component({
  selector: 'cms-contact-edit',
  templateUrl: './contact-edit.component.html',
  styleUrl: './contact-edit.component.css',
})
export class ContactEditComponent implements OnInit {
  originalContact: Contact;
  contact: Contact;
  groupContacts: Contact[] = [];
  groupContactsError: boolean = false;
  editMode: boolean = false;
  id: string;

  constructor(
    private contactService: ContactService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  onSubmit(form: NgForm) {
    const value = form.value;
    const newContact = new Contact(
      '',
      value.name,
      value.email,
      value.phone,
      value.imageUrl,
      this.groupContacts.length ? this.groupContacts : null
    );
    if (this.editMode) {
      this.contactService.updateContact(this.originalContact, newContact);
    } else {
      console.log(newContact);
      this.contactService.addContact(newContact);
    }
    this.router.navigate(['/contacts']);
  }

  addToGroup(event: any) {
    this.groupContactsError = false;
    const selectedContact: Contact =
      event.item.dropContainer.data[event.previousIndex];
    const invalidGroupContact = this.isInvalidContact(selectedContact);
    if (invalidGroupContact) {
      this.groupContactsError = true;
      return;
    }
    this.groupContacts.push(selectedContact);
  }

  onRemoveItem(index) {
    if (index < 0 || index >= this.groupContacts.length) {
      return;
    }
    this.groupContacts.splice(index, 1);
  }

  isInvalidContact(newContact: Contact) {
    if (!newContact) {
      return true;
    }
    if (this.contact && newContact.id === this.contact.id) {
      return true;
    }
    for (let i = 0; i < this.groupContacts.length; i++) {
      if (newContact.id === this.groupContacts[i].id) {
        return true;
      }
    }
    return false;
  }

  onCancel() {
    this.router.navigate(['/contacts']);
  }

  ngOnInit() {
    this.route.params.subscribe((params: Params) => {
      this.id = params['id'];
      if (this.id === undefined || this.id === null) {
        this.editMode = false;
        return;
      }
      this.originalContact = this.contactService.getContact(this.id);
      if (this.originalContact === undefined || this.originalContact === null) {
        return;
      }
      this.editMode = true;
      this.contact = JSON.parse(JSON.stringify(this.originalContact));
      if (this.contact.group !== null && this.contact.group !== undefined) {
        this.groupContacts = JSON.parse(
          JSON.stringify(this.originalContact.group.slice())
        );
      }
    });
  }
}
