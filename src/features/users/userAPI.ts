/**
 * 指定されたユーザーUIDのユーザー情報を取得する非同期関数
 * 
 * @param {string} user_uid - ユーザーのUID
 * @returns {Promise<User | undefined>} ユーザー情報を含むPromise。ドキュメントが存在しない場合はundefinedを返す。
 */
import {doc, getDoc, getFirestore} from 'firebase/firestore';
import {firebaseApp} from '../../firebase/firebaseConfig.ts';
import {User} from '../../type/User';

// Firestoreデータベースのインスタンスを取得
const db = getFirestore(firebaseApp);

// ユーザー情報を取得する関数
export const getUser = async(user_uid: string) => {
    // 指定されたユーザーUIDのドキュメント参照を取得
    const userRef = doc(db, 'users', user_uid);
    // ドキュメントのスナップショットを取得
    const docSnap = await getDoc(userRef);
    // ドキュメントが存在する場合、データをUser型として返す
    if (docSnap.exists()) {
        return docSnap.data() as User;
    }
}


