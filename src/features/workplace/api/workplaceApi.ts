/**
 * Workplace API Module
 *
 * This module provides a comprehensive set of functions to interact with the "workplaces" 
 * data stored in Firebase Firestore. It includes functionalities to create a new workplace, 
 * fetch an existing workplace by its unique identifier, and list all workplaces associated 
 * with a given user.
 *
 * Detailed Functions:
 * - createWorkplace: Inserts a new workplace document into the "workplaces" collection and 
 *   returns the generated document ID.
 * - getWorkplace: Retrieves a workplace document by ID, ensuring it exists before returning 
 *   the data merged with the ID.
 * - listWorkplaces: Queries the "workplace_members" collection based on the user ID to find 
 *   associated workplace IDs and then retrieves each corresponding workplace.
 *
 * The module initializes Firestore using the imported Firebase app configuration, ensuring 
 * that all database interactions are performed within the context of the configured app.
 */

import { getFirestore, collection, doc, setDoc, getDoc, getDocs, query, where} from "firebase/firestore";
import { Workplace } from '../types/workplace.ts';
import { firebaseApp } from '../../../firebase/firebaseConfig.ts';

const db = getFirestore(firebaseApp);

export const workplaceApi = {
    async createWorkplace(workplace: Omit<Workplace, 'id'>): Promise<string> {
        const workplaceRef = doc(collection(db, 'workplaces'));
        await setDoc(workplaceRef, workplace);
        return workplaceRef.id;
    },

    async getWorkplace(id: string): Promise<Workplace | null> {
        const docRef = doc(db, 'workplaces', id);
        const docSnap = await getDoc(docRef);
        return docSnap.exists() ? {id: docSnap.id, ...docSnap.data()} as Workplace : null;
    },

    async listWorkplaces(userId: string): Promise<Workplace[]> {
        const memberQuery = query(
            collection(db, 'workplace_members'),
            where('user_id', '==', userId)
        );
        const memberSnapshot = await getDocs(memberQuery);
        const workplaceIds = memberSnapshot.docs.map(doc => doc.data().workplace_id);

        const workplaces: Workplace[] = [];
        for (const id of workplaceIds) {
            const workplace = await this.getWorkplace(id);
            if (workplace) workplaces.push(workplace);
        }

        return workplaces;
    }
}
