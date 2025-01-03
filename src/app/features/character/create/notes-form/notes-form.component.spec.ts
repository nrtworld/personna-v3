import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NotesFormComponent } from './notes-form.component';
import { ReactiveFormsModule } from '@angular/forms';
import { CharacterNote } from '../../../../models/note.model';

describe('NotesFormComponent', () => {
  let component: NotesFormComponent;
  let fixture: ComponentFixture<NotesFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NotesFormComponent, ReactiveFormsModule]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NotesFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should add new note', () => {
    const newNote = {
      title: 'Test Note',
      content: 'Test Content'
    };

    component.showForm = true;
    component.noteForm.patchValue(newNote);
    component.addNote();

    expect(component.notes.length).toBe(1);
    expect(component.notes[0].title).toBe('Test Note');
    expect(component.notes[0].content).toBe('Test Content');
  });

  it('should edit existing note', () => {
    const note: CharacterNote = {
      id: '1',
      title: 'Original Title',
      content: 'Original Content',
      createdAt: new Date(),
      updatedAt: new Date()
    };

    component.notes = [note];
    component.editNote(note);
    
    component.noteForm.patchValue({
      title: 'Updated Title',
      content: 'Updated Content'
    });
    component.addNote();

    expect(component.notes[0].title).toBe('Updated Title');
    expect(component.notes[0].content).toBe('Updated Content');
    expect(component.notes[0].createdAt).toBe(note.createdAt);
    expect(component.notes[0].updatedAt).not.toBe(note.updatedAt);
  });

  it('should delete note', () => {
    const note: CharacterNote = {
      id: '1',
      title: 'Test Note',
      content: 'Test Content',
      createdAt: new Date(),
      updatedAt: new Date()
    };

    component.notes = [note];
    spyOn(window, 'confirm').and.returnValue(true);
    component.deleteNote(note);

    expect(component.notes.length).toBe(0);
  });

  it('should not delete note when cancelled', () => {
    const note: CharacterNote = {
      id: '1',
      title: 'Test Note',
      content: 'Test Content',
      createdAt: new Date(),
      updatedAt: new Date()
    };

    component.notes = [note];
    spyOn(window, 'confirm').and.returnValue(false);
    component.deleteNote(note);

    expect(component.notes.length).toBe(1);
  });
}); 