const core = require('actions/core');
const github = require('actions/github');

function isMostlyEmojis(input) {
  const emojiRegex = /[\u{1F600}-\u{1F64F}\u{2700}-\u{27BF}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}\u{2600}-\u{26FF}]/gu;
  const emojiCount = (input.match(emojiRegex) || []).length;
  const charCount = [...input].filter(c => c.trim()).length;
  return charCount > 0 && emojiCount >= Math.floor(charCount * 0.6);
}

function isRepetitiveNoise(input) {
  const normalized = input.replace(/[\n\r\s]/g, '').toLowerCase();
  if (/^(.)\1{9,}$/.test(normalized)) return true;
  if ((/(..+)\1{4,}/).test(normalized)) return true;
  return false;
}

function checkSection(body, section, allowNA, minLength, msgArr) {
  const regex = new RegExp(`(?:\\*\\*)?${section}:(?:\\*\\*)?([\\s\\S]*?)(?=\\n\\s*\\*\\*|\\n[A-Z][a-z]+:|$)`, 'i');
  const match = body.match(regex);
  if (!match) {
    msgArr.push(`👀 ${section} section is missing.`);
    return;
  }
  let content = match[1] || "";
  let cleaned = content.replace(/<[^>]*>/g, '')
    .replace(/<!--.*-->/g, '')
    .replace(/\*\*/g, '')
    .replace(/[\n\r\s\\]/g, '')
    .replace(/[^\x20-\x7E]/g, '');
  const normalized = cleaned.toLowerCase();
  if (allowNA && (normalized === "na" || normalized === "n/a")) return;
  if (isRepetitiveNoise(cleaned)) {
    msgArr.push(`👀 ${section} section contains low-quality repetitive content.`);
    return;
  }
  if (isMostlyEmojis(cleaned)) {
    msgArr.push(`👀 ${section} section contains mostly emojis, which is not valid.`);
    return;
  }
  if (cleaned.length < minLength) {
    let msg = `👀 ${section} section is too short (minimum ${minLength} visible characters`;
    if (allowNA) msg += ", or use 'N/A'";
    msgArr.push(msg + ").");
  }
}

async function run() {
  try {
    const pr = github.context.payload.pull_request;
    if (!pr) {
      core.setFailed('No pull request found.');
      return;
    }
    const body = pr.body || "";
    const minLength = 30;
    let msgArr = [];
    checkSection(body, "Description", false, minLength, msgArr);
    checkSection(body, "Task", true, minLength, msgArr);
    checkSection(body, "Demo", true, minLength, msgArr);
    if (msgArr.length > 0) {
      let formatHint =
        `\n❌ ERROR: The PR description must contain valid 'Description:', 'Task:' and 'Demo:' sections.\n` +
        msgArr.join("\n") +
        `\n💡 Expected format:\nDescription: Short summary of the change...\nTask: https://gradiweb.monday.com/... or N/A\nDemo: Video link or N/A\n`;
      core.setFailed(formatHint);
    }
  } catch (error) {
    core.setFailed(error.message);
  }
}

run();
