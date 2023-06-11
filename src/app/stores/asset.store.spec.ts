import { TestBed } from '@angular/core/testing';

import { StateManagementService, TargetAssetsVm } from './assets.store';
import { TargetAssetService } from '../services/target-asset.service';
import { of } from 'rxjs';
import { TargetAsset } from 'src/app/models/target-asset.model';

describe('StateManagementService', () => {
  let service: StateManagementService;

  const mockAssetService = {
    getTargetAssets: jest
      .fn()
      .mockReturnValue(
        of([
          {
            id: 1,
            name: 'Asset 1',
            cpu: 2,
            tags: ['tag1', 'tag2'],
            status: 'On',
            isStartable: true,
            location: 'Location 1',
          },
        ])
      ),
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        StateManagementService,
        { provide: TargetAssetService, useValue: mockAssetService },
      ],
    });
    service = TestBed.inject(StateManagementService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should set chip', () => {
    service.setChip('chip1');
    expect(service.currentState.tagFilters).toEqual(['chip1']);

    service.setChip('chip1');
    expect(service.currentState.tagFilters).toEqual([]);
  });

  it('should set name filter', () => {
    service.setNameFilter('filter1');
    expect(service.currentState.nameFilter).toEqual('filter1');
  });

  it('should set status filter', () => {
    service.setStatusFilter('status1');
    expect(service.currentState.statusFilter).toEqual('status1');
  });

  it('should set tag filters', () => {
    service.setTagFilters(['filter1', 'filter2']);
    expect(service.currentState.tagFilters).toEqual(['filter1', 'filter2']);
  });

  it('should get parent', () => {
    expect(service.getParent(1)).toEqual({
      id: 1,
      name: 'Asset 1',
      cpu: 2,
      tags: ['tag1', 'tag2'],
      status: 'On',
      isStartable: true,
      location: 'Location 1',
    });
    expect(service.getParent(99)).toBeUndefined();
  });

  it('should set selected item', () => {
    service.setSeletedItem(1);
    expect(service.currentState.selectedItemId).toEqual(1);
  });

  it('should init with assets data', (done) => {
    service.vm$.subscribe((vm: TargetAssetsVm) => {
      expect(vm.data).toEqual([
        {
          id: 1,
          name: 'Asset 1',
          cpu: 2,
          tags: ['tag1', 'tag2'],
          status: 'On',
          isStartable: true,
          location: 'Location 1',
        },
      ]);
      done();
    });
  });

  it('should apply filters correctly', () => {
    const assets = [
      {
        id: 1,
        name: 'Asset 1',
        cpu: 2,
        status: 'On',
        isStartable: true,
        location: 'Location 1',
        tags: ['tag1', 'tag2'],
      },
      {
        id: 2,
        name: 'Asset 2',
        cpu: 1,
        status: 'Off',
        isStartable: false,
        location: 'Location 1',
        tags: ['tag2'],
      },
      {
        id: 3,
        name: 'Asset 3',
        cpu: 3,
        status: 'On',
        isStartable: true,
        location: 'Location 2',
        tags: ['tag1'],
      },
    ] as TargetAsset[];

    let result = service.applyFilter(assets, ['tag1'], '', '');
    expect(result).toEqual([assets[0], assets[2]]);

    result = service.applyFilter(assets, [], 'Asset 1', '');
    expect(result).toEqual([assets[0]]);

    result = service.applyFilter(assets, [], '', 'On');
    expect(result).toEqual([assets[0], assets[2]]);
  });

  it('should check asset matching filter correctly', () => {
    const asset = {
      id: 1,
      name: 'Asset 1',
      cpu: 2,
      status: 'On',
      isStartable: true,
      location: 'Location 1',
      tags: ['tag1', 'tag2'],
    } as TargetAsset;

    expect(service.doesAssetMatchFilter(asset, ['tag1'], '', '')).toEqual(true);
    expect(service.doesAssetMatchFilter(asset, [], 'Asset 1', '')).toEqual(
      true
    );
    expect(service.doesAssetMatchFilter(asset, [], '', 'On')).toEqual(true);
    expect(service.doesAssetMatchFilter(asset, ['tag3'], '', '')).toEqual(
      false
    );
    expect(service.doesAssetMatchFilter(asset, [], 'Asset 2', '')).toEqual(
      false
    );
    expect(service.doesAssetMatchFilter(asset, [], '', 'Off')).toEqual(false);
  });

  it('should calculate statistics for given assets', () => {
    const assets = [
      {
        id: 1,
        cpu: 2,
        status: 'On',
        isStartable: true,
        location: 'Location 1',
        tags: ['tag1', 'tag2'],
      },
      {
        id: 2,
        cpu: 1,
        status: 'Off',
        isStartable: false,
        location: 'Location 1',
        tags: ['tag2'],
      },
      {
        id: 3,
        cpu: 3,
        status: 'On',
        isStartable: true,
        location: 'Location 2',
        tags: ['tag1'],
      },
    ] as TargetAsset[];

    const result = service.calculateStats(assets);

    expect(result).toEqual({
      totalCPUs: 6,
      statusCounts: [
        { name: 'On', count: 2 },
        { name: 'Off', count: 1 },
      ],
      startableAssetsCount: 2,
      locationCounts: [
        { name: 'Location 1', count: 2 },
        { name: 'Location 2', count: 1 },
      ],
    });
  });
});
