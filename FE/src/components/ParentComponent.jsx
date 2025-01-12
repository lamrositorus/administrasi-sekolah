import React from 'react';
import { useParams } from 'react-router-dom';
import Header from '../pages/Header';

const ParentComponent = () => {
  const id = useParams();
  return (
    <div>
      <Header Userid={id} />
      <div>ParentComponent</div>
    </div>
  );
};
export default ParentComponent;
