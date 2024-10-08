import { User } from "./user.interface";

export interface PersonalityScore {
    id: number;
    adaptability: number;
    extroversion: number;
    independence: number;
    workMotivation: number;
    deadlineCommitment: number;
    detailCommitment: number;
    preferredTeamSize: number;
    liveCommunication: number;
    innovativeness: number;
    user: User;
}