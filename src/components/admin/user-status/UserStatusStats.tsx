import React from 'react';
import { Users, UserCheck, Home, AlertCircle } from 'lucide-react';
import { UserStatusData } from '@/services/dashboardApi';

interface UserStatusStatsProps {
  stats?: UserStatusData['statistics'];
  isLoading?: boolean;
}

const UserStatusStats: React.FC<UserStatusStatsProps> = ({ stats, isLoading }) => {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 animate-pulse">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="h-28 bg-gray-200 rounded-xl" />
        ))}
      </div>
    );
  }

  const statItems = [
    // {
    //   label: 'Registrations',
    //   value: stats?.total || 0,
    //   icon: <Users className="w-6 h-6 text-blue-600" />,
    //   bg: 'bg-blue-50',
    //   border: 'border-blue-100',
    // },
    {
      label: 'Allotted',
      value: stats?.allotted || 0,
      icon: <Home className="w-6 h-6 text-indigo-600" />,
      bg: 'bg-indigo-50',
      border: 'border-indigo-100',
    },
    {
      label: 'Rooms Acquired',
      value: stats?.acquired || 0,
      icon: <UserCheck className="w-6 h-6 text-emerald-600" />,
      bg: 'bg-emerald-50',
      border: 'border-emerald-100',
    },
    {
      label: 'Not Acquired',
      value: (stats?.allotted || 0) - (stats?.acquired || 0),
      icon: <AlertCircle className="w-6 h-6 text-rose-600" />,
      bg: 'bg-rose-50',
      border: 'border-rose-100',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
      {statItems.map((item, index) => (
        <div
          key={index}
          className={`flex flex-col justify-center p-4 rounded-xl border ${item.border} ${item.bg} backdrop-blur-sm shadow-sm transition-transform hover:scale-[1.02]`}
        >
          <div className="flex items-center mb-2">
            <div className="p-2 bg-white rounded-lg shadow-sm mr-3">
              {item.icon}
            </div>
            <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">{item.label}</p>
          </div>
          <h3 className="text-2xl font-black text-gray-900 ml-1">{item.value}</h3>
        </div>
      ))}
    </div>
  );
};

export default UserStatusStats;
