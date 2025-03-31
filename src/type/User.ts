/**
 * Represents a user in the SlackClone application.
 */
export interface User {
    profile_picture: string;
    email: string;
    displayName: string;
    isOnline: boolean;
}

/**
 * ユーザー参照を表すインターフェース。
 * 
 * @property {string} uid - ユーザーの一意の識別子。
 * @property {User} user - ユーザーオブジェクト。
 */
export interface UserRef {
    uid: string;
    user: User;
}
