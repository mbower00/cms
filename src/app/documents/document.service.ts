import { Subject } from 'rxjs';
import { Injectable } from '@angular/core';
import { Document } from './document.model';
import { MOCKDOCUMENTS } from './MOCKDOCUMENTS';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class DocumentService {
  documentListChangedEvent = new Subject<Document[]>();
  documents: Document[] = [];
  maxDocumentId: number;

  constructor(private http: HttpClient) {
    this.getDocuments();
  }

  storeDocuments() {
    const documents = JSON.stringify(this.documents);
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    const res = this.http.put(
      'https://mbbcms-5b2ac-default-rtdb.firebaseio.com/documents.json',
      documents,
      {
        headers,
      }
    );
    res.subscribe(
      // success
      () => {
        this.documentListChangedEvent.next(this.documents.slice());
      },
      // error
      (error) => {
        console.log(error);
      }
    );
  }

  getDocuments() {
    const res = this.http.get('https://mbbcms-5b2ac-default-rtdb.firebaseio.com/documents.json');
    res.subscribe(
      // success method
      (documents: Document[]) => {
        this.documents = documents;
        this.maxDocumentId = this.getMaxId();
        this.documents.sort((current, next) => {
          if (current.name < next.name) return -1;
          if (current.name > next.name) return 1;
          return 0;
        });
        this.documentListChangedEvent.next(this.documents.slice());
      },
      // error method
      (error) => {
        console.log(error);
      }
    );
  }

  getDocument(id: string): Document {
    for (let document of this.documents) {
      if (document.id === id) {
        return document;
      }
    }
    return null;
  }

  getMaxId(): number {
    let maxId = 0;
    this.documents.forEach((document: Document) => {
      const currentId = parseInt(document.id);
      if (currentId > maxId) {
        maxId = currentId;
      }
    });
    return maxId;
  }

  addDocument(newDocument: Document) {
    if (newDocument === undefined || newDocument === null) {
      return;
    }

    this.maxDocumentId++;
    newDocument.id = `${this.maxDocumentId}`;
    this.documents.push(newDocument);

    this.storeDocuments();
  }

  updateDocument(originalDocument: Document, newDocument: Document) {
    if (
      originalDocument === null ||
      originalDocument === undefined ||
      newDocument === null ||
      newDocument === undefined
    ) {
      return;
    }

    const pos = this.documents.indexOf(originalDocument);
    if (pos < 0) {
      return;
    }

    newDocument.id = originalDocument.id;
    this.documents[pos] = newDocument;

    this.storeDocuments();
  }

  deleteDocument(document: Document) {
    if (document === undefined || document == null) {
      return;
    }

    const pos = this.documents.indexOf(document);
    if (pos < 0) {
      return;
    }

    this.documents.splice(pos, 1);

    this.storeDocuments();
  }
}
