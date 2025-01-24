import React, { useState, useEffect } from 'react';
import { School, Department, Class } from './types';
import { Navbar } from './components/Navbar';
import { HomePage } from './pages/HomePage';
import { SchoolsPage } from './pages/SchoolsPage';
import { DepartmentsPage } from './pages/DepartmentsPage';
import { ClassesPage } from './pages/ClassesPage';
import { ClassPage } from './pages/ClassPage';
import { AboutPage } from './pages/AboutPage';
import { ContactPage } from './pages/ContactPage';
import { LoginModal } from './components/LoginModal';
import { ThemeProvider } from './context/ThemeContext';
import { api } from './lib/api';

const App: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<string>('home');
  const [selectedSchool, setSelectedSchool] = useState<School | null>(null);
  const [selectedDepartment, setSelectedDepartment] = useState<Department | null>(null);
  const [selectedClass, setSelectedClass] = useState<Class | null>(null);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { data: { session } } = await api.supabase.auth.getSession();
        setIsAuthenticated(!!session);
      } catch (error) {
        console.error('Error checking auth status:', error);
        setIsAuthenticated(false);
      }
    };
    checkAuth();
  }, []);

  const handleNavigation = (page: string) => {
    setCurrentPage(page);
    if (page === 'home' || page === 'schools') {
      setSelectedSchool(null);
      setSelectedDepartment(null);
      setSelectedClass(null);
    }
  };

  const handleDepartmentSelect = (dept: Department) => {
    if (!isAuthenticated) {
      setSelectedDepartment(dept);
      setShowLoginModal(true);
    }
  };

  const handleLogin = async (credentials: { email: string; password: string }) => {
    try {
      const { session } = await api.auth.signIn(credentials.email, credentials.password);
      if (session) {
        setIsAuthenticated(true);
        setShowLoginModal(false);
      }
    } catch (error) {
      console.error('Login error:', error);
    }
  };

  const renderContent = () => {
    switch (currentPage) {
      case 'home':
        return <HomePage onGetStarted={() => handleNavigation('schools')} />;
      case 'schools':
        if (selectedClass) {
          return (
            <ClassPage
              classData={selectedClass}
              onBack={() => setSelectedClass(null)}
            />
          );
        }
        if (selectedDepartment && isAuthenticated) {
          return (
            <ClassesPage
              department={selectedDepartment}
              onBack={() => setSelectedDepartment(null)}
              onClassSelect={setSelectedClass}
            />
          );
        }
        if (selectedSchool) {
          return (
            <DepartmentsPage
              school={selectedSchool}
              onBack={() => setSelectedSchool(null)}
              onDepartmentSelect={handleDepartmentSelect}
            />
          );
        }
        return <SchoolsPage onSchoolSelect={setSelectedSchool} />;
      case 'about':
        return <AboutPage />;
      case 'contact':
        return <ContactPage />;
      default:
        return null;
    }
  };

  return (
    <ThemeProvider>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
        <Navbar currentPage={currentPage} onNavigate={handleNavigation} />
        <main className="min-h-[calc(100vh-4rem)]">
          {renderContent()}
        </main>
        {showLoginModal && selectedDepartment && (
          <LoginModal
            department={selectedDepartment.name}
            onClose={() => {
              setShowLoginModal(false);
              setSelectedDepartment(null);
            }}
            onLogin={handleLogin}
          />
        )}
      </div>
    </ThemeProvider>
  );
};

export default App;