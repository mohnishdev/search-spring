import React from 'react';
import './FeaturedImage.scss';


const FeaturedImage = ({
  imageSrc = '',
  label = 'Spring Collection',
  heading = 'Limited Edition Series',
}) => {
  return (
    <div className="featured-image" style={imageSrc ? { backgroundImage: `url(${imageSrc})` } : {}}>
      {/* Gradient overlay */}
      <div className="featured-image__gradient" />

      {/* Text content */}
      <div className="featured-image__content">
        <span className="featured-image__label">{label}</span>
        <h4 className="featured-image__heading">{heading}</h4>
      </div>
    </div>
  );
};

export default FeaturedImage;