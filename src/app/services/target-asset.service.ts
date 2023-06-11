import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { TargetAsset } from '../models/target-asset.model';

@Injectable({
  providedIn: 'root',
})
export class TargetAssetService {
  constructor(private http: HttpClient) {}

  getTargetAssets(): Observable<TargetAsset[]> {
    return this.http.get<TargetAsset[]>(
      'https://adb47d56-1aa9-4aa7-8ec2-77a923b80a5b.mock.pstmn.io/targetasset'
    );
  }
}
