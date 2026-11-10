export interface NotionBlock {
  object: string;
  id: string;
  type: string;
  [key: string]: any;
}

export function convertNotionBlocksToMarkdown(blocks: NotionBlock[]): string {
  return blocks.map(block => convertBlockToMarkdown(block)).join('\n\n');
}

function convertBlockToMarkdown(block: NotionBlock): string {
  const type = block.type;

  switch (type) {
    case 'paragraph':
      return convertRichText(block.paragraph?.rich_text || []);

    case 'heading_1':
      return `# ${convertRichText(block.heading_1?.rich_text || [])}`;

    case 'heading_2':
      return `## ${convertRichText(block.heading_2?.rich_text || [])}`;

    case 'heading_3':
      return `### ${convertRichText(block.heading_3?.rich_text || [])}`;

    case 'bulleted_list_item':
      return `- ${convertRichText(block.bulleted_list_item?.rich_text || [])}`;

    case 'numbered_list_item':
      return `1. ${convertRichText(block.numbered_list_item?.rich_text || [])}`;

    case 'quote':
      return `> ${convertRichText(block.quote?.rich_text || [])}`;

    case 'code':
      const language = block.code?.language || '';
      const code = convertRichText(block.code?.rich_text || []);
      return `\`\`\`${language}\n${code}\n\`\`\``;

    case 'image':
      const imageUrl = block.image?.file?.url || block.image?.external?.url || '';
      const caption = convertRichText(block.image?.caption || []);
      return `![${caption}](${imageUrl})`;

    case 'divider':
      return '---';

    case 'callout':
      return `> 💡 ${convertRichText(block.callout?.rich_text || [])}`;

    case 'toggle':
      return `<details>\n<summary>${convertRichText(block.toggle?.rich_text || [])}</summary>\n\n</details>`;

    default:
      return '';
  }
}

function convertRichText(richText: any[]): string {
  if (!Array.isArray(richText)) return '';

  return richText.map(text => {
    let content = text.plain_text || '';

    if (text.annotations?.bold) {
      content = `**${content}**`;
    }
    if (text.annotations?.italic) {
      content = `*${content}*`;
    }
    if (text.annotations?.strikethrough) {
      content = `~~${content}~~`;
    }
    if (text.annotations?.code) {
      content = `\`${content}\``;
    }
    if (text.href) {
      content = `[${content}](${text.href})`;
    }

    return content;
  }).join('');
}

export function generateExcerpt(blocks: NotionBlock[]): string {
  for (const block of blocks) {
    if (block.type === 'paragraph') {
      const text = convertRichText(block.paragraph?.rich_text || []);
      if (text.length > 0) {
        return text.length > 150 ? text.substring(0, 150) + '...' : text;
      }
    }
  }
  return '';
}
