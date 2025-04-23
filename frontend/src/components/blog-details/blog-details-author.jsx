import React from "react";
// internal
import social_data from "@/data/social-data";

const BlogDetailsAuthor = () => {
  return (
    <div
      className="tp-postbox-details-author"
      data-bg-color="#F4F7F9"
    >
      <div className="tp-postbox-details-author-content">
        <span>Written by</span>
        <h5 className="tp-postbox-details-author-title">
          <a href="#">Vastrashahi</a>
        </h5>
        <p>
          The Vastrashahi team specializes in traditional Indian clothing, 
          bringing authentic designs and cultural insights to our customers.
          Our blog showcases the rich heritage and craftsmanship behind every garment.
        </p>

        <div className="tp-postbox-details-author-social">
          {social_data.map((s) => (
            <a href={s.link} target="_blank" className="me-1" key={s.id}>
              <i className={s.icon}></i>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BlogDetailsAuthor;
