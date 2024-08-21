import { createFeatureSelector, createSelector } from "@ngrx/store";
import { TagsState } from "../models/tags-state.interface";
import { Features } from "../../features.enum";
import { Tag } from "../models/tag.interface";

export const tagsFeature = createFeatureSelector<TagsState>(Features.Tags);


export const selectIsLoading = createSelector(
    tagsFeature,
    (state: TagsState) => state.isLoading
);

export const selectFilteredTags = createSelector(
    tagsFeature,
    (state: TagsState) => state.filteredTags
);

export const selectLoadedTags= createSelector(
    tagsFeature,
    (state: TagsState) => state.ids.map(id => state.entities[id])
                                   .filter(tag => tag != undefined)
                                   .map(tag => tag as Tag)
)