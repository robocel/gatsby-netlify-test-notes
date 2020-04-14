import React from "react"
import { Link, useStaticQuery } from "gatsby"

import Layout from "../components/layout"
import SEO from "../components/seo"

const BlogsPage = () => {
    const data = useStaticQuery(graphql`
        {
            allMarkdownRemark(
                sort: { order: DESC, fields: [frontmatter___date] }
                limit: 1000
            ) {
                edges {
                    node {
                        frontmatter {
                            path
                            title
                        }
                    }
                }
            }
        }
    `);

    return (
        <Layout>
            <SEO title="Home" />
            <h1>My Blog Posts</h1>
            <ul>
                { data.allMarkdownRemark.edges.map(({node}) => <Link to={node.frontmatter.path}><li>{node.frontmatter.title}</li></Link>) }
            </ul>
        </Layout>
    );
}

export default BlogsPage
