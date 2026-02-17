# 🎯 Node.js Streams - Complete Hands-On Challenge

> **Master ALL Stream Concepts Through One Comprehensive Project**

---

## 🎓 Your Mission

Build a **Log File Processing System** that:
1. Reads a large log file (using our 1.6GB test file)
2. Filters ERROR logs
3. Transforms data format
4. Compresses output
5. Tracks progress
6. Handles backpressure properly

This single project will cover **ALL** stream topics!

---

## 📋 Challenge Requirements

### Part 1: Setup (Warm-up)

**Task:** Create a log file generator

```javascript
// File: generate-logs.js
// TODO: Create a Readable stream that generates fake log lines
// Each line format: [TIMESTAMP] [LEVEL] Message
// Levels: INFO, WARN, ERROR, DEBUG
// Generate 100,000 lines
```

**What you'll learn:**
- ✅ Creating custom Readable streams
- ✅ Using `_read()` method
- ✅ Pushing data with `this.push()`

---

### Part 2: Filter Stream (Core Concept)

**Task:** Create a Transform stream that filters only ERROR logs

```javascript
// File: error-filter.js
// TODO: Create ErrorFilter class extending Transform
// Keep only lines containing [ERROR]
// Pass through unchanged
```

**What you'll learn:**
- ✅ Creating Transform streams
- ✅ Using `_transform()` method
- ✅ Conditional data passing

---

### Part 3: Format Transformer (Data Manipulation)

**Task:** Transform log format from text to JSON

```javascript
// Input:  [2024-01-01 10:30:45] [ERROR] Database connection failed
// Output: {"timestamp":"2024-01-01 10:30:45","level":"ERROR","message":"Database connection failed"}

// TODO: Create JSONFormatter class extending Transform
// Parse each line and convert to JSON
// Enable objectMode
```

**What you'll learn:**
- ✅ Object mode streams
- ✅ Data transformation
- ✅ Working with different data types

---

### Part 4: Batch Processor (Advanced Pattern)

**Task:** Batch JSON objects into groups of 10

```javascript
// TODO: Create Batcher class extending Transform
// Collect 10 objects
// Push as array
// Don't forget remaining items in _flush()!
```

**What you'll learn:**
- ✅ Implementing `_flush()` method
- ✅ Buffering data
- ✅ Batch processing pattern

---

### Part 5: Progress Tracker (Monitoring)

**Task:** Show processing progress

```javascript
// TODO: Create ProgressTracker class extending Transform
// Count total lines processed
// Show percentage every 10%
// Display: "Progress: 25% (25000/100000 lines)"
```

**What you'll learn:**
- ✅ Pass-through transforms
- ✅ Monitoring streams
- ✅ Real-time feedback

---

### Part 6: Rate Limiter (Backpressure Control)

**Task:** Limit processing to 1000 lines per second

```javascript
// TODO: Create RateLimiter class extending Transform
// Process max 1000 items/second
// Use delays to control flow
// Handle backpressure properly
```

**What you'll learn:**
- ✅ Manual backpressure handling
- ✅ Flow control
- ✅ Async operations in streams

---

### Part 7: Pipeline Assembly (Putting It All Together)

**Task:** Connect all streams using pipeline()

```javascript
// TODO: Use pipeline() to connect:
// 1. Read large_file.txt
// 2. Filter errors
// 3. Transform to JSON
// 4. Batch into groups
// 5. Rate limit
// 6. Track progress
// 7. Compress with gzip
// 8. Write to output.json.gz

// Handle errors properly!
```

**What you'll learn:**
- ✅ Using pipeline() vs pipe()
- ✅ Error handling
- ✅ Stream composition
- ✅ Automatic backpressure

---

### Part 8: Memory Monitoring (Production Ready)

**Task:** Monitor memory usage during processing

```javascript
// TODO: Add memory monitoring
// Check memory every 1 second
// Log: "Memory: 45.23 MB, Processed: 50000 lines"
// Pause if memory > 100MB
// Resume when memory < 80MB
```

**What you'll learn:**
- ✅ Memory management
- ✅ pause() and resume()
- ✅ Production monitoring

---

### Part 9: Duplex Stream (Bonus Challenge)

**Task:** Create a TCP server that processes logs

```javascript
// TODO: Create TCP server using net.Socket (Duplex)
// Client sends log lines
// Server filters and returns only errors
// Real-time bidirectional communication
```

**What you'll learn:**
- ✅ Duplex streams
- ✅ Network programming
- ✅ Real-time processing

---

### Part 10: highWaterMark Experiment

**Task:** Test different buffer sizes

```javascript
// TODO: Run the same pipeline with different highWaterMark values:
// - 8KB
// - 64KB
// - 1MB
// Measure: time taken, memory used, CPU usage
// Document findings
```

**What you'll learn:**
- ✅ highWaterMark impact
- ✅ Performance tuning
- ✅ Trade-offs (memory vs speed)

---

## 🎯 Complete Solution Template

Create `solution.js`:

