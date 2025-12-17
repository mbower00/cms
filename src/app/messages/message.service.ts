import { EventEmitter, Injectable } from '@angular/core';
import { Message } from './message.model';
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

  // storeMessages() {
  //   const messages = JSON.stringify(this.messages);
  //   const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
  //   const res = this.http.put(
  //     'https://mbbcms-5b2ac-default-rtdb.firebaseio.com/messages.json',
  //     messages,
  //     {
  //       headers,
  //     }
  //   );
  //   res.subscribe(
  //     // success
  //     () => {
  //       this.messageChangedEvent.next(this.messages.slice());
  //     },
  //     // error
  //     (error) => {
  //       console.log(error);
  //     }
  //   );
  // }

  getMessages() {
    const res = this.http.get('http://localhost:3000/messages');
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

  // using code from Jeremy Troy Suchanski's comment on W11 Developer Forum
  sortAndSend() {
    this.messages.sort((current, next) => {
      if (current.id < next.id) return -1;
      if (current.id > next.id) return 1;
      return 0;
    });
    this.messageChangedEvent.next(this.messages.slice());
  }

  addMessage(message: Message) {
    if (!message) {
      return
    }
    // make sure id of the new Message is empty
    message.id = ''
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' })

    // add to database
    this.http.post<{ message: string, data: Message }>('http://localhost:3000/messages', message, { headers })
      .subscribe((responseData) => {
        // add new message to messages
        this.messages.push(responseData.data)
        this.sortAndSend()
      })
  }
}
