import { useState, useEffect } from 'react';
import { collection, getDocs, doc, getDoc } from 'firebase/firestore';
import { db } from '../services/firebase';

const defaultParametres = {
  etatsRuche: ['Actif', 'Faible', 'Essaim', 'Morte'],
  puissances: ['Très forte', 'Forte', 'Moyenne', 'Faible', 'Très faible'],
  maladies: ['Varroa', 'Loque américaine', 'Loque européenne', 'Nosémose', 'Acariose'],
  predateurs: ['Frelon asiatique', 'Souris', 'Fourmis', 'Oiseau'],
  typesNourrissement: ['Sirop', 'Candi', 'Pain protéiné', 'Pâte'],
  produits: ['Apivar', 'Apistan', 'ApiLife VAR', 'Acide formique', 'Acide oxalique']
};

export const useFirebaseData = () => {
  const [data, setData] = useState({
    ruchers: [],
    parametres: defaultParametres
  });
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    try {
      setLoading(true);

      // Charger les ruchers
      const ruchersSnapshot = await getDocs(collection(db, 'ruchers'));
      const ruchers = [];

      for (const docSnap of ruchersSnapshot.docs) {
        const rucherData = { id: docSnap.id, ...docSnap.data(), ruches: [] };

        // Charger les ruches
        const ruchesSnapshot = await getDocs(
          collection(db, `ruchers/${docSnap.id}/ruches`)
        );

        for (const rucheDoc of ruchesSnapshot.docs) {
          const rucheData = { id: rucheDoc.id, ...rucheDoc.data(), visites: [] };

          // Charger les visites
          const visitesSnapshot = await getDocs(
            collection(db, `ruchers/${docSnap.id}/ruches/${rucheDoc.id}/visites`)
          );

          rucheData.visites = visitesSnapshot.docs.map(v => ({
            id: v.id,
            ...v.data()
          }));

          rucherData.ruches.push(rucheData);
        }

        ruchers.push(rucherData);
      }

      // Charger les paramètres
      const parametresDoc = await getDoc(doc(db, 'configuration', 'parametres'));
      const parametres = parametresDoc.exists()
        ? parametresDoc.data()
        : defaultParametres;

      setData({ ruchers, parametres });
    } catch (error) {
      console.error('Erreur chargement Firebase:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  return { data, loading, loadData };
};