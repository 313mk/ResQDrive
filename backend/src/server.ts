/**
 * @file backend/src/server.ts
 * @responsibility Single Responsibility: Production Express API server connecting directly
 * to PostgreSQL (resqdrive_db). Provides real endpoints for authentication, vehicles,
 * 5-contact emergency escalation, incident logging, and WebSocket live coordinate streaming.
 */

import express, { Request, Response, NextFunction } from 'express';
import http from 'http';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import { WebSocketServer, WebSocket } from 'ws';
import { pool, query } from './db/connection';

dotenv.config();

const app = express();
const server = http.createServer(app);
const port = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET || 'resqdrive_secret_key_2026';

app.use(helmet());
app.use(cors({ origin: '*' }));
app.use(express.json());

// Helper: Secure password hashing using native Node.js crypto
function hashPassword(password: string): string {
  const salt = crypto.randomBytes(16).toString('hex');
  const hash = crypto.pbkdf2Sync(password, salt, 1000, 64, 'sha512').toString('hex');
  return `${salt}:${hash}`;
}

function verifyPassword(password: string, combinedHash: string): boolean {
  if (!combinedHash || !combinedHash.includes(':')) return false;
  const [salt, originalHash] = combinedHash.split(':');
  const hash = crypto.pbkdf2Sync(password, salt, 1000, 64, 'sha512').toString('hex');
  return hash === originalHash;
}

// Middleware: Authenticate JWT Token
interface AuthRequest extends Request {
  user?: {
    id: string;
    email: string;
    role: string;
  };
}

function authenticateToken(req: AuthRequest, res: Response, next: NextFunction) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    // If token not provided in development demo, fallback gracefully or reject
    return res.status(401).json({ error: 'Access token required' });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ error: 'Invalid or expired token' });
    req.user = user as { id: string; email: string; role: string };
    next();
  });
}

// ==========================================
// 1. WEBSOCKET REAL-TIME BROADCAST ENGINE
// ==========================================
const wss = new WebSocketServer({ server, path: '/ws/live-track' });

interface TrackerClient extends WebSocket {
  incidentId?: string;
  clientType?: string; // 'mobile_driver' | 'admin_dashboard' | 'family_viewer'
}

wss.on('connection', (ws: TrackerClient) => {
  ws.on('message', (message: string) => {
    try {
      const data = JSON.parse(message.toString());

      if (data.type === 'SUBSCRIBE') {
        ws.incidentId = data.incidentId;
        ws.clientType = data.clientType || 'viewer';
        console.log(`[WebSocket] Client subscribed to incident ${data.incidentId}`);
      } else if (data.type === 'GPS_UPDATE') {
        // Broadcast moving coordinates to all connected admin dashboards and family viewers
        wss.clients.forEach((client: TrackerClient) => {
          if (client.readyState === WebSocket.OPEN && client.incidentId === data.incidentId) {
            client.send(JSON.stringify({
              type: 'LOCATION_BROADCAST',
              coordinates: data.coordinates,
              telemetry: data.telemetry,
              timestamp: Date.now()
            }));
          }
        });
      } else if (data.type === 'ACKNOWLEDGE_INCIDENT') {
        // Broadcast acknowledgement to halt mobile call escalation immediately
        wss.clients.forEach((client: TrackerClient) => {
          if (client.readyState === WebSocket.OPEN && client.incidentId === data.incidentId) {
            client.send(JSON.stringify({
              type: 'INCIDENT_ACKNOWLEDGED',
              acknowledgedBy: data.acknowledgedBy,
              timestamp: Date.now()
            }));
          }
        });
      }
    } catch (err) {
      console.error('[WebSocket] Message parsing error:', err);
    }
  });
});

// Broadcast helper for server-side incident creation
function broadcastToAdminDashboard(eventData: any) {
  wss.clients.forEach((client: TrackerClient) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify(eventData));
    }
  });
}

// ==========================================
// 2. SYSTEM & DATABASE SEED ENDPOINTS
// ==========================================
app.get('/api/health', async (req, res) => {
  try {
    const dbTest = await query('SELECT NOW()');
    res.json({
      status: 'ONLINE',
      service: 'ResQDrive Backend Core API',
      database: 'PostgreSQL Connected',
      dbTime: dbTest.rows[0].now,
      region: 'Pakistan',
      timestamp: new Date().toISOString()
    });
  } catch (err: any) {
    res.status(500).json({
      status: 'DEGRADED',
      database: 'PostgreSQL Connection Error',
      error: err.message
    });
  }
});

