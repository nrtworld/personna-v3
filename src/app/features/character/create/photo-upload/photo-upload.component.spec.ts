import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PhotoUploadComponent } from './photo-upload.component';
import { StorageService } from '../../../../core/services/storage.service';

describe('PhotoUploadComponent', () => {
  let component: PhotoUploadComponent;
  let fixture: ComponentFixture<PhotoUploadComponent>;
  let storageService: jasmine.SpyObj<StorageService>;

  beforeEach(async () => {
    const spy = jasmine.createSpyObj('StorageService', ['uploadCharacterPhoto']);
    spy.uploadCharacterPhoto.and.returnValue(Promise.resolve('photo-url'));

    await TestBed.configureTestingModule({
      imports: [PhotoUploadComponent],
      providers: [
        { provide: StorageService, useValue: spy }
      ]
    }).compileComponents();

    storageService = TestBed.inject(StorageService) as jasmine.SpyObj<StorageService>;
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PhotoUploadComponent);
    component = fixture.componentInstance;
    component.characterId = 'test-id';
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should handle file selection', async () => {
    const file = new File([''], 'test.jpg', { type: 'image/jpeg' });
    const event = { target: { files: [file] } } as unknown as Event;
    
    spyOn(component.photoUploaded, 'emit');
    await component.onFileSelected(event);

    expect(storageService.uploadCharacterPhoto).toHaveBeenCalledWith(file, 'test-id');
    expect(component.photoUploaded.emit).toHaveBeenCalledWith('photo-url');
  });

  it('should handle upload error', async () => {
    storageService.uploadCharacterPhoto.and.rejectWith(new Error('Upload failed'));
    
    const file = new File([''], 'test.jpg', { type: 'image/jpeg' });
    const event = { target: { files: [file] } } as unknown as Event;
    
    await component.onFileSelected(event);
    
    expect(component.error).toBeTruthy();
    expect(component.isUploading).toBeFalse();
  });
}); 