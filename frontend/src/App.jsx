import React from 'react';
import { AuthProvider } from './context/AuthContext';
import { AppProvider } from './context/AppContext';
import Navbar from './components/navbar/Navbar';
import AppRoutes from './routes/AppRoutes';
import Toast from './components/common/Toast';

function App() {
  return (
    <AuthProvider>
      <AppProvider>
        <div className="app-container">
          <Navbar />
          <main className="main-content">
            <AppRoutes />
          </main>
          <Toast />
        </div>
      </AppProvider>
    </AuthProvider>
  );
}

export default App;
