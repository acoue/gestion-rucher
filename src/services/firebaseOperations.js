import { doc, setDoc, deleteDoc, collection, getDocs } from 'firebase/firestore';
import { db } from './firebase';

// RUCHERS
export const saveRucher = async (rucher) => {
  await setDoc(doc(db, 'ruchers', rucher.id), {
    nom: rucher.nom
  });
};

export const deleteRucher = async (rucherId) => {
  // Supprimer toutes les ruches et leurs visites
  const ruchesSnapshot = await getDocs(collection(db, `ruchers/${rucherId}/ruches`));

  for (const rucheDoc of ruchesSnapshot.docs) {
    // Supprimer toutes les visites de cette ruche
    const visitesSnapshot = await getDocs(
      collection(db, `ruchers/${rucherId}/ruches/${rucheDoc.id}/visites`)
    );

    for (const visiteDoc of visitesSnapshot.docs) {
      await deleteDoc(
        doc(db, `ruchers/${rucherId}/ruches/${rucheDoc.id}/visites`, visiteDoc.id)
      );
    }

    // Supprimer la ruche
    await deleteDoc(doc(db, `ruchers/${rucherId}/ruches`, rucheDoc.id));
  }

  // Supprimer le rucher
  await deleteDoc(doc(db, 'ruchers', rucherId));
};

// RUCHES
export const saveRuche = async (rucherId, ruche) => {
  await setDoc(doc(db, `ruchers/${rucherId}/ruches`, ruche.id), {
    nom: ruche.nom,
    etat: ruche.etat
  });
};

export const deleteRuche = async (rucherId, rucheId) => {
  // Supprimer toutes les visites de cette ruche
  const visitesSnapshot = await getDocs(
    collection(db, `ruchers/${rucherId}/ruches/${rucheId}/visites`)
  );

  for (const visiteDoc of visitesSnapshot.docs) {
    await deleteDoc(
      doc(db, `ruchers/${rucherId}/ruches/${rucheId}/visites`, visiteDoc.id)
    );
  }

  // Supprimer la ruche
  await deleteDoc(doc(db, `ruchers/${rucherId}/ruches`, rucheId));
};

// VISITES
export const saveVisite = async (rucherId, rucheId, visite) => {
  await setDoc(
    doc(db, `ruchers/${rucherId}/ruches/${rucheId}/visites`, visite.id),
    visite
  );
};

export const deleteVisite = async (rucherId, rucheId, visiteId) => {
  await deleteDoc(
    doc(db, `ruchers/${rucherId}/ruches/${rucheId}/visites`, visiteId)
  );
};

// PARAMETRES
export const saveParametres = async (parametres) => {
  await setDoc(doc(db, 'configuration', 'parametres'), parametres);
};