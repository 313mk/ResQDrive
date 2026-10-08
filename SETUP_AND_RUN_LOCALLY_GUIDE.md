# ResQDrive: Local Setup, Execution & Testing Master Guide
**Air University Islamabad (AU) · Final Year Project (FYP)**  
*Authors: Muhammad Kamran (232501), Muhammad Areeb Islam (232468), Abdul Basit (232477)*  
*Supervisor: Mr. Mohabbat Ali*

---

## 📁 Project Architecture & Folder Breakdown

When you download this repository as a ZIP, it contains a production-grade multi-service architecture:

```
├── backend/                  # Node.js + Express + PostgreSQL API Service
│   ├── src/
│   │   ├── db/schema.sql     # PostgreSQL database schema & tables
│   │   ├── db/connection.ts  # Database connection pool
│   │   └── server.ts         # Express API & WebSocket Live Location Streaming
│   ├── package.json
│   └── .env.example
│
├── mobile/                   # React Native (Expo) Cross-Platform Mobile App
│   ├── src/screens/
│   │   ├── DriverHomeScreen.js        # Driving HUD & Sensor Source Selector
│   │   ├── CrashCountdownScreen.js    # 10s Voice Cancel & 60s Call Escalation
│   │   ├── DamageAssessmentScreen.js  # Camera + PakWheels Parts Estimator
│   │   ├── EmergencyContactsScreen.js # 5 Prioritized Emergency Contacts
│   │   └── MechanicJobsScreen.js      # Workshop Recovery & Towing Jobs
│   ├── App.js                         # Root navigation & gesture container
│   ├── app.json                       # Mobile hardware permissions (Mic, BLE, GPS)
│   └── package.json
│
├── damage-assessment-ai/     # Python FastAPI Vision & Scraper Microservice
│   ├── app.py                # FastAPI endpoints (/predict-damage)
│   ├── scrape_pakwheels.py   # PakWheels & OLX auto parts price scraper
│   ├── train_mobilenet.py    # PyTorch MobileNetV3 multi-task training pipeline
│   └── requirements.txt      # Python dependencies (PyTorch, Torchvision, FastAPI)
│
├── src/                      # Full-Featured Web Suite (Driver, Mechanic, Admin Heatmap)
│   ├── components/           # Modular UI components with Single Responsibility
│   ├── services/             # Web Audio sirens, Web Speech, PakWheels pricing
│   └── context/AppContext.tsx# Unified state management & simulation dock
│
└── SETUP_AND_RUN_LOCALLY_GUIDE.md # This guide!
```

---

## 🛠 Prerequisites on Your Laptop

