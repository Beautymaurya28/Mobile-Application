import { useState, useEffect } from 'react';
import { supabase, Vet, Pet } from '../lib/supabase';
import { MapPin, Star, Phone, Calendar, CheckCircle } from 'lucide-react';

const USER_ID = '00000000-0000-0000-0000-000000000001';

export default function VetsPage() {
  const [vets, setVets] = useState<Vet[]>([]);
  const [pets, setPets] = useState<Pet[]>([]);
  const [selectedVet, setSelectedVet] = useState<Vet | null>(null);
  const [showAppointmentForm, setShowAppointmentForm] = useState(false);
  const [appointmentSuccess, setAppointmentSuccess] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchVets();
    fetchPets();
  }, []);

  const fetchVets = async () => {
    const { data, error } = await supabase
      .from('vets')
      .select('*')
      .order('rating', { ascending: false });

    if (!error && data) {
      setVets(data);
    }
    setLoading(false);
  };

  const fetchPets = async () => {
    const { data } = await supabase
      .from('pets')
      .select('*')
      .order('name');

    if (data) {
      setPets(data);
    }
  };

  const handleConsultDoctor = (vet: Vet) => {
    setSelectedVet(vet);
    setShowAppointmentForm(true);
  };

  const handleAppointmentSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    const appointmentDate = `${formData.get('date')}T${formData.get('time')}:00`;

    const { error } = await supabase.from('appointments').insert({
      user_id: USER_ID,
      pet_id: formData.get('pet_id'),
      vet_id: selectedVet?.id,
      appointment_date: appointmentDate,
      status: 'confirmed',
      reason: formData.get('reason'),
      notes: formData.get('notes'),
    });

    if (!error) {
      setAppointmentSuccess(true);
      setTimeout(() => {
        setAppointmentSuccess(false);
        setShowAppointmentForm(false);
        setSelectedVet(null);
      }, 3000);
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  if (appointmentSuccess) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-teal-50 flex items-center justify-center">
        <div className="bg-white rounded-2xl shadow-2xl p-12 text-center max-w-md">
          <CheckCircle className="w-24 h-24 text-green-500 mx-auto mb-6" />
          <h2 className="text-3xl font-bold text-gray-800 mb-4">Appointment Confirmed!</h2>
          <p className="text-gray-600 mb-2">Your appointment has been successfully booked.</p>
          <p className="text-gray-500 text-sm">We'll send you a reminder before your appointment.</p>
        </div>
      </div>
    );
  }

  if (showAppointmentForm && selectedVet) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-teal-50 to-cyan-50 p-6">
        <div className="max-w-3xl mx-auto">
          <div className="bg-white rounded-2xl shadow-2xl p-8">
            <h2 className="text-3xl font-bold text-gray-800 mb-6">Book Appointment</h2>

            <div className="bg-teal-50 rounded-xl p-6 mb-8">
              <div className="flex gap-4">
                <img
                  src={selectedVet.image_url}
                  alt={selectedVet.name}
                  className="w-24 h-24 rounded-lg object-cover"
                />
                <div>
                  <h3 className="text-xl font-bold text-gray-800">{selectedVet.name}</h3>
                  <p className="text-gray-600">{selectedVet.clinic_name}</p>
                  <p className="text-sm text-gray-500 mt-1">{selectedVet.specialization}</p>
                  <div className="flex items-center gap-2 mt-2">
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    <span className="font-semibold">{selectedVet.rating}</span>
                  </div>
                </div>
              </div>
            </div>

            <form onSubmit={handleAppointmentSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Select Pet
                </label>
                <select
                  name="pet_id"
                  required
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-teal-500 outline-none"
                >
                  <option value="">Choose your pet</option>
                  {pets.map((pet) => (
                    <option key={pet.id} value={pet.id}>
                      {pet.name} ({pet.type})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Date
                  </label>
                  <input
                    type="date"
                    name="date"
                    required
                    min={new Date().toISOString().split('T')[0]}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-teal-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Time
                  </label>
                  <select
                    name="time"
                    required
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-teal-500 outline-none"
                  >
                    <option value="">Select time</option>
                    <option value="09:00">09:00 AM</option>
                    <option value="10:00">10:00 AM</option>
                    <option value="11:00">11:00 AM</option>
                    <option value="12:00">12:00 PM</option>
                    <option value="14:00">02:00 PM</option>
                    <option value="15:00">03:00 PM</option>
                    <option value="16:00">04:00 PM</option>
                    <option value="17:00">05:00 PM</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Reason for Visit
                </label>
                <input
                  type="text"
                  name="reason"
                  placeholder="e.g., Regular checkup, vaccination, etc."
                  required
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-teal-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Additional Notes
                </label>
                <textarea
                  name="notes"
                  rows={3}
                  placeholder="Any additional information or concerns..."
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-teal-500 outline-none resize-none"
                ></textarea>
              </div>

              <div className="flex gap-4">
                <button
                  type="submit"
                  className="flex-1 bg-teal-600 text-white py-3 rounded-lg font-bold hover:bg-teal-700 transition flex items-center justify-center gap-2"
                >
                  <Calendar size={20} />
                  Confirm Appointment
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowAppointmentForm(false);
                    setSelectedVet(null);
                  }}
                  className="px-6 bg-gray-300 text-gray-700 rounded-lg font-bold hover:bg-gray-400 transition"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 to-cyan-50 p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-800 mb-8">Veterinarians Near You</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {vets.map((vet) => (
            <div
              key={vet.id}
              className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow"
            >
              <img
                src={vet.image_url}
                alt={vet.name}
                className="w-full h-48 object-cover"
              />
              <div className="p-6">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="text-xl font-bold text-gray-800">{vet.name}</h3>
                    <p className="text-gray-600 font-semibold">{vet.clinic_name}</p>
                  </div>
                  <div className="flex items-center gap-1 bg-yellow-100 px-3 py-1 rounded-full">
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    <span className="font-bold text-gray-800">{vet.rating}</span>
                  </div>
                </div>

                <div className="space-y-2 mb-4">
                  <p className="text-sm text-gray-600 flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-teal-600" />
                    {vet.address}
                  </p>
                  {vet.phone && (
                    <p className="text-sm text-gray-600 flex items-center gap-2">
                      <Phone className="w-4 h-4 text-teal-600" />
                      {vet.phone}
                    </p>
                  )}
                  <div className="inline-block bg-teal-100 text-teal-800 text-xs font-semibold px-3 py-1 rounded-full">
                    {vet.specialization}
                  </div>
                </div>

                <button
                  onClick={() => handleConsultDoctor(vet)}
                  className="w-full bg-teal-600 text-white py-3 rounded-lg font-bold hover:bg-teal-700 transition flex items-center justify-center gap-2"
                >
                  <Calendar size={20} />
                  Consult Doctor
                </button>
              </div>
            </div>
          ))}
        </div>

        {vets.length === 0 && (
          <div className="text-center py-16">
            <p className="text-gray-500 text-lg">No veterinarians found</p>
          </div>
        )}
      </div>
    </div>
  );
}
