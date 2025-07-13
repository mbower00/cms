import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Document } from '../document.model';
import { DocumentService } from '../document.service';
import { ActivatedRoute, Params, Router } from '@angular/router';

@Component({
  selector: 'cms-document-edit',
  templateUrl: './document-edit.component.html',
  styleUrl: './document-edit.component.css',
})
export class DocumentEditComponent implements OnInit {
  originalDocument: Document;
  document: Document;
  editMode: boolean = false;

  constructor(
    private documentService: DocumentService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  onCancel() {
    this.router.navigate(['/documents']);
  }

  onSubmit(form: FormGroup) {
    const value = form.value;
    const newDocument = new Document(
      '',
      value.name,
      value.description,
      value.url,
      []
    );
    if (this.editMode) {
      this.documentService.updateDocument(this.originalDocument, newDocument);
    } else {
      this.documentService.addDocument(newDocument);
    }
    this.router.navigate(['/documents']);
  }

  ngOnInit() {
    this.route.params.subscribe((params: Params) => {
      const id = params['id'];
      if (id === undefined || id === null) {
        this.editMode = false;
        return;
      }
      this.originalDocument = this.documentService.getDocument(id);
      if (
        this.originalDocument === undefined ||
        this.originalDocument === null
      ) {
        return;
      }
      this.editMode = true;
      this.document = JSON.parse(JSON.stringify(this.originalDocument));
    });
  }
}
