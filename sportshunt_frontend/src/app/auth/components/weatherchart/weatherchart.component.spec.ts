import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WeatherchartComponent } from './weatherchart.component';

describe('WeatherchartComponent', () => {
  let component: WeatherchartComponent;
  let fixture: ComponentFixture<WeatherchartComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WeatherchartComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WeatherchartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
