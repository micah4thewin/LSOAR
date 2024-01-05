export const markdownToHtml = (jsonArticle) => {
    const article = jsonArticle.replace(/\r\n/g, '\n'); // Normalize line breaks
    const lines = article.split('\n');
    let html = '<div class="container mt-5 border border-1 border-secondary p-3 shadow-sm">';
    let inCodeBlock = false;
    let codeLanguage = "";

    const boldify = (text) => text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    const generateId = (text) => text.toLowerCase().replace(/[^\w]+/g, '-');

    // Function to escape HTML special characters
    const escapeHtml = (text) => text
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");

    for (let line of lines) {
        const trimmedLine = line.trim();

        if (trimmedLine === '' && !inCodeBlock) {
            html += '<br>';
            continue;
        }

        if (trimmedLine.startsWith('```')) {
            if (inCodeBlock) {
                html += `</code></pre>`;
                inCodeBlock = false;
                codeLanguage = "";
            } else {
                codeLanguage = trimmedLine.substring(3).trim();
                html += `<pre class="bg-dark text-white p-3 code-block"><code class="${codeLanguage}">`;
                inCodeBlock = true;
            }
            continue;
        }

        if (inCodeBlock) {
            // Directly add the line without escaping
            html += line + '\n';
            continue;
        }

        let displayText = trimmedLine.replace(/_/g, ' ');
        const headerMatch = displayText.match(/^(#{1,4}) /);

        if (headerMatch) {
            const headerLevel = headerMatch[1].length; // Corrected to access the matched group
            const headerText = displayText.substring(headerLevel + 1).trim();
            html += `<h${headerLevel} id="${generateId(headerText)}" class="header-level-${headerLevel}"><strong>${headerText}</strong></h${headerLevel}>`;
        } else if (displayText.startsWith('- ')) {
            const linkMatch = displayText.match(/- \[(.+)\]\(#(.+)\)/);
            if (linkMatch) {
                const [, text, link] = linkMatch;
                html += `<ul class="no-bullet"><li><a href="#${link}">${text}</a></li></ul>`;
            } else {
                html += `<ul class="no-bullet"><li>${boldify(displayText.substring(2).trim())}</li></ul>`;
            }
        } else {
            html += `<p class="text-justify">${boldify(displayText)}</p>`;
        }
    }

    if (inCodeBlock) {
        html += '</code></pre>';
    }

    html += '</div>';
    return html;
};
