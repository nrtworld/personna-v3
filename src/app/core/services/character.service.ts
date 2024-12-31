import { Injectable } from '@angular/core';
import { Character, BaseCharacter } from '../../models/database.model';
import { Observable, from, map } from 'rxjs';
import { AuthService } from './auth.service';
import { 
  getFirestore, 
  collection, 
  query, 
  where, 
  getDocs,
  deleteDoc,
  doc,
  onSnapshot,
  Firestore,
  addDoc,
  updateDoc,
  DocumentData
} from 'firebase/firestore';
import { getApp } from 'firebase/app';

@Injectable({
  providedIn: 'root'
})
export class CharacterService {
  private db: Firestore;

  constructor(private authService: AuthService) {
    this.db = getFirestore(getApp());
  }

  getUserCharacters(): Observable<Character[]> {
    return new Observable(subscriber => {
      const userId = this.authService.getCurrentUser()?.uid;
      if (!userId) {
        subscriber.next([]);
        return;
      }

      const charactersRef = collection(this.db, 'characters');
      const q = query(charactersRef, where('userId', '==', userId));

      const unsubscribe = onSnapshot(q, (querySnapshot) => {
        const characters = querySnapshot.docs
          .map(doc => ({
            ...(doc.data() as BaseCharacter),
            id: doc.id
          }))
          .filter((char): char is Character => {
            return Boolean(
              char.id &&
              char.name &&
              char.game &&
              char.userId &&
              typeof char.xp === 'number'
            );
          });
        subscriber.next(characters);
      }, error => {
        subscriber.error(error);
      });

      return () => unsubscribe();
    });
  }

  async deleteCharacter(id: string): Promise<void> {
    const characterRef = doc(this.db, 'characters', id);
    await deleteDoc(characterRef);
  }

  async addCharacter(character: Omit<Character, 'id'>): Promise<string> {
    const charactersRef = collection(this.db, 'characters');
    const docRef = await addDoc(charactersRef, character);
    return docRef.id;
  }

  async updateCharacter(character: Character & { id: string }): Promise<void> {
    const characterRef = doc(this.db, 'characters', character.id);
    const { id, ...characterData } = character;
    await updateDoc(characterRef, characterData);
  }
} 