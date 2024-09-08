import React from "react";
import "../rich-text.css"

function RichTextViewer({ className, content }) {
  return <div className={`rich-text-container ${className}`} dangerouslySetInnerHTML={{ __html: content }}></div>;
}

export default RichTextViewer;
