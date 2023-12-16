import { Injectable } from '@nestjs/common';
import { Server } from 'socket.io';

export interface ProgressSession {
  token: string;
  total: number;
  counter: number;
  timerId: any;
}

@Injectable()
export class ProgressManagerService {
  public server: Server;
  private storage: Map<string, ProgressSession> = new Map();
  startSession(token: string, total: number, delay = 2000) {
    const currentSession = this.storage.get(token);
    if (currentSession) {
      return;
    }
    const timerId = setInterval(async () => {
      const currentSession: ProgressSession = this.storage.get(token);
      // Protect the functionality: if the current session is missing then do nothing
      if (!currentSession) {
        return;
      }
      // Calculate the progress
      let progress = Math.ceil(
        (currentSession.counter / currentSession.total) * 100,
      );
      // Protect the progress value, it should be less or equal 100
      if (progress > 100) {
        progress = 100;
      }
      // Send the progress. Pay attention that the event name should contain the "token"
      // Client will use this token also
      console.log('this.server', this.server);
      this.server.emit(`progress-${token}`, progress);
    }, delay);
    // Initial Progress Session settings. Token is a key.
    this.storage.set(token, {
      token,
      total,
      counter: 0,
      timerId,
    });
  }

  // This method increases the progress
  step(token: string, value = 1) {
    // Get the current session
    const currentSession: ProgressSession = this.storage.get(token);
    // Do nothing if it doesn't exist
    if (!currentSession) {
      return;
    }
    // Increase the counter
    const counter = currentSession.counter + value;
    // Update the storage
    this.storage.set(token, {
      ...currentSession,
      counter,
    });
  }

  // Stop the session by the token
  stopSession(token: string) {
    // Get the current session
    const currentSession: ProgressSession = this.storage.get(token);
    // Do nothing if it doesn't exist
    if (currentSession) {
      // Stop the current timer
      clearInterval(currentSession.timerId);
      // Remove information regarding the current session from the storage
      this.storage.delete(token);
    }
  }
}
