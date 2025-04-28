import { Component, inject } from '@angular/core';
import { Firestore, collection, query, where, getDocs, doc, setDoc } from '@angular/fire/firestore';
import { Auth } from '@angular/fire/auth';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { IonicModule, ToastController } from '@ionic/angular';
import { CommonModule } from '@angular/common';

interface UserData {
  name: string;
  phone: string;
}

@Component({
  selector: 'app-add-contact',
  standalone: true,
  imports: [CommonModule, IonicModule, ReactiveFormsModule],
  templateUrl: './add-contact.page.html',
  styleUrls: ['./add-contact.page.scss']
})
export class AddContactPage {
  private firestore = inject(Firestore);
  private auth = inject(Auth);
  private toastCtrl = inject(ToastController);
  private fb = inject(FormBuilder);

  form: FormGroup = this.fb.group({
    phone: ['', [Validators.required, Validators.pattern('^[0-9]{10}$')]]
  });

  async addContact() {
    const phone = this.form.value.phone;
    const user = this.auth.currentUser;

    if (!user) return;

    const usersRef = collection(this.firestore, 'users');
    const q = query(usersRef, where('phone', '==', phone));
    const snapshot = await getDocs(q);

    if (snapshot.empty) {
      this.showToast('❌ Número no registrado.');
      return;
    }

    const contactDoc = snapshot.docs[0];
    const contactData = contactDoc.data() as UserData;

    const contactRef = doc(this.firestore, `users/${user.uid}/contacts/${contactDoc.id}`);
    await setDoc(contactRef, {
      name: contactData.name,
      phone: contactData.phone
    });

    this.showToast('✅ Contacto agregado.');
    this.form.reset();
  }

  private async showToast(message: string) {
    const toast = await this.toastCtrl.create({
      message,
      duration: 2000,
      position: 'top',
      color: 'primary'
    });
    await toast.present();
  }
}