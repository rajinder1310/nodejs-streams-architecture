# 🌊 Node.js Streams - Complete Technical Guide

> **Master Node.js Streams from Beginner to Advanced with Clear Concepts & Real Examples**


## 🌊 What Are Streams?

### Simple Definition
**Streams** are a way to handle data **piece by piece** instead of loading everything into memory at once.

### Real-Life Analogy 🚿

Imagine you want to transfer water from one tank to another:

**Without Streams (Bad Way):**
```
Tank A → Fill a HUGE bucket → Carry bucket → Pour into Tank B
Problem: Need a massive bucket, heavy to carry, slow
```

**With Streams (Good Way):**
```
Tank A → Pipe → Tank B
Water flows continuously, small amounts at a time
```

### Technical Example

**❌ Without Streams:**
```javascript
// Reading a 1GB file
const fs = require('fs');
const data = fs.readFileSync('1GB-movie.mp4');
// Problem: Uses 1GB of RAM!
// If file is 10GB, your app crashes!
```

**✅ With Streams:**
```javascript
// Reading the same 1GB file
const stream = fs.createReadStream('1GB-movie.mp4');
// Uses only ~64KB of RAM at any time!
// Can handle files of ANY size!
```

---

## 🎯 Core Concepts

### 1. **Chunks (टुकड़े)**

Data is broken into small pieces called **chunks**.

```
File: "Hello World"
↓
Chunks: ["Hello", " ", "World"]
```

**Why chunks?**
- Process data while it's still downloading
- Use less memory
- Start showing results faster

### 2. **Buffer (अस्थायी भंडारण)**

A temporary storage area where chunks wait before processing.

```
Producer → [Buffer: 16KB] → Consumer
           ↑ Temporary storage
```

**Think of it like:**
- A waiting room at a doctor's office
- People (data) wait here before being called (processed)

### 3. **Flow Control (प्रवाह नियंत्रण)**

Managing the speed of data flow so nothing gets overwhelmed.

```
Fast Producer → Slow Consumer
              ↓
         Need control!
```

---

## 📖 Stream Types Explained

Node.js has **4 types** of streams. Let's understand each with real examples.

### 1. Readable Stream (पढ़ने योग्य)

**What it does:** Provides data that you can read

**Real-life example:** A water tap 🚰
- You can take water from it
- Water flows out
- You control when to start/stop

**Code example:**
```javascript
const fs = require('fs');

// Reading a file
const readStream = fs.createReadStream('movie.mp4');

readStream.on('data', (chunk) => {
  console.log(`Received ${chunk.length} bytes`);
  // Process this chunk
});
```

**Real uses:**
- Reading files: `fs.createReadStream()`
- HTTP requests: `req` in Express
- Reading from database
- Reading user input: `process.stdin`

---

### 2. Writable Stream (लिखने योग्य)

**What it does:** Accepts data that you can write to

**Real-life example:** A bucket 🪣
- You can pour water into it
- It stores what you give
- You control when to pour

**Code example:**
```javascript
const fs = require('fs');

// Writing to a file
const writeStream = fs.createWriteStream('output.txt');

writeStream.write('Hello ');
writeStream.write('World');
writeStream.end(); // Done writing
```

**Real uses:**
- Writing files: `fs.createWriteStream()`
- HTTP responses: `res` in Express
- Writing to database
- Console output: `process.stdout`

---

### 3. Duplex Stream (दोनों तरफ़ा)

**What it does:** Both readable AND writable (independent)

**Real-life example:** A telephone ☎️
- You can speak (write)
- You can listen (read)
- Both happen independently

**Code example:**
```javascript
const net = require('net');

// TCP socket is duplex
const socket = net.connect(8080);

// Can write
socket.write('Hello Server');

// Can read
socket.on('data', (data) => {
  console.log('Received:', data);
});
```

**Real uses:**
- TCP sockets: `net.Socket`
- WebSockets
- Secure connections: `tls.TLSSocket`

---

### 4. Transform Stream (रूपांतरण)

**What it does:** Reads data, modifies it, then writes it

**Real-life example:** A water filter 🚰→🔧→💧
- Takes dirty water (input)
- Filters it (transform)
- Gives clean water (output)

