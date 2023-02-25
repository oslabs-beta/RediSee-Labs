import React, { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import SideBar from './components/SideBar';
import ActivitiesPage from './components/BasicActivities/ActivitiesPage';
import ErrorsPage from './components/Errors/ErrorsPage';
import MemoryPage from './components/Memory/MemoryPage';
import PerformancePage from './components/Performance/PerformancePage';
import PersistencePage from './components/Persistence/PersistencePage';
import { ThemeProvider } from 'styled-components';
import { GlobalStyle } from './components/StyledComponents/GlobalStyle';
import { lightTheme, darkTheme } from './components/StyledComponents/Themes';
import { useSelector } from 'react-redux';

const App = () => {
  const theme = useSelector((state) => state.global.theme);
  console.log(theme);
  return (
    <div>
      <ThemeProvider theme={theme === 'light' ? lightTheme : darkTheme}>
        <GlobalStyle />
        <SideBar />
        <Routes>
          <Route
            path="/BasicActivities/:redisName"
            element={<ActivitiesPage />}
          />
          <Route path="/Error/:redisName" element={<ErrorsPage />} />
          <Route path="/Memory/:redisName" element={<MemoryPage />} />
          <Route path="/Performance/:redisName" element={<PerformancePage />} />
          <Route path="/Persistence/:redisName" element={<PersistencePage />} />
          <Route path="/:instanceName" />
        </Routes>
      </ThemeProvider>
    </div>
  );
};

export default App;
