import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UniqueArmorListComponent } from './unique-armor-list.component';

describe('UniqueArmorListComponent', () => {
  let component: UniqueArmorListComponent;
  let fixture: ComponentFixture<UniqueArmorListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UniqueArmorListComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UniqueArmorListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