**Code example:**
```javascript
const { Transform } = require('stream');

// Convert text to uppercase
const upperCaseTransform = new Transform({
  transform(chunk, encoding, callback) {
    // Modify the data
    const upperChunk = chunk.toString().toUpperCase();
    this.push(upperChunk);
    callback();
  }
});

// Usage
process.stdin
  .pipe(upperCaseTransform)
  .pipe(process.stdout);
// Type "hello" → outputs "HELLO"
```

**Real uses:**
- Compression: `zlib.createGzip()`
- Encryption: `crypto.createCipher()`
- Data transformation
- Format conversion

---

## 🔗 Understanding Pipes

### What is a Pipe?

**Pipe** connects one stream's output to another stream's input.

**Real-life analogy:** Water pipes 🚰→|→🪣
```
Source (Tap) → Pipe → Destination (Bucket)
```

### How Pipe Works

```javascript
source.pipe(destination);
```

**What happens internally:**
1. Source produces data
2. Pipe automatically takes that data
3. Pipe writes it to destination
4. Handles speed differences automatically

### Simple Example

```javascript
const fs = require('fs');

// Copy a file
fs.createReadStream('input.txt')
  .pipe(fs.createWriteStream('output.txt'));

// That's it! File copied with minimal memory
```

### Chaining Pipes

You can connect multiple streams:

```javascript
source
  .pipe(transform1)  // First transformation
  .pipe(transform2)  // Second transformation
  .pipe(destination); // Final destination
```

**Real example:**
```javascript
const fs = require('fs');
const zlib = require('zlib');

// Read file → Compress → Save
fs.createReadStream('file.txt')
  .pipe(zlib.createGzip())           // Compress
  .pipe(fs.createWriteStream('file.txt.gz')); // Save
```

### Problem with .pipe()

**Error handling is manual!**

```javascript
// ❌ If any stream errors, others keep running
source
  .pipe(transform)
  .pipe(destination);

// ✅ Must handle errors on each stream
source.on('error', handleError)
  .pipe(transform).on('error', handleError)
  .pipe(destination).on('error', handleError);
```

This is tedious! That's why we have **pipeline()**.

---

## ⚙️ Understanding Pipelines

### What is pipeline()?

**pipeline()** is like `.pipe()` but **better** - it handles errors automatically.

### Comparison

```javascript
// Old way (.pipe)
source.pipe(transform).pipe(dest);
// Problem: No error handling, no cleanup

// New way (pipeline)
const { pipeline } = require('stream');

pipeline(
  source,
  transform,
  dest,
  (err) => {
    if (err) console.error('Error:', err);
    else console.log('Success!');
  }
);
// Automatic error handling + cleanup!
```

### Why pipeline() is Better

| Feature | .pipe() | pipeline() |
|---------|---------|------------|
| Error handling | Manual (each stream) | Automatic (one callback) |
| Cleanup on error | Manual | Automatic |
| Async/await support | ❌ No | ✅ Yes |
| Stream destruction | Manual | Automatic |
| Production ready | ⚠️ Risky | ✅ Safe |

### Using with Async/Await

```javascript
const { pipeline } = require('stream');
const { promisify } = require('util');
const pipelineAsync = promisify(pipeline);

async function processFile() {
  try {
    await pipelineAsync(
      fs.createReadStream('input.txt'),
      transform,
      fs.createWriteStream('output.txt')
    );
    console.log('✅ Success!');
  } catch (err) {
    console.error('❌ Error:', err);
  }
}
```

### Real Example: Compress Multiple Files

```javascript
const files = ['file1.txt', 'file2.txt', 'file3.txt'];

for (const file of files) {
  await pipelineAsync(
    fs.createReadStream(file),
    zlib.createGzip(),
    fs.createWriteStream(`${file}.gz`)
  );
  console.log(`✅ Compressed: ${file}`);
}
```

---

## ⚡ Understanding Backpressure

### What is Backpressure?

**Backpressure** is a signal that says: *"Slow down! I can't keep up!"*

### Real-Life Analogy 🏭

Imagine a factory:
```
Fast Machine A → Slow Machine B
(Makes 100/min)   (Processes 10/min)

Problem: Machine B gets overwhelmed!
Solution: Machine A must slow down (backpressure)
```

