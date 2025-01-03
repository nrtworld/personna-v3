import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CharacterNote } from '../../../../models/note.model';

@Component({
  selector: 'app-notes-form',
  templateUrl: './notes-form.component.html',
  styleUrls: ['./notes-form.component.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule]
})
export class NotesFormComponent {
  @Input() notes: CharacterNote[] = [];
  @Output() notesChange = new EventEmitter<CharacterNote[]>();

  noteForm: FormGroup;
  editingNote: CharacterNote | null = null;
  showForm = false;

  constructor(private fb: FormBuilder) {
    this.noteForm = this.fb.group({
      title: ['', Validators.required],
      content: ['', Validators.required]
    });
  }

  addNote() {
    if (this.noteForm.valid) {
      const now = new Date();
      const newNote: CharacterNote = {
        ...this.noteForm.value,
        createdAt: now,
        updatedAt: now
      };

      if (this.editingNote) {
        const index = this.notes.findIndex(n => n.id === this.editingNote?.id);
        this.notes[index] = {
          ...this.editingNote,
          ...newNote,
          createdAt: this.editingNote.createdAt,
          updatedAt: now
        };
      } else {
        newNote.id = crypto.randomUUID();
        this.notes.push(newNote);
      }

      this.notesChange.emit(this.notes);
      this.resetForm();
    }
  }

  editNote(note: CharacterNote) {
    this.editingNote = note;
    this.noteForm.patchValue({
      title: note.title,
      content: note.content
    });
    this.showForm = true;
  }

  deleteNote(note: CharacterNote) {
    if (confirm('Êtes-vous sûr de vouloir supprimer cette note ?')) {
      this.notes = this.notes.filter(n => n.id !== note.id);
      this.notesChange.emit(this.notes);
    }
  }

  public resetForm() {
    this.noteForm.reset();
    this.editingNote = null;
    this.showForm = false;
  }

  formatDate(date: Date): string {
    return new Date(date).toLocaleString();
  }
} 