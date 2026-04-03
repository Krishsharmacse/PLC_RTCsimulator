import sys
import os
import time
import random
import asyncio
from typing import List, Dict, Any, Optional
from fastapi import FastAPI, WebSocket, HTTPException, BackgroundTasks
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

# Add simulator source paths to sys.path
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
sys.path.append(os.path.join(BASE_DIR, "Modbus_PLC_Simulator", "src"))
sys.path.append(os.path.join(BASE_DIR, "S7Comm_RTU_Simulator", "src"))

# Try importing the simulators (with fallbacks for environment without dependencies)
MODBUS_AVAILABLE = False
S7COMM_AVAILABLE = False

try:
    import plcSimulator
    import modbusTcpCom
    MODBUS_AVAILABLE = True
except ImportError as e:
    print(f"Warning: Modbus simulator dependencies not found. Using fallback mock data. Error: {e}")

try:
    import rtuSimulator
    import snap7Comm
    S7COMM_AVAILABLE = True
except ImportError as e:
    print(f"Warning: S7Comm simulator dependencies not found. Using fallback mock data. Error: {e}")

app = FastAPI(title="Industrial Digital Twin Bridge")

# Enable CORS for frontend development
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class DeviceStatus(BaseModel):
    id: str
    name: str
    type: str # 'PLC' or 'RTU'
    protocol: str # 'Modbus', 'S7Comm', 'IEC104'
    status: str # 'Online', 'Offline', 'Attacked'
    lastUpdated: float

# --- Mock Data Engine (Always running for demo reliability) ---
class MockDataEngine:
    def __init__(self):
        self.devices = {
            "plc-01": {
                "id": "plc-01",
                "name": "Train Power Controller",
                "type": "PLC",
                "protocol": "Modbus",
                "status": "Online",
                "data": {
                    "coils": [True, False, True, True, False, False, True, False],
                    "registers": [220, 221, 219, 0, 1024, 50, 0, 12],
                }
            },
            "rtu-01": {
                "id": "rtu-01",
                "name": "Onboard Sensor Unit",
                "type": "RTU",
                "protocol": "S7Comm",
                "status": "Online",
                "data": {
                    "speed": 85.5,
                    "temp": 32.4,
                    "pressure": 101.3,
                    "vibration": 0.02
                }
            }
        }
        self.is_attacked = False

    def get_all_devices(self) -> List[Dict]:
        # Add some random fluctuations to data
        self.devices["plc-01"]["data"]["registers"][0] += random.randint(-1, 1)
        self.devices["rtu-01"]["data"]["speed"] += random.uniform(-0.5, 0.5)
        return list(self.devices.values())

    def trigger_attack(self):
        self.is_attacked = True
        self.devices["plc-01"]["status"] = "Attacked"
        # Spoil data
        self.devices["plc-01"]["data"]["registers"][0] = 999 

    def reset_attack(self):
        self.is_attacked = False
        self.devices["plc-01"]["status"] = "Online"

class DemoOrchestrator:
    def __init__(self, engine: MockDataEngine):
        self.engine = engine
        self.is_running = False
        self.current_phase = "IDLE"

    async def run_scenario(self):
        self.is_running = True
        
        # Phase 1: Normal Operation
        self.current_phase = "NORMAL OPERATION"
        print(f"Demo Phase: {self.current_phase}")
        for _ in range(10):
            await asyncio.sleep(1)
            
        # Phase 2: Anomaly Detected
        self.current_phase = "ANOMALY DETECTED"
        print(f"Demo Phase: {self.current_phase}")
        for i in range(5):
            self.engine.devices["rtu-01"]["data"]["speed"] += 5.0
            self.engine.devices["rtu-01"]["data"]["temp"] += 2.0
            await asyncio.sleep(1)

        # Phase 3: Cyber Attack
        self.current_phase = "CYBER ATTACK IN PROGRESS"
        print(f"Demo Phase: {self.current_phase}")
        self.engine.trigger_attack()
        await asyncio.sleep(10)

        # Phase 4: Recovery
        self.current_phase = "EMERGENCY RECOVERY"
        print(f"Demo Phase: {self.current_phase}")
        self.engine.reset_attack()
        self.engine.devices["rtu-01"]["data"]["speed"] = 85.5
        self.engine.devices["rtu-01"]["data"]["temp"] = 32.4
        await asyncio.sleep(5)

        self.is_running = False
        self.current_phase = "IDLE"
        print("Demo Scenario Complete")

mock_engine = MockDataEngine()
demo_orchestrator = DemoOrchestrator(mock_engine)

# --- API Endpoints ---

@app.get("/")
def read_root():
    return {"message": "Industrial Digital Twin Bridge is running"}

@app.get("/api/devices")
def get_devices():
    return mock_engine.get_all_devices()

@app.get("/api/devices/{device_id}")
def get_device_details(device_id: str):
    devices = mock_engine.get_all_devices()
    for d in devices:
        if d["id"] == device_id:
            return d
    raise HTTPException(status_code=404, detail="Device not found")

@app.post("/api/attack/simulate")
def simulate_attack():
    mock_engine.trigger_attack()
    return {"status": "Attack simulated successfully", "alert": "Critical: Register Overflow Detected!"}

@app.post("/api/attack/reset")
def reset_attack():
    mock_engine.reset_attack()
    return {"status": "System restored to normal"}

@app.get("/api/stats")
def get_global_stats():
    return {
        "uptime": time.time(),
        "totalDevices": len(mock_engine.devices),
        "protocolHealth": {
            "Modbus": "Healthy",
            "S7Comm": "Healthy",
            "IEC104": "Standby"
        },
        "systemLoad": f"{random.randint(5, 15)}%",
        "demo": {
            "isRunning": demo_orchestrator.is_running,
            "currentPhase": demo_orchestrator.current_phase
        }
    }

@app.post("/api/demo/start")
async def start_demo(background_tasks: BackgroundTasks):
    if demo_orchestrator.is_running:
        return {"status": "Demo already running"}
    background_tasks.add_task(demo_orchestrator.run_scenario)
    return {"status": "Demo scenario started"}

if __name__ == "__main__":
    import uvicorn
    print("Starting Industrial Digital Twin Bridge...")
    uvicorn.run(app, host="0.0.0.0", port=8000)
