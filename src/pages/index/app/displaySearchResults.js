import { markdownToHtml as originalMarkdownToHtml } from './markdownToHtml.js';  // Adjust the import path as needed

const escapeHtml = (text) => {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
};

const markdownToHtml = (markdown) => {
  const convertedHtml = originalMarkdownToHtml(markdown);
  return convertedHtml.replace(/<pre.*?>.*?<code.*?>([\s\S]*?)<\/code>.*?<\/pre>/g, (match, codeContent) => {
    const escapedCode = escapeHtml(codeContent);
    return `<pre class="bg-dark text-white p-3 code-block"><code class="html">${escapedCode}</code></pre>`;
  });
};

export const displaySearchResults = (data) => {
  const resultsContainer = document.getElementById('results');
  let originalHtml = '';

  const generateCardHtml = (article, index) => {
    let { id, title, content } = article;
    let html = `<div class="card mt-5 bg-white border border-1 border-dark" data-aos="fade-up" data-aos-duration="1000" id="card-${index}">`;
    if (title) {
      const formattedTitle = title.replace(/_/g, ' ');
      html += `<div class="card-header bg-white border border-1 border-dark"><h2 class="fw-bolder">${formattedTitle}</h2></div>`;
    }
    if (content) {
      const introRegex = /## Introduction(.*?)(?=##)/gs;
      const introMatch = content.match(introRegex);
      if (introMatch && introMatch[0]) {
        const intro = introMatch[0].replace("## Introduction", "").trim();
        html += `<div class="card-body bg-white border border-1 border-dark"><p>${intro}</p></div>`;
      }
    }
    html += '</div>';
    return html;
  };

  const attachEventListeners = () => {
    data.forEach((article, index) => {
      const card = document.getElementById(`card-${index}`);
      card.addEventListener('click', () => {
        resultsContainer.innerHTML = '';
        const backButton = `<button id="back-button" class="btn btn-secondary">
                              <i class="bi bi-arrow-left"></i> Back
                            </button>`;
        resultsContainer.innerHTML = backButton;
        const htmlContent = markdownToHtml(article.content);
        resultsContainer.innerHTML += htmlContent;

        // Scroll to the top of the element with id="whatIsIt"
        const resultsElement = document.getElementById('results');
        if (resultsElement) {
          resultsElement.scrollIntoView({ behavior: 'smooth' });
        }


        document.getElementById('back-button').addEventListener('click', () => {
          resultsContainer.innerHTML = originalHtml;
          attachEventListeners();
        });
      });
    });
  };

  if (!Array.isArray(data) || data.length === 0) {
    resultsContainer.innerHTML = '<p class="mx-auto display-7 fw-bolder text-center text-secondary text-uppercase text-muted my-5">No results found.</p>';
  } else {
    originalHtml = data.map((article, index) => generateCardHtml(article, index)).join('');
    resultsContainer.innerHTML = originalHtml;
    attachEventListeners();
  }

  resultsContainer.scrollIntoView({ behavior: 'smooth' });
};
