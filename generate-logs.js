/**
 * 🎯 PART 1: Log Generator — Custom Readable Stream
 *
 * Concept:
 *   - Readable stream extend karo
 *   - _read() method override karo
 *   - this.push(data) se data dalo
 *   - this.push(null) se stream band karo
 */

const { Readable } = require('stream');
const fs = require('fs');
const path = require('path');

// ─────────────────────────────────────────────
// Step 1: Log levels aur random message helpers
// ─────────────────────────────────────────────

const LOG_LEVELS = ['INFO', 'WARN', 'ERROR', 'DEBUG'];

const MESSAGES = {
  INFO: ['Server started', 'User logged in', 'Request received', 'Cache hit', 'Connection established'],
  WARN: ['Slow response', 'High memory usage', 'Retry attempt', 'Rate limit near', 'Disk space low'],
  ERROR: ['Database connection failed', 'Timeout exceeded', 'File not found', 'Auth failed', 'Null pointer'],
  DEBUG: ['Processing request', 'Cache miss', 'Query executed', 'Session created', 'Event emitted'],
};

// Random item array se uthaao
function randomFrom(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

// Ek log line banao: [TIMESTAMP] [LEVEL] Message
function generateLogLine() {
  const now = new Date().toISOString().replace('T', ' ').slice(0, 19); // "2024-01-01 10:30:45"
  const level = randomFrom(LOG_LEVELS);
  const message = randomFrom(MESSAGES[level]);
  return `[${now}] [${level}] ${message}\n`;
}

// ─────────────────────────────────────────────
// Step 2: Custom Readable Stream — LogGenerator
// ─────────────────────────────────────────────

class LogGenerator extends Readable {
  /**
   * @param {number} totalLines - Kitni lines generate karni hain
   */
  constructor(totalLines = 100_000) {
    super(); // Readable ko initialize karo

    this.totalLines = totalLines; // Total lines ka target
    this.currentLine = 0;        // Abhi tak kitni lines push ki
  }

  /**
   * _read() — Node.js khud call karta hai jab use data chahiye hota hai
   *
   * Rules:
   * 1. Yahan data push karo with: this.push(data)
   * 2. Jab sab data de do toh: this.push(null)  ← stream khatam hoti hai
   * 3. Kabhi bhi _read() ko khud mat bulao — Node.js handle karta hai
   */
  _read() {
    // Kya sari lines generate ho gayi?
    if (this.currentLine >= this.totalLines) {
      this.push(null); // ← EOF signal — stream khatam
      return;
    }

    // Ek log line banao aur stream mein daalo
    const line = generateLogLine();
    this.push(line); // ← yeh data consumer ko milega

    this.currentLine++;

    // Progress log karo har 10,000 lines par
    if (this.currentLine % 10_000 === 0) {
      console.log(`📝 Generated: ${this.currentLine.toLocaleString()} / ${this.totalLines.toLocaleString()} lines`);
    }
  }
}

// ─────────────────────────────────────────────
// Step 3: Stream use karo — File mein likho
// ─────────────────────────────────────────────

function generateLogFile(outputPath = 'logs.txt', totalLines = 100_000) {
  console.log(`\n🚀 Log file generate ho rahi hai...`);
  console.log(`   📄 Output: ${outputPath}`);
  console.log(`   📊 Total lines: ${totalLines.toLocaleString()}\n`);

  const startTime = Date.now();

  // Readable stream banao
  const logGenerator = new LogGenerator(totalLines);

  // Writable stream — file mein likhne ke liye
  const fileWriter = fs.createWriteStream(outputPath);

  // pipe() — Readable ko Writable se connect karo
  // Backpressure automatically handle hota hai!
  logGenerator.pipe(fileWriter);

  // Jab sab complete ho
  fileWriter.on('finish', () => {
    const elapsed = ((Date.now() - startTime) / 1000).toFixed(2);
    const stats = fs.statSync(outputPath);
    const sizeMB = (stats.size / 1024 / 1024).toFixed(2);

    console.log(`\n✅ Done!`);
    console.log(`   ⏱️  Time: ${elapsed}s`);
    console.log(`   📦 File size: ${sizeMB} MB`);
    console.log(`   📍 Location: ${path.resolve(outputPath)}`);
  });

  // Error handle karo
  logGenerator.on('error', (err) => console.error('❌ Generator error:', err));
  fileWriter.on('error', (err) => console.error('❌ Writer error:', err));
}


generateLogFile('logs.txt', 100_000);
