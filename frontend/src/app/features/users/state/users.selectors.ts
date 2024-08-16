import { createFeatureSelector, createSelector } from "@ngrx/store";
import { UsersState } from "../models/users-state.interface";
import { Features } from "../../features.enum";
import { usersAdapter } from "./users.reducer";
import { authFeature } from "../../auth/state/auth.selectors";

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

export const selectUsers = createSelector(
    usersFeature,
    (state: UsersState) => state.ids.map(id => state.entities[id]) //selectEntities nece da radi
)

export const selectUsersPaginationMetadata = createSelector(
    usersFeature,
    (state: UsersState) => state.paginationMetadata
);

export const selectIsUserOnOwnProfile = createSelector(
    usersFeature,
    authFeature,
    (usersState, authState) => usersState.chosenUserProfile?.id === authState.currentLoggedInUser?.id
)

export const selectErrorMessage = createSelector(
    usersFeature,
    (state: UsersState) => state.errorMessage
);