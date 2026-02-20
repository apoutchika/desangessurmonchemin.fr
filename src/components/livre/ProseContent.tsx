// Rendu du contenu texte.
// Supporte un markdown minimal sans dépendance externe.
// Remplacer par `next-mdx-remote` ou `react-markdown` pour plus de richesse.

interface Props {
  content: string;
}

function simpleMarkdown(text: string): string {
  return (
    text
      .trim()
      // Gras
      .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
      // Italique
      .replace(/\*(.+?)\*/g, "<em>$1</em>")
      // Titres ##
      .replace(/^## (.+)$/gm, "<h2>$1</h2>")
      // Séparateur
      .replace(
        /^---$/gm,
        '<hr style="border:none;border-top:1px solid var(--line);margin:2em 0">',
      )
      // Paragraphes : séparer par double saut de ligne
      .split(/\n\n+/)
      .map((block) => {
        block = block.trim();
        if (!block) return "";
        if (block.startsWith("<h") || block.startsWith("<hr")) return block;
        return `<p>${block.replace(/\n/g, "<br>")}</p>`;
      })
      .join("\n")
  );
}

export function ProseContent({ content }: Props) {
  const html = simpleMarkdown(content);

  return <div className="prose" dangerouslySetInnerHTML={{ __html: html }} />;
}