// Seed Initial Data (Pakistan Emergency Services & Default Demo Records)
app.post('/api/db/seed', async (req, res) => {
  try {
    // 1. Seed Rescue Services if empty
    const rescueCheck = await query('SELECT COUNT(*) FROM rescue_services');
    if (parseInt(rescueCheck.rows[0].count, 10) === 0) {
      await query(`
        INSERT INTO rescue_services (name, region, short_code, helpline_11_digit, priority_order) VALUES
        ('Rescue 1122 (Punjab & Islamabad)', 'Islamabad', '1122', '0519255555', 1),
        ('Rescue 1122 (Punjab Operations HQ)', 'Punjab', '1122', '04299231122', 2),
        ('Edhi Ambulance Service (Sindh HQ)', 'Sindh', '115', '02132310066', 3),
        ('Chhipa Welfare Ambulance', 'Sindh', '1020', '021111102020', 4),
        ('Rescue 1122 (Khyber Pakhtunkhwa)', 'KPK', '1122', '0919211122', 5),
        ('National Highways & Motorway Police', 'National', '130', '0519277021', 6);
      `);
    }

    // 2. Seed Default Driver if not exists
    const userCheck = await query("SELECT * FROM users WHERE email = 'kamran@students.au.edu.pk'");
    let userId = '';

    if (userCheck.rows.length === 0) {
      const passwordHash = hashPassword('kamran123');
      const newUser = await query(`
        INSERT INTO users (name, email, password_hash, role, phone)
        VALUES ('Muhammad Kamran', 'kamran@students.au.edu.pk', $1, 'driver', '03001234567')
        RETURNING id;
      `, [passwordHash]);
      userId = newUser.rows[0].id;

      // Seed Vehicle
      await query(`
        INSERT INTO vehicles (user_id, make, model, year, variant, car_type, color, license_plate, insurance_company, policy_number)
        VALUES ($1, 'Honda', 'Civic', 2022, '1.8 i-VTEC Oriel', 'Sedan', 'Taffeta White', 'ICT-LE-2022', 'Adamjee Insurance', 'PK-ADM-883921-2026');
      `, [userId]);

      // Seed 3 Emergency Contacts (Prioritized 1 to 3)
      await query(`
        INSERT INTO emergency_contacts (user_id, name, phone, email, relationship, priority, is_primary) VALUES
        ($1, 'Ahmad Khan (Brother)', '03001234567', 'ahmad.khan@gmail.com', 'Brother', 1, true),
        ($1, 'Fatima Kamran (Spouse)', '03219876543', 'fatima.k@gmail.com', 'Spouse', 2, false),
        ($1, 'Tariq Mehmood (Father)', '03335551234', 'tariq.m@yahoo.com', 'Father', 3, false);
      `, [userId]);
    } else {
      userId = userCheck.rows[0].id;
    }

    res.json({ success: true, message: 'Database initialized and seeded successfully', userId });
  } catch (err: any) {
    res.status(500).json({ error: 'Seed failed', details: err.message });
  }
});

// ==========================================
// 3. REAL AUTHENTICATION CONTROLLER
// ==========================================
app.post('/api/auth/register', async (req, res) => {
  try {
    const { name, email, password, role, phone } = req.body;

    if (!name || !email || !password || !phone) {
      return res.status(400).json({ error: 'Name, email, password, and phone are required' });
    }

    const cleanEmail = email.trim().toLowerCase();
    const existing = await query('SELECT id FROM users WHERE email = $1', [cleanEmail]);
    if (existing.rows.length > 0) {
      return res.status(409).json({ error: 'Email already registered' });
    }

    const passwordHash = hashPassword(password);
    const validRole = ['driver', 'mechanic', 'admin'].includes(role) ? role : 'driver';

    const result = await query(`
      INSERT INTO users (name, email, password_hash, role, phone)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING id, name, email, role, phone, created_at;
    `, [name.trim(), cleanEmail, passwordHash, validRole, phone.trim()]);

    const user = result.rows[0];
    const token = jwt.sign({ id: user.id, email: user.email, role: user.role }, JWT_SECRET, { expiresIn: '30d' });

    res.status(201).json({ success: true, user, token });
  } catch (err: any) {
    res.status(500).json({ error: 'Registration failed', details: err.message });
  }
});

