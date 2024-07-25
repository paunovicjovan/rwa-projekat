import { createFeatureSelector, createSelector } from "@ngrx/store";
import { UsersState } from "../models/users-state.interface";
import { Features } from "../../features.enum";
import { usersAdapter } from "./users.reducer";

export const usersFeature = createFeatureSelector<UsersState>(Features.Users);

const { selectEntities } = usersAdapter.getSelectors(usersFeature);

export const selectIsLoading = createSelector(
    usersFeature,
    (state: UsersState) => state.isLoading
);
  
export const selectChosenUserProfile = createSelector(
    usersFeature,
    (state: UsersState) => state.chosenUserProfile
);

export const selectFilteredUsers = createSelector(
    usersFeature,
    (state: UsersState) => state.ids.map(id=>state.entities[id]) //selectEntities nece da radi
)

export const selectUsersPaginationMetadata = createSelector(
    usersFeature,
    (state: UsersState) => state.paginationMetadata
);