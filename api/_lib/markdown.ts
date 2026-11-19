type NotionBlock = {
  object?: string;
  id?: string;
  type: string;
  [key: string]: unknown;
};

type RichText = {
  plain_text?: string;
  href?: string | null;
  annotations?: {
    bold?: boolean;
    italic?: boolean;
    strikethrough?: boolean;
    code?: boolean;
  };
};

export function convertNotionBlocksToMarkdown(blocks: NotionBlock[]): string {
  return blocks.map((block) => convertBlockToMarkdown(block)).join('\n\n');
}

function convertBlockToMarkdown(block: NotionBlock): string {
  const type = block.type;
  const payload = block[type] as Record<string, unknown> | undefined;

  switch (type) {
    case 'paragraph':
      return convertRichText((payload?.rich_text as RichText[]) || []);
    case 'heading_1':
      return `# ${convertRichText((payload?.rich_text as RichText[]) || [])}`;
    case 'heading_2':
      return `## ${convertRichText((payload?.rich_text as RichText[]) || [])}`;
    case 'heading_3':
      return `### ${convertRichText((payload?.rich_text as RichText[]) || [])}`;
    case 'bulleted_list_item':
      return `- ${convertRichText((payload?.rich_text as RichText[]) || [])}`;
    case 'numbered_list_item':
      return `1. ${convertRichText((payload?.rich_text as RichText[]) || [])}`;
    case 'quote':
      return `> ${convertRichText((payload?.rich_text as RichText[]) || [])}`;
    case 'code': {
      const language = (payload?.language as string) || '';
      const code = convertRichText((payload?.rich_text as RichText[]) || []);
      return `\`\`\`${language}\n${code}\n\`\`\``;
    }
    case 'image': {
      const file = payload?.file as { url?: string } | undefined;
      const external = payload?.external as { url?: string } | undefined;
      const imageUrl = file?.url || external?.url || '';
      const caption = convertRichText((payload?.caption as RichText[]) || []);
      return `![${caption}](${imageUrl})`;
    }
    case 'divider':
      return '---';
    case 'callout':
      return `> ${convertRichText((payload?.rich_text as RichText[]) || [])}`;
    case 'toggle':
      return `<details>\n<summary>${convertRichText((payload?.rich_text as RichText[]) || [])}</summary>\n\n</details>`;
    default:
      return '';
  }
}

function convertRichText(richText: RichText[]): string {
  if (!Array.isArray(richText)) return '';

  return richText
    .map((text) => {
      let content = text.plain_text || '';
      if (text.annotations?.bold) content = `**${content}**`;
      if (text.annotations?.italic) content = `*${content}*`;
      if (text.annotations?.strikethrough) content = `~~${content}~~`;
      if (text.annotations?.code) content = `\`${content}\``;
      if (text.href) content = `[${content}](${text.href})`;
      return content;
    })
    .join('');
}

export function generateExcerpt(blocks: NotionBlock[]): string {
  for (const block of blocks) {
    if (block.type === 'paragraph') {
      const payload = block.paragraph as { rich_text?: RichText[] } | undefined;
      const text = convertRichText(payload?.rich_text || []);
      if (text.length > 0) {
        return text.length > 150 ? `${text.substring(0, 150)}...` : text;
      }
    }
  }
  return '';
}
