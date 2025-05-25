// Helper functions for device motion detection

// Check if device motion is available
export const isDeviceMotionAvailable = (): boolean => {
  return typeof DeviceMotionEvent !== 'undefined';
};

// Check if permission is needed (iOS 13+)
export const isPermissionNeeded = (): boolean => {
  return typeof (DeviceMotionEvent as any).requestPermission === 'function';
};

// Request permission for device motion
export const requestMotionPermission = async (): Promise<boolean> => {
  if (!isDeviceMotionAvailable()) {
    return false;
  }
  
  if (isPermissionNeeded()) {
    try {
      const permissionState = await (DeviceMotionEvent as any).requestPermission();
      return permissionState === 'granted';
    } catch (error) {
      console.error('Error requesting motion permission:', error);
      return false;
    }
  }
  
  // For non-iOS devices, permission is implicitly granted
  return true;
};

// Motion detection utilities for fallback (keyboard/mouse)
export const createFallbackControls = (
  onShake: () => void,
  interval: number = 100
) => {
  let lastTriggerTime = 0;
  
  const handleKeyDown = (event: KeyboardEvent) => {
    if (event.key === ' ' || event.key === 'ArrowRight') {
      const now = Date.now();
      if (now - lastTriggerTime > interval) {
        onShake();
        lastTriggerTime = now;
      }
    }
  };
  
  const handleClick = () => {
    const now = Date.now();
    if (now - lastTriggerTime > interval) {
      onShake();
      lastTriggerTime = now;
    }
  };
  
  window.addEventListener('keydown', handleKeyDown);
  window.addEventListener('click', handleClick);
  
  return () => {
    window.removeEventListener('keydown', handleKeyDown);
    window.removeEventListener('click', handleClick);
  };
};