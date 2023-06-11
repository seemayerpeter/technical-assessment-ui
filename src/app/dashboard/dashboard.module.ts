import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { DashboardComponent } from './dashboard.component';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatOptionModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatChipsModule } from '@angular/material/chips';
import { AssetDetailsComponent } from './asset-details/asset-details.component';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { TargetAssetService } from '../services/target-asset.service';
import { StateManagementService } from '../stores/assets.store';

const routes: Routes = [
  { path: '', component: DashboardComponent },
  { path: 'assets/:id', component: AssetDetailsComponent },
];

@NgModule({
  declarations: [DashboardComponent, AssetDetailsComponent],
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
    MatProgressSpinnerModule,
    FormsModule,
    RouterModule.forChild(routes),
  ],
  providers: [StateManagementService, TargetAssetService],
})
export class DashboardModule {}
