// src/utils/decodeHtml.js
// Small helper to decode HTML entities OpenTDB returns (&quot;, &#039;, &amp;, etc.)
export default function decodeHtml(html) {
  if (!html) return "";
  // Using a DOM parser (works in browser)
  const txt = document.createElement("textarea");
  txt.innerHTML = html;
  return txt.value;
}
