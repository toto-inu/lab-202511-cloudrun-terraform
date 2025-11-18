import { Injectable, OnModuleInit } from '@nestjs/common';
import * as admin from 'firebase-admin';

@Injectable()
export class FirebaseService implements OnModuleInit {
  private app: admin.app.App;

  onModuleInit() {
    const projectId = process.env.FIREBASE_PROJECT_ID;

    if (!projectId) {
      throw new Error('FIREBASE_PROJECT_ID environment variable is not set');
    }

    try {
      // Use Application Default Credentials (ADC) on Cloud Run
      // This automatically uses the service account attached to Cloud Run
      this.app = admin.initializeApp({
        projectId: projectId,
      });

      console.log('Firebase Admin SDK initialized successfully with ADC');
    } catch (error) {
      console.error('Failed to initialize Firebase Admin SDK:', error);
      throw error;
    }
  }

  getAuth(): admin.auth.Auth {
    return this.app.auth();
  }

  async verifyIdToken(token: string): Promise<admin.auth.DecodedIdToken> {
    try {
      return await this.app.auth().verifyIdToken(token);
    } catch (error) {
      throw new Error(`Invalid Firebase ID token: ${error.message}`);
    }
  }
}
