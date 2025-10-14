import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NotificationRuleFormComponent } from './notification-rule-form.component';

describe('NotificationRuleFormComponent', () => {
  let component: NotificationRuleFormComponent;
  let fixture: ComponentFixture<NotificationRuleFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NotificationRuleFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NotificationRuleFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
