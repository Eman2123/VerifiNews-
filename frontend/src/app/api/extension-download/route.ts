// File Path: src/app/api/extension-download/route.ts
// OPTIONAL: Use this if you want users to download extension ZIP from landing page button

import { NextResponse } from 'next/server';
import path from 'path';
import fs from 'fs';

export async function GET(request: Request) {
  try {
    // Path to your extension folder
    // Adjust this based on where your extension is stored
    const extensionPath = path.join(process.cwd(), '..', 'verifinews-extension');

    // Check if extension folder exists
    if (!fs.existsSync(extensionPath)) {
      return NextResponse.json(
        { error: 'Extension folder not found' },
        { status: 404 }
      );
    }

    // For development: create a response with download headers
    // In production, you'd want to pre-zip the extension and serve it

    // Option 1: Redirect to a pre-generated ZIP file if you've already created one
    // const zipPath = path.join(public, 'downloads', 'verifinews-extension.zip');
    // const zipBuffer = fs.readFileSync(zipPath);
    
    // return new NextResponse(zipBuffer, {
    //   headers: {
    //     'Content-Disposition': 'attachment; filename="verifinews-extension.zip"',
    //     'Content-Type': 'application/zip',
    //   },
    // });

    // Option 2: Return instructions instead (simpler for development)
    return NextResponse.json({
      message: 'Extension Download Instructions',
      steps: [
        'The extension is available at the project root',
        'Extract verifinews-extension.zip',
        'Go to chrome://extensions',
        'Enable Developer mode',
        'Click Load unpacked',
        'Select the extracted folder'
      ],
      note: 'For production, pre-generate a ZIP and serve it here'
    });

  } catch (error) {
    console.error('Extension download error:', error);
    return NextResponse.json(
      { error: 'Failed to download extension' },
      { status: 500 }
    );
  }
}

// ==============================================================
// PRODUCTION SETUP: Create ZIP before deployment
// ==============================================================
// 
// npm install archiver
// 
// Then create this script (build-extension.js):
// 
// const archiver = require('archiver');
// const fs = require('fs');
// const path = require('path');
// 
// const source = path.join(__dirname, 'verifinews-extension');
// const destination = path.join(__dirname, 'public', 'downloads', 'verifinews-extension.zip');
// 
// const output = fs.createWriteStream(destination);
// const archive = archiver('zip', { zlib: { level: 9 } });
// 
// output.on('close', () => console.log(`Created: ${destination}`));
// archive.on('error', (err) => { throw err; });
// 
// archive.pipe(output);
// archive.directory(source, 'verifinews-extension');
// archive.finalize();
// 
// Run: node build-extension.js
// This creates public/downloads/verifinews-extension.zip
//
// Then in route.ts, uncomment Option 1 above