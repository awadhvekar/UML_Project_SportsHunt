import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchsportseventComponent } from './searchsportsevent.component';

describe('SearchsportseventComponent', () => {
  let component: SearchsportseventComponent;
  let fixture: ComponentFixture<SearchsportseventComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SearchsportseventComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SearchsportseventComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
