import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChicagoDivvyStationsComponent } from './chicago-divvy-stations.component';

describe('ChicagoDivvyStationsComponent', () => {
  let component: ChicagoDivvyStationsComponent;
  let fixture: ComponentFixture<ChicagoDivvyStationsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChicagoDivvyStationsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChicagoDivvyStationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
