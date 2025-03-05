import { firebaseApp } from "../../firebase/firebaseConfig";
import {
    getFirestore,
    collection,
    addDoc,
    query,
    where,
    getDocs,
    doc,
    getDoc,
    updateDoc,
    orderBy,
    serverTimestamp,
    onSnapshot,
    Timestamp,
    DocumentReference
} from "firebase/firestore";
import { DMChat, DMMessage, DMMessageRef, DMChatRef } from "../../type/DM";
import { User } from "../../type/User";

const db = getFirestore(firebaseApp);

export const createDMChat = async (currentUserId: string, receiverId: string): Promise<string> => {
    try {
        const existingChat = await findExistingDMChat(currentUserId, receiverId);
        if (existingChat) {
            return existingChat.id;
        }

        const dmChatRef = await addDoc(collection(db, "dm_chats"), {
            participants: [currentUserId, receiverId],
            created_at: serverTimestamp(),
            updated_at: serverTimestamp()
        });

        return dmChatRef.id;
    } catch (error) {
        console.error("Failed to create DMChat:.", error);
        throw error;
    }
}

    export const findExistingDMChat = async (userId: string, user2Id: string): Promise<DMChatRef | null> => {
        try {
            const q = query(
                collection(db, "dm_chats"),
                where("participants", "array-contains", userId)
            );

            const querySnapshot = await getDocs(q);

            let existingChat: DMChatRef | null = null;

            querySnapshot.forEach((doc) => {
                const chatData = doc.data() as DMChat;
                if (chatData.participants.includes(user2Id)) {
                    existingChat = {
                        id: doc.id,
                        chat: chatData
                    };
                }
            });

            return existingChat;
        } catch (error) {
            console.error("Search for existing DM chat failed:", error);
            throw error;
        }
    };

    export const fetchUserDMChats = async (userId: string): Promise<DMChatRef[]> => {
        try {
            const q = query(
                collection(db, "dm_chats"),
                where("participants", "array-contains", userId),
                orderBy("updated_at", "desc")
            );

            const querySnapshot = await getDocs(q);

            const dmChats: DMChatRef[] = [];

            querySnapshot.forEach((doc) => {
                    const chatData = doc.data() as DMChat;
                    dmChats.push({
                        id: doc.id,
                        chat: chatData
                    });
                });

                return dmChats;
            } catch (error) {
                console.error("Failed to fetch user DM chats:", error);
                throw error;
            }
        };

    export const sendDMMessage = async (dmChatId: string, senderId: string, receiverId: string, text: string): Promise<string> {
        try {
            const messageData: DMMessage = {
                user_id: senderId,
                dm_chat_id: dmChatId,
                text,
                created_at: serverTimestamp() as Timestamp,
                updated_at: serverTimestamp() as Timestamp,
                is_edited: false,
                is_read: false
            };

            const messageRef = await addDoc(collection(db, "dm_messages"), messageData);

            const dmChatRef = doc(db, "dm_chats", dmChatId);
            await updateDoc(dmChatRef, {
                updated_at: serverTimestamp(),
                last_message: {
                    text,
                    sender_id: senderId,
                    sent_at: serverTimestamp()
                }
            });

            return messageRef.id;
        } catch (error) {
            console.error("Failed to send DM message:", error);
            throw error;
        }
    };
    
