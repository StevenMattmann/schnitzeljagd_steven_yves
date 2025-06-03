import { Component, EventEmitter, Output } from '@angular/core';
import {IonButton, IonCard, IonCardContent, IonCardHeader, IonCardSubtitle, IonCardTitle, IonInput, IonTitle} from "@ionic/angular/standalone";
import {FormsModule} from "@angular/forms";

@Component({
  selector: 'app-username-dialog',
  standalone: true,
  templateUrl: './username-dialog.component.html',
  styleUrls: ['./username-dialog.component.scss'],
  imports: [
    IonCard,
    IonCardHeader,
    IonCardTitle,
    IonCardSubtitle,
    IonCardContent,
    IonInput,
    IonButton,
    FormsModule,
  ]
})
export class UsernameDialogComponent {
  @Output() usernameSubmit = new EventEmitter<string>();
  @Output() dialogCancel = new EventEmitter<void>();

  username: string = '';

  submitName() {
    if (this.username.trim()) {
      this.usernameSubmit.emit(this.username.trim());
    }
  }

  onCancel() {
    this.dialogCancel.emit();
  }
}