### Technical Explanation

```
Producer (Fast)  →  [Buffer: 16KB]  →  Consumer (Slow)
Produces 1MB/s       ↑ Gets full!      Processes 100KB/s

When buffer is full:
1. Producer gets signal: "STOP!"
2. Producer pauses
3. Consumer catches up
4. Buffer empties
5. Producer gets signal: "GO!"
6. Producer resumes
```

### Why Backpressure Matters

**Without backpressure:**
```javascript
// Reading fast, writing slow
for (let i = 0; i < 1000000; i++) {
  writeStream.write(data); // Ignoring if it's full!
}
// Result: Memory keeps growing → Crash! 💥
```

**With backpressure:**
```javascript
async function writeWithBackpressure(stream, data) {
  if (!stream.write(data)) {
    // Buffer is full! Wait for it to drain
    await new Promise(resolve => {
      stream.once('drain', resolve);
    });
  }
}

for (let i = 0; i < 1000000; i++) {
  await writeWithBackpressure(writeStream, data);
}
// Result: Controlled memory usage ✅
```

### How .write() Works

```javascript
const canContinue = stream.write(data);

if (canContinue === true) {
  // Buffer has space, keep writing
} else {
  // Buffer is full, wait for 'drain' event
  stream.once('drain', () => {
    // Now you can write again
  });
}
```

### Automatic Backpressure with pipeline()

```javascript
// pipeline() handles backpressure automatically!
pipeline(
  fastReadStream,    // Reads at 10MB/s
  slowWriteStream,   // Writes at 1MB/s
  (err) => {
    // pipeline() automatically slows down reading
    // to match writing speed
  }
);
```

### Visual Example

```
Time: 0s
Producer: [####] producing
Buffer:   [    ] empty
Consumer: [    ] waiting

Time: 1s
Producer: [####] producing
Buffer:   [####] FULL! ⚠️
Consumer: [#   ] processing

Time: 2s
Producer: [    ] PAUSED (backpressure)
Buffer:   [##  ] draining
Consumer: [##  ] processing

Time: 3s
Producer: [####] RESUMED
Buffer:   [#   ] space available
Consumer: [### ] processing
```

---

## 📊 Understanding highWaterMark

### What is highWaterMark?

**highWaterMark** is the **size of the internal buffer** before backpressure triggers.

### Simple Explanation

Think of it as a bucket size:
```
Small bucket (8KB):  Fills quickly, frequent pauses
Medium bucket (16KB): Balanced (default)
Large bucket (64KB):  Fills slowly, fewer pauses
```

### How It Works

```javascript
const stream = fs.createReadStream('file.txt', {
  highWaterMark: 64 * 1024 // 64KB buffer
});

// What happens:
// 1. Stream reads 64KB from file
// 2. Stores in buffer
// 3. When buffer is full (64KB), stops reading
// 4. When buffer empties, reads next 64KB
```

### Choosing the Right Size

| Use Case | highWaterMark | Why? |
|----------|---------------|------|
| Small files | 8-16KB | Less memory, fine for small data |
| Normal files | 64KB | Balanced performance |
| Large files | 256KB-1MB | Fewer disk reads, faster |
| Network | 16KB | Standard TCP buffer size |
| Memory-limited | 8KB | Minimize memory usage |
| High-performance | 1MB+ | Maximum throughput |

### Example: Different Sizes

```javascript
// Small buffer (more frequent reads)
const smallStream = fs.createReadStream('file.txt', {
  highWaterMark: 8 * 1024 // 8KB
});
// Reads: 8KB → process → 8KB → process → ...
// More syscalls, less memory

// Large buffer (fewer reads)
const largeStream = fs.createReadStream('file.txt', {
  highWaterMark: 1024 * 1024 // 1MB
});
// Reads: 1MB → process → 1MB → process → ...
// Fewer syscalls, more memory
```

### Real Impact

```javascript
// Processing a 100MB file

// With 16KB buffer:
// - 6,250 read operations
// - ~16KB memory used
// - Time: ~5 seconds

// With 1MB buffer:
// - 100 read operations
// - ~1MB memory used
// - Time: ~2 seconds

// Trade-off: Memory vs Speed
```

