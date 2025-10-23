import { useState, useEffect } from 'react';
import { supabase, Pet, VaccinationRecord, DewormingRecord } from '../lib/supabase';
import { Calendar, Syringe, Pill, Plus } from 'lucide-react';

export default function RecordsPage() {
  const [pets, setPets] = useState<Pet[]>([]);
  const [selectedPet, setSelectedPet] = useState<Pet | null>(null);
  const [vaccinationRecords, setVaccinationRecords] = useState<VaccinationRecord[]>([]);
  const [dewormingRecords, setDewormingRecords] = useState<DewormingRecord[]>([]);
  const [showAddVaccine, setShowAddVaccine] = useState(false);
  const [showAddDeworming, setShowAddDeworming] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPets();
  }, []);

  useEffect(() => {
    if (selectedPet) {
      fetchRecords(selectedPet.id);
    }
  }, [selectedPet]);

  const fetchPets = async () => {
    const { data, error } = await supabase
      .from('pets')
      .select('*')
      .order('name');

    if (!error && data) {
      setPets(data);
      if (data.length > 0) {
        setSelectedPet(data[0]);
      }
    }
    setLoading(false);
  };

  const fetchRecords = async (petId: string) => {
    const { data: vaccineData } = await supabase
      .from('vaccination_records')
      .select('*')
      .eq('pet_id', petId)
      .order('date_administered', { ascending: false });

    const { data: dewormingData } = await supabase
      .from('deworming_records')
      .select('*')
      .eq('pet_id', petId)
      .order('date_administered', { ascending: false });

    if (vaccineData) setVaccinationRecords(vaccineData);
    if (dewormingData) setDewormingRecords(dewormingData);
  };

  const handleAddVaccination = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    const { error } = await supabase.from('vaccination_records').insert({
      pet_id: selectedPet?.id,
      vaccine_name: formData.get('vaccine_name'),
      date_administered: formData.get('date_administered'),
      next_due_date: formData.get('next_due_date'),
      veterinarian: formData.get('veterinarian'),
      notes: formData.get('notes'),
    });

    if (!error) {
      setShowAddVaccine(false);
      if (selectedPet) fetchRecords(selectedPet.id);
      e.currentTarget.reset();
    }
  };

  const handleAddDeworming = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    const { error } = await supabase.from('deworming_records').insert({
      pet_id: selectedPet?.id,
      medicine_name: formData.get('medicine_name'),
      date_administered: formData.get('date_administered'),
      next_due_date: formData.get('next_due_date'),
      dosage: formData.get('dosage'),
      notes: formData.get('notes'),
    });

    if (!error) {
      setShowAddDeworming(false);
      if (selectedPet) fetchRecords(selectedPet.id);
      e.currentTarget.reset();
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-800 mb-8">Pet Health Records</h1>

        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-700 mb-4">Select Your Pet</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {pets.map((pet) => (
              <button
                key={pet.id}
                onClick={() => setSelectedPet(pet)}
                className={`p-4 rounded-xl border-2 transition-all ${
                  selectedPet?.id === pet.id
                    ? 'border-blue-500 bg-blue-50 shadow-md'
                    : 'border-gray-200 hover:border-blue-300'
                }`}
              >
                <img
                  src={pet.image_url || 'https://images.pexels.com/photos/1805164/pexels-photo-1805164.jpeg?auto=compress&cs=tinysrgb&w=400'}
                  alt={pet.name}
                  className="w-full h-32 object-cover rounded-lg mb-3"
                />
                <h3 className="font-bold text-gray-800">{pet.name}</h3>
                <p className="text-sm text-gray-600">{pet.type} • {pet.breed}</p>
                <p className="text-sm text-gray-500">{pet.age} years old</p>
              </button>
            ))}
          </div>
        </div>

        {selectedPet && (
          <>
            <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                  <Syringe className="text-blue-600" />
                  Vaccination Records
                </h2>
                <button
                  onClick={() => setShowAddVaccine(!showAddVaccine)}
                  className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
                >
                  <Plus size={20} />
                  Add Record
                </button>
              </div>

              {showAddVaccine && (
                <form onSubmit={handleAddVaccination} className="bg-blue-50 p-4 rounded-lg mb-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input
                      name="vaccine_name"
                      placeholder="Vaccine Name"
                      required
                      className="px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                    <input
                      name="date_administered"
                      type="date"
                      required
                      className="px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                    <input
                      name="next_due_date"
                      type="date"
                      placeholder="Next Due Date"
                      className="px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                    <input
                      name="veterinarian"
                      placeholder="Veterinarian Name"
                      className="px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                    <input
                      name="notes"
                      placeholder="Notes"
                      className="px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none md:col-span-2"
                    />
                  </div>
                  <div className="flex gap-2 mt-4">
                    <button
                      type="submit"
                      className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
                    >
                      Save
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowAddVaccine(false)}
                      className="bg-gray-300 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-400 transition"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              )}

              <div className="space-y-4">
                {vaccinationRecords.length === 0 ? (
                  <p className="text-gray-500 text-center py-8">No vaccination records yet</p>
                ) : (
                  vaccinationRecords.map((record) => (
                    <div key={record.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-bold text-lg text-gray-800">{record.vaccine_name}</h3>
                          <p className="text-gray-600 mt-1">
                            <Calendar className="inline w-4 h-4 mr-1" />
                            Administered: {new Date(record.date_administered).toLocaleDateString()}
                          </p>
                          {record.next_due_date && (
                            <p className="text-orange-600 mt-1">
                              Next Due: {new Date(record.next_due_date).toLocaleDateString()}
                            </p>
                          )}
                          {record.veterinarian && (
                            <p className="text-gray-600 mt-1">Vet: {record.veterinarian}</p>
                          )}
                          {record.notes && (
                            <p className="text-gray-500 text-sm mt-2">{record.notes}</p>
                          )}
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-lg p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                  <Pill className="text-green-600" />
                  Deworming Records
                </h2>
                <button
                  onClick={() => setShowAddDeworming(!showAddDeworming)}
                  className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition"
                >
                  <Plus size={20} />
                  Add Record
                </button>
              </div>

              {showAddDeworming && (
                <form onSubmit={handleAddDeworming} className="bg-green-50 p-4 rounded-lg mb-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input
                      name="medicine_name"
                      placeholder="Medicine Name"
                      required
                      className="px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 outline-none"
                    />
                    <input
                      name="date_administered"
                      type="date"
                      required
                      className="px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 outline-none"
                    />
                    <input
                      name="next_due_date"
                      type="date"
                      placeholder="Next Due Date"
                      className="px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 outline-none"
                    />
                    <input
                      name="dosage"
                      placeholder="Dosage"
                      className="px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 outline-none"
                    />
                    <input
                      name="notes"
                      placeholder="Notes"
                      className="px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 outline-none md:col-span-2"
                    />
                  </div>
                  <div className="flex gap-2 mt-4">
                    <button
                      type="submit"
                      className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition"
                    >
                      Save
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowAddDeworming(false)}
                      className="bg-gray-300 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-400 transition"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              )}

              <div className="space-y-4">
                {dewormingRecords.length === 0 ? (
                  <p className="text-gray-500 text-center py-8">No deworming records yet</p>
                ) : (
                  dewormingRecords.map((record) => (
                    <div key={record.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-bold text-lg text-gray-800">{record.medicine_name}</h3>
                          <p className="text-gray-600 mt-1">
                            <Calendar className="inline w-4 h-4 mr-1" />
                            Administered: {new Date(record.date_administered).toLocaleDateString()}
                          </p>
                          {record.next_due_date && (
                            <p className="text-orange-600 mt-1">
                              Next Due: {new Date(record.next_due_date).toLocaleDateString()}
                            </p>
                          )}
                          {record.dosage && (
                            <p className="text-gray-600 mt-1">Dosage: {record.dosage}</p>
                          )}
                          {record.notes && (
                            <p className="text-gray-500 text-sm mt-2">{record.notes}</p>
                          )}
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
