import { Component } from '@angular/core';
import { Router } from '@angular/router';
import {IonContent, IonButton} from '@ionic/angular/standalone';
import { CommonModule } from '@angular/common';
import { UsernameDialogComponent } from '../../components/username-dialog/username-dialog.component';
import { PrivacyDialogComponent } from '../../components/privacy-dialog/privacy-dialog.component';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    IonContent,
    IonButton,
    UsernameDialogComponent,
    PrivacyDialogComponent,
  ],
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage {
  username: string = '';
  showUsernameDialog = false;
  showPrivacyDialog = false;
  permissionsApproved = false;

  constructor(private router: Router) {}

  onUsernameSubmit(name: string) {
    this.username = name;
    this.showUsernameDialog = false;
  }

  onPermissionsApproved() {
    this.permissionsApproved = true;
    this.showPrivacyDialog = false;
    this.router.navigateByUrl('/tabs/tasks');
  }
}