---

## 🎭 Understanding Object Mode

### What is Object Mode?

Normally, streams work with **Buffers** (binary data). **Object Mode** lets streams work with **JavaScript objects**.

### Buffer Mode (Default)

```javascript
const stream = new Transform({
  transform(chunk, encoding, callback) {
    // chunk is a Buffer
    console.log(chunk); // <Buffer 48 65 6c 6c 6f>
    callback();
  }
});

stream.write('Hello'); // Converted to Buffer
```

### Object Mode

```javascript
const stream = new Transform({
  objectMode: true, // ← Enable object mode
  transform(obj, encoding, callback) {
    // obj is a JavaScript object!
    console.log(obj); // { name: 'John', age: 30 }
    callback();
  }
});

stream.write({ name: 'John', age: 30 }); // Works!
```

### When to Use Object Mode?

**Use Buffer Mode when:**
- Reading/writing files
- Network communication
- Binary data (images, videos)

**Use Object Mode when:**
- Processing JSON data
- Database records
- API responses
- Data transformations

### Real Example: CSV to JSON

```javascript
class CSVToJSON extends Transform {
  constructor() {
    super({ objectMode: true }); // Objects in, objects out
    this.headers = null;
  }

  _transform(line, encoding, callback) {
    if (!this.headers) {
      this.headers = line.split(',');
    } else {
      const values = line.split(',');
      const obj = {};
      this.headers.forEach((h, i) => {
        obj[h] = values[i];
      });
      this.push(obj); // Push JavaScript object
    }
    callback();
  }
}

// Usage
pipeline(
  fs.createReadStream('data.csv'),
  split(), // Split by lines
  new CSVToJSON(), // Convert to objects
  new Transform({
    objectMode: true,
    transform(obj, enc, cb) {
      console.log(obj); // { name: 'John', age: '30' }
      cb();
    }
  })
);
```

### highWaterMark in Object Mode

```javascript
// Buffer mode
const bufferStream = new Transform({
  highWaterMark: 16384 // 16KB of bytes
});

// Object mode
const objectStream = new Transform({
  objectMode: true,
  highWaterMark: 16 // 16 objects (not bytes!)
});
```

---

## 📡 Understanding Stream Events

### Readable Stream Events

#### 1. `'data'` Event (Flowing Mode)

**When:** A chunk of data is available

```javascript
const stream = fs.createReadStream('file.txt');

stream.on('data', (chunk) => {
  console.log(`Got ${chunk.length} bytes`);
  // Automatically flows, you just receive chunks
});
```

#### 2. `'end'` Event

**When:** No more data to read

```javascript
stream.on('end', () => {
  console.log('Finished reading file');
});
```

#### 3. `'error'` Event

**When:** Something went wrong

```javascript
stream.on('error', (err) => {
  console.error('Error reading file:', err);
});
```

#### 4. `'readable'` Event (Paused Mode)

**When:** Data is available to read manually

```javascript
stream.on('readable', () => {
  let chunk;
  while ((chunk = stream.read()) !== null) {
    console.log(`Read ${chunk.length} bytes`);
  }
});
```

### Writable Stream Events

#### 1. `'drain'` Event

**When:** Buffer has space again after being full

```javascript
if (!stream.write(data)) {
  // Buffer is full
  stream.once('drain', () => {
    console.log('Can write again!');
  });
}
```

#### 2. `'finish'` Event

**When:** All data has been written

```javascript
stream.end('Last data');

stream.on('finish', () => {
  console.log('All data written');
});
```

#### 3. `'pipe'` Event

**When:** A readable stream is piped to this writable

```javascript
writeStream.on('pipe', (src) => {
  console.log('Something is piping to me');
});

readStream.pipe(writeStream);
```

### Event Flow Example

```javascript
const readStream = fs.createReadStream('input.txt');
const writeStream = fs.createWriteStream('output.txt');

// Track the complete flow
readStream.on('data', (chunk) => {
  console.log('1. Read chunk:', chunk.length);

  const canWrite = writeStream.write(chunk);

  if (!canWrite) {
    console.log('2. Buffer full! Pausing read...');
    readStream.pause();

    writeStream.once('drain', () => {
      console.log('3. Buffer drained! Resuming read...');
      readStream.resume();
    });
  }
});

readStream.on('end', () => {
  console.log('4. Reading complete');
  writeStream.end();
});

writeStream.on('finish', () => {
  console.log('5. Writing complete');
});
```

