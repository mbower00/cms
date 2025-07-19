import { EventEmitter, Injectable } from '@angular/core';
import { Message } from './message.model';
import { MOCKMESSAGES } from './MOCKMESSAGES';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class MessageService {
  maxMessageId: number;
  messageChangedEvent = new Subject<Message[]>();
  messages: Message[] = [];

  constructor(private http: HttpClient) {
    // this.messages = MOCKMESSAGES;
  }

  storeMessages() {
    const messagesString = JSON.stringify(this.messages);
    const httpHeaders = new HttpHeaders({
      'Content-Type': 'application/json',
    });
    this.http
      .put(
        'https://mbb-cms-default-rtdb.firebaseio.com/messages.json',
        messagesString,
        { headers: httpHeaders }
      )
      .subscribe(() => {
        this.messageChangedEvent.next(this.messages.slice());
      });
  }

  getMessages() {
    this.http
      .get<Message[]>(
        'https://mbb-cms-default-rtdb.firebaseio.com/messages.json'
      )
      .subscribe(
        // success method
        (messages: Message[]) => {
          this.messages = messages;
          this.maxMessageId = this.getMaxId();
          this.messages.sort(
            (currentMessage: Message, nextMessage: Message) => {
              if (currentMessage.msgText < nextMessage.msgText) {
                return -1;
              } else if (currentMessage.msgText > nextMessage.msgText) {
                return 1;
              } else {
                return 0;
              }
            }
          );
          console.log(this.messages.slice());
          this.messageChangedEvent.next(this.messages.slice());
        },
        // error method
        (error: any) => {
          console.log(error);
        }
      );
    return this.messages.slice();
  }

  getMessage(id: string) {
    for (let message of this.messages) {
      if (message.id === id) {
        return message;
      }
    }
    return null;
  }

  getMaxId(): number {
    let maxId = 0;
    for (let message of this.messages) {
      const currenctId = +message.id;
      if (currenctId > maxId) {
        maxId = currenctId;
      }
    }
    return maxId;
  }

  addMessage(message: Message) {
    this.messages.push(message);
    this.storeMessages();
  }
}
