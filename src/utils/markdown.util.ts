/**
 * 去除 Markdown 标记
 * @param content Markdown 内容
 * @returns 字数
 */
export function removeMarkdownTag(content: string): string {
  // 去除 Markdown 标记：标题、列表、代码块、链接、图片等
  let text = content
    // 去除代码块
    .replace(/```[\s\S]*?```/g, '')
    // 去除行内代码
    .replace(/`[^`]*`/g, '')
    // 去除标题标记
    .replace(/^#{1,6}\s+/gm, '')
    // 去除列表标记
    .replace(/^[\*\-\+]\s+/gm, '')
    .replace(/^\d+\.\s+/gm, '')
    // 去除链接和图片
    .replace(/!\[([^\]]*)\]\([^\)]+\)/g, '')
    .replace(/\[([^\]]+)\]\([^\)]+\)/g, '$1')
    // 去除粗体和斜体标记
    .replace(/\*\*([^\*]+)\*\*/g, '$1')
    .replace(/\*([^\*]+)\*/g, '$1')
    .replace(/__([^_]+)__/g, '$1')
    .replace(/_([^_]+)_/g, '$1')
    // 去除删除线
    .replace(/~~([^~]+)~~/g, '$1')
    // 去除引用标记
    .replace(/^>\s+/gm, '')
    // 去除水平线
    .replace(/^[-*]{3,}$/gm, '')
    // 去除多余空白
    .replace(/\s+/g, ' ')
    .trim();

  return text;
}
