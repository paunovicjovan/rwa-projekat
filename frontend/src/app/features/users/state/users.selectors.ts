import { createFeatureSelector, createSelector } from "@ngrx/store";
import { UsersState } from "../models/users-state.interface";
import { Features } from "../../features.enum";
import { User } from "../models/user.interface";

export const usersFeature = createFeatureSelector<UsersState>(Features.Users);

export const selectIsLoading = createSelector(
    usersFeature,
    (state: UsersState) => state.isLoading
);
  
export const selectChosenUserProfile = createSelector(
    usersFeature,
    (state: UsersState) => state.chosenUserProfile
);

export const selectUsers = createSelector(
    usersFeature,
    (state: UsersState) => state.ids.map(id => state.entities[id])
                                    .filter(user => user != undefined)
                                    .map(user => user as User)
)

export const selectUsersPaginationMetadata = createSelector(
    usersFeature,
    (state: UsersState) => state.paginationMetadata
);