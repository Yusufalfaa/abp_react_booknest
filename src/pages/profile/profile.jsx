// Profile.js
import { useEffect } from "react";

const Profile = () => {
  useEffect(() => {
    document.title = "Edit Profile - BookNest";
  }, []);
  
  return (
    <div>
      <h1>User Profile</h1>
    </div>
  );
};

export default Profile;
