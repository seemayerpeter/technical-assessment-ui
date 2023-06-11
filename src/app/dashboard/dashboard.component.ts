import { Component } from '@angular/core';
import { StateManagementService } from '../stores/assets.store';
import { TargetAsset } from '../models/target-asset.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  templateUrl: 'dashboard.component.html',
  styleUrls: ['dashboard.component.scss'],
})
export class DashboardComponent {
  readonly vm$ = this.state.vm$;

  constructor(private router: Router, private state: StateManagementService) {}

  onViewDetails(asset: TargetAsset) {
    this.router.navigate(['/dashboard/assets', asset.id]);
  }

  chipClick(tag: string): void {
    this.state.setChip(tag);
  }

  applyStatusFilter(event: any) {
    this.state.setStatusFilter(event);
  }

  applyTagFilter(event: any) {
    this.state.setTagFilters(event);
  }

  applyNameFilter(event: any) {
    this.state.setNameFilter(event);
  }
}
