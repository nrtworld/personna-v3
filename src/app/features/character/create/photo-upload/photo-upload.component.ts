import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StorageService } from '../../../../core/services/storage.service';

@Component({
  selector: 'app-photo-upload',
  templateUrl: './photo-upload.component.html',
  styleUrls: ['./photo-upload.component.scss'],
  standalone: true,
  imports: [CommonModule]
})
export class PhotoUploadComponent {
  @Input() characterId?: string;
  @Output() photoUploaded = new EventEmitter<string>();

  previewUrl: string | null = null;
  isUploading = false;
  error: string | null = null;

  constructor(private storageService: StorageService) {}

  async onFileSelected(event: Event) {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (!file || !this.characterId) return;

    // Prévisualisation
    this.previewUrl = URL.createObjectURL(file);

    try {
      this.isUploading = true;
      this.error = null;
      const photoUrl = await this.storageService.uploadCharacterPhoto(file, this.characterId);
      this.photoUploaded.emit(photoUrl);
    } catch (err) {
      this.error = 'Erreur lors de l\'upload de la photo';
      console.error(err);
    } finally {
      this.isUploading = false;
    }
  }
} 