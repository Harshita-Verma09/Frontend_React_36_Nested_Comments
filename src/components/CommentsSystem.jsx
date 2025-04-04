import React, { useState } from "react";

const CommentSystem = () => {
  const [comments, setComments] = useState([]);
  const [text, setText] = useState("");

  // Add a new comment or reply
  const addComment = (text, parentId = null) => {
    if (!text.trim()) return; // Prevent empty comments
    const newComment = {
      id: Date.now(),
      text,
      parentId,
      children: [],
    };

    if (parentId === null) {
      setComments([...comments, newComment]); // Add main comment
    } else {
      const updatedComments = addReply(comments, parentId, newComment);
      setComments([...updatedComments]);
    }
  };

  // Recursively add replies
  const addReply = (commentsList, parentId, newComment) => {
    return commentsList.map(comment => {
      if (comment.id === parentId) {
        return { ...comment, children: [...comment.children, newComment] };
      }
      return { ...comment, children: addReply(comment.children, parentId, newComment) };
    });
  };

  return (
    <div className="comment-container">
      <h2>💬 Nested Comment System</h2>

      {/* Input for new comment */}
      <div className="comment-input">
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Write a comment..."
        />
        <button onClick={() => { addComment(text); setText(""); }}>Add Comment</button>
      </div>

      {/* Render comments */}
      <CommentList comments={comments} addComment={addComment} />
    </div>
  );
};

// Component to render a list of comments
const CommentList = ({ comments, addComment }) => {
  return (
    <ul className="comment-list">
      {comments.map(comment => (
        <Comment key={comment.id} comment={comment} addComment={addComment} />
      ))}
    </ul>
  );
};

// Single comment component
const Comment = ({ comment, addComment }) => {
  const [replyText, setReplyText] = useState("");
  const [showReply, setShowReply] = useState(false);

  return (
    <li className="comment">
      <p>{comment.text}</p>

      {/* Reply input */}
      {showReply && (
        <div className="reply-input">
          <input
            type="text"
            value={replyText}
            onChange={(e) => setReplyText(e.target.value)}
            placeholder="Write a reply..."
          />
          <button onClick={() => { addComment(replyText, comment.id); setReplyText(""); setShowReply(false); }}>Reply</button>
        </div>
      )}

      <button className="reply-btn" onClick={() => setShowReply(!showReply)}>
        {showReply ? "Cancel" : "Reply"}
      </button>

      {/* Render nested replies */}
      {comment.children.length > 0 && (
        <ul className="nested-comments">
          <CommentList comments={comment.children} addComment={addComment} />
        </ul>
      )}
    </li>
  );
};

export default CommentSystem;
