function escapeHtml(input: string) {
  return input
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function inline(text: string) {
  return text
    .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
    .replace(/\*(.+?)\*/g, "<em>$1</em>")
    .replace(/`(.+?)`/g, "<code>$1</code>");
}

export function renderMarkdown(source: string) {
  const lines = escapeHtml(source).split("\n");
  const html: string[] = [];
  let inList = false;

  for (const rawLine of lines) {
    const line = rawLine.trimEnd();

    if (/^### /.test(line)) {
      closeList();
      html.push(`<h3>${inline(line.slice(4))}</h3>`);
    } else if (/^## /.test(line)) {
      closeList();
      html.push(`<h2>${inline(line.slice(3))}</h2>`);
    } else if (/^# /.test(line)) {
      closeList();
      html.push(`<h1>${inline(line.slice(2))}</h1>`);
    } else if (/^[-*] /.test(line)) {
      if (!inList) {
        html.push("<ul>");
        inList = true;
      }
      html.push(`<li>${inline(line.slice(2))}</li>`);
    } else if (line.trim() === "") {
      closeList();
    } else {
      closeList();
      html.push(`<p>${inline(line)}</p>`);
    }
  }
  closeList();

  function closeList() {
    if (inList) {
      html.push("</ul>");
      inList = false;
    }
  }

  return html.join("\n");
}
