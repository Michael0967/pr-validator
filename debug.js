const body = `**Description:** 
**Task:** https://gradiweb.monday.com/tasks/123
**Demo:** N/A`;

function extractSection(section) {
  const regex = new RegExp(`^\\s*(\\*\\*)?${section}:(\\*\\*)?\\s*([\\s\\S]*?)(?=\\n\\s*\\*\\*?\\w+:|$)`, 'im');
  const match = body.match(regex);
  console.log(`Section: ${section}`);
  console.log(`Regex: ${regex}`);
  console.log(`Match:`, match);
  if (!match) return '__MISSING__';
  const content = match[3]?.trim() || '';
  console.log(`Content: "${content}"`);
  console.log(`Content length: ${content.length}`);
  if (!content || content === '') return '__EMPTY__';
  return content;
}

console.log('Testing Description section extraction:');
const result = extractSection('Description');
console.log(`Result: ${result}`); 