import { Component, OnInit } from '@angular/core';
import { Document } from '../document.model';
import { DocumentService } from '../document.service';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { WinRefService } from '../../win-ref.service';

@Component({
  selector: 'cms-document-detail',
  standalone: false,
  templateUrl: './document-detail.html',
  styleUrl: './document-detail.css',
})
export class DocumentDetail implements OnInit {
  navitveWindow: any;
  document: Document;

  constructor(
    private documentService: DocumentService,
    private router: Router,
    private route: ActivatedRoute,
    private winRefService: WinRefService
  ) {}

  ngOnInit() {
    this.navitveWindow = this.winRefService.getNativeWindow();
    this.route.params.subscribe((params: Params) => {
      const id = params['id'];
      this.document = this.documentService.getDocument(id);
    });
  }

  onView() {
    if (this.document.url) {
      console.log(this.document.url);
      this.navitveWindow.open(this.document.url);
    }
  }

  onDelete() {
    this.documentService.deleteDocument(this.document);
    this.router.navigateByUrl('/documents');
  }
}
