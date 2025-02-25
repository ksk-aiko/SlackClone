import React, { useState } from 'react';
import { Timestamp } from 'firebase/firestore';
import { workplaceApi} from '../api/workplaceApi.ts';
import { useAuth } from '../hooks/useAuth.ts';

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

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user) return;

        try {
            setIsSubmitting(true);
            setError(null);

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
                role: 'owner',
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
}