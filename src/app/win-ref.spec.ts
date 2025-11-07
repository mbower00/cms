import { TestBed } from '@angular/core/testing';

import { WinRef } from './win-ref';

describe('WinRef', () => {
  let service: WinRef;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(WinRef);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
