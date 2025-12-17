import { Component, OnDestroy, OnInit } from '@angular/core';
import { Document } from './document.model';
import { DocumentService } from './document.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'cms-documents',
  standalone: false,
  templateUrl: './documents.html',
  styleUrl: './documents.css',
})
export class Documents implements OnInit, OnDestroy {
  loaded = false
  subscription: Subscription

  constructor(private documentService: DocumentService) { }

  ngOnInit() {
    this.subscription = this.documentService.isLoaded.subscribe(() => {
      this.loaded = true
    })
  }

  ngOnDestroy() {
    this.subscription.unsubscribe()
  }
}