---

## 🌍 Real-World Scenarios

### Scenario 1: Video Streaming (Netflix-style)

**Problem:** User wants to watch a 2GB movie

**Without Streams:**
```
1. Download entire 2GB file
2. Wait 10 minutes
3. Then start playing
❌ Bad user experience!
```

**With Streams:**
```
1. Download first 1MB
2. Start playing immediately
3. Keep downloading in background
✅ User happy!
```

**Code:**
```javascript
const http = require('http');
const fs = require('fs');

http.createServer((req, res) => {
  // Stream video to user
  const videoStream = fs.createReadStream('movie.mp4');

  videoStream.pipe(res);
  // User starts watching while file is streaming!
}).listen(3000);
```

### Scenario 2: Large File Upload

**Problem:** User uploads 5GB file

**Without Streams:**
```
1. Load entire 5GB in server memory
2. Server crashes (out of memory)
❌ Server down!
```

**With Streams:**
```
1. Receive data in chunks
2. Save each chunk immediately
3. Memory usage: only ~64KB
✅ Server stable!
```

**Code:**
```javascript
app.post('/upload', (req, res) => {
  const writeStream = fs.createWriteStream('uploaded-file.zip');

  req.pipe(writeStream);

  writeStream.on('finish', () => {
    res.send('Upload complete!');
  });
});
```

### Scenario 3: Log File Processing

**Problem:** Analyze 10GB log file

**Without Streams:**
```
const logs = fs.readFileSync('10GB-logs.txt');
// Crash! Not enough RAM
```

**With Streams:**
```javascript
const readline = require('readline');
const fs = require('fs');

const rl = readline.createInterface({
  input: fs.createReadStream('10GB-logs.txt')
});

let errorCount = 0;

rl.on('line', (line) => {
  if (line.includes('ERROR')) {
    errorCount++;
  }
});

rl.on('close', () => {
  console.log(`Found ${errorCount} errors`);
});
// Works perfectly with minimal memory!
```

### Scenario 4: Database Export

**Problem:** Export 1 million database records to CSV

**Code:**
```javascript
const { pipeline } = require('stream');
const { Readable, Transform } = require('stream');

// Create readable stream from database
const dbStream = Readable.from(async function* () {
  let offset = 0;
  while (true) {
    const records = await db.query('SELECT * FROM users LIMIT 1000 OFFSET ?', [offset]);
    if (records.length === 0) break;

    for (const record of records) {
      yield record;
    }
    offset += 1000;
  }
}());

// Transform to CSV
const toCSV = new Transform({
  objectMode: true,
  transform(record, enc, cb) {
    const csv = `${record.id},${record.name},${record.email}\n`;
    cb(null, csv);
  }
});

// Save to file
pipeline(
  dbStream,
  toCSV,
  fs.createWriteStream('users.csv'),
  (err) => {
    if (err) console.error(err);
    else console.log('Export complete!');
  }
);
```

---

## ❌ Common Mistakes

### Mistake 1: Ignoring Backpressure

```javascript
// ❌ WRONG
for (let i = 0; i < 1000000; i++) {
  stream.write(data); // Ignoring return value!
}
// Memory leak! Will crash!

// ✅ CORRECT
for (let i = 0; i < 1000000; i++) {
  if (!stream.write(data)) {
    await new Promise(resolve => stream.once('drain', resolve));
  }
}
```

### Mistake 2: Not Handling Errors

```javascript
// ❌ WRONG
readStream.pipe(writeStream);
// If error occurs, app crashes!

// ✅ CORRECT
pipeline(
  readStream,
  writeStream,
  (err) => {
    if (err) console.error('Error:', err);
  }
);
```

### Mistake 3: Forgetting to Call callback()

```javascript
// ❌ WRONG
class MyTransform extends Transform {
  _transform(chunk, enc, cb) {
    this.push(chunk);
    // Forgot to call cb()!
  }
}
// Stream hangs forever!

// ✅ CORRECT
class MyTransform extends Transform {
  _transform(chunk, enc, cb) {
    this.push(chunk);
    cb(); // Always call callback!
  }
}
```

