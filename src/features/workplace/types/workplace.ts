/**
 * Represents the workplace and member-related types for the Slack Clone application
 * @module workplace
 */

/**
 * Enum representing different roles a user can have in a workplace
 * @enum {string}
 */

/**
 * Interface representing a workplace entity
 * @interface Workplace
 * @property {string} id - Unique identifier for the workplace
 * @property {string} name - Name of the workplace
 * @property {string} [description] - Optional description of the workplace
 * @property {TimeStamp} created_at - Timestamp when the workplace was created
 * @property {TimeStamp} updated_at - Timestamp when the workplace was last updated
 * @property {string} owner_id - ID of the workplace owner
 * @property {string} [icon_url] - Optional URL for the workplace icon
 */

/**
 * Interface representing a member of a workplace
 * @interface WorkplaceMember
 * @property {string} workplace_id - ID of the workplace the member belongs to
 * @property {string} user_id - ID of the user who is a member
 * @property {WorkplaceRole} role - Role of the member in the workplace
 * @property {TimeStamp} joined_at - Timestamp when the member joined the workplace
 */

import { TimeStamp } from 'firebase/firestore';

export enum WorkplaceRole {
    OWNER = 'owner',
    ADMIN = 'admin',
    MEMBER = 'member',
    GUEST = 'guest'
}

export interface Workplace {
    id: string;
    name: string;
    description?: string;
    created_at: TimeStamp;
    updated_at: TimeStamp;
    owner_id: string;
    icon_url?: string;
}

export interface WorkplaceMember {
    workplace_id: string;
    user_id: string;
    role: WorkplaceRole;
    joined_at: TimeStamp;
}