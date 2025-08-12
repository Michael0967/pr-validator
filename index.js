// pr-validation.js
const core = require('@actions/core');
const github = require('@actions/github');

try {
  const MIN_LENGTH = 30;
  
  // Get PR body from input or fallback to context
  const prBodyInput = core.getInput('pr-body');
  const body = prBodyInput || github.context.payload.pull_request?.body || '';
  
  let msg = '';

  // Helpers
  function isMostlyEmojis(input) {
    const emojiRegex = /[\u{1F600}-\u{1F64F}\u{2700}-\u{27BF}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}\u{2600}-\u{26FF}]/gu;
    const emojiCount = (input.match(emojiRegex) || []).length;
    const charCount = input.replace(/[^\x20-\x7E]/g, '').length;
    if (charCount === 0) return false;
    return emojiCount > 0 && emojiCount >= (charCount * 0.6);
  }

  function isRepetitiveNoise(input) {
    const normalized = input.replace(/\s+/g, '').toLowerCase();
    if (/^(.)\1{9,}$/.test(normalized)) return true; // same char repeated
    const repeatPattern = /(.+)\1{4,}/;
    return repeatPattern.test(normalized);
  }

  function extractSection(section) {
    // Look for the section with proper boundaries
    const sectionRegex = new RegExp(`^\\s*(\\*\\*)?${section}:(\\*\\*)?\\s*([\\s\\S]*?)(?=\\n\\s*(\\*\\*)?\\w+:|$)`, 'im');
    const match = body.match(sectionRegex);
    
    if (!match) return '__MISSING__';
    
    // Get the content and clean it
    const content = match[3]?.trim() || '';
    
    // Check if content is empty
    if (!content || content === '') return '__EMPTY__';
    
    return content;
  }

  function checkSection(section, allowNA) {
    const raw = extractSection(section);
    if (raw === '__MISSING__') {
      msg += `👀 ${section} section is missing.\n`;
      return;
    }
    if (raw === '__EMPTY__') {
      msg += `👀 ${section} section is empty.\n`;
      return;
    }

    // Clean content
    const cleaned = raw
      .replace(/<[^>]*>/g, '')    // remove HTML
      .replace(/<!--.*-->/g, '')  // remove comments
      .replace(/\*\*/g, '')       // remove markdown bold
      .replace(/[\n\r\\]/g, '')   // remove line breaks and slashes
      .trim();

    const normalized = cleaned.toLowerCase();

    if (allowNA && (normalized === 'na' || normalized === 'n/a')) return;

    if (isRepetitiveNoise(cleaned)) {
      msg += `👀 ${section} section contains low-quality repetitive content.\n`;
      return;
    }

    if (isMostlyEmojis(cleaned)) {
      msg += `👀 ${section} section contains mostly emojis, which is not valid.\n`;
      return;
    }

    if (cleaned.length < MIN_LENGTH) {
      msg += `👀 ${section} section is too short (minimum ${MIN_LENGTH} visible characters`;
      if (allowNA) msg += `, or use 'N/A'`;
      msg += `).\n`;
    }
  }

  // Validate
  checkSection('Description', false);
  checkSection('Task', true);
  checkSection('Demo', true);

  if (msg) {
    core.setFailed(
      `❌ ERROR: The PR description must contain valid 'Description:', 'Task:' and 'Demo:' sections.\n${msg}\n` +
      `💡 Expected format:\nDescription: Short summary of the change...\nTask: https://gradiweb.monday.com/... or N/A\nDemo: Video link or N/A`
    );
  } else {
    core.info('✅ PR description is valid.');
  }

} catch (error) {
  core.setFailed(error.message);
}
