import { UserResponseDto } from "../user/user-response.dto";

export class PersonalityScoreResponseDto {
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
    user: UserResponseDto;  
}