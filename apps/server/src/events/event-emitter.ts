/**
 * A simple event emitter for handling application events
 */
export class EventEmitter {
  private listeners: Record<string, Array<(data: any) => void>> = {};

  /**
   * Subscribe to an event
   * @param event The event name
   * @param listener The callback function
   */
  on(event: string, listener: (data: any) => void): void {
    if (!this.listeners[event]) {
      this.listeners[event] = [];
    }
    this.listeners[event].push(listener);
  }

  /**
   * Emit an event with data
   * @param event The event name
   * @param data Data to pass to listeners
   */
  emit(event: string, data: any): void {
    const eventListeners = this.listeners[event];
    if (eventListeners) {
      eventListeners.forEach(listener => {
        listener(data);
      });
    }
  }

  /**
   * Remove a listener from an event
   * @param event The event name
   * @param listenerToRemove The listener function to remove
   */
  off(event: string, listenerToRemove: (data: any) => void): void {
    const eventListeners = this.listeners[event];
    if (eventListeners) {
      this.listeners[event] = eventListeners.filter(
        listener => listener !== listenerToRemove
      );
    }
  }
}

// Create a singleton instance
export const eventEmitter = new EventEmitter();
