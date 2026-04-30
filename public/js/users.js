import { db } from '../../services/firebase.js';
import { collection, doc, setDoc, query, where, getDocs, updateDoc, deleteDoc, orderBy } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-firestore.js";

/**
 * Inscreve um novo usuário na newsletter
 */
export async function subscribeUser(email, name = null) {
    // Gerar um token único para descadastro
    const unsubscribe_token = btoa(email + Date.now()).replace(/=/g, '');

    try {
        // Usando o email como ID do documento para simular "upsert" com onConflict
        const docRef = doc(db, "subscribers", email);
        const data = {
            email,
            name,
            active: true,
            unsubscribe_token,
            created_at: new Date().toISOString()
        };
        await setDoc(docRef, data, { merge: true });
        return [data];
    } catch (error) {
        throw error;
    }
}

/**
 * Desinscreve um usuário via token
 */
export async function unsubscribeUser(token) {
    try {
        const q = query(collection(db, "subscribers"), where("unsubscribe_token", "==", token));
        const querySnapshot = await getDocs(q);
        
        if (querySnapshot.empty) {
            throw new Error("Token não encontrado.");
        }
        
        const docsUpdated = [];
        const updatePromises = [];
        querySnapshot.forEach((document) => {
            const docRef = doc(db, "subscribers", document.id);
            updatePromises.push(updateDoc(docRef, { active: false }));
            docsUpdated.push({ ...document.data(), active: false });
        });
        await Promise.all(updatePromises);
        
        return docsUpdated;
    } catch (error) {
        throw error;
    }
}

/**
 * Lista todos os usuários (Admin)
 */
export async function listSubscribers() {
    try {
        const q = query(collection(db, "subscribers"), orderBy("created_at", "desc"));
        const querySnapshot = await getDocs(q);
        const data = [];
        querySnapshot.forEach((docSnap) => {
            // Se o ID for o email, adicionamos o ID como id da row para manter compatibilidade
            data.push({ id: docSnap.id, ...docSnap.data() });
        });
        return data;
    } catch (error) {
        throw error;
    }
}

/**
 * Remove um usuário permanentemente (Admin)
 */
export async function deleteSubscriber(id) {
    try {
        const docRef = doc(db, "subscribers", id);
        await deleteDoc(docRef);
    } catch (error) {
        throw error;
    }
}
