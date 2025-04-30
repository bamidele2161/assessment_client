
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Index = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem('auth_token');

  useEffect(() => {
    if (token) {
      navigate('/dashboard');
    } else {
      navigate('/login');
    }
  }, [navigate, token]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="animate-spin-slow w-12 h-12 border-4 border-primary border-t-transparent rounded-full"></div>
    </div>
  );
};

export default Index;
