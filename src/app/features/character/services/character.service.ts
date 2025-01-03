import { Injectable, Inject } from '@angular/core';
import { Observable, from } from 'rxjs';
import { Firestore, collection, doc, setDoc, updateDoc } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { Character, NewCharacter } from '../../../models/database.model';

@Injectable({
  providedIn: 'root'
})
export class CharacterService {
  constructor(@Inject('Firestore') private firestore: Firestore) {}

  saveCharacter(character: Partial<Character>): Observable<void> {
    const auth = getAuth();
    const user = auth.currentUser;
    
    if (!user) {
      return new Observable(subscriber => {
        subscriber.error(new Error('Utilisateur non connecté'));
      });
    }

    // Si le personnage n'a pas d'ID, c'est une création
    if (!character.id) {
      const charactersRef = collection(this.firestore, 'characters');
      const newDocRef = doc(charactersRef);
      const newCharacter: NewCharacter = {
        userId: user.uid,
        game: 'Le jeu d\'Aimé', // ou passé en paramètre
        name: character.name || 'Nouveau personnage',
        xp: 0,
        maxHp: character.maxHp || 100,
        currentHp: character.currentHp || 100,
        stats: character.stats || {},
        masteries: character.masteries || [],
        skills: character.skills || [],
        traits: character.traits || [],
        inventory: character.inventory || {
          items: [],
          dices: [],
          currentWeight: 0,
          maxWeight: 50
        },
        notes: character.notes || []
      };

      return from(setDoc(newDocRef, { id: newDocRef.id, ...newCharacter }));
    }

    // Sinon c'est une mise à jour
    const characterRef = doc(this.firestore, 'characters', character.id);
    return from(updateDoc(characterRef, { ...character }));
  }
} 