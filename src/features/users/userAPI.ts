/**
 * API functions for user management with Firestore.
 * Provides functionality to fetch, add, and search users in the database.
 */

/**
 * Asynchronous function that retrieves user information for the specified user UID
 *
 * @param {string} user_uid - User UID
 * @returns {Promise<User | undefined>} Promise containing user information. If no documentation exists, undefined is returned.
 */

/**
 * Asynchronous function that adds or updates a user in the Firestore database
 * 
 * @param {UserRef} userRef - User reference object containing user data and UID
 * @returns {Promise<void>} Promise that resolves when the user is successfully added
 */

/**
 * Fetches all users from the Firestore database
 * 
 * @returns {Promise<UserRef[]>} Promise containing an array of user references
 * @throws {Error} If there's an error fetching the users
 */

/**
 * Searches for users by display name or email
 * 
 * @param {string} searchTerm - The term to search for in user display names and emails
 * @returns {Promise<UserRef[]>} Promise containing filtered array of matching user references
 * @throws {Error} If there's an error during the search process
 */

import {
  doc,
  getDoc,
  getDocs,
  setDoc,
  getFirestore,
  collection,
} from "firebase/firestore";
import { firebaseApp } from "../../firebase/firebaseConfig.ts";
import { User, UserRef } from "../../type/User";

// Obtain an instance of the Firestore database
const db = getFirestore(firebaseApp);

// Function to get user information
export const getUser = async (user_uid: string) => {
  // Get the document reference for the specified user UID
  const userRef = doc(db, "users", user_uid);
  // Get a snapshot of the document
  const docSnap = await getDoc(userRef);
  // If document exists, return data as type User
  if (docSnap.exists()) {
    return docSnap.data() as User;
  }
};

export const postUser = async (userRef: UserRef) => {
  const user = userRef.user;
  await setDoc(doc(db, "users", userRef.uid), {
    displayName: user.displayName,
    email: user.email,
    profile_picture: user.profile_picture,
  });
};

// Function to fetch all users
export const fetchUsers = async (): Promise<UserRef[]> => {
  try {
    const usersCollection = collection(db, "users");
    const usersSnapshot = await getDocs(usersCollection);

    const userList: UserRef[] = [];

    usersSnapshot.forEach((doc) => {
      userList.push({
        uid: doc.id,
        user: doc.data() as User,
      });
    });

    return userList;
  } catch (error) {
    console.error("Error fetching users:", error);
    throw error;
  }
};

// Function to search users by display name or email
export const searchUsers = async (searchTerm: string): Promise<UserRef[]> => {
  try {
    if (!searchTerm.trim()) {
      return await fetchUsers();
    }

    const allUsers = await fetchUsers();
    const normalizedSearchTerm = searchTerm.toLowerCase().trim();

    return allUsers.filter((userRef) => {
      const user = userRef.user;
      return (
        user.displayName.toLowerCase().includes(normalizedSearchTerm) ||
        user.email.toLowerCase().includes(normalizedSearchTerm)
      );
    });
  } catch (error) {
    console.error("Error searching users:", error);
    throw error;
  }
};
