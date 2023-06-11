import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { of } from 'rxjs';

import { StateManagementService } from '../stores/assets.store';
import { DashboardComponent } from './dashboard.component';
import { TargetAsset } from '../models/target-asset.model';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import {
  MATERIAL_SANITY_CHECKS,
  MatOptionModule,
} from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatToolbarModule } from '@angular/material/toolbar';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

describe('DashboardComponent', () => {
  let component: DashboardComponent;
  let fixture: ComponentFixture<DashboardComponent>;

  const mockRouter = {
    navigate: jest.fn(),
  };

  const mockState = {
    setChip: jest.fn(),
    setStatusFilter: jest.fn(),
    setTagFilters: jest.fn(),
    setNameFilter: jest.fn(),
    vm$: of({}),
  };

  const mockAsset: TargetAsset = {
    id: 1,
    location: 'Paris',
    name: 'Test',
    status: 'Running',
    tags: ['test'],
    cpu: 5,
    ram: 100,
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DashboardComponent],
      imports: [
        CommonModule,
        MatCardModule,
        MatButtonModule,
        MatFormFieldModule,
        MatInputModule,
        MatOptionModule,
        MatSelectModule,
        MatToolbarModule,
        MatChipsModule,
        FormsModule,
        BrowserAnimationsModule,
      ],
      providers: [
        { provide: Router, useValue: mockRouter },
        { provide: StateManagementService, useValue: mockState },
        { provide: MATERIAL_SANITY_CHECKS, useValue: false },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(DashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should navigate to asset details page when onViewDetails is called', () => {
    component.onViewDetails(mockAsset);
    expect(mockRouter.navigate).toHaveBeenCalledWith([
      '/dashboard/assets',
      mockAsset.id,
    ]);
  });

  it('should call setChip when chipClick is called', () => {
    component.chipClick('test');
    expect(mockState.setChip).toHaveBeenCalledWith('test');
  });

  it('should call setStatusFilter when applyStatusFilter is called', () => {
    component.applyStatusFilter('status');
    expect(mockState.setStatusFilter).toHaveBeenCalledWith('status');
  });

  it('should call setTagFilters when applyTagFilter is called', () => {
    component.applyTagFilter('tag');
    expect(mockState.setTagFilters).toHaveBeenCalledWith('tag');
  });

  it('should call setNameFilter when applyNameFilter is called', () => {
    component.applyNameFilter('name');
    expect(mockState.setNameFilter).toHaveBeenCalledWith('name');
  });
});
