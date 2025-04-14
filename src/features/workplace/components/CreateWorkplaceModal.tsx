import React, { useState } from 'react';
import { Timestamp } from 'firebase/firestore';
import { workplaceApi} from '../api/workplaceApi';
import { useAuth } from '../hooks/useAuth';
import { WorkplaceRole } from '../types/workplace';

interface CreateWorkplaceModalProps {
    isOpen: boolean;
    onClose: () => void;
    onCreated: (workplaceId: string) => void;
}

export const CreateWorkplaceModal: React.FC<CreateWorkplaceModalProps> = ({
    isOpen,
    onClose,
    onCreated
}) => {
    const { user } = useAuth();
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    /**
     * Handles the form submission to create a new workplace
     * 
     * This function:
     * 1. Creates a new workplace with the provided name and description
     * 2. Adds the current user as an owner of the workplace
     * 3. Clears the form and closes the modal on success
     * 4. Handles and displays errors if they occur
     * 
     * @param {React.FormEvent} e - The form submission event
     * @returns {Promise<void>}
     */
    const handleSubmit = async (e: React.FormEvent) => {
        // Prevent the default form submission behavior
        e.preventDefault();
        if (!user) return;

        try {
            // Reset the error state and set the submitting state
            setIsSubmitting(true);
            setError(null);

            // Create the new workplace
            const now = Timestamp.now();
            const workplaceId = await workplaceApi.createWorkplace({
                name,
                description,
                owner_id: user.uid,
                created_at: now,
                updated_at: now
            });

            // Add yourself as a member
            await workplaceApi.addMember({
                workplace_id: workplaceId,
                user_id: user.uid,
                role: 'owner' as WorkplaceRole,
                joined_at: now
            });

            onCreated(workplaceId);
            setName('');
            setDescription('');
            onClose();
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An unknown error has occurred');
        } finally {
            setIsSubmitting(false);
        }
    };

    if (!isOpen) return null;

/**
 * The modal component to create a new workplace 
 * 
 * This component provides a form interface for users to create new workplaces.
 * It handles:
 * - Input validation for required fields
 * - Form submission with loading states
 * - Error handling and display
 * - Creating the workplace in the database
 * - Adding the current user as an owner
 * - Notifying the parent component on successful creation
 * 
 * The modal can be shown/hidden using the isOpen prop and includes
 * responsive styling for different screen sizes.
 */
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <h2 className="text-xl font-bold mb-4">Create new workplaces</h2>
        
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}
        
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="name">
              workspace name <span className="text-red-500">*</span>
            </label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              required
            />
          </div>
          
          <div className="mb-6">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="description">
              Description
            </label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              rows={3}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <button
              type="button"
              onClick={onClose}
              className="bg-gray-300 hover:bg-gray-400 text-black font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting || !name.trim()}
              className={`bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline ${
                (isSubmitting || !name.trim()) ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              {isSubmitting ? 'Creating....' : 'Create'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
