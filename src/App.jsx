import React, { useState, useEffect } from 'react';
import { Plus, Settings, ChevronDown, ChevronRight, Calendar, Trash2, Edit2, Check, X } from 'lucide-react';
import { useFirebaseData } from './hooks/useFirebaseData';
import {
  saveRucher as saveRucherToFirebase,
  deleteRucher as deleteRucherFromFirebase,
  saveRuche as saveRucheToFirebase,
  deleteRuche as deleteRucheFromFirebase,
  saveVisite as saveVisiteToFirebase,
  deleteVisite as deleteVisiteFromFirebase,
  saveParametres as saveParametresToFirebase
} from './services/firebaseOperations';
const App = () => {
  const { data, loading, loadData } = useFirebaseData();
  const [expandedRuchers, setExpandedRuchers] = useState({});
  const [expandedRuches, setExpandedRuches] = useState({});
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState('');
  const [editingItem, setEditingItem] = useState(null);
  const [contextIds, setContextIds] = useState({ rucherId: null, rucheId: null });

  const toggleRucher = (rucherId) => {
    setExpandedRuchers(prev => ({ ...prev, [rucherId]: !prev[rucherId] }));
  };

  const toggleRuche = (rucheId) => {
    setExpandedRuches(prev => ({ ...prev, [rucheId]: !prev[rucheId] }));
  };

  // useEffect(() => {
  //   console.log('Firebase initialisé:', db);
  //   console.log('Données chargées:', data);
  // }, [data]);
  
  const ajouterRucher = async (nom) => {
    try {
      const newRucher = {
        id: Date.now().toString(),
        nom
      };
      await saveRucherToFirebase(newRucher);
      await loadData(); // Recharger les données
    } catch (error) {
      console.error('Erreur ajout rucher:', error);
      alert('Erreur lors de l\'ajout du rucher');
    }
  };

  const modifierRucher = async (rucherId, nom) => {
    try {
      await saveRucherToFirebase({ id: rucherId, nom });
      await loadData();
    } catch (error) {
      console.error('Erreur modification rucher:', error);
      alert('Erreur lors de la modification du rucher');
    }
  };

  const supprimerRucher = async (rucherId) => {
    try {
      await deleteRucherFromFirebase(rucherId);
      await loadData();
    } catch (error) {
      console.error('Erreur suppression rucher:', error);
      alert('Erreur lors de la suppression du rucher');
    }
  };

  const ajouterRuche = async (rucherId, nom, etat) => {
    try {
      const newRuche = {
        id: Date.now().toString(),
        nom,
        etat
      };
      await saveRucheToFirebase(rucherId, newRuche);
      await loadData();
    } catch (error) {
      console.error('Erreur ajout ruche:', error);
      alert('Erreur lors de l\'ajout de la ruche');
    }
  };

  const modifierRuche = async (rucherId, rucheId, nom, etat) => {
    try {
      await saveRucheToFirebase(rucherId, { id: rucheId, nom, etat });
      await loadData();
    } catch (error) {
      console.error('Erreur modification ruche:', error);
      alert('Erreur lors de la modification de la ruche');
    }
  };

  const supprimerRuche = async (rucherId, rucheId) => {
    try {
      await deleteRucheFromFirebase(rucherId, rucheId);
      await loadData();
    } catch (error) {
      console.error('Erreur suppression ruche:', error);
      alert('Erreur lors de la suppression de la ruche');
    }
  };

  const ajouterVisite = async (rucherId, rucheId, visite) => {
    try {
      const newVisite = {
        ...visite,
        id: Date.now().toString()
      };
      await saveVisiteToFirebase(rucherId, rucheId, newVisite);
      await loadData();
    } catch (error) {
      console.error('Erreur ajout visite:', error);
      alert('Erreur lors de l\'ajout de la visite');
    }
  };

  const modifierVisite = async (rucherId, rucheId, visiteId, visite) => {
    try {
      await saveVisiteToFirebase(rucherId, rucheId, { ...visite, id: visiteId });
      await loadData();
    } catch (error) {
      console.error('Erreur modification visite:', error);
      alert('Erreur lors de la modification de la visite');
    }
  };

  const supprimerVisite = async (rucherId, rucheId, visiteId) => {
    try {
      await deleteVisiteFromFirebase(rucherId, rucheId, visiteId);
      await loadData();
    } catch (error) {
      console.error('Erreur suppression visite:', error);
      alert('Erreur lors de la suppression de la visite');
    }
  };

  const updateParametres = async (newParams) => {
    try {
      await saveParametresToFirebase(newParams);
      await loadData();
    } catch (error) {
      console.error('Erreur mise à jour paramètres:', error);
      alert('Erreur lors de la mise à jour des paramètres');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600 mb-4"></div>
          <p className="text-gray-600">Chargement des données...</p>
        </div>
      </div>
    );
  }
return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-amber-600 text-white p-4 shadow-lg sticky top-0 z-10">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold">🐝 Gestion de Rucher</h1>
          <button
            onClick={() => {
              setModalType('parametres');
              setShowModal(true);
            }}
            className="flex items-center gap-2 bg-amber-700 hover:bg-amber-800 px-4 py-2 rounded-lg transition"
          >
            <Settings size={20} />
            Paramètres
          </button>
        </div>
      </header>

      <main className="container mx-auto p-4">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-bold text-gray-800">Mes Ruchers</h2>
          <button
            onClick={() => {
              setEditingItem(null);
              setModalType('rucher');
              setShowModal(true);
            }}
            className="flex items-center gap-2 bg-amber-600 hover:bg-amber-700 text-white px-4 py-2 rounded-lg transition"
          >
            <Plus size={20} />
            Nouveau Rucher
          </button>
        </div>

        {data.ruchers.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg shadow">
            <p className="text-gray-500 mb-4">Aucun rucher enregistré</p>
            <button
              onClick={() => {
                setEditingItem(null);
                setModalType('rucher');
                setShowModal(true);
              }}
              className="text-amber-600 hover:text-amber-700"
            >
              Créer votre premier rucher
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {data.ruchers.map(rucher => (
              <div key={rucher.id} className="bg-white rounded-lg shadow">
                <div className="p-4 border-b border-gray-200">
                  <div className="flex items-center justify-between">
                    <button
                      onClick={() => toggleRucher(rucher.id)}
                      className="flex items-center gap-3 flex-1 text-left"
                    >
                      {expandedRuchers[rucher.id] ? (
                        <ChevronDown className="text-amber-600" size={24} />
                      ) : (
                        <ChevronRight className="text-amber-600" size={24} />
                      )}
                      <div>
                        <h3 className="text-xl font-semibold text-gray-800">{rucher.nom}</h3>
                        <p className="text-sm text-gray-500">{rucher.ruches.length} ruche(s)</p>
                      </div>
                    </button>
                    <div className="flex gap-2">
                      <button
                        onClick={() => {
                          setContextIds({ rucherId: rucher.id, rucheId: null });
                          setEditingItem(null);
                          setModalType('ruche');
                          setShowModal(true);
                        }}
                        className="text-green-600 hover:text-green-700 p-2"
                        title="Ajouter une ruche"
                      >
                        <Plus size={20} />
                      </button>
                      <button
                        onClick={() => {
                          setEditingItem(rucher);
                          setModalType('rucher');
                          setShowModal(true);
                        }}
                        className="text-blue-500 hover:text-blue-700 p-2"
                        title="Modifier"
                      >
                        <Edit2 size={18} />
                      </button>
                      <button
                        onClick={() => {
                          if (confirm(`Supprimer le rucher "${rucher.nom}" et toutes ses ruches ?`)) {
                            supprimerRucher(rucher.id);
                          }
                        }}
                        className="text-red-500 hover:text-red-700 p-2"
                        title="Supprimer"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>
                </div>

                {expandedRuchers[rucher.id] && (
                  <div className="p-4 bg-gray-50">
                    {rucher.ruches.length === 0 ? (
                      <div className="text-center py-6 text-gray-500">
                        <p className="mb-2">Aucune ruche dans ce rucher</p>
                        <button
                          onClick={() => {
                            setContextIds({ rucherId: rucher.id, rucheId: null });
                            setEditingItem(null);
                            setModalType('ruche');
                            setShowModal(true);
                          }}
                          className="text-amber-600 hover:text-amber-700"
                        >
                          Ajouter une ruche
                        </button>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {rucher.ruches.map(ruche => (
                          <div key={ruche.id} className="bg-white rounded-lg shadow-sm">
                            <div className="p-3 border-b border-gray-100">
                              <div className="flex items-center justify-between">
                                <button
                                  onClick={() => toggleRuche(ruche.id)}
                                  className="flex items-center gap-3 flex-1 text-left"
                                >
                                  {expandedRuches[ruche.id] ? (
                                    <ChevronDown className="text-blue-600" size={20} />
                                  ) : (
                                    <ChevronRight className="text-blue-600" size={20} />
                                  )}
                                  <div>
                                    <h4 className="text-lg font-semibold text-gray-800">{ruche.nom}</h4>
                                    <div className="flex items-center gap-2 mt-1">
                                      <span className={`px-2 py-0.5 rounded-full text-xs ${
                                        ruche.etat === 'Actif' ? 'bg-green-100 text-green-800' :
                                        ruche.etat === 'Faible' ? 'bg-yellow-100 text-yellow-800' :
                                        ruche.etat === 'Morte' ? 'bg-red-100 text-red-800' :
                                        'bg-blue-100 text-blue-800'
                                      }`}>
                                        {ruche.etat}
                                      </span>
                                      <span className="text-xs text-gray-500">
                                        {ruche.visites?.length || 0} visite(s)
                                      </span>
                                    </div>
                                  </div>
                                </button>
                                <div className="flex gap-2">
                                  <button
                                    onClick={() => {
                                      setContextIds({ rucherId: rucher.id, rucheId: ruche.id });
                                      setEditingItem(null);
                                      setModalType('visite');
                                      setShowModal(true);
                                    }}
                                    className="text-green-600 hover:text-green-700 p-1"
                                    title="Ajouter une visite"
                                  >
                                    <Plus size={18} />
                                  </button>
                                  <button
                                    onClick={() => {
                                      setContextIds({ rucherId: rucher.id, rucheId: ruche.id });
                                      setEditingItem(ruche);
                                      setModalType('ruche');
                                      setShowModal(true);
                                    }}
                                    className="text-blue-500 hover:text-blue-700 p-1"
                                    title="Modifier"
                                  >
                                    <Edit2 size={16} />
                                  </button>
                                  <button
                                    onClick={() => {
                                      if (confirm(`Supprimer la ruche "${ruche.nom}" ?`)) {
                                        supprimerRuche(rucher.id, ruche.id);
                                      }
                                    }}
                                    className="text-red-500 hover:text-red-700 p-1"
                                    title="Supprimer"
                                  >
                                    <Trash2 size={16} />
                                  </button>
                                </div>
                              </div>
                            </div>

                            {expandedRuches[ruche.id] && (
                              <div className="p-3 bg-gray-50">
                                {!ruche.visites || ruche.visites.length === 0 ? (
                                  <div className="text-center py-4 text-gray-500">
                                    <p className="mb-2 text-sm">Aucune visite enregistrée</p>
                                    <button
                                      onClick={() => {
                                        setContextIds({ rucherId: rucher.id, rucheId: ruche.id });
                                        setEditingItem(null);
                                        setModalType('visite');
                                        setShowModal(true);
                                      }}
                                      className="text-amber-600 hover:text-amber-700 text-sm"
                                    >
                                      Ajouter une visite
                                    </button>
                                  </div>
                                ) : (
                                  <div className="space-y-2">
                                    {ruche.visites.map(visite => (
                                      <div key={visite.id} className="bg-white p-3 rounded border border-gray-200">
                                        <div className="flex items-start gap-3">
                                          <Calendar className="text-amber-600 mt-0.5 flex-shrink-0" size={18} />
                                          <div className="flex-1 min-w-0">
                                            <div className="flex justify-between items-start mb-2">
                                              <div className="flex-1">
                                                <p className="font-semibold text-gray-800 text-sm">
                                                  {new Date(visite.date).toLocaleDateString('fr-FR')}
                                                </p>
                                                <div className="flex gap-1 flex-wrap mt-1">
                                                  {visite.themes.map((theme, i) => (
                                                    <span key={i} className="px-2 py-0.5 bg-amber-100 text-amber-800 rounded-full text-xs">
                                                      {theme}
                                                    </span>
                                                  ))}
                                                </div>
                                              </div>
                                              <div className="flex gap-1 ml-2">
                                                <button
                                                  onClick={() => {
                                                    setContextIds({ rucherId: rucher.id, rucheId: ruche.id });
                                                    setEditingItem(visite);
                                                    setModalType('visite');
                                                    setShowModal(true);
                                                  }}
                                                  className="text-blue-500 hover:text-blue-700 p-1"
                                                  title="Modifier"
                                                >
                                                  <Edit2 size={14} />
                                                </button>
                                                <button
                                                  onClick={() => {
                                                    if (confirm('Supprimer cette visite ?')) {
                                                      supprimerVisite(rucher.id, ruche.id, visite.id);
                                                    }
                                                  }}
                                                  className="text-red-500 hover:text-red-700 p-1"
                                                  title="Supprimer"
                                                >
                                                  <Trash2 size={14} />
                                                </button>
                                              </div>
                                            </div>

                                            {visite.commentaire && (
                                              <p className="text-gray-600 text-sm mb-2">{visite.commentaire}</p>
                                            )}

                                            {visite.controle && (
                                              <div className="mb-2 p-2 bg-blue-50 rounded text-xs">
                                                <h5 className="font-semibold text-blue-900 mb-1">Contrôle</h5>
                                                <p className="text-gray-700">Puissance: {visite.controle.puissance}</p>
                                                {visite.controle.maladies?.length > 0 && (
                                                  <p className="text-gray-700">Maladies: {visite.controle.maladies.join(', ')}</p>
                                                )}
                                                {visite.controle.predateurs?.length > 0 && (
                                                  <p className="text-gray-700">Prédateurs: {visite.controle.predateurs.join(', ')}</p>
                                                )}
                                              </div>
                                            )}

                                            {visite.nourrissement && (
                                              <div className="mb-2 p-2 bg-green-50 rounded text-xs">
                                                <h5 className="font-semibold text-green-900 mb-1">Nourrissement</h5>
                                                <p className="text-gray-700">Type: {visite.nourrissement.type}</p>
                                                <p className="text-gray-700">Quantité: {visite.nourrissement.quantite}</p>
                                              </div>
                                            )}

                                            {visite.traitement && (
                                              <div className="p-2 bg-purple-50 rounded text-xs">
                                                <h5 className="font-semibold text-purple-900 mb-1">Traitement</h5>
                                                <p className="text-gray-700">Maladie: {visite.traitement.maladie}</p>
                                                <p className="text-gray-700">Produit: {visite.traitement.produit}</p>
                                                <p className="text-gray-700">N° Lot: {visite.traitement.numeroLot}</p>
                                              </div>
                                            )}
                                          </div>
                                        </div>
                                      </div>
                                    ))}
                                  </div>
                                )}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </main>

      {showModal && (
        <Modal onClose={() => setShowModal(false)}>
          {modalType === 'rucher' && (
            <RucherForm
              rucher={editingItem}
              onSubmit={(nom) => {
                if (editingItem) {
                  modifierRucher(editingItem.id, nom);
                } else {
                  ajouterRucher(nom);
                }
                setShowModal(false);
                setEditingItem(null);
              }}
              onCancel={() => {
                setShowModal(false);
                setEditingItem(null);
              }}
            />
          )}
          {modalType === 'ruche' && (
            <RucheForm
              etatsRuche={data.parametres.etatsRuche}
              ruche={editingItem}
              onSubmit={(nom, etat) => {
                if (editingItem) {
                  modifierRuche(contextIds.rucherId, editingItem.id, nom, etat);
                } else {
                  ajouterRuche(contextIds.rucherId, nom, etat);
                }
                setShowModal(false);
                setEditingItem(null);
              }}
              onCancel={() => {
                setShowModal(false);
                setEditingItem(null);
              }}
            />
          )}
          {modalType === 'visite' && (
            <VisiteForm
              parametres={data.parametres}
              visite={editingItem}
              onSubmit={(visite) => {
                if (editingItem) {
                  modifierVisite(contextIds.rucherId, contextIds.rucheId, editingItem.id, visite);
                } else {
                  ajouterVisite(contextIds.rucherId, contextIds.rucheId, visite);
                }
                setShowModal(false);
                setEditingItem(null);
              }}
              onCancel={() => {
                setShowModal(false);
                setEditingItem(null);
              }}
            />
          )}
          {modalType === 'parametres' && (
            <ParametresForm
              parametres={data.parametres}
              onSubmit={(newParams) => {
                updateParametres(newParams);
                setShowModal(false);
              }}
              onCancel={() => setShowModal(false)}
            />
          )}
        </Modal>
      )}
    </div>
  );
};

const Modal = ({ onClose, children }) => (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
    <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
      {children}
    </div>
  </div>
);

const RucherForm = ({ rucher, onSubmit, onCancel }) => {
  const [nom, setNom] = useState(rucher?.nom || '');

  return (
    <div className="p-6">
      <h3 className="text-2xl font-bold mb-4">{rucher ? 'Modifier le Rucher' : 'Nouveau Rucher'}</h3>
      <input
        type="text"
        value={nom}
        onChange={(e) => setNom(e.target.value)}
        placeholder="Nom du rucher"
        className="w-full p-3 border rounded-lg mb-4"
      />
      <div className="flex gap-2 justify-end">
        <button onClick={onCancel} className="px-4 py-2 text-gray-600 hover:text-gray-800">
          Annuler
        </button>
        <button
          onClick={() => nom.trim() && onSubmit(nom)}
          className="px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700"
        >
          {rucher ? 'Modifier' : 'Créer'}
        </button>
      </div>
    </div>
  );
};

const RucheForm = ({ etatsRuche, ruche, onSubmit, onCancel }) => {
  const [nom, setNom] = useState(ruche?.nom || '');
  const [etat, setEtat] = useState(ruche?.etat || etatsRuche[0]);

  return (
    <div className="p-6">
      <h3 className="text-2xl font-bold mb-4">{ruche ? 'Modifier la Ruche' : 'Nouvelle Ruche'}</h3>
      <input
        type="text"
        value={nom}
        onChange={(e) => setNom(e.target.value)}
        placeholder="Nom de la ruche"
        className="w-full p-3 border rounded-lg mb-4"
      />
      <select
        value={etat}
        onChange={(e) => setEtat(e.target.value)}
        className="w-full p-3 border rounded-lg mb-4"
      >
        {etatsRuche.map(e => (
          <option key={e} value={e}>{e}</option>
        ))}
      </select>
      <div className="flex gap-2 justify-end">
        <button onClick={onCancel} className="px-4 py-2 text-gray-600 hover:text-gray-800">
          Annuler
        </button>
        <button
          onClick={() => nom.trim() && onSubmit(nom, etat)}
          className="px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700"
        >
          {ruche ? 'Modifier' : 'Créer'}
        </button>
      </div>
    </div>
  );
};

const VisiteForm = ({ parametres, visite, onSubmit, onCancel }) => {
  const [themes, setThemes] = useState(visite?.themes || []);
  const [date, setDate] = useState(visite?.date || new Date().toISOString().split('T')[0]);
  const [commentaire, setCommentaire] = useState(visite?.commentaire || '');

  const [controle, setControle] = useState(visite?.controle || {
    puissance: parametres.puissances[0],
    maladies: [],
    predateurs: []
  });

  const [nourrissement, setNourrissement] = useState(visite?.nourrissement || {
    type: parametres.typesNourrissement[0],
    quantite: ''
  });

  const [traitement, setTraitement] = useState(visite?.traitement || {
    maladie: parametres.maladies[0],
    produit: parametres.produits[0],
    numeroLot: ''
  });

  const handleSubmit = () => {
    const newVisite = {
      themes,
      date,
      commentaire
    };

    if (themes.includes('Contrôle')) {
      newVisite.controle = controle;
    }
    if (themes.includes('Nourrissement')) {
      newVisite.nourrissement = nourrissement;
    }
    if (themes.includes('Traitement')) {
      newVisite.traitement = traitement;
    }

    onSubmit(newVisite);
  };

  const toggleTheme = (theme) => {
    setThemes(prev =>
      prev.includes(theme) ? prev.filter(t => t !== theme) : [...prev, theme]
    );
  };

  return (
    <div className="p-6">
      <h3 className="text-2xl font-bold mb-4">{visite ? 'Modifier la Visite' : 'Nouvelle Visite'}</h3>

      <div className="mb-4">
        <label className="block text-sm font-medium mb-2">Date</label>
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="w-full p-3 border rounded-lg"
        />
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium mb-2">Thèmes de visite</label>
        <div className="flex gap-2 flex-wrap">
          {['Contrôle', 'Nourrissement', 'Traitement'].map(theme => (
            <button
              key={theme}
              onClick={() => toggleTheme(theme)}
              className={`px-4 py-2 rounded-lg transition ${
                themes.includes(theme)
                  ? 'bg-amber-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              {theme}
            </button>
          ))}
        </div>
      </div>

      {themes.includes('Contrôle') && (
        <div className="mb-4 p-4 bg-blue-50 rounded-lg">
          <h4 className="font-semibold mb-3 text-blue-900">Contrôle</h4>
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium mb-1">Puissance</label>
              <select
                value={controle.puissance}
                onChange={(e) => setControle({ ...controle, puissance: e.target.value })}
                className="w-full p-2 border rounded"
              >
                {parametres.puissances.map(p => (
                  <option key={p} value={p}>{p}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Maladies détectées</label>
              <div className="space-y-1">
                {parametres.maladies.map(m => (
                  <label key={m} className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={controle.maladies.includes(m)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setControle({ ...controle, maladies: [...controle.maladies, m] });
                        } else {
                          setControle({ ...controle, maladies: controle.maladies.filter(x => x !== m) });
                        }
                      }}
                      className="rounded"
                    />
                    <span className="text-sm">{m}</span>
                  </label>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Prédateurs observés</label>
              <div className="space-y-1">
                {parametres.predateurs.map(p => (
                  <label key={p} className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={controle.predateurs.includes(p)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setControle({ ...controle, predateurs: [...controle.predateurs, p] });
                        } else {
                          setControle({ ...controle, predateurs: controle.predateurs.filter(x => x !== p) });
                        }
                      }}
                      className="rounded"
                    />
                    <span className="text-sm">{p}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {themes.includes('Nourrissement') && (
        <div className="mb-4 p-4 bg-green-50 rounded-lg">
          <h4 className="font-semibold mb-3 text-green-900">Nourrissement</h4>
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium mb-1">Type</label>
              <select
                value={nourrissement.type}
                onChange={(e) => setNourrissement({ ...nourrissement, type: e.target.value })}
                className="w-full p-2 border rounded"
              >
                {parametres.typesNourrissement.map(t => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Quantité</label>
              <input
                type="text"
                value={nourrissement.quantite}
                onChange={(e) => setNourrissement({ ...nourrissement, quantite: e.target.value })}
                placeholder="ex: 2kg, 1L..."
                className="w-full p-2 border rounded"
              />
            </div>
          </div>
        </div>
      )}

      {themes.includes('Traitement') && (
        <div className="mb-4 p-4 bg-purple-50 rounded-lg">
          <h4 className="font-semibold mb-3 text-purple-900">Traitement</h4>
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium mb-1">Maladie</label>
              <select
                value={traitement.maladie}
                onChange={(e) => setTraitement({ ...traitement, maladie: e.target.value })}
                className="w-full p-2 border rounded"
              >
                {parametres.maladies.map(m => (
                  <option key={m} value={m}>{m}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Produit</label>
              <select
                value={traitement.produit}
                onChange={(e) => setTraitement({ ...traitement, produit: e.target.value })}
                className="w-full p-2 border rounded"
              >
                {parametres.produits.map(p => (
                  <option key={p} value={p}>{p}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Numéro de lot</label>
              <input
                type="text"
                value={traitement.numeroLot}
                onChange={(e) => setTraitement({ ...traitement, numeroLot: e.target.value })}
                placeholder="Numéro de lot"
                className="w-full p-2 border rounded"
              />
            </div>
          </div>
        </div>
      )}

      <div className="mb-4">
        <label className="block text-sm font-medium mb-2">Commentaire</label>
        <textarea
          value={commentaire}
          onChange={(e) => setCommentaire(e.target.value)}
          placeholder="Notes complémentaires..."
          rows="3"
          className="w-full p-3 border rounded-lg"
        />
      </div>

      <div className="flex gap-2 justify-end">
        <button onClick={onCancel} className="px-4 py-2 text-gray-600 hover:text-gray-800">
          Annuler
        </button>
        <button
          onClick={handleSubmit}
          disabled={themes.length === 0}
          className="px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          {visite ? 'Modifier' : 'Enregistrer'}
        </button>
      </div>
    </div>
  );
};

const ParametresForm = ({ parametres, onSubmit, onCancel }) => {
  const [params, setParams] = useState(parametres);
  const [editingCategory, setEditingCategory] = useState(null);
  const [newItem, setNewItem] = useState('');

  const categories = {
    etatsRuche: 'États de ruche',
    puissances: 'Puissances',
    maladies: 'Maladies',
    predateurs: 'Prédateurs',
    typesNourrissement: 'Types de nourrissement',
    produits: 'Produits de traitement'
  };

  const addItem = (category) => {
    if (newItem.trim() && !params[category].includes(newItem.trim())) {
      setParams({
        ...params,
        [category]: [...params[category], newItem.trim()]
      });
      setNewItem('');
    }
  };

  const removeItem = (category, item) => {
    setParams({
      ...params,
      [category]: params[category].filter(i => i !== item)
    });
  };

  return (
    <div className="p-6">
      <h3 className="text-2xl font-bold mb-4">Paramètres</h3>

      <div className="space-y-6 max-h-[60vh] overflow-y-auto">
        {Object.entries(categories).map(([key, label]) => (
          <div key={key} className="border-b pb-4">
            <h4 className="font-semibold mb-3 text-lg">{label}</h4>
            <div className="space-y-2">
              {params[key].map((item, index) => (
                <div key={index} className="flex items-center justify-between bg-gray-50 p-2 rounded">
                  <span className="text-sm">{item}</span>
                  <button
                    onClick={() => removeItem(key, item)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <X size={16} />
                  </button>
                </div>
              ))}
            </div>

            {editingCategory === key ? (
              <div className="mt-3 flex gap-2">
                <input
                  type="text"
                  value={newItem}
                  onChange={(e) => setNewItem(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && addItem(key)}
                  placeholder="Nouvelle valeur"
                  className="flex-1 p-2 border rounded"
                  autoFocus
                />
                <button
                  onClick={() => addItem(key)}
                  className="px-3 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                >
                  <Check size={18} />
                </button>
                <button
                  onClick={() => {
                    setEditingCategory(null);
                    setNewItem('');
                  }}
                  className="px-3 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
                >
                  <X size={18} />
                </button>
              </div>
            ) : (
              <button
                onClick={() => setEditingCategory(key)}
                className="mt-3 text-sm text-amber-600 hover:text-amber-700 flex items-center gap-1"
              >
                <Plus size={16} />
                Ajouter
              </button>
            )}
          </div>
        ))}
      </div>

      <div className="flex gap-2 justify-end mt-6 pt-4 border-t">
        <button onClick={onCancel} className="px-4 py-2 text-gray-600 hover:text-gray-800">
          Annuler
        </button>
        <button
          onClick={() => onSubmit(params)}
          className="px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700"
        >
          Enregistrer
        </button>
      </div>
    </div>
  );
};

export default App;