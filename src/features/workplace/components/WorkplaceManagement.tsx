
/**
 * A component for managing workplaces in the application.
 * 
 * This component provides functionality to:
 * - Display a list of workplaces
 * - Select a workplace
 * - Open a modal to create new workplaces
 * 
 * @component
 * @example
 * ```tsx
 * <WorkplaceManagement />
 * ```
 */
import React, { useState } from 'react';
import { Workplace } from '../types/workplace';
import { WorkplaceList } from './WorkplaceList';
import { CreateWorkplaceModal } from './CreateWorkplaceModal';

export const WorkplaceManagement: React.FC = () => {
    const [selectedWorkplace, setSelectedWorkplace] = useState<Workplace | null>(null);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

    const handleSelectWorkplace = (workplace: Workplace) => {
        setSelectedWorkplace(workplace);

    }

    const handleWorkplaceCreated = (workplaceId: string) => {

    }

    return (
        <div className="container mx-auto p-4">
            <WorkplaceList
                onSelectWorkplace={handleSelectWorkplace}
                onCreateNew={() => setIsCreateModalOpen(true)}
            />

            <CreateWorkplaceModal
                isOpen={isCreateModalOpen}
                onClose={() => setIsCreateModalOpen(false)}
                onCreated={handleWorkplaceCreated}
            />

        </div>
    )
}