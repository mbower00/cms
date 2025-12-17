import { Component, OnInit } from '@angular/core';
import { Document } from './document.model';
import { DocumentService } from './document.service';

@Component({
  selector: 'cms-documents',
  standalone: false,
  templateUrl: './documents.html',
  styleUrl: './documents.css',
})
export class Documents implements OnInit {
  loaded = false
  constructor(private documentService: DocumentService) { }
  ngOnInit() {
    this.documentService.isLoaded.subscribe(() => {
      this.loaded = true
    })
  }
}
