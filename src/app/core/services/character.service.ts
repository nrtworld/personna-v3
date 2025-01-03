import { Injectable, Inject } from '@angular/core';
import { 
  Firestore, 
  collection, 
  addDoc, 
  doc, 
  updateDoc, 
  deleteDoc, 
  query, 
  where, 
  getDocs,
  onSnapshot,
  DocumentData,
  DocumentReference,
  CollectionReference
} from 'firebase/firestore';
import { Observable, BehaviorSubject, map } from 'rxjs';
import { AuthService } from './auth.service';
import { CharacterCreationState, Mastery } from '../../models/character-creation.model';
import { Character } from '../../models/database.model';

@Injectable({
  providedIn: 'root'
})
export class CharacterService {
  private charactersSubject = new BehaviorSubject<Character[]>([]);
  characters$ = this.charactersSubject.asObservable();

  private currentCharacterSubject = new BehaviorSubject<Character | null>(null);
  currentCharacter$ = this.currentCharacterSubject.asObservable();

  private unsubscribeCharacters?: () => void;
  private unsubscribeCurrentCharacter?: () => void;

  constructor(
    @Inject('Firestore') private firestore: Firestore,
    private authService: AuthService
  ) {
    // Initialiser l'écoute des personnages quand l'utilisateur change
    this.authService.user$.subscribe(user => {
      if (user) {
        this.initCharactersListener(user.uid);
      } else {
        this.cleanupListeners();
        this.charactersSubject.next([]);
        this.currentCharacterSubject.next(null);
      }
    });
  }

  private initCharactersListener(userId: string): void {
    // Nettoyer l'ancien listener si existant
    this.cleanupListeners();

    // Créer la requête pour les personnages de l'utilisateur
    const q = query(
      collection(this.firestore, 'characters'),
      where('userId', '==', userId)
    );

    // Mettre en place le listener temps réel
    this.unsubscribeCharacters = onSnapshot(q, 
      (snapshot) => {
        const characters = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        } as Character));
        this.charactersSubject.next(characters);
      },
      (error) => {
        console.error('Error listening to characters:', error);
        // TODO: Ajouter un service de notification pour informer l'utilisateur
      }
    );
  }

  watchCharacter(characterId: string): Observable<Character | null> {
    // Nettoyer l'ancien listener de personnage si existant
    if (this.unsubscribeCurrentCharacter) {
      this.unsubscribeCurrentCharacter();
    }

    const docRef = doc(this.firestore, 'characters', characterId);
    
    this.unsubscribeCurrentCharacter = onSnapshot(docRef,
      (snapshot) => {
        if (snapshot.exists()) {
          const character = {
            id: snapshot.id,
            ...snapshot.data()
          } as Character;
          this.currentCharacterSubject.next(character);
        } else {
          this.currentCharacterSubject.next(null);
        }
      },
      (error) => {
        console.error('Error listening to character:', error);
        this.currentCharacterSubject.next(null);
      }
    );

    return this.currentCharacter$;
  }

  async addCharacter(characterData: CharacterCreationState): Promise<string> {
    const user = this.authService.getCurrentUser();
    const userId = user?.uid;
    if (!userId) throw new Error('User must be authenticated');

    const character: Omit<Character, 'id'> = {
      userId,
      game: 'default',
      name: characterData.name,
      photo: characterData.photo,
      age: characterData.age,
      xp: 0,
      maxHp: characterData.maxHp,
      currentHp: characterData.currentHp,
      stats: Object.entries(characterData.stats).reduce((acc, [key, stat]) => ({
        ...acc,
        [key]: { ...stat, description: '' }
      }), {}),
      masteries: Object.entries(characterData.masteries).map(([name, level]) => ({
        id: crypto.randomUUID(),
        name,
        level,
        description: ''
      })),
      skills: characterData.skills.map(skill => ({
        ...skill,
        description: '',
        relatedStats: []
      })),
      traits: characterData.traits,
      inventory: characterData.inventory,
      notes: characterData.notes
    };

    try {
      const docRef = await addDoc(collection(this.firestore, 'characters'), character);
      return docRef.id;
    } catch (error) {
      console.error('Error adding character:', error);
      throw error;
    }
  }

  async updateCharacter(id: string, characterData: Partial<Character>): Promise<void> {
    try {
      const docRef = doc(this.firestore, 'characters', id);
      await updateDoc(docRef, characterData);
    } catch (error) {
      console.error('Error updating character:', error);
      throw error;
    }
  }

  async deleteCharacter(id: string): Promise<void> {
    try {
      const docRef = doc(this.firestore, 'characters', id);
      await deleteDoc(docRef);
    } catch (error) {
      console.error('Error deleting character:', error);
      throw error;
    }
  }

  private cleanupListeners(): void {
    if (this.unsubscribeCharacters) {
      this.unsubscribeCharacters();
    }
    if (this.unsubscribeCurrentCharacter) {
      this.unsubscribeCurrentCharacter();
    }
  }

  // Nettoyer les listeners quand le service est détruit
  ngOnDestroy() {
    this.cleanupListeners();
  }

  transformCharacterData(characterData: any): CharacterCreationState {
    return {
      name: characterData.name || '',
      maxHp: characterData.maxHp || 0,
      currentHp: characterData.currentHp || 0,
      stats: characterData.stats || {},
      masteries: Object.fromEntries(
        (characterData.masteries as any[]).map((mastery) => [
          mastery.name,
          mastery.level
        ])
      ),
      skills: characterData.skills || [],
      traits: characterData.traits || [],
      inventory: characterData.inventory || {
        items: [],
        dices: [],
        currentWeight: 0,
        maxWeight: 100
      },
      notes: characterData.notes || []
    };
  }
} 