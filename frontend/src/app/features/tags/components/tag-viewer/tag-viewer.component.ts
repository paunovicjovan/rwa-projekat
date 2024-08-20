import { Component, EventEmitter, Input, OnDestroy, Output } from '@angular/core';
import { Tag } from '../../models/tag.interface';
import { FormControl } from '@angular/forms';
import { Store } from '@ngrx/store';
import { AppState } from '../../../../state/app-state.interface';
import { combineLatest, debounceTime, distinctUntilChanged, filter, Observable, Subscription, tap } from 'rxjs';
import * as tagsActions from '../../state/tags.actions';
import * as tagsSelectors from '../../state/tags.selectors';

@Component({
  selector: 'app-tag-viewer',
  templateUrl: './tag-viewer.component.html',
  styleUrl: './tag-viewer.component.scss'
})
export class TagViewerComponent implements OnDestroy {

  @Input({required: true}) tags!: Tag[] | null;
  @Input() readonly: boolean = false;
  @Output() addTag: EventEmitter<Tag> = new EventEmitter();
  @Output() removeTag: EventEmitter<number> = new EventEmitter();
  @Output() clickTag: EventEmitter<Tag> = new EventEmitter();

  searchTagControl = new FormControl();
  selectedTag: Tag | null = null;
  filteredTags$!: Observable<Tag[]>;
  searchSubscription?: Subscription;

  constructor(private store: Store<AppState>) { }

  ngOnInit(): void {
    this.observeSearchChanges();
    this.selectDataFromStore();
  }

  observeSearchChanges() {
    this.searchSubscription = this.searchTagControl.valueChanges.pipe(
      debounceTime(500),
      distinctUntilChanged(),
      filter((tagName: string) => tagName !== ''),
      tap((tagName: string) => this.store.dispatch(tagsActions.searchTags({tagName})))
    ).subscribe();
  }

  selectDataFromStore() {
    this.filteredTags$ = this.store.select(tagsSelectors.selectFilteredTags)
  }

  handleAddTag() {
    this.addTag.emit(this.selectedTag!);
    this.selectedTag = null;
    this.searchTagControl.setValue(null);
  }

  handleRemoveTag(tag: Tag) {
    this.removeTag.emit(tag.id);
  }

  handleClickTag(tag: Tag) {
    this.clickTag.emit(tag);
  }

  setSelectedTag(tag: Tag) {
    this.selectedTag = tag;
  }

  displayTag(tag?: Tag) {
    return tag?.name ?? '';
  }

  ngOnDestroy(): void {
    this.searchSubscription?.unsubscribe();
  }
}
