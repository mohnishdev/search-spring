import React from 'react';
import Filters from '../Filters/Filters';
import FeaturedImage from '../FeaturedImage/FeaturedImage';
import './Sidebar.scss';

const Sidebar = (props) => {
  return (
    <aside className="sidebar">
      <Filters {...props} />
      <FeaturedImage />
    </aside>
  );
};

export default Sidebar;
