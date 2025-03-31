import React from 'react';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

const TabPanel: React.FC<TabPanelProps> = ({ children, value, index, ...other }) => {
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      {...other}
      style={{
        display: value !== index ? 'none' : 'block',
        padding: '8px 0'
      }}
    >
      {value === index && children}
    </div>
  );
};

export default TabPanel;
