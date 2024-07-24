import { createFeatureSelector, createSelector } from "@ngrx/store";
import { UsersState } from "../models/users-state.interface";
import { Features } from "../../features.enum";

export const usersFeature = createFeatureSelector<UsersState>(Features.Users);

export const selectIsLoading = createSelector(
    usersFeature,
    (state: UsersState) => state.isLoading
);
  
export const selectChosenUserProfile = createSelector(
    usersFeature,
    (state: UsersState) => state.chosenUserProfile
);