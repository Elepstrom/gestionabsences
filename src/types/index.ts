// Ajout des nouveaux types
export interface RFIDRecord {
  id: string;
  studentId: string;
  timestamp: string;
  type: 'entry' | 'exit';
  deviceId: string;
}

export interface RFIDDevice {
  id: string;
  name: string;
  location: string;
  status: 'active' | 'inactive';
  lastPing: string;
}