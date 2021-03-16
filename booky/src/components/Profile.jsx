import React, { useEffect, useState } from "react";
import auth from "../services/authService";

const Profile = ({ history }) => {
  const [user, setUser] = useState("");

  useEffect(() => {
    const user = auth.getCurrentUser();
    setUser(user);
    if (!user) {
      history.push("/login");
    }
  }, []);
  return (
    <div className="container-username">
      <div className="username">
        <h6 className="username-item">
          <span className="username-span-1">Name:</span>
          <span className="username-span-2">{user.name}</span>
        </h6>
        <h6 className="username-item">
          <span className="username-span-1">Email:</span>
          <span className="username-span-2">{user.email}</span>
        </h6>
        <h6 className="username-item">
          <span className="username-span-1">Admin:</span>
          {user.isAdmin ? (
            <span className="username-span-2">Yes</span>
          ) : (
            <span className="username-span-2">No</span>
          )}
        </h6>
      </div>
    </div>
  );
};

export default Profile;
