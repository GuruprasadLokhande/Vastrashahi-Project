import React from "react";
import { Date, UserTwo } from "@/svg";

const PostboxDetailsTop = ({blog}) => {
  const {category, title, date} = blog || {};
  return ( 
    <div className="tp-postbox-details-top">
      <div className="tp-postbox-details-category">
        <span>
          <a href="#" className="text-capitalize">{category}</a>
        </span>
      </div>
      <h3 className="tp-postbox-details-title">
        {title}
      </h3>
      <div className="tp-postbox-details-meta mb-50">
        <span data-meta="author">
          <UserTwo />
          By <a href="#">{" "}Vastrashahi</a>
        </span>
        <span>
          <Date />
          {" "}{date}
        </span>
      </div>
    </div>
  );
};

export default PostboxDetailsTop;
