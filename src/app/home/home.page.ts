import { Component, inject, OnInit } from '@angular/core';
import { Firestore, doc, getDoc, collection, collectionData } from '@angular/fire/firestore';
import { Auth } from '@angular/fire/auth';
import { onAuthStateChanged } from 'firebase/auth';
import { Observable } from 'rxjs';
import { IonHeader, IonItem, IonList, IonToolbar, IonContent, IonTitle } from "@ionic/angular/standalone";
import { IonicModule } from '@ionic/angular';
import { Router } from '@angular/router';
// Tipado del contacto (opcional pero recomendado)

interface Contact {
  id: string;
  name: string;
  phone: string;
}

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
  imports : [IonHeader, IonItem, IonList, IonToolbar,IonContent,IonTitle,]
})
export class HomePage implements OnInit {
  private firestore = inject(Firestore);
  private auth = inject(Auth);

  userName: string = '';
  contacts$: Observable<Contact[]> | undefined;

  ngOnInit() {
    onAuthStateChanged(this.auth, async (user) => {
      if (user) {
        // Obtener nombre del usuario desde Firestore
        const userDocRef = doc(this.firestore, `users/${user.uid}`);
        const userSnap = await getDoc(userDocRef);
        const userData = userSnap.data() as { name?: string };
        this.userName = userData?.name ?? '';

        // Cargar contactos del usuario
        const contactsRef = collection(this.firestore, `users/${user.uid}/contacts`);
        this.contacts$ = collectionData(contactsRef, { idField: 'id' }) as Observable<Contact[]>;
      }
    });
  }
}
