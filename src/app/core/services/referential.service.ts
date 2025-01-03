import { Injectable } from '@angular/core';
import { 
  getFirestore,
  collection, 
  doc, 
  getDoc, 
  getDocs, 
  query, 
  where,
  onSnapshot
} from 'firebase/firestore';
import { Observable, BehaviorSubject, map } from 'rxjs';
import { GameReferential } from '../../models/referential.model';

@Injectable({
  providedIn: 'root'
})
export class ReferentialService {
  private currentGameSubject = new BehaviorSubject<GameReferential | null>(null);
  currentGame$ = this.currentGameSubject.asObservable();

  private unsubscribeGame?: () => void;

  private db = getFirestore();

  constructor() {}

  /**
   * Charge les référentiels d'un jeu spécifique
   */
  async loadGameReferential(gameId: string): Promise<void> {
    // Nettoyer l'ancien listener si existant
    this.cleanupListeners();

    const docRef = doc(this.db, 'games', gameId);
    
    this.unsubscribeGame = onSnapshot(docRef,
      (snapshot) => {
        if (snapshot.exists()) {
          const game = {
            id: snapshot.id,
            ...snapshot.data()
          } as GameReferential;
          this.currentGameSubject.next(game);
        } else {
          this.currentGameSubject.next(null);
        }
      },
      (error) => {
        console.error('Error listening to game referential:', error);
        this.currentGameSubject.next(null);
      }
    );
  }

  /**
   * Récupère la liste des jeux disponibles
   */
  async getAvailableGames(): Promise<GameReferential[]> {
    try {
      const querySnapshot = await getDocs(collection(this.db, 'games'));
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as GameReferential));
    } catch (error) {
      console.error('Error getting available games:', error);
      throw error;
    }
  }

  /**
   * Récupère les statistiques disponibles pour le jeu actuel
   */
  getAvailableStats() {
    return this.currentGame$.pipe(
      map(game => game?.stats || [])
    );
  }

  /**
   * Récupère les maîtrises disponibles pour le jeu actuel
   */
  getAvailableMasteries() {
    return this.currentGame$.pipe(
      map(game => game?.masteries || [])
    );
  }

  /**
   * Récupère les compétences disponibles pour le jeu actuel
   */
  getAvailableSkills() {
    return this.currentGame$.pipe(
      map(game => game?.skills || [])
    );
  }

  /**
   * Récupère les traits disponibles pour le jeu actuel
   */
  getAvailableTraits() {
    return this.currentGame$.pipe(
      map(game => game?.traits || [])
    );
  }

  /**
   * Récupère les types d'objets disponibles pour le jeu actuel
   */
  getAvailableItemTypes() {
    return this.currentGame$.pipe(
      map(game => game?.itemTypes || [])
    );
  }

  /**
   * Calcule les bonus/malus appliqués par les traits
   */
  calculateTraitEffects(traitIds: string[]) {
    return this.currentGame$.pipe(
      map(game => {
        if (!game) return {};

        const effects: Record<string, number> = {};
        
        traitIds.forEach(traitId => {
          const trait = game.traits.find(t => t.id === traitId);
          if (trait?.effects) {
            trait.effects.forEach(effect => {
              if (effect.type === 'bonus' || effect.type === 'malus') {
                const value = Number(effect.value) * (effect.type === 'malus' ? -1 : 1);
                effects[effect.target] = (effects[effect.target] || 0) + value;
              }
            });
          }
        });

        return effects;
      })
    );
  }

  private cleanupListeners(): void {
    if (this.unsubscribeGame) {
      this.unsubscribeGame();
    }
  }

  ngOnDestroy() {
    this.cleanupListeners();
  }
} 