import {
  BehaviorSubject,
  EMPTY,
  Observable,
  ReplaySubject,
  Subject,
  catchError,
  map,
  of,
  share,
  takeUntil,
  tap,
} from 'rxjs';
import { TargetAsset } from '../models/target-asset.model';
import { Injectable, OnDestroy } from '@angular/core';
import { TargetAssetService } from '../services/target-asset.service';

export interface Stat {
  name: string;
  count: number;
}

export interface TargetAssetsState {
  data?: TargetAsset[];
  loadingState: boolean;
  filteredData?: TargetAsset[];
  tagFilters: string[];
  nameFilter: string;
  statusFilter: string;
  allTags: string[];
  selectedItemId: number;
}

const initialState: TargetAssetsState = {
  data: [],
  loadingState: true,
  filteredData: [],
  tagFilters: [],
  nameFilter: '',
  statusFilter: '',
  allTags: [],
  selectedItemId: 0,
};

export interface TargetAssetsVm {
  data?: TargetAsset[];
  loadingState: boolean;
  selectedItem?: TargetAsset;
  filteredData?: TargetAsset[];
  tagFilters: string[];
  nameFilter: string;
  statusFilter: string;
  allTags: string[];
  totalCPUs: number;
  startableAssetsCount: number;
  statusCounts: Stat[];
  locationCounts: Stat[];
  parentAsset?: TargetAsset;
}

@Injectable()
export class StateManagementService implements OnDestroy {
  getParent(id: number | undefined): TargetAsset | undefined {
    if (this.currentState.data && id) {
      return this.currentState.data.find((asset) => asset.id === id);
    } else {
      return undefined;
    }
  }
  setSeletedItem(id: number) {
    this.patchState({ selectedItemId: id });
  }
  ngOnDestroy(): void {
    this._state.complete();
    this._destroyed.next();
    this._destroyed.complete();
  }

  // Subject to emit when service is destroyed
  private readonly _destroyed = new Subject<void>();

  // Behavior subject to store the state
  private readonly _state: BehaviorSubject<TargetAssetsState>;

  // Observable of the state
  private readonly state$: Observable<TargetAssetsState>;

  // Observable of the ViewModel, representing a projection of the state
  readonly vm$: Observable<TargetAssetsVm>;

  constructor(private assetService: TargetAssetService) {
    this._state = new BehaviorSubject(initialState);
    this.state$ = this._state
      .asObservable()
      .pipe(
        share({
          connector: () => new ReplaySubject(1),
          resetOnComplete: true,
          resetOnRefCountZero: true,
        }),
        takeUntil(this._destroyed)
      );
    this.vm$ = this.state$.pipe(map((state) => this.buildVm(state)));

    this.init();
  }

  private buildVm(state: TargetAssetsState): TargetAssetsVm {
    const filteredData = this.applyFilter(
      state.data,
      state.tagFilters,
      state.nameFilter,
      state.statusFilter
    );
    const stats = this.calculateStats(filteredData);
    const selectedItem = state.data?.find(
      (asset) => asset.id === state.selectedItemId
    );
    const vm = {
      data: state.data,
      selectedItem: selectedItem,
      filteredData: filteredData,
      loadingState: state.loadingState,
      tagFilters: state.tagFilters,
      nameFilter: state.nameFilter,
      statusFilter: state.statusFilter,
      allTags: state.allTags,
      totalCPUs: stats.totalCPUs,
      startableAssetsCount: stats.startableAssetsCount,
      statusCounts: stats.statusCounts,
      locationCounts: stats.locationCounts,
      parentAsset: this.getParent(selectedItem?.parentId),
    };

    return vm;
  }

  init() {
    this.assetService
      .getTargetAssets()
      .pipe(
        tap((data) => {
          const sanitizedData = data.filter((x: TargetAsset) => x !== null);
          this.patchState({
            data: sanitizedData,
            allTags: this.getTags(sanitizedData),
            loadingState: false,
          });
        }),
        catchError((error: any) => {
          console.error(
            'An error occurred while fetching target assets:',
            error
          );
          this.patchState({
            data: [],
            loadingState: false,
          });
          return EMPTY;
        })
      )
      .subscribe();
  }

  getTags(data: TargetAsset[]): string[] | undefined {
    return [
      ...new Set(data.flatMap((asset: TargetAsset) => asset.tags)),
    ] as string[];
  }

  applyFilter(
    data: TargetAsset[] | undefined,
    tagFilters: string[],
    nameFilter: string,
    statusFilter: string
  ): TargetAsset[] {
    if (data) {
      return data.filter((asset) =>
        this.doesAssetMatchFilter(asset, tagFilters, nameFilter, statusFilter)
      );
    } else {
      return [];
    }
  }

  doesAssetMatchFilter(
    asset: TargetAsset,
    tagFilters: string[],
    nameFilter: string,
    statusFilter: string
  ): boolean {
    return (
      asset.name.toLowerCase().includes(nameFilter.toLowerCase()) &&
      (!statusFilter || asset.status === statusFilter) &&
      (!tagFilters.length || tagFilters.some((tag) => asset.tags.includes(tag)))
    );
  }

  calculateStats(filteredData: TargetAsset[]): any {
    if (filteredData) {
      const totalCPUs = filteredData.reduce((acc, asset) => acc + asset.cpu, 0);

      const statusMap = filteredData.reduce((acc, asset) => {
        acc[asset.status] = (acc[asset.status] || 0) + 1;
        return acc;
      }, {} as { [key: string]: number });

      const statusCounts = Object.keys(statusMap).map((key) => ({
        name: key,
        count: statusMap[key],
      }));

      const startableAssetsCount = filteredData.reduce(
        (acc, asset) => (asset.isStartable ? acc + 1 : acc),
        0
      );

      const locationMap = filteredData.reduce((acc, asset) => {
        acc[asset.location] = (acc[asset.location] || 0) + 1;
        return acc;
      }, {} as { [key: string]: number });

      const locationCounts = Object.keys(locationMap).map((key) => ({
        name: key,
        count: locationMap[key],
      }));

      return {
        totalCPUs,
        statusCounts,
        startableAssetsCount,
        locationCounts,
      };
    }
    return null;
  }

  setChip(tag: string) {
    if (this.currentState.tagFilters.includes(tag)) {
      this.setTagFilters(
        this.currentState.tagFilters.filter((x: string) => {
          return x !== tag;
        })
      );
    } else {
      this.setTagFilters([...this.currentState.tagFilters, tag]);
    }
  }

  setNameFilter(nameFilter: string) {
    this.patchState({ nameFilter });
  }

  setStatusFilter(statusFilter: string) {
    this.patchState({ statusFilter });
  }

  setTagFilters(tagFilters: string[]) {
    this.patchState({ tagFilters });
  }

  get currentState(): TargetAssetsState {
    return this._state.getValue();
  }
  setState(state: TargetAssetsState) {
    this._state.next(state);
  }

  patchState(state: Partial<TargetAssetsState>) {
    this.setState({
      ...this._state.getValue(),
      ...state,
    });
  }
}
