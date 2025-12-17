import { Observable, Subject } from 'rxjs';
import { Injectable } from '@angular/core';
import { Document } from './document.model';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class DocumentService {
  documentListChangedEvent = new Subject<Document[]>();
  documents: Document[] = [];
  maxDocumentId: number;
  isLoaded: Observable<Object>;

  constructor(private http: HttpClient) {
    this.getDocuments();
  }

  // storeDocuments() {
  //   const documents = JSON.stringify(this.documents);
  //   const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
  //   const res = this.http.put(
  //     'https://mbbcms-5b2ac-default-rtdb.firebaseio.com/documents.json',
  //     documents,
  //     {
  //       headers,
  //     }
  //   );
  //   res.subscribe(
  //     // success
  //     () => {
  //       this.documentListChangedEvent.next(this.documents.slice());
  //     },
  //     // error
  //     (error) => {
  //       console.log(error);
  //     }
  //   );
  // }

  getDocuments() {
    const res = this.http.get('http://localhost:3000/documents');
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
    this.isLoaded = res
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

  // using code from Jeremy Troy Suchanski's comment on W11 Developer Forum
  sortAndSend() {
    this.documents.sort((current, next) => {
      if (current.name < next.name) return -1;
      if (current.name > next.name) return 1;
      return 0;
    });
    this.documentListChangedEvent.next(this.documents.slice());
  }

  addDocument(document: Document) {
    if (!document) {
      return
    }
    // make sure id of the new Document is empty
    document.id = ''
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' })

    // add to database
    this.http.post<{ message: string, data: Document }>('http://localhost:3000/documents', document, { headers })
      .subscribe((responseData) => {
        // add new document to documents
        this.documents.push(responseData.data)
        this.sortAndSend()
      })
  }

  updateDocument(originalDocument: Document, newDocument: Document) {
    if (!originalDocument || !newDocument) {
      return
    }

    const pos = this.documents.findIndex(d => d.id === originalDocument.id)

    if (pos < 0) {
      return
    }

    // set the id of the new Document to the id of the old Document
    newDocument.id = originalDocument.id
    // newDocument._id = originalDocument._id

    const headers = new HttpHeaders({ 'Content-Type': 'application/json' })

    // update database
    this.http.put('http://localhost:3000/documents/' + originalDocument.id, newDocument, { headers })
      .subscribe((response: Response) => {
        this.documents[pos] = newDocument
        this.sortAndSend()
      })
  }

  deleteDocument(document: Document) {
    if (!document) {
      return
    }
    const pos = this.documents.findIndex(d => d.id === document.id)
    if (pos < 0) {
      return
    }
    // delete from database
    this.http.delete('http://localhost:3000/documents/' + document.id)
      .subscribe((response: Response) => {
        this.documents.splice(pos, 1)
        this.sortAndSend()
      })
  }
}
