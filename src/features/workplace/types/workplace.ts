import { TimeStamp } from 'firebase/firestore';

export enum WorkplaceRole {
    OWNER = 'owner',
    ADMIN = 'admin',
    MEMBER = 'member',
    GUEST = 'guest'
}