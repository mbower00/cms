import { EventEmitter, Injectable } from '@angular/core';
import { Message } from './message.model';
import { MOCKMESSAGES } from './MOCKMESSAGES';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class MessageService {
  messages: Message[] = [];
  messageChangedEvent = new Subject<Message[]>();
  maxMessageId: number;

  constructor(private http: HttpClient) {
    this.getMessages();
  }

  storeMessages() {
    const messages = JSON.stringify(this.messages);
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    const res = this.http.put(
      'https://mbbcms-5b2ac-default-rtdb.firebaseio.com/messages.json',
      messages,
      {
        headers,
      }
    );
    res.subscribe(
      // success
      () => {
        this.messageChangedEvent.next(this.messages.slice());
      },
      // error
      (error) => {
        console.log(error);
      }
    );
  }

  getMessages() {
    const res = this.http.get('https://mbbcms-5b2ac-default-rtdb.firebaseio.com/messages.json');
    res.subscribe(
      // success method
      (messages: Message[]) => {
        this.messages = messages;
        this.maxMessageId = this.getMaxId();
        this.messages.sort((current, next) => {
          if (current.id < next.id) return -1;
          if (current.id > next.id) return 1;
          return 0;
        });
        this.messageChangedEvent.next(this.messages.slice());
      },
      // error method
      (error) => {
        console.log(error);
      }
    );
  }

  getMaxId(): number {
    let maxId = 0;
    this.messages.forEach((message: Message) => {
      const currentId = parseInt(message.id);
      if (currentId > maxId) {
        maxId = currentId;
      }
    });
    return maxId;
  }

  addMessage(message: Message) {
    this.messages.push(message);
    this.storeMessages();
  }
}