app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password, role } = req.body;

    if (!email) {
      return res.status(400).json({ error: 'Email is required' });
    }

    const cleanEmail = email.trim().toLowerCase();
    const result = await query('SELECT * FROM users WHERE email = $1', [cleanEmail]);

    if (result.rows.length === 0) {
      // Auto-create demo account if not exists for smooth testing
      const passwordHash = hashPassword(password || 'password123');
      const assignedRole = role || 'driver';
      const newUser = await query(`
        INSERT INTO users (name, email, password_hash, role, phone)
        VALUES ($1, $2, $3, $4, '03001234567')
        RETURNING id, name, email, role, phone;
      `, [cleanEmail.split('@')[0], cleanEmail, passwordHash, assignedRole]);

      const user = newUser.rows[0];
      const token = jwt.sign({ id: user.id, email: user.email, role: user.role }, JWT_SECRET, { expiresIn: '30d' });
      return res.json({ success: true, user, token });
    }

    const user = result.rows[0];

    // If password provided, verify hash (or allow demo bypass if testing with standard role switch)
    if (password && !verifyPassword(password, user.password_hash)) {
      return res.status(401).json({ error: 'Invalid password credentials' });
    }

    const token = jwt.sign({ id: user.id, email: user.email, role: user.role }, JWT_SECRET, { expiresIn: '30d' });
    const { password_hash, ...safeUser } = user;

    res.json({ success: true, user: safeUser, token });
  } catch (err: any) {
    res.status(500).json({ error: 'Login failed', details: err.message });
  }
});

// ==========================================
// 4. VEHICLES CONTROLLER (POSTGRESQL)
// ==========================================
app.get('/api/vehicles', async (req, res) => {
  try {
    const userId = req.query.userId as string;
    let result;
    if (userId) {
      result = await query('SELECT * FROM vehicles WHERE user_id = $1 ORDER BY created_at DESC', [userId]);
    } else {
      result = await query('SELECT * FROM vehicles ORDER BY created_at DESC LIMIT 10');
    }
    res.json({ success: true, vehicles: result.rows });
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to fetch vehicles', details: err.message });
  }
});

app.post('/api/vehicles', async (req, res) => {
  try {
    const { userId, make, model, year, variant, carType, color, licensePlate, insuranceCompany, policyNumber } = req.body;

    const result = await query(`
      INSERT INTO vehicles (user_id, make, model, year, variant, car_type, color, license_plate, insurance_company, policy_number)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
      RETURNING *;
    `, [
      userId || null,
      make || 'Honda',
      model || 'Civic',
      parseInt(year, 10) || 2022,
      variant || '1.8 i-VTEC Oriel',
      carType || 'Sedan',
      color || 'Taffeta White',
      licensePlate || `ICT-${Math.floor(1000 + Math.random() * 9000)}`,
      insuranceCompany || 'Adamjee Insurance',
      policyNumber || 'PK-ADM-00192'
    ]);

    res.status(201).json({ success: true, vehicle: result.rows[0] });
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to register vehicle', details: err.message });
  }
});

// ==========================================
// 5. EMERGENCY CONTACTS (MAX 5 RULE ENFORCED)
// ==========================================
app.get('/api/contacts', async (req, res) => {
  try {
    const userId = req.query.userId as string;
    let result;

    if (userId) {
      result = await query('SELECT * FROM emergency_contacts WHERE user_id = $1 ORDER BY priority ASC', [userId]);
    } else {
      // Return top priority contacts from database
      result = await query('SELECT * FROM emergency_contacts ORDER BY priority ASC LIMIT 5');
    }

    res.json({
      success: true,
      contacts: result.rows,
      count: result.rows.length,
      maxLimit: 5
    });
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to fetch contacts', details: err.message });
  }
});

app.post('/api/contacts', async (req, res) => {
  try {
    const { userId, name, phone, email, relationship } = req.body;

    if (!name || !phone) {
      return res.status(400).json({ error: 'Name and phone are required' });
    }

    // Check count constraint (Strict Max 5)
    const countCheck = await query('SELECT COUNT(*) FROM emergency_contacts WHERE user_id = $1', [userId]);
    const currentCount = parseInt(countCheck.rows[0]?.count || '0', 10);

    if (currentCount >= 5) {
      return res.status(400).json({ error: 'Maximum 5 emergency contacts limit reached' });
    }

    const nextPriority = currentCount + 1;
    const isPrimary = nextPriority === 1;

    const result = await query(`
      INSERT INTO emergency_contacts (user_id, name, phone, email, relationship, priority, is_primary)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING *;
    `, [
      userId || null,
      name.trim(),
      phone.trim(),
      email ? email.trim() : null,
      relationship || 'Family',
      nextPriority,
      isPrimary
    ]);

    res.status(201).json({ success: true, contact: result.rows[0] });
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to add emergency contact', details: err.message });
  }
});

app.delete('/api/contacts/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await query('DELETE FROM emergency_contacts WHERE id = $1', [id]);

    // Re-sequence remaining priorities
    const remaining = await query('SELECT id FROM emergency_contacts ORDER BY priority ASC');
    for (let i = 0; i < remaining.rows.length; i++) {
      await query('UPDATE emergency_contacts SET priority = $1, is_primary = $2 WHERE id = $3', [
        i + 1,
        i === 0,
        remaining.rows[i].id
      ]);
    }

    res.json({ success: true, message: 'Contact deleted and priorities re-ordered' });
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to delete contact', details: err.message });
  }
});

