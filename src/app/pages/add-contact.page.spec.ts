import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { AddContactPage } from './add-contact.page';

describe('AddContactPage', () => {
  let component: AddContactPage;
  let fixture: ComponentFixture<AddContactPage>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [AddContactPage],
    }).compileComponents();

    fixture = TestBed.createComponent(AddContactPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
