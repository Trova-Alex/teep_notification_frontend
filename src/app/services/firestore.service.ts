import { Injectable } from '@angular/core';
import {
  Firestore,
  collection,
  collectionData,
  doc,
  getDoc,
  setDoc,
  docData,
  addDoc,
  updateDoc,
  deleteDoc,
  arrayRemove,
  arrayUnion,
  DocumentReference
} from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { Item } from '../models/item.model';
import { RegraNotificacao} from '../models/notification_rule';
import { CompanyFirebase } from '../models/company_firebase';


@Injectable({
  providedIn: 'root'
})
export class FirestoreService {
  private collectionName = 'companies';
  private notificationRulesSubcollection = 'notification_rules';
  private usersList = 'users';
  private monthSystemUse = 'month_system_use';

  constructor(private firestore: Firestore) {}

  getNotificationRules(uid: string) {
    console.log('get itens from firestore for uid:', uid);
    const itemsCollection = collection(this.firestore, `${this.collectionName}/${uid}/${this.notificationRulesSubcollection}`);
    return collectionData(itemsCollection, { idField: 'id' }) as Observable<RegraNotificacao[]>;
  }

  // Adiciona uma nova regra de notificação para uma empresa
  async createNotificationRule(uid: string, regra: RegraNotificacao): Promise<DocumentReference> {
    const rulesCollection = collection(this.firestore, `${this.collectionName}/${uid}/${this.notificationRulesSubcollection}`);
    const regraData = {
      ...regra,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    return await addDoc(rulesCollection, regraData);
  }

  async updateNotificationRule(uid: string, regraId: string, regra: Partial<RegraNotificacao>): Promise<void> {
    const regraDoc = doc(this.firestore, `${this.collectionName}/${uid}/${this.notificationRulesSubcollection}/${regraId}`);
    const regraData = {
      ...regra,
      updatedAt: new Date()
    };
    return await updateDoc(regraDoc, regraData);
  }

  // Lista os usuários de uma empresa
  getCompany(uid: string): Observable<CompanyFirebase> {
    const userDoc = doc(this.firestore, `${this.collectionName}/${uid}`);
    return docData(userDoc, { idField: 'id' }) as Observable<CompanyFirebase>;
  }

  async carregarUsuariosComDados(userRefs: DocumentReference[]): Promise<any[]> {
    const usuarios: any[] = [];
    for (const ref of userRefs) {
      const snap = await getDoc(ref);
      if (snap.exists()) {
        const data = snap.data();
        usuarios.push({
          id: ref.id,
          name: data['name'],
          email: data['email'],
          activ: data['activ'],
          token: data['token']
        });
      }
    }
    return usuarios;
  }

  getMonthSystemUse(companyUid: string, month: string) {
    const colRef = collection(this.firestore, `${this.collectionName}/${companyUid}/${this.monthSystemUse}`);
    const docRef = doc(colRef, month);
    return docData(docRef);
  }

  async deleteUser(companyUid: string, userId: string): Promise<void> {
    // Remove o documento do usuário
    const userDoc = doc(this.firestore, `${this.usersList}/${userId}`);
    await deleteDoc(userDoc);

    // Remove a referência do usuário do array no documento da empresa
    const companyDoc = doc(this.firestore, `${this.collectionName}/${companyUid}`);
    const userRef = doc(this.firestore, `${this.usersList}/${userId}`);
    await updateDoc(companyDoc, {
      users: arrayRemove(userRef)
    });
  }

  async upsertUserToCompany(companyUid: string, user: { id: string; name: string; email: string; token?: string; ativo?: boolean }): Promise<void> {
    if (!user.id) {
      throw new Error('O campo id do usuário é obrigatório.');
    }
    try {
      const userDocRef = doc(this.firestore, `${this.usersList}/${user.id}`);
      const companyDocRef = doc(this.firestore, `${this.collectionName}/${companyUid}`);

      const userSnap = await getDoc(userDocRef);
      if (userSnap.exists()) {
        await updateDoc(userDocRef, {
          ...user,
          updatedAt: new Date()
        });
      } else {
        await setDoc(userDocRef, {
          ...user,
          createdAt: new Date(),
          updatedAt: new Date()
        });
      }

      await updateDoc(companyDocRef, {
        users: arrayUnion(userDocRef)
      });
    } catch (error) {
      console.error('Erro ao criar/atualizar usuário ou adicionar referência à empresa:', error);
      throw error;
    }
  }

  // GET - Listar todos os itens
  getItems(): Observable<Item[]> {
    const itemsCollection = collection(this.firestore, this.collectionName);
    return collectionData(itemsCollection, { idField: 'id' }) as Observable<Item[]>;
  }

  // GET - Obter item por ID
  getItem(id: string): Observable<Item> {
    const itemDoc = doc(this.firestore, `${this.collectionName}/${id}`);
    return docData(itemDoc, { idField: 'id' }) as Observable<Item>;
  }

  // POST - Criar novo item
  async createItem(item: Item): Promise<DocumentReference> {
    const itemsCollection = collection(this.firestore, this.collectionName);
    const itemData = {
      ...item,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    return await addDoc(itemsCollection, itemData);
  }

  // PUT - Atualizar item
  async updateItem(id: string, item: Partial<Item>): Promise<void> {
    const itemDoc = doc(this.firestore, `${this.collectionName}/${id}`);
    const itemData = {
      ...item,
      updatedAt: new Date()
    };
    return await updateDoc(itemDoc, itemData);
  }

  // DELETE - Deletar item
  async deleteItem(uid: string, id: string): Promise<void> {
    const itemDoc = doc(this.firestore, `${this.collectionName}/${uid}/${this.notificationRulesSubcollection}/${id}/`);
    return await deleteDoc(itemDoc);
  }
}
