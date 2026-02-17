import chalk from 'chalk';

/**
 * Word-wraps text to fit within a given width, preserving existing line breaks.
 */
function wordWrap(text, maxWidth) {
  const lines = [];
  for (const rawLine of text.split('\n')) {
    if (rawLine.length <= maxWidth) {
      lines.push(rawLine);
      continue;
    }
    const words = rawLine.split(' ');
    let current = '';
    for (const word of words) {
      if (current.length + word.length + 1 > maxWidth) {
        lines.push(current);
        current = word;
      } else {
        current = current ? `${current} ${word}` : word;
      }
    }
    if (current) lines.push(current);
  }
  return lines;
}

/**
 * Renders a boxed analysis result matching the demo style:
 *
 *   ┌─ Analysis Result ──────────────────────────────┐
 *   │                                                │
 *   │  File:    ./brokenFunction.ts                  │
 *   │  Status:  2 issues found                       │
 *   │                                                │
 *   │  [1] Line 14 — Uncaught promise rejection      │
 *   │      description text...                       │
 *   │                                                │
 *   │  Suggestion:                                   │
 *   │      ...                                       │
 *   │                                                │
 *   └────────────────────────────────────────────────┘
 */
export function renderAnalysisBox({ filePath, issues = [], suggestion = '' }) {
  const termWidth = Math.min(process.stdout.columns || 80, 80);
  const boxWidth = Math.max(termWidth - 4, 40); // leave margin
  const innerWidth = boxWidth - 4; // 2 for "│  " and 2 for "  │"
  const pad = 2; // left padding inside box

  const border = chalk.cyan;
  const padStr = ' '.repeat(pad);

  // Build content lines (plain strings, will be padded later)
  const contentLines = [];

  // Empty line
  contentLines.push('');

  // File + Status
  contentLines.push(`File:    ${filePath}`);
  const issueCount = issues.length;
  const statusText = issueCount === 0
    ? 'No issues found'
    : `${issueCount} issue${issueCount !== 1 ? 's' : ''} found`;
  contentLines.push(`Status:  ${statusText}`);

  // Empty line
  contentLines.push('');

  // Issues
  for (let i = 0; i < issues.length; i++) {
    const issue = issues[i];
    const lineRef = issue.line != null ? `Line ${issue.line}` : 'General';
    const header = `[${i + 1}] ${lineRef} — ${issue.title}`;

    for (const wl of wordWrap(header, innerWidth)) {
      contentLines.push(wl);
    }

    if (issue.detail) {
      const detailLines = wordWrap(issue.detail, innerWidth - 4);
      for (const dl of detailLines) {
        contentLines.push(`    ${dl}`);
      }
    }

    contentLines.push('');
  }

  // Suggestion
  if (suggestion) {
    contentLines.push(chalk.green('Suggestion:'));
    const suggestionLines = wordWrap(suggestion, innerWidth - 4);
    for (const sl of suggestionLines) {
      contentLines.push(`    ${sl}`);
    }
    contentLines.push('');
  }

  // Render box
  const titleText = ' Analysis Result ';
  const topBorderLen = boxWidth - 2 - titleText.length; // -2 for ┌ and ┐
  const topLeft = topBorderLen > 0 ? '─'.repeat(topBorderLen) : '';
  const top = border(`  ┌─${titleText}${'─'.repeat(Math.max(boxWidth - 4 - titleText.length, 0))}┐`);
  const bottom = border(`  └${'─'.repeat(boxWidth - 2)}┘`);

  const output = [top];

  for (const line of contentLines) {
    // Strip ANSI for length calculation
    const plainLine = line.replace(/\u001b\[[0-9;]*m/g, '');
    const rightPad = Math.max(innerWidth - plainLine.length, 0);
    output.push(`  ${border('│')}${padStr}${line}${' '.repeat(rightPad)}${padStr}${border('│')}`);
  }

  output.push(bottom);

  console.log(output.join('\n'));
}

/**
 * Parses a structured JSON analysis response from the AI.
 * Handles markdown code fences and falls back gracefully.
 */
export function parseAnalysisJSON(rawText) {
  // Strip markdown code fences if present
  let text = rawText.trim();
  const fenceMatch = text.match(/```(?:json)?\s*\n?([\s\S]*?)```/i);
  if (fenceMatch) {
    text = fenceMatch[1].trim();
  }

  try {
    const parsed = JSON.parse(text);
    if (parsed.issues && Array.isArray(parsed.issues)) {
      return {
        issues: parsed.issues.map(i => ({
          line: i.line ?? null,
          title: i.title || 'Issue',
          detail: i.detail || '',
        })),
        suggestion: parsed.suggestion || '',
      };
    }
  } catch {
    // Fall through to fallback
  }

  // Fallback: treat entire response as a single issue
  return {
    issues: [{ line: null, title: 'Analysis', detail: rawText.trim() }],
    suggestion: '',
  };
}