```javascript
const { pipeline } = require('stream');
const { promisify } = require('util');
const pipelineAsync = promisify(pipeline);
const fs = require('fs');
const zlib = require('zlib');
const { Transform, Readable } = require('stream');

// Part 1: Log Generator
class LogGenerator extends Readable {
  constructor(totalLines) {
    super();
    // TODO: Implement
  }

  _read() {
    // TODO: Generate log lines
  }
}

// Part 2: Error Filter
class ErrorFilter extends Transform {
  constructor() {
    super();
    // TODO: Implement
  }

  _transform(chunk, encoding, callback) {
    // TODO: Filter ERROR logs
  }
}

// Part 3: JSON Formatter
class JSONFormatter extends Transform {
  constructor() {
    super({ objectMode: true });
    // TODO: Implement
  }

  _transform(chunk, encoding, callback) {
    // TODO: Parse and convert to JSON
  }
}

// Part 4: Batcher
class Batcher extends Transform {
  constructor(batchSize) {
    super({ objectMode: true });
    // TODO: Implement
  }

  _transform(item, encoding, callback) {
    // TODO: Batch items
  }

  _flush(callback) {
    // TODO: Push remaining items
  }
}

// Part 5: Progress Tracker
class ProgressTracker extends Transform {
  constructor(total) {
    super();
    // TODO: Implement
  }

  _transform(chunk, encoding, callback) {
    // TODO: Track progress
  }
}

// Part 6: Rate Limiter
class RateLimiter extends Transform {
  constructor(itemsPerSecond) {
    super({ objectMode: true });
    // TODO: Implement
  }

  async _transform(item, encoding, callback) {
    // TODO: Rate limit
  }
}

// Part 7: Main Pipeline
async function processLogs() {
  try {
    await pipelineAsync(
      // TODO: Connect all streams
    );
    console.log('✅ Processing complete!');
  } catch (err) {
    console.error('❌ Error:', err);
  }
}

// Part 8: Memory Monitor
function startMemoryMonitor() {
  setInterval(() => {
    const usage = process.memoryUsage();
    const heapMB = (usage.heapUsed / 1024 / 1024).toFixed(2);
    console.log(`Memory: ${heapMB} MB`);
  }, 1000);
}

// Run
processLogs();
startMemoryMonitor();
```

---

## ✅ Success Criteria

Your solution should:

1. **Process the 1.6GB file** without crashing
2. **Use < 100MB memory** at any time
3. **Handle backpressure** properly
4. **Show progress** in real-time
5. **Handle errors** gracefully
6. **Complete in reasonable time** (< 5 minutes)
7. **Produce compressed output** file

---

## 🧪 Testing Your Solution

```bash
# Generate test logs
node generate-logs.js

# Run your solution
node solution.js

# Check output
gunzip -c output.json.gz | head -n 10

# Monitor memory
node --expose-gc solution.js
```

---

## 📊 Self-Assessment Checklist

After completing, you should be able to explain:

- [ ] What is a stream and why use it?
- [ ] Difference between 4 stream types
- [ ] How pipe() works internally
- [ ] Why pipeline() is better than pipe()
- [ ] What is backpressure and how to handle it
- [ ] What is highWaterMark and how to choose it
- [ ] When to use object mode
- [ ] What is _flush() and when to use it
- [ ] How to handle errors in streams
- [ ] How to monitor stream performance

---

## 🎓 Bonus Challenges

### Challenge A: Multi-File Processing
Process 10 log files simultaneously, merge results

### Challenge B: Real-Time Dashboard
Create a web dashboard showing live processing stats

### Challenge C: Stream Encryption
Add encryption/decryption to the pipeline

### Challenge D: Database Integration
Stream processed logs directly to MongoDB

---

## 💡 Hints

<details>
<summary>Hint 1: Backpressure in _transform()</summary>

```javascript
_transform(chunk, encoding, callback) {
  // Process chunk
  this.push(result);

  // ALWAYS call callback!
  callback();

  // If you don't call callback(), stream hangs forever!
}
```
</details>

<details>
<summary>Hint 2: Don't forget _flush()</summary>

```javascript
_flush(callback) {
  // Push any remaining buffered data
  if (this.buffer.length > 0) {
    this.push(this.buffer);
  }
  callback();
}
```
</details>

<details>
<summary>Hint 3: Object mode for JSON</summary>

```javascript
// When working with objects, enable objectMode
super({ objectMode: true });

// Now you can push objects directly
this.push({ id: 1, name: 'test' });
```
</details>

<details>
<summary>Hint 4: Handling backpressure manually</summary>

```javascript
if (!stream.write(data)) {
  // Buffer is full, wait for drain
  await new Promise(resolve => {
    stream.once('drain', resolve);
  });
}
```
</details>

---

## 🏆 Expected Learning Outcomes

After completing this challenge, you will:

1. **Understand** all stream concepts deeply
2. **Remember** how to implement each pattern
3. **Apply** streams to real-world problems
4. **Debug** stream issues confidently
5. **Optimize** stream performance
6. **Ace** any streams interview question!

---

## 📝 Solution Walkthrough

Once you complete the challenge, compare with the reference implementations in:
- `streams_1_fundamentals.js`
- `streams_2_pipes_pipelines.js`
- `streams_3_backpressure.js`
- `streams_4_implementations.js`

---

## 🎯 Start Here

1. Create `solution.js` with the template above
2. Implement each part step by step
3. Test after each part
4. Run the complete pipeline
5. Optimize and improve
6. Share your solution!

---

**Good Luck! You've got this! 🚀**

*Remember: The best way to learn is by doing. Don't just read - CODE!*