### Mistake 4: Not Implementing _flush()

```javascript
// ❌ WRONG
class Batcher extends Transform {
  constructor() {
    super({ objectMode: true });
    this.batch = [];
  }

  _transform(item, enc, cb) {
    this.batch.push(item);
    if (this.batch.length === 10) {
      this.push(this.batch);
      this.batch = [];
    }
    cb();
  }
  // Last batch (< 10 items) is lost!
}

// ✅ CORRECT
class Batcher extends Transform {
  // ... same as above ...

  _flush(cb) {
    if (this.batch.length > 0) {
      this.push(this.batch); // Push remaining items
    }
    cb();
  }
}
```

---

## 🎓 Interview Questions

### Q1: What are streams and why use them?

**Answer:**
Streams process data in chunks instead of loading everything into memory. Benefits:
1. **Memory efficient** - Process 1GB file with 64KB memory
2. **Time efficient** - Start processing before download completes
3. **Scalable** - Handle files of any size

### Q2: Explain the 4 types of streams

**Answer:**
1. **Readable** - Source of data (reading files, HTTP requests)
2. **Writable** - Destination for data (writing files, HTTP responses)
3. **Duplex** - Both readable and writable, independent (TCP sockets)
4. **Transform** - Modifies data while passing through (compression, encryption)

### Q3: What is backpressure?

**Answer:**
Backpressure is a signal to slow down when the consumer can't keep up with the producer. When buffer fills up, `.write()` returns `false`, telling the producer to pause until the `'drain'` event fires.

### Q4: Difference between .pipe() and pipeline()?

**Answer:**
- `.pipe()`: Manual error handling, no automatic cleanup
- `pipeline()`: Automatic error handling, cleanup, supports async/await
- Always use `pipeline()` in production!

### Q5: What is highWaterMark?

**Answer:**
The size of the internal buffer (default 16KB). When buffer reaches this limit, backpressure is triggered. Choose based on use case: 8-16KB for low memory, 64KB for balanced, 256KB-1MB for high throughput.

### Q6: Explain flowing vs paused mode

**Answer:**
- **Flowing mode**: Data flows automatically when you attach `'data'` event listener
- **Paused mode**: Must manually call `.read()` to get data, triggered by `'readable'` event

### Q7: What happens if you ignore backpressure?

**Answer:**
Memory leak → buffer grows indefinitely → out of memory crash → data loss → poor performance

### Q8: How does object mode work?

**Answer:**
By default, streams work with Buffers (binary data). Object mode (`objectMode: true`) allows streams to work with JavaScript objects. In object mode, `highWaterMark` counts objects, not bytes.

### Q9: When to use Transform vs Duplex?

**Answer:**
- **Transform**: When output relates to input (compression, encryption, data modification)
- **Duplex**: When read and write are independent (network sockets, two-way communication)

### Q10: How to handle errors in streams?

**Answer:**
Always attach `'error'` event handlers or use `pipeline()`:
```javascript
stream.on('error', err => console.error(err));
// OR
pipeline(source, dest, (err) => { if (err) handle(err); });
```

---

## 📦 Repository Files

- **`streams_1_fundamentals.js`** - Stream types, events, basic theory
- **`streams_2_pipes_pipelines.js`** - Connecting streams, pipe vs pipeline
- **`streams_3_backpressure.js`** - Backpressure handling in detail
- **`streams_4_implementations.js`** - Production-ready patterns

---

## 🚀 Quick Reference

```javascript
// Read file
fs.createReadStream('file.txt')

// Write file
fs.createWriteStream('output.txt')

// Pipe (connect streams)
source.pipe(destination)

// Pipeline (better pipe)
pipeline(source, transform, dest, callback)

// Handle backpressure
if (!stream.write(data)) {
  await new Promise(r => stream.once('drain', r));
}

// Transform data
new Transform({
  transform(chunk, enc, cb) {
    this.push(modified);
    cb();
  }
})
```

---

**Happy Learning! 🌊**

*For code examples, check the JavaScript files in this repository.*
