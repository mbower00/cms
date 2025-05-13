import { Component, EventEmitter, Output } from '@angular/core';
import { Document } from '../document.model';

@Component({
  selector: 'cms-document-list',
  templateUrl: './document-list.component.html',
  styleUrl: './document-list.component.css',
})
export class DocumentListComponent {
  @Output() selectedDocumentEvent = new EventEmitter<Document>();
  documents: Document[] = [
    new Document(
      '1',
      'Come, Thou Fount of Every Blessing',
      'This is a hymn about the goodness of God.',
      'https://www.churchofjesuschrist.org/media/music/songs/come-thou-fount-of-every-blessing'
    ),
    new Document(
      '2',
      "Aaron Reading the Scriptures to Lamoni's Father",
      "Aaron stands higher than Lamoni's father. He reads from paper and Lamoni's father appears interested.",
      'https://www.churchofjesuschrist.org/media/image/aaron-preaching-king-thompson-b8700ca'
    ),
    new Document(
      '3',
      '1 Nephi 1',
      'The first chapter of The Book of Mormon.',
      'https://www.churchofjesuschrist.org/study/scriptures/bofm/1-ne/1'
    ),
    new Document(
      '4',
      'I Am a Child of God',
      'This is a very popular song about being a child of God.',
      'https://www.churchofjesuschrist.org/media/music/songs/i-am-a-child-of-god-wolford'
    ),
  ];

  onSelectedDocument(document: Document) {
    this.selectedDocumentEvent.emit(document);
  }
}
