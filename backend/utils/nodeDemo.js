const http = require('http');
const fs = require('fs');
const path = require('path');

/**
 * Node.js Fundamentals Demonstration (Experiment 7)
 * Demonstrates: HTTP Server, Event Loop, File System, Buffers, Streams
 */

const runDemo = () => {
  console.log('\n--- Starting Node.js Experiment 7 Demo ---\n');

  // 1. Buffer Creation & Manipulation
  console.log('1. Buffer Demo:');
  const buf = Buffer.from('Raj Enterprises Water Purifiers', 'utf8');
  console.log('Buffer content as hex:', buf.toString('hex'));
  console.log('Buffer decoded back to string:', buf.toString('utf8'));
  console.log('--------------------------------------------------\n');

  // 2. Event Loop Demonstration
  console.log('2. Event Loop Ordering Demo (Observe the log order):');
  setTimeout(() => console.log('   -> setTimeout 1 executed'), 0);
  setImmediate(() => console.log('   -> setImmediate 1 executed'));
  process.nextTick(() => console.log('   -> process.nextTick 1 executed'));
  console.log('   -> Synchronous log executed');
  
  // 3. File System & Streams Demo (Setting up for HTTP server)
  const tempFilePath = path.join(__dirname, 'demo.txt');
  const tempFileCopyPath = path.join(__dirname, 'demo-copy.txt');
  
  // Using fs.writeFile to create a temporary file
  fs.writeFile(tempFilePath, 'Sample data for streams and fs demo.\nShuddha Paani, Bharosa Pakka.', (err) => {
    if (err) throw err;
    console.log('\n3. File System & Streams Demo:');
    console.log('   -> demo.txt created successfully.');
    
    // Using fs.readFile
    fs.readFile(tempFilePath, 'utf8', (err, data) => {
      if (err) throw err;
      console.log('   -> fs.readFile output:', data);
      
      // Using Streams (Readable & Writable)
      const readStream = fs.createReadStream(tempFilePath);
      const writeStream = fs.createWriteStream(tempFileCopyPath);
      
      readStream.pipe(writeStream);
      
      writeStream.on('finish', () => {
        console.log('   -> Stream pipe finished: demo.txt copied to demo-copy.txt');
        
        // Cleanup demo files
        fs.unlink(tempFilePath, () => {});
        fs.unlink(tempFileCopyPath, () => {});
      });
    });
  });

  // 4. Basic HTTP Server Creation
  const demoPort = 8080;
  const demoServer = http.createServer((req, res) => {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/plain');
    res.end('Hello from Node.js Experiment 7 Basic Server!\n');
  });

  demoServer.on('error', (err) => {
    console.log(`   -> Could not start demo server on port ${demoPort}: ${err.message}`);
  });

  demoServer.listen(demoPort, () => {
    console.log(`\n4. HTTP Server Demo:`);
    console.log(`   -> Basic HTTP server running at http://localhost:${demoPort}/`);
    console.log(`   -> (Note: This is separate from the Express server on port 5000)`);

    // Make a request to demonstrate it works, then shut it down so the process exits
    http.get(`http://localhost:${demoPort}/`, (res) => {
      let body = '';
      res.on('data', (chunk) => { body += chunk; });
      res.on('end', () => {
        console.log(`   -> HTTP response: ${body.trim()}`);
        demoServer.close(() => console.log('   -> Demo server closed.\n'));
      });
    }).on('error', () => demoServer.close());
  });
};

module.exports = { runDemo };

// Allow running directly: `node utils/nodeDemo.js` (Experiment 7)
if (require.main === module) {
  runDemo();
}
