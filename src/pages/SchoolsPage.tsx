import React, { useState, useEffect } from 'react';
import { School } from '../types';
import { SchoolCard } from '../components/SchoolCard';
import { api } from '../lib/api';
import { LoadingDots } from '../components/LoadingDots';

interface SchoolsPageProps {
  onSchoolSelect: (school: School) => void;
}

export const SchoolsPage: React.FC<SchoolsPageProps> = ({ onSchoolSelect }) => {
  const [schools, setSchools] = useState<School[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadSchools = async () => {
      try {
        const data = await api.schools.getAll();
        setSchools(data);
      } catch (err) {
        setError('Erreur lors du chargement des écoles');
        console.error('Error loading schools:', err);
      } finally {
        setLoading(false);
      }
    };

    loadSchools();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingDots />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center text-red-600">
        {error}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <h2 className="text-2xl font-semibold text-gray-800 dark:text-white mb-6 animate-fadeIn">
          Sélectionnez votre école
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {schools.map((school, index) => (
            <div
              key={school.id}
              className="animate-slideUp"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <SchoolCard
                school={school}
                onClick={onSchoolSelect}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};