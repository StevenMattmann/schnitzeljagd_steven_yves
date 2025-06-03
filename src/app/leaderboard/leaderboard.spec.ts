import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Leaderboard } from './leaderboard';

describe('Tab3Page', () => {
  let component: Leaderboard;
  let fixture: ComponentFixture<Leaderboard>;

  beforeEach(async () => {
    fixture = TestBed.createComponent(Leaderboard);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
