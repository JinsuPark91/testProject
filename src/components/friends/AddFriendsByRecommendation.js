import React from 'react';
import AddFriendsByRecommendationHeader from './AddFriendsByRecommendationHeader';
import AddFriendsByRecommendationContent from './AddFriendsByRecommendationContent';

function AddFriendsByRecommendation() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <AddFriendsByRecommendationHeader />
      <AddFriendsByRecommendationContent />
    </div>
  );
}
export default AddFriendsByRecommendation;
