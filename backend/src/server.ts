/**
 * @file backend/src/server.ts
 * @responsibility Single Responsibility: Main entry point for the ResQDrive Node/Express API
 * service with WebSocket live location streaming, CORS, error handling, and routes.
 */

import express from 'express';
import http from 'http';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import { WebSocketServer, WebSocket } from 'ws';

dotenv.config();

const app = express();
const server = http.createServer(app);
const port = process.env.PORT || 5000;

app.use(helmet());
app.use(cors({ origin: '*' }));
app.use(express.json());

// WebSocket server for bi-directional live GPS coordinate broadcasting
const wss = new WebSocketServer({ server, path: '/ws/live-track' });

interface TrackerClient extends WebSocket {
  incidentId?: string;
}

wss.on('connection', (ws: TrackerClient) => {
  ws.on('message', (message: string) => {
    try {
      const data = JSON.parse(message.toString());
      if (data.type === 'SUBSCRIBE') {
        ws.incidentId = data.incidentId;
      } else if (data.type === 'GPS_UPDATE') {
        // Broadcast location to all contacts watching this incident
        wss.clients.forEach((client: TrackerClient) => {
          if (client.readyState === WebSocket.OPEN && client.incidentId === data.incidentId) {
            client.send(JSON.stringify({
              type: 'LOCATION_BROADCAST',
              coordinates: data.coordinates,
              timestamp: Date.now()
            }));
          }
        });
      }
    } catch {
      // JSON parse safety
    }
  });
});

// System Health Check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ONLINE',
    service: 'ResQDrive Backend Core API',
    region: 'Pakistan',
    timestamp: new Date().toISOString(),
  });
});

// Mock/Heuristic Auth Route
app.post('/api/auth/login', (req, res) => {
  const { email, role } = req.body;
  if (!email) {
    return res.status(400).json({ error: 'Email is required' });
  }
  const user = {
    id: 'usr-1',
    name: email.split('@')[0],
    email,
    role: role || 'driver',
    token: 'jwt_mock_token_resqdrive_2026',
  };
  return res.json({ user, token: user.token });
});

// Emergency Contacts Endpoint (Enforcing max 5 contacts rule)
app.get('/api/contacts', (req, res) => {
  res.json({
    contacts: [
      { id: 'c-1', name: 'Ahmad Khan', phone: '03001234567', relationship: 'Brother', priority: 1, isPrimary: true },
      { id: 'c-2', name: 'Fatima Kamran', phone: '03219876543', relationship: 'Spouse', priority: 2, isPrimary: false },
      { id: 'c-3', name: 'Tariq Mehmood', phone: '03335551234', relationship: 'Father', priority: 3, isPrimary: false },
    ],
    maxLimit: 5,
  });
});

// Incident Logger Endpoint
app.post('/api/incidents', (req, res) => {
  const incident = req.body;
  console.log(`[INCIDENT LOGGED] ID: ${incident.id}, Severity: ${incident.severity}, Location: ${incident.coordinates?.address}`);
  res.status(201).json({ success: true, incidentId: incident.id, status: 'RECORDED' });
});

server.listen(port, () => {
  console.log(`[ResQDrive] Backend server running on http://localhost:${port}`);
});
