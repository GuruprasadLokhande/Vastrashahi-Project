import React from "react";
import Link from "next/link";
import { Tags } from "@/svg";

const BlogItem = ({ blog }) => {
  const { id, date, title, tags } = blog || {};
  return (
    <div className="tp-blog-item-2 mb-40">
      <div className="tp-blog-content-2">
        <div className="tp-blog-meta-2">
          <span>
            <Tags />
          </span>
          {tags.map((t, i) => (
            <a key={i} href="#">
              {t}
              {i < tags.length - 1 && ", "}
            </a>
          ))}
        </div>
        <div className="tp-blog-meta-date-2 mb-15">
          <span>{date}</span>
        </div>
        <h3 className="tp-blog-title-2">
          <Link href={`/blog-details/${id}`}>{title}</Link>
        </h3>
      </div>
    </div>
  );
};

export default BlogItem;
