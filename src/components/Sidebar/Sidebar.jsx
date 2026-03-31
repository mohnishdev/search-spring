import React from 'react';
import Filters from '../Filters/Filters';
import FeaturedImage from '../FeaturedImage/FeaturedImage';
import './Sidebar.scss';

const Sidebar = () => {
  return (
    <aside className="sidebar">
      <Filters />
      <FeaturedImage />
    </aside>
  );
};

export default Sidebar;