import { initializeApp } from 'firebase/app';

const firebaseConfig = {
  apiKey: 'test',
  authDomain: 'test',
  projectId: 'test',
  storageBucket: 'test',
  messagingSenderId: 'test',
  appId: 'test'
};

// Initialize Firebase for all tests
beforeAll(() => {
  initializeApp(firebaseConfig);
}); 