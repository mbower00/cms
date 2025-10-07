import { Component, EventEmitter, Output } from '@angular/core';
import { Document } from '../document.model';

@Component({
  selector: 'cms-document-list',
  standalone: false,
  templateUrl: './document-list.html',
  styleUrl: './document-list.css',
})
export class DocumentList {
  @Output() selectedDocumentEvent = new EventEmitter<Document>();

  // Using links copied from www.churchofjesuschrist.org
  // I think I also did pretty much this same thing last time I took this class.
  documents: Document[] = [
    new Document(
      '1',
      'New Testament',
      'This book is a witness to the role of Jesus Christ as our savior.',
      'https://www.churchofjesuschrist.org/study/scriptures/nt?lang=eng'
    ),
    new Document(
      '2',
      'Old Testament',
      'This is a book of pre-Christ prophets.',
      'https://www.churchofjesuschrist.org/study/scriptures/ot?lang=eng'
    ),
    new Document(
      '3',
      'Book of Mormon',
      'This book is another witness to the role of Jesus Christ as our savior.',
      'https://www.churchofjesuschrist.org/study/scriptures/bofm?lang=eng'
    ),
    new Document(
      '4',
      'Doctrine and Covenants',
      'This is a book of latter-day revelations.',
      'https://www.churchofjesuschrist.org/study/scriptures/dc-testament?lang=eng'
    ),
  ];

  onSelectedDocument(document: Document) {
    this.selectedDocumentEvent.emit(document);
  }
}
