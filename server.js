const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

// Serve static files (HTML, CSS, JS) from the current directory
app.use(express.static(__dirname));

// Default route
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Store active match states
const activeMatches = {};

// Socket.io Logic
io.on('connection', (socket) => {
    console.log(`Player connected: ${socket.id}`);

    // Join a room
    socket.on('join-room', (roomCode) => {
        socket.join(roomCode);
        
        // Initialize match state if it doesn't exist
        if (!activeMatches[roomCode]) {
            activeMatches[roomCode] = {
                scoreHome: 0,
                scoreAway: 0,
                momentumHome: 50,
                momentumAway: 50,
                currentRotation: 1
            };
        }
        
        console.log(`Player ${socket.id} joined room ${roomCode}`);
        
        // Broadcast to the room that someone joined
        io.to(roomCode).emit('room-update', {
            message: 'A player joined the room.',
            matchState: activeMatches[roomCode]
        });
    });

    // Handle Rally Simulation (Backend Authoritative Logic)
    socket.on('play-rally', (data) => {
        const roomCode = data.roomCode;
        if (!activeMatches[roomCode]) return;

        const match = activeMatches[roomCode];

        // --- AUTHORITATIVE MATCH ENGINE LOGIC ---
        // Right now this is a placeholder random winner.
        // TODO: Port the full 'simulatePoint' math from app.js here.
        const homeWins = Math.random() > 0.5;

        if (homeWins) {
            match.scoreHome++;
        } else {
            match.scoreAway++;
        }

        // Broadcast the result of the rally to all clients in the room
        io.to(roomCode).emit('rally-result', {
            winner: homeWins ? 'HOME' : 'AWAY',
            matchState: match
        });
    });

    socket.on('disconnect', () => {
        console.log(`Player disconnected: ${socket.id}`);
    });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`=========================================`);
    console.log(`🏐 Volleyball Server Running on Port ${PORT}`);
    console.log(`👉 Open http://localhost:${PORT} in your browser`);
    console.log(`=========================================`);
});
