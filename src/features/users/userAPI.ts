/**
* Asynchronous function that retrieves user information for the specified user UID
 * 
 * @param {string} user_uid - User UID
 * @returns {Promise<User | undefined>} Promise containing user information. If no documentation exists, undefined is returned.
 */
import {doc, getDoc, setDoc, getFirestore} from 'firebase/firestore';
import {firebaseApp} from '../../firebase/firebaseConfig.ts';
import {User, UserRef} from '../../type/User';

// Obtain an instance of the Firestore database
const db = getFirestore(firebaseApp);

// Function to get user information
export const getUser = async(user_uid: string) => {
    // Get the document reference for the specified user UID
    const userRef = doc(db, 'users', user_uid);
    // Get a snapshot of the document
    const docSnap = await getDoc(userRef);
    // If document exists, return data as type User
    if (docSnap.exists()) {
        return docSnap.data() as User;
    }
}

export const postUser = async (userRef:UserRef) => {
    const user = userRef.user;
    await setDoc(doc(db, 'users', userRef.uid), {
        displayName: user.displayName,
        email: user.email,
        profile_picture: user.profile_picture
    });
};


