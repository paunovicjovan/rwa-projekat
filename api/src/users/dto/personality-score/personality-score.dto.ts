import { UserDto } from "../user/user.dto";

export class PersonalityScoreDto {
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
    user: UserDto;  
}