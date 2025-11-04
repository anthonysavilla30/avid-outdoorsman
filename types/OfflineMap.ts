
export interface MapRegion {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  latitudeDelta: number;
  longitudeDelta: number;
  downloadDate?: Date;
  size?: number; // in MB
  status: 'available' | 'downloading' | 'downloaded' | 'error';
  progress?: number; // 0-100
}

export interface MapTile {
  x: number;
  y: number;
  z: number; // zoom level
  url: string;
  localPath?: string;
}
