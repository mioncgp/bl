import React, { useState, useEffect } from "react";
import { getCurrentUser } from "../../services/authService";

const Like = (props) => {
  const [likes, setLikes] = useState([]);
  const user = getCurrentUser();

  if (!user) {
    return null;
  }

  useEffect(() => {
    if (props.likes.length > 0) {
      setLikes(props.likes);
    }
  }, [user._id]);

  const liked = likes.find((id) => id === user._id);

  let classes = "fa fa-heart";
  if (!liked) classes += "-o";
  return (
    <i
      onClick={props.onClick}
      style={{ cursor: "pointer" }}
      className={classes}
      aria-hidden="true"
    />
  );
};

export default Like;
