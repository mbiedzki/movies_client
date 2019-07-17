import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GenresDetailsComponent } from './genres-details.component';

describe('GenresDetailsComponent', () => {
  let component: GenresDetailsComponent;
  let fixture: ComponentFixture<GenresDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GenresDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GenresDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
