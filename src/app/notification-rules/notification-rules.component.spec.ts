import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NotificationRulesComponent } from './notification-rules.component';

describe('NotificationRulesComponent', () => {
  let component: NotificationRulesComponent;
  let fixture: ComponentFixture<NotificationRulesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NotificationRulesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NotificationRulesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
