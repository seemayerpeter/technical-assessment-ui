import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { StateManagementService } from '../../stores/assets.store';

@Component({
  selector: 'app-asset-details',
  templateUrl: './asset-details.component.html',
  styleUrls: ['./asset-details.component.scss'],
})
export class AssetDetailsComponent implements OnInit {
  vm$ = this.state.vm$;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private state: StateManagementService
  ) {}

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.state.setSeletedItem(id);
  }

  goToParent(id: number | undefined) {
    if (id) {
      this.router.navigate(['/dashboard/assets', id]);
      this.state.setSeletedItem(id);
    }
  }

  goToDashboard() {
    this.router.navigate(['/dashboard']);
  }
}
