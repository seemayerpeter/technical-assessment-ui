import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';
import { StateManagementService } from '../../stores/assets.store';

import { AssetDetailsComponent } from './asset-details.component';

describe('AssetDetailsComponent', () => {
  let component: AssetDetailsComponent;
  let fixture: ComponentFixture<AssetDetailsComponent>;

  // Create mock services
  const mockStateService = {
    vm$: of({}),
    setSeletedItem: jest.fn(),
    doesParentExist: jest.fn(() => true),
  };

  const mockRouter = {
    navigate: jest.fn(),
  };

  const mockActivatedRoute = {
    snapshot: {
      paramMap: {
        get: jest.fn(() => 1),
      },
    },
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AssetDetailsComponent],
      providers: [
        { provide: StateManagementService, useValue: mockStateService },
        { provide: Router, useValue: mockRouter },
        { provide: ActivatedRoute, useValue: mockActivatedRoute },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(AssetDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should set selected item on init', () => {
    expect(mockStateService.setSeletedItem).toHaveBeenCalledWith(1);
  });

  it('should navigate to parent and set selected item', () => {
    component.goToParent(1);
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/dashboard/assets', 1]);
    expect(mockStateService.setSeletedItem).toHaveBeenCalledWith(1);
  });
});
