<div align="center">

<h1>📈 Marketing Performance Tracker</h1>

<p>
<strong>A robust, real-time, and offline-capable dashboard for modern marketing teams.</strong>
</p>

<p>
<a href="#-key-features">Key Features</a> •
<a href="#-tech-stack">Tech Stack</a> •
<a href="#-getting-started">Getting Started</a> •
<a href="#-usage-guide">Usage Guide</a>
</p>

</div>

<br />

📖 Overview

Marketing Performance Tracker is a specialized tool designed to streamline the workflow of marketing teams. It replaces messy spreadsheets with a clean, interactive Single Page Application (SPA). It allows teams to track daily engagements, monitor influencer performance, and analyze weekly KPIs automatically.

Whether you are working Offline on a flight or collaborating Real-time with your team, this app handles data seamlessly.

✨ Key Features

<table>
<tr>
<td width="50%">
<h3>🔄 Hybrid Storage System</h3>
<ul>
<li><strong>Offline Mode (Local):</strong> Zero setup required. Data persists in your browser's LocalStorage. Perfect for individual use.</li>
<li><strong>Online Mode (Cloud):</strong> Seamlessly syncs data across all team members using <strong>Firebase Firestore</strong>.</li>
</ul>
</td>
<td width="50%">
<h3>📊 3-in-1 Dashboard</h3>
<ul>
<li><strong>Daily Tracker:</strong> Log interactions with validation (Dropdowns, Checkboxes).</li>
<li><strong>Influencer Hub:</strong> Track promo codes and lead generation.</li>
<li><strong>KPI Analytics:</strong> Auto-calculated weekly summaries & visual benchmarks.</li>
</ul>
</td>
</tr>
<tr>
<td colspan="2">
<h3>🚀 Productivity Boosters</h3>
<ul>
<li><strong>JSON Backup:</strong> One-click <code>Export</code> and <code>Import</code> to share data manually.</li>
<li><strong>Smart Filters:</strong> Filter leads by <em>Today, Last 7 Days,</em> or <em>This Month</em>.</li>
<li><strong>Instant Search:</strong> Quick-find leads using <code>Ctrl + F</code> shortcut.</li>
<li><strong>Visual Alerts:</strong> Auto-highlight <span style="color:red">red</span> for responses delayed >48 hours.</li>
<li><strong>Responsive Design:</strong> Fully optimized for Desktop, Tablet, and Mobile.</li>
</ul>
</td>
</tr>
</table>

💻 Tech Stack

Built with the latest web technologies for speed and reliability.

Core

Styling & Assets

Backend (Optional)



















🚀 Getting Started

Follow these simple steps to get a local copy up and running.

Prerequisites

Node.js (v14 or higher)

npm or yarn

Installation

Clone the repository

git clone [https://github.com/your-username/marketing-tracker.git](https://github.com/your-username/marketing-tracker.git)
cd marketing-tracker


Install dependencies

npm install


Start the development server

npm run dev


Open your browser and visit http://localhost:5173/.

☁️ Online Mode Configuration (Optional)

By default, the app runs in Offline Mode. To enable real-time collaboration:

Create a project at Firebase Console.

Navigate to Project Settings > General > Your apps.

Copy your firebaseConfig object.

Open src/App.tsx and replace the placeholder config:

// src/App.tsx

const firebaseConfig = {
  apiKey: "AIzaSy...",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:..."
};


Success: The app will automatically detect the config and switch the badge to ONLINE.

📖 Usage Guide

📝 Managing Leads

Go to the Daily Engagement tab.

Click the green + Add button.

Fill in the details. Tip: Use the dropdowns for consistent data.

Edit: Click any cell to modify content instantly.

Delete: Click the Trash Icon (🗑️) to remove a row.

🔍 Search & Filter

Search: Press Ctrl + F or click the search box to find specific names.

Time Filter: Use the dropdown next to the search bar to view leads from Today, Last 7 Days, etc.

💾 Backup Data (Offline Mode)

If you are not using Firebase, you can still share data:

Click Export in the header to download a .json file.

Send the file to your colleague.

They click Import to load your data into their browser.

📂 Project Structure

marketing-tracker/
├── public/              # Static assets (favicons, etc.)
├── src/
│   ├── App.tsx          # Main Application Logic (Single File Architecture)
│   ├── main.tsx         # Entry Point
│   └── index.css        # Global Styles
├── package.json         # Dependencies
├── tsconfig.json        # TypeScript Configuration
└── vite.config.ts       # Vite Configuration


<div align="center">





<sub>Built with ❤️ for High Performance Marketing Teams</sub>
</div>