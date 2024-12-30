export const mockFirebase = {
  initializeApp: jasmine.createSpy('initializeApp'),
  auth: jasmine.createSpy('auth'),
  firestore: jasmine.createSpy('firestore')
};

export const mockAuth = {
  signInWithEmailAndPassword: jasmine.createSpy('signInWithEmailAndPassword'),
  signOut: jasmine.createSpy('signOut'),
  onAuthStateChanged: jasmine.createSpy('onAuthStateChanged')
};

export const mockFirestore = {
  collection: jasmine.createSpy('collection'),
  doc: jasmine.createSpy('doc'),
  get: jasmine.createSpy('get'),
  set: jasmine.createSpy('set'),
  update: jasmine.createSpy('update'),
  delete: jasmine.createSpy('delete')
}; 