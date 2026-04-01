import React from 'react';
import Filters from '../Filters/Filters';
import './Sidebar.scss';

const Sidebar = (props) => {
  return (
    <aside className="sidebar">
      <Filters {...props} />
    </aside>
  );
};

export default Sidebar;
