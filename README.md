# Chat App

A real-time chat application built with a React frontend and a NestJS backend using Socket.IO.

## Project Structure

- `chat-app-backend`: NestJS server handling WebSocket connections.
- `chat-app-frontend`: React application (Vite) for the user interface.

## Prerequisites

- Node.js
- npm or yarn

## Getting Started

### Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd chat-app-backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the server:
   ```bash
   # Development mode
   npm run start:dev
   
   # Production mode
   npm run start:prod
   ```

   The backend server will start on `http://localhost:3000` (default NestJS port).

### Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd chat-app-frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

   The frontend will be available at the URL shown in the terminal (usually `http://localhost:5173`).

## Usage

1. Ensure the backend server is running.
2. Open the frontend in your browser.
3. The app should automatically connect to the backend via WebSocket.

## Technologies Used

- **Backend**: NestJS, Socket.IO
- **Frontend**: React, Vite, Socket.IO Client
