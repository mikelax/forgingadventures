import sanitizeHtml from 'sanitize-html';

export default function (input) {
  return sanitizeHtml(input, {
    allowedTags: ['h1', 'h2', 'h3', 'blockquote', 'p', 'a', 'ul', 'ol', 'img',
      'nl', 'li', 'b', 'i', 'strong', 'em', 'strike', 'hr', 'br', 'div',
      'table', 'thead', 'caption', 'tbody', 'tr', 'th', 'td', 'pre'],
    allowedAttributes: {
      a: ['href'],
      img: ['src', 'width', 'height']
    }
  });
}
