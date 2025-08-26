import React from 'react';

const SidebarLayout = ({ children }) => {
  return (
    <div className="sidebar-layout">
      {/* Header will go here */}
      <main className="sidebar-content">
        {children}
      </main>
      {/* Footer or action bar will go here */}
    </div>
  );
};

export default SidebarLayout;