Before running locally, ensure the following are installed:
1. **Node.js** (v18 or v20 LTS): [Download Node.js](https://nodejs.org/)
2. **PostgreSQL** (v14, v15, or v16): [Download PostgreSQL](https://www.postgresql.org/download/)
3. **Python** (v3.10 or v3.11): [Download Python](https://www.python.org/)
4. **Git**: [Download Git](https://git-scm.com/)
5. **Expo Go Mobile App** (Free on Google Play Store or Apple App Store) on your physical smartphone to test the React Native app.

---

## 🚀 Step 1: Set Up & Run the PostgreSQL Database & Backend

1. **Open your terminal** and start the PostgreSQL service.
2. **Create the ResQDrive database**:
   ```bash
   # Using psql terminal or pgAdmin
   psql -U postgres
   CREATE DATABASE resqdrive_db;
   \q
   ```
3. **Run the Database Schema Migration**:
   ```bash
   cd backend
   psql -U postgres -d resqdrive_db -f src/db/schema.sql
   ```
4. **Configure the Environment File**:
   - Copy `.env.example` to `.env`:
     ```bash
     cp .env.example .env
     ```
   - Update your PostgreSQL password in `.env` if different from default:
     ```env
     DATABASE_URL=postgresql://postgres:YOUR_PASSWORD@localhost:5432/resqdrive_db
     PORT=5000
     JWT_SECRET=super_secret_jwt_resqdrive_fyp_key_2026
     ```
5. **Install Dependencies & Start the Backend**:
   ```bash
   npm install
   npm run dev
   ```
   *Your backend API will start on `http://localhost:5000` with WebSocket support at `ws://localhost:5000/ws/live-track`.*

---

## 📱 Step 2: Set Up & Run the React Native Mobile App

The mobile application is located in the `/mobile` directory:

1. **Open a new terminal window**:
   ```bash
   cd mobile
   npm install
   ```
2. **Start the Expo Development Server**:
   ```bash
   npx expo start
   ```
3. **Test on Physical Smartphone**:
   - Open the **Expo Go** app on your Android phone or iPhone.
   - Scan the QR code displayed in your laptop terminal.
   - The ResQDrive mobile app will load instantly on your phone with native access to:
     - Phone Accelerometer & Gyroscope
     - Native Microphone (for voice cancellation *"I am OK"*)
     - Native Camera (for vehicle damage capture)
     - Native Phone Dialer (one-tap auto dialer for emergency contacts and Rescue 1122)

---

## 💻 Step 3: Run the Web Application & Admin Command Center

The root directory contains the full responsive web platform (Driver HUD, Mechanic Portal, Admin Heatmap, and Family Live Tracker):

1. **Open a terminal in the root directory**:
   ```bash
   npm install
   npm run dev
   ```
2. Open your browser to `http://localhost:3000`.
3. You can switch between:
   - **Driver Mobile App**: Click the phone icon to toggle the realistic smartphone bezel frame.
   - **Mechanic Portal**: Inspect customer damaged vehicles and dispatch recovery tow trucks.
   - **Admin Heatmap**: View live Pakistan highway collision analytics and false alarm logs.
   - **Family Live Tracker**: Open `/track/demo` to simulate how family members track a crash site without installing any app.

---

## 🧠 Step 4: Run the AI Damage Assessment Microservice (Python)

The vision and PakWheels pricing microservice runs in `/damage-assessment-ai`:

1. **Open a new terminal window**:
   ```bash
   cd damage-assessment-ai
   python -m venv venv
   ```
2. **Activate the Virtual Environment**:
   - **Windows**: `venv\Scripts\activate`
   - **Mac/Linux**: `source venv/bin/activate`
3. **Install AI Dependencies**:
   ```bash
   pip install -r requirements.txt
   ```
4. **Start the FastAPI Microservice**:
   ```bash
   uvicorn app:app --port 8000 --reload
   ```
   *The AI service is live at `http://localhost:8000` with interactive Swagger docs at `http://localhost:8000/docs`.*

---

## 📊 Step 5: How to Download Datasets & Train the AI Models

### A. Crash Sound Detection (Google YAMNet)
- **Datasets to download**:
  1. *Enhanced Audio of Accident and Crime Detection* (Kaggle: `afisarsy/enhanced-audio-of-accident-and-crime-detection`)
  2. *NINA In-Car Crash Audio Dataset* (`github.com/axa-rev-research/NINA-Dataset`)
  3. *MIVIA Road Audio Events Dataset* (400 skid and crash clips)
- **How to Train**:
  - Preprocess audio to 16kHz mono, 64-band log-mel spectrograms.
  - Freeze the first 12 convolutional blocks of YAMNet; train the classification dense layer on crash classes with Adam optimizer (lr=0.0001).
  - Export to TensorFlow Lite (`.tflite`) for mobile on-device inference.

### B. Car Damage Classification & Segmentation (MobileNetV3)
- **Datasets to download**:
  1. *COCO Car Damage Detection Dataset* (Kaggle: `lplenka/coco-car-damage-detection-dataset`)
  2. *IEEE Access 2023 Car Damage Dataset* (`nasimetemadi/car-damage-detection`)
  3. *Insurance Claim Images Dataset* (`vinayjose/car-damage-dataset`)
- **How to Train**:
  - Run the provided training script:
    ```bash
    python train_mobilenet.py
    ```
  - The script executes the multi-task loss function combining severity classification (CrossEntropy with label smoothing) and part identification.
  - Checkpoint weights are saved to `models/mobilenetv3_damage_weights.pth`.

---

## 🧪 Step 6: Testing the Full End-to-End Emergency Flow

1. Open the Driver screen and ensure your registered vehicle is set (e.g., *Honda Civic 2022*).
2. Check your **Emergency Contacts** list (up to 5 contacts prioritized 1 to 5).
3. Tap **Simulate / Trigger Accident** (or trigger a preset like *T-Bone 2.8g*).
4. **Test the 10-Second Countdown**:
   - The screen turns crimson, audio sirens pulse, and the microphone listens.
   - Say loudly *"I AM OK"* to test voice cancellation (logs a false alarm).
5. **Test the 60-Second Auto-Call Escalation**:
   - Let the countdown reach 0.
   - Contact #1 is immediately dialed via the phone dialer.
   - A 60-second timer begins ticking down. If unacknowledged, Contact #2 is dialed next.
   - Tap **"Acknowledge Alert"** to stop the calling cascade.
6. **Test Damage AI**:
   - Navigate to the Damage tab and select or capture a collision photo.
   - Verify that the identified parts (Bumper, Headlight, Fender) pull matching Pakistani Rupees (PKR) prices from the PakWheels parts catalog for your vehicle.
   - Download the official PDF claim dossier for insurance submission.
