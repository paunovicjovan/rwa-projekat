import { createFeatureSelector, createSelector } from "@ngrx/store";
import { UsersState } from "../models/users-state.interface";
import { Features } from "../../features.enum";

export const usersFeature = createFeatureSelector<UsersState>(Features.Users);

export const selectIsLoadingAndUser = createSelector(
    usersFeature,
    (state: UsersState) => ({isLoading: state.isLoading, chosenUserProfile: state.chosenUserProfile})
);
  