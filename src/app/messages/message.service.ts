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
    this.http.get<Message[]>('http://localhost:3000/messages').subscribe(
      // success method
      (messages: Message[]) => {
        this.messages = messages;
        this.maxMessageId = this.getMaxId();
        this.messages.sort((currentMessage: Message, nextMessage: Message) => {
          if (currentMessage.msgText < nextMessage.msgText) {
            return -1;
          } else if (currentMessage.msgText > nextMessage.msgText) {
            return 1;
          } else {
            return 0;
          }
        });
        this.messageChangedEvent.next(this.messages.slice());
      },
      // error method
      (error: any) => {
        console.log(error);
      }
    );
    return this.messages.slice();
  }

  sortAndSend() {
    this.messages.sort((currentMessage: Message, nextMessage: Message) => {
      if (currentMessage.msgText < nextMessage.msgText) {
        return -1;
      } else if (currentMessage.msgText > nextMessage.msgText) {
        return 1;
      } else {
        return 0;
      }
    });
    this.messageChangedEvent.next(this.messages.slice());
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
    if (!message) {
      return;
    }

    //make sure id of the new Message is empty
    message.id = '';

    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });

    // add to database
    this.http
      .post<{ message: string; messageData: Message }>(
        'http://localhost:3000/messages',
        message,
        { headers: headers }
      )
      .subscribe((responseData) => {
        // add new message to messages
        this.messages.push(responseData.messageData);
        this.sortAndSend();
      });
  }

  updateMessage(originalMessage: Message, newMessage: Message) {
    if (!originalMessage || !newMessage) {
      return;
    }

    const pos = this.messages.findIndex((d) => d.id === originalMessage.id);

    if (pos < 0) {
      return;
    }

    // set the id of the new Message to the id of the old Message
    newMessage.id = originalMessage.id;
    // newMessage._id = originalMessage._id;

    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });

    // update database
    this.http
      .put('http://localhost:3000/messages/' + originalMessage.id, newMessage, {
        headers: headers,
      })
      .subscribe((response: Response) => {
        this.messages[pos] = newMessage;
        this.sortAndSend();
      });
  }

  deleteMessage(message: Message) {
    if (!message) {
      return;
    }

    const pos = this.messages.findIndex((d) => d.id === message.id);

    if (pos < 0) {
      return;
    }

    //delete from database
    this.http
      .delete('http://localhost:3000/messages/' + message.id)
      .subscribe((response: Response) => {
        this.messages.splice(pos, 1);
        this.sortAndSend();
      });
  }
}
