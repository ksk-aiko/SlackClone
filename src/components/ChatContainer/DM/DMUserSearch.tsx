/**
 * DMUserSearch Component
 * 
 * A modal component that allows users to search for and select other users
 * to start or continue a direct message (DM) conversation.
 * 
 * @component
 * @param {Object} props - Component props
 * @param {Function} props.onClose - Callback function to close the modal
 * 
 * @example
 * ```tsx
 * <DMUserSearch onClose={() => setShowDMSearch(false)} />
 * ```
 * 
 * The component handles:
 * - Fetching all users from the database (excluding the current user)
 * - Searching users by name or email
 * - Creating or retrieving an existing DM conversation when a user is selected
 * - Loading and error states during user fetching
 * - UI for displaying user search results with profile pictures
 */

import React, { useState, useEffect } from 'react';
import { useAppSelector, useAppDispatch } from '../../../app/hook';
import { createOrGetDMChatAsync, setCurrentDMChat } from '../../../features/dm/dmSlice';
import { fetchUsers, searchUsers } from '../../../features/users/userAPI';
import { User, UserRef } from '../../../type/User';

interface DMUserSearchProps {
    onClose: () => void;
}

const DMUserSearch: React.FC<DMUserSearchProps> = ({ onClose }) => {
    const dispatch = useAppDispatch();
    const currentUserId = useAppSelector((state) => state.user.userId);

    const [searchTerm, setSearchTerm] = useState('');
    const [users, setUsers] = useState<UserRef[]>([]);
    const [filteredUsers, setFilteredUsers] = useState<UserRef[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {

        // Fetch all users excluding the current user
        const loadUsers = async () => {
            try {
                setIsLoading(true);
                const usersList = await fetchUsers();
                const filteredList = usersList.filter(u => u.uid !== currentUserId);
                setUsers(filteredList);
                setFilteredUsers(filteredList);
            } catch (err) {
                setError('Failed to load users.Please try again.');
                console.error('Error loading users:', err);
            } finally {
                setIsLoading(false);
            }
        };

        loadUsers();
    }, [currentUserId]);

    useEffect(() => {
        // Filter users based on search term
        const filterUsers = async () => {
            if (searchTerm.trim() === '') {
                setFilteredUsers(users);
            } else {
                try {
                    const filteredList = await searchUsers(searchTerm);
                    setFilteredUsers(filteredList);
                } catch (err) {
                    setError('Failed to search users. Please try again.');
                    console.error('Error searching users:', err);
                }
            }
        };

        filterUsers();
    }, [searchTerm, users]);

    // Handle search input change
    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(e.target.value);
    };

    // Handle user selection
    const handleSelectUser = async (userRef: UserRef) => {
        if (!currentUserId) return;

        try {
            const result = await dispatch(createOrGetDMChatAsync({
                currentUserId,
                receiverId: userRef.uid
            })).unwrap();

            dispatch(setCurrentDMChat(result.id));

            onClose();
        } catch (error) {
            console.error('Error creating or getting DM chat:', error);
            setError('Failed to start coversation. Please try again.');
        }
    };

    // Handle modal click to prevent closing when clicking inside the modal
    const handleModalClick = (e: React.MouseEvent) => {
        e.stopPropagation();
    };

    return (
        // Modal overlay
        <div
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
            onClick={onClose}
        >
            {/* Modal content */}
            <div 
                className="bg-gray-800 text-white rounded-lg max-w-md w-full shadow-xl"
                onClick={handleModalClick}
            >
                {/* Modal header */}
                <div className="border-b border-gray-700 px-4 py-2 flex justify-between items-center">
                    <h3 className="text-lg font-medium ">New Message</h3>
                    <button 
                        className="text-gray-400 hover:text-white"
                        onClick={onClose}
                    >
                        &times;
                    </button>
                </div>
                {/* Modal body */}
                <div className="p-4">
                    <input 
                        type="text"
                        placeholder="Search users by name or email"
                        className="w-full p-2 rounded bg-gray-700 text-white border border-gray-600 focus:outline-none focus:border-blue-500"
                        onChange={handleSearchChange}
                    />
                </div>

                {/* User list */} 
                {/* Loading and error states */}
                {/* Display filtered users */}
                <div className="px-4 pb-4 max-h-80 overflow-y-auto">
                    {isLoading ? (
                        <div className="text-center py-4 text-gray-400">Loading users...</div>
                    ) : error ? (
                        <div className="text-center py-4 text-red-400">{error}</div>
                    ) : filteredUsers.length === 0 ? (
                        <div className="text-center py-4 text-gray-400">No users found</div>
                    ) : (
                        <ul className="space-y-2">
                            {filteredUsers.map((userRef) => (
                                <li
                                    key={userRef.uid}
                                    className="flex items-center p-2 hover:bg-gray-700 rounded cursor-pointer"
                                    onClick={() => handleSelectUser(userRef)}
                                >
                                    <div className="w-10 h-10 rounded-full overflow-hidden mr-3">
                                        {userRef.user.profile_picture ? (
                                            <img 
                                                src={userRef.user.profile_picture} 
                                                alt={userRef.user.displayName} 
                                                className="w-full h-full object-cover"
                                            />
                                        ) : (
                                            <div className="w-full h-full bg-gray600 flex items-center justify-center">
                                                {userRef.user.displayName.charAt(0).toUpperCase()}
                                            </div>
                                        )}
                                    </div>
                                    <div className="">
                                        <div className="font-medium">{userRef.user.displayName}</div>
                                        <div className="text-sm text-gray-400 ">{userRef.user.email}</div>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            </div>
        </div>
    );
};

export default DMUserSearch;