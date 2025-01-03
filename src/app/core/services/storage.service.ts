import { Injectable } from '@angular/core';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { getApp } from 'firebase/app';

@Injectable({
  providedIn: 'root'
})
export class StorageService {
  private storage = getStorage(getApp());

  async uploadCharacterPhoto(file: File, characterId: string): Promise<string> {
    const fileRef = ref(this.storage, `characters/${characterId}/photo`);
    await uploadBytes(fileRef, file);
    return getDownloadURL(fileRef);
  }
} 