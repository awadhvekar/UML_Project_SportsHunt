import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProtecteduserlistComponent } from './protecteduserlist.component';

describe('ProtecteduserlistComponent', () => {
  let component: ProtecteduserlistComponent;
  let fixture: ComponentFixture<ProtecteduserlistComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProtecteduserlistComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProtecteduserlistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
