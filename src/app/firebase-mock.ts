export const mockFirestore = {
  collection: jasmine.createSpy('collection'),
  doc: jasmine.createSpy('doc'),
  onSnapshot: jasmine.createSpy('onSnapshot'),
  getDocs: jasmine.createSpy('getDocs')
}; 