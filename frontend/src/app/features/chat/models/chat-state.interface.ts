import { EntityState } from "@ngrx/entity";
import { Room } from "./room.interface";

export interface ChatState extends EntityState<Room> {
    
}