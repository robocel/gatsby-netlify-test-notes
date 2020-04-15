import React from "react"
import { graphql } from "gatsby"
export default function Template({
  data, // this prop will be injected by the GraphQL query below.
}) {
  let [comments, setComments] = React.useState([])
  let [newComment, setNewComment] = React.useState("")

  const { markdownRemark } = data // data.markdownRemark holds your post data
  const { frontmatter, html } = markdownRemark

  const getComments = () => {
    fetch(`/.netlify/functions/like-post/${frontmatter.slug}`)
      .then(response => response.json())
      .then(comments =>
        setComments(comments.map(comment => comment.data.comment) || [])
      )
  }

  React.useEffect(() => {
    getComments()
  }, [])

  const addComment = event => {
    fetch("/.netlify/functions/like-post", {
      method: "POST",
      body: JSON.stringify({ post: frontmatter.slug, comment: newComment }),
    }).then(() => {
      getComments()
      setNewComment("")
    })
    event.preventDefault()
  }

  return (
    <div className="blog-post-container">
      <div className="blog-post">
        <h1>{frontmatter.title}</h1>
        <h2>{frontmatter.date}</h2>
        <div
          className="blog-post-content"
          dangerouslySetInnerHTML={{ __html: html }}
        />
      </div>
      <form onSubmit={event => addComment(event)}>
        <input
          type="text"
          value={newComment}
          onChange={event => setNewComment(event.target.value)}
        ></input>
        <button type="submit">Submit Comment</button>
      </form>
      <section>
        <h2>Comments</h2>
        {comments.map(comment => (
          <p>{comment}</p>
        ))}
      </section>
    </div>
  )
}
export const pageQuery = graphql`
  query($path: String!) {
    markdownRemark(frontmatter: { path: { eq: $path } }) {
      html
      frontmatter {
        date(formatString: "MMMM DD, YYYY")
        path
        title
        slug
      }
    }
  }
`
