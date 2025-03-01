import React from 'react';
import { useWorkplaces } from '../hooks/useWorkplaceAuth.ts';
import { Workplace } from '../types/workplace.ts';

interface WorkplaceListProps {
    onSelectWorkplace: (workplace: Workplace) => void;
    onCreateNew: () => void;
}

export const WorkplaceList: React.FC<WorkplaceListProps> = ({
    onSelectWorkplace,
    onCreateNew
}) => {
    const { workplaces, loading, error } = useWorkplaces();

    if (loading) {
        return <div className="p-4">Loading...</div>
    }

    if (error) {
        return <div className="p-4 text-red-500">An error has occurred.: {error.message}</div>
    }

    return (
        <div className="p-4">
            <div className="flex flex-col justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-white mb-4">Workplace</h2>
                <button 
                    className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                    onClick={onCreateNew} 
                >
                    Create New
                </button>
            </div>

            {workplaces.length === 0 ? (
                <p className="text-white">No workplaces are currently registered</p>
            ) : (
                <ul className="space-y-2">
                    {workplaces.map((workplace) => (
                        <li 
                            key={workplace.id}
                            onClick={() => onSelectWorkplace(workplace)}
                            className="p-3 border rounded cursor-pointer hover:bg-gray-100 flex items-center"
                        >
                            {workplace.icon_url && (
                                <img 
                                    src={workplace.icon_url} 
                                    alt={workplace.name}
                                    className="w-8 h-8 rounded-full mr-3" 
                                />
                            )}
                            <div>
                                <h3 className="font-medium">{workplace.name}</h3>
                                {workplace.description && (
                                    <p className="text-sm text-gray-600">{workplace.description}</p>
                                )}
                            </div>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};