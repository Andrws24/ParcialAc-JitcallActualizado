import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { 
  IonHeader, 
  IonToolbar, 
  IonTitle, 
  IonContent, 
  IonButton,
  IonList,
  IonItem,
  IonLabel, 
  IonIcon 
} from '@ionic/angular/standalone';
import { Firestore, doc, getDoc, collection, collectionData, setDoc } from '@angular/fire/firestore';
import { Auth } from '@angular/fire/auth';
import { onAuthStateChanged } from 'firebase/auth';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { FirebaseX } from '@awesome-cordova-plugins/firebase-x/ngx'; // 👈 Importa el plugin

interface Contact {
  id: string;
  name: string;
  phone: string;
}

@Component({
  selector: 'app-home',
  standalone: true,
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
  imports: [
    CommonModule,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonButton,
    IonList,
    IonItem,
    IonLabel
  ],
  providers: [FirebaseX] // 👈 Registra el proveedor del plugin
})
export class HomePage implements OnInit {
  private firestore = inject(Firestore);
  private auth = inject(Auth);
  private router = inject(Router);
  private firebaseX = inject(FirebaseX); // 👈 Inyecta FirebaseX

  userName: string = '';
  contacts$: Observable<Contact[]> | undefined;

  ngOnInit() {
    onAuthStateChanged(this.auth, async (user) => {
      if (user) {
        const userDocRef = doc(this.firestore, `users/${user.uid}`);
        const userSnap = await getDoc(userDocRef);
        const userData = userSnap.data() as { name?: string };
        this.userName = userData?.name ?? '';

        const contactsRef = collection(this.firestore, `users/${user.uid}/contacts`);
        this.contacts$ = collectionData(contactsRef, { idField: 'id' }) as Observable<Contact[]>;

        // ✅ 🔥 Obtener token FCM
        this.firebaseX.getToken()
          .then(async token => {
            console.log('📱 Token FCM:', token);

            // 👉 Guardar token en Firestore
            await setDoc(doc(this.firestore, `users/${user.uid}`), { fcmToken: token }, { merge: true });
          })
          .catch(err => {
            console.error('❌ Error al obtener token FCM:', err);
          });

        // ✅ 📩 Escuchar notificaciones entrantes
        this.firebaseX.onMessageReceived().subscribe(data => {
          console.log('📬 Notificación recibida:', data);
          alert(`🔔 ${data.title}\n${data.body}`);
        });
      }
    });
  }

  goToAddContact() {
    this.router.navigate(['/add-contact']);
  }
}
