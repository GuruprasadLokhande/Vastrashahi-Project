import React from "react";
import SEO from "@/components/seo";
import HeaderTwo from "@/layout/headers/header-2";
import Wrapper from "@/layout/wrapper";
import Footer from "@/layout/footers/footer";
import blogData from "@/data/blog-data";

// Only show the Vastrashahi articles
const BlogArticles = () => {
  // Filter to only show fashion articles from Vastrashahi
  const vastrashahiArticles = blogData.filter((b) => 
    b.category === 'Vastrashahi' && 
    (b.tags.includes('Fashion') || b.tags.includes('Traditional') || b.tags.includes('Clothing'))
  );

  return (
    <section className="tp-postbox-area pt-120 pb-120">
      <div className="container">
        <div className="row">
          <div className="col-xl-12">
            <h2 className="section-title mb-30 text-center">Vastrashahi Fashion Blogs</h2>
            <p className="text-center mb-50">Authentic Content By Our Expert Team</p>
            <div className="tp-postbox-wrapper">
              {vastrashahiArticles.map((article) => (
                <article key={article.id} className="tp-postbox-item format-image mb-50 transition-3">
                  <div className="tp-postbox-content">
                    <div className="tp-postbox-meta">
                      <span>
                        <i className="far fa-calendar-check"></i> {article.date}
                      </span>
                      <span>
                        <a href="#">
                          <i className="far fa-user"></i> Vastrashahi
                        </a>
                      </span>
                    </div>
                    <h3 className="tp-postbox-title">
                      {article.title}
                    </h3>
                    <div className="tp-postbox-text">
                      <p>{article.desc}</p>
                    </div>
                    <div className="tp-postbox-read-more mt-25">
                      <a href={`/blog-details/${article.id}`} className="tp-btn">
                        Read More
                      </a>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

const BlogPostBoxPage = () => {
  return (
    <Wrapper>
      <SEO pageTitle="Vastrashahi Fashion Blog" />
      <HeaderTwo style_2={true} />
      <BlogArticles />
      <Footer primary_style={true} />
    </Wrapper>
  );
};

export default BlogPostBoxPage;