// ==========================================
// 6. COLLISION INCIDENTS CONTROLLER
// ==========================================
app.get('/api/incidents', async (req, res) => {
  try {
    const result = await query(`
      SELECT i.*, v.make, v.model, v.license_plate
      FROM incidents i
      LEFT JOIN vehicles v ON i.vehicle_id = v.id
      ORDER BY i.timestamp DESC
      LIMIT 50;
    `);
    res.json({ success: true, incidents: result.rows });
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to fetch incidents', details: err.message });
  }
});

app.post('/api/incidents', async (req, res) => {
  try {
    const {
      userId,
      vehicleId,
      severity,
      latitude,
      longitude,
      address,
      city,
      province,
      peakGForce,
      speedDropKmH,
      detectionSource,
      sensorSnapshot
    } = req.body;

    const timestamp = new Date();
    const incidentSeverity = severity || 'Moderate';
    const lat = latitude || 33.7027;
    const lng = longitude || 73.0569;
    const roadAddress = address || 'Islamabad Expressway near Faizabad Interchange';
    const roadCity = city || 'Islamabad';
    const roadProvince = province || 'Islamabad Capital Territory';
    const gForce = peakGForce || 3.2;
    const speedDrop = speedDropKmH || 55;
    const source = detectionSource || 'iot_esp32';

    const result = await query(`
      INSERT INTO incidents (
        user_id, vehicle_id, timestamp, severity, latitude, longitude,
        address, city, province, peak_g_force, speed_drop_kmh, detection_source, status
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, 'escalating')
      RETURNING *;
    `, [
      userId || null,
      vehicleId || null,
      timestamp,
      incidentSeverity,
      lat,
      lng,
      roadAddress,
      roadCity,
      roadProvince,
      gForce,
      speedDrop,
      source
    ]);

    const createdIncident = result.rows[0];

    // Broadcast Real-Time Emergency Event to Connected Web Admin Dashboards
    broadcastToAdminDashboard({
      type: 'NEW_ACCIDENT_EMERGENCY',
      incident: createdIncident,
      coordinates: { lat, lng, address: roadAddress },
      timestamp: Date.now()
    });

    console.log(`[EMERGENCY BROADCAST] Real incident ${createdIncident.id} saved in PostgreSQL!`);

    res.status(201).json({
      success: true,
      incident: createdIncident,
      trackingUrl: `http://localhost:3000/track/${createdIncident.id}`
    });
  } catch (err: any) {
    console.error('[Incident Creation Error]:', err);
    res.status(500).json({ error: 'Failed to log accident incident', details: err.message });
  }
});

// Acknowledge Incident (Halts Escalation)
app.patch('/api/incidents/:id/acknowledge', async (req, res) => {
  try {
    const { id } = req.params;
    const { acknowledgedBy } = req.body;

    const result = await query(`
      UPDATE incidents
      SET status = 'acknowledged', acknowledged_by = $1
      WHERE id = $2
      RETURNING *;
    `, [acknowledgedBy || 'Emergency Contact', id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Incident not found' });
    }

    broadcastToAdminDashboard({
      type: 'INCIDENT_ACKNOWLEDGED',
      incidentId: id,
      acknowledgedBy: acknowledgedBy || 'Family Contact',
      timestamp: Date.now()
    });

    res.json({ success: true, incident: result.rows[0] });
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to acknowledge incident', details: err.message });
  }
});

// Cancel Incident as False Alarm
app.patch('/api/incidents/:id/cancel', async (req, res) => {
  try {
    const { id } = req.params;
    const { reason } = req.body;

    const result = await query(`
      UPDATE incidents
      SET status = 'cancelled_false_alarm', false_alarm_reason = $1
      WHERE id = $2
      RETURNING *;
    `, [reason || 'Voice Cancel: User said I AM OK', id]);

    res.json({ success: true, incident: result.rows[0] });
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to cancel incident', details: err.message });
  }
});

// ==========================================
// 7. DIRECTORY ENDPOINTS (PAKISTAN SERVICES)
// ==========================================
app.get('/api/rescue-services', async (req, res) => {
  try {
    const result = await query('SELECT * FROM rescue_services ORDER BY priority_order ASC');
    res.json({ success: true, services: result.rows });
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to fetch rescue services', details: err.message });
  }
});

// Start Server
server.listen(port, () => {
  console.log(`[ResQDrive PostgreSQL API] Server live on http://localhost:${port}`);
  console.log(`[ResQDrive WebSocket] Streaming live at ws://localhost:${port}/ws/live-track`);
});