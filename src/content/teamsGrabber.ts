import { ActionItem } from '../lib/types';

/**
 * Parses selected text or page content to extract corporate action items.
 */
export function extractActionItemsFromText(rawText: string): ActionItem[] {
  const sentences = rawText
    .split(/(?<=[.?!])\s+|\n+/)
    .map((s) => s.trim())
    .filter((s) => s.length > 10);

  const actionRegex = /\b(will|shall|action|deadline|by\s+[A-Za-z]+|assigned|due|finalize|submit|deliver|schedule|prepare|complete|follow\s+up)\b/i;
  const items: ActionItem[] = [];

  sentences.forEach((sent) => {
    if (actionRegex.test(sent) && items.length < 10) {
      // Try finding assignee (e.g. John will..., @Sarah to deliver...)
      let assignee: string | undefined = undefined;
      const mentionMatch = sent.match(/@([A-Za-z]+)/);
      if (mentionMatch) {
        assignee = mentionMatch[1];
      }

      // Try finding deadline (e.g. by Friday, by Nov 15)
      let dueDate: string | undefined = undefined;
      const dateMatch = sent.match(/\bby\s+([A-Za-z0-9\s,]+)(?=[.?!]|$)/i);
      if (dateMatch) {
        dueDate = dateMatch[1].trim();
      }

      items.push({
        id: 'act_' + Math.random().toString(36).substring(2, 9),
        text: sent,
        assignee,
        dueDate,
        completed: false
      });
    }
  });

  return items;
}
