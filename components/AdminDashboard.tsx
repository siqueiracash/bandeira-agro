import React, { useState, useEffect } from 'react';
import { MarketSample, PropertyType } from '../types';
import { getSamples, saveSample, deleteSample } from '../services/storageService';
import { BRAZIL_STATES } from '../constants';

interface AdminDashboardProps {
  onLogout: () => void;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ onLogout }) => {
  const [samples, setSamples] = useState<MarketSample[]>([]);
  const [activeTab, setActiveTab] = useState<'LIST' | 'ADD'>('LIST');
  const [form, setForm] = useState<Partial<MarketSample>>({ type: PropertyType.URBAN, state: '', city: '' });

  useEffect(() => { load(); }, []);

  const load = () => setSamples(getSamples());

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.city || !form.price || !form.areaTotal) return alert('Preencha os campos!');
    
    saveSample({
      type: form.type || PropertyType.URBAN,
      title: 'Amostra Manual',
      address: form.address || '',
      city: form.city,
      state: form.state || 'SP',
      price: Number(form.price),
      areaTotal: Number(form.areaTotal),
      areaBuilt: Number(form.areaBuilt || 0),
      date: new Date().toISOString(),
      source: form.source || 'Equipe',
      urbanSubType: form.urbanSubType,
      ruralActivity: form.ruralActivity
    } as any);
    
    alert('Salvo!');
    setForm({ type: PropertyType.URBAN, state: '', city: '' });
    setActiveTab('LIST');
    load();
  };

  const remove = (id: string) => {
    if (confirm('Excluir?')) { deleteSample(id); load(); }
  };

  return (
    <div className="w-full max-w-6xl animate-fade-in pb-10">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-agro-900">Gestão de Amostras</h2>
        <button onClick={onLogout} className="text-red-600 font-bold border px-3 py-1 rounded">Sair</button>
      </div>

      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex gap-4 mb-6 border-b pb-2">
          <button onClick={() => setActiveTab('LIST')} className={`font-bold ${activeTab === 'LIST' ? 'text-agro-700' : 'text-gray-400'}`}>Listar Amostras</button>
          <button onClick={() => setActiveTab('ADD')} className={`font-bold ${activeTab === 'ADD' ? 'text-agro-700' : 'text-gray-400'}`}>+ Nova Amostra</button>
        </div>

        {activeTab === 'LIST' ? (
          <table className="w-full text-sm text-left">
            <thead>
              <tr className="bg-gray-100"><th className="p-2">Local</th><th className="p-2">Tipo</th><th className="p-2">Valor</th><th className="p-2">Ação</th></tr>
            </thead>
            <tbody>
              {samples.map(s => (
                <tr key={s.id} className="border-b">
                  <td className="p-2">{s.city}/{s.state}</td>
                  <td className="p-2">{s.type === 'URBANO' ? s.urbanSubType : s.ruralActivity}</td>
                  <td className="p-2">R$ {s.price.toLocaleString('pt-BR')}</td>
                  <td className="p-2"><button onClick={() => remove(s.id)} className="text-red-500">Excluir</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <form onSubmit={handleSave} className="grid grid-cols-1 md:grid-cols-2 gap-4">
             <select className="border p-2 rounded" value={form.type} onChange={e => setForm({...form, type: e.target.value as any})}>
               <option value="URBANO">Urbano</option><option value="RURAL">Rural</option>
             </select>
             <input className="border p-2 rounded" placeholder="Cidade" value={form.city} onChange={e => setForm({...form, city: e.target.value})} required />
             <select className="border p-2 rounded" value={form.state} onChange={e => setForm({...form, state: e.target.value})} required>
                <option value="">UF</option>{BRAZIL_STATES.map(s => <option key={s} value={s}>{s}</option>)}
             </select>
             <input className="border p-2 rounded" placeholder="Endereço" value={form.address} onChange={e => setForm({...form, address: e.target.value})} />
             <input className="border p-2 rounded" placeholder="Preço (R$)" type="number" value={form.price || ''} onChange={e => setForm({...form, price: e.target.value as any})} required />
             <input className="border p-2 rounded" placeholder="Área Total" type="number" value={form.areaTotal || ''} onChange={e => setForm({...form, areaTotal: e.target.value as any})} required />
             
             {form.type === 'URBANO' ? (
               <select className="border p-2 rounded" value={form.urbanSubType} onChange={e => setForm({...form, urbanSubType: e.target.value})}>
                 <option value="Apartamento">Apartamento</option><option value="Casa">Casa</option><option value="Terreno">Terreno</option>
               </select>
             ) : (
               <select className="border p-2 rounded" value={form.ruralActivity} onChange={e => setForm({...form, ruralActivity: e.target.value})}>
                 <option value="Lavoura">Lavoura</option><option value="Pasto">Pasto</option>
               </select>
             )}

             <button className="col-span-2 bg-agro-700 text-white p-3 rounded font-bold">Salvar</button>
          </form>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;