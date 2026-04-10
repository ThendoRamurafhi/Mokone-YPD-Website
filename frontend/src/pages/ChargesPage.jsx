import React, { useState } from 'react';
import ChargeCard from '../components/charges/ChargeCard';
import LoadingSpinner from '../components/common/LoadingSpinner';

const ChargesPage = () => {
  const [selectedDistrict, setSelectedDistrict] = useState('ALL');
  const [searchTerm, setSearchTerm] = useState('');
  const [loading] = useState(false);

  const charges = [
    {
      chargeId: 1,
      chargeName: 'Bethel AME Church',
      district: 'Pretoria',
      region: 'Gauteng',
      address: '123 Church Street',
      city: 'Pretoria',
      phone: '+27 12 345 6789',
      email: 'bethel@amechurch.co.za',
      pastorName: 'Rev. John Doe',
      memberCount: 250,
      status: 'ACTIVE',
      latitude: -25.7479,
      longitude: 28.2293,
    },
    {
      chargeId: 2,
      chargeName: 'Emmanuel AME Church',
      district: 'Johannesburg',
      region: 'Gauteng',
      address: '456 Gospel Avenue',
      city: 'Johannesburg',
      phone: '+27 11 234 5678',
      email: 'emmanuel@amechurch.co.za',
      pastorName: 'Pastor Jane Smith',
      memberCount: 180,
      status: 'ACTIVE',
      latitude: -26.2041,
      longitude: 28.0473,
    },
    {
      chargeId: 3,
      chargeName: 'Grace AME Church',
      district: 'Cape Town',
      region: 'Western Cape',
      address: '789 Faith Road',
      city: 'Cape Town',
      phone: '+27 21 345 6789',
      email: 'grace@amechurch.co.za',
      pastorName: 'Rev. Michael Brown',
      memberCount: 320,
      status: 'ACTIVE',
      latitude: -33.9249,
      longitude: 18.4241,
    },
    {
      chargeId: 4,
      chargeName: 'Trinity AME Church',
      district: 'Durban',
      region: 'KwaZulu-Natal',
      address: '321 Hope Street',
      city: 'Durban',
      phone: '+27 31 456 7890',
      email: 'trinity@amechurch.co.za',
      pastorName: 'Pastor Sarah Johnson',
      memberCount: 210,
      status: 'ACTIVE',
      latitude: -29.8587,
      longitude: 31.0218,
    },
    {
      chargeId: 5,
      chargeName: 'Zion AME Church',
      district: 'Pretoria',
      region: 'Gauteng',
      address: '654 Blessing Boulevard',
      city: 'Pretoria',
      phone: '+27 12 456 7890',
      email: 'zion@amechurch.co.za',
      pastorName: 'Rev. David Wilson',
      memberCount: 150,
      status: 'ACTIVE',
      latitude: -25.7479,
      longitude: 28.2293,
    },
    {
      chargeId: 6,
      chargeName: 'Mount Olive AME Church',
      district: 'Johannesburg',
      region: 'Gauteng',
      address: '987 Victory Lane',
      city: 'Johannesburg',
      phone: '+27 11 567 8901',
      email: 'mountolive@amechurch.co.za',
      pastorName: 'Pastor Mary Thompson',
      memberCount: 290,
      status: 'ACTIVE',
      latitude: -26.2041,
      longitude: 28.0473,
    },
  ];

  const districts = ['ALL', 'Pretoria', 'Johannesburg', 'Cape Town', 'Durban'];

  const filteredCharges = charges.filter(charge => {
    const matchesDistrict = selectedDistrict === 'ALL' ||
      charge.district === selectedDistrict;
    const matchesSearch =
      charge.chargeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      charge.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
      charge.pastorName.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesDistrict && matchesSearch;
  });

  return (
    <div>
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-emerald-800 to-emerald-900 text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-5xl font-bold mb-6">Church Finder</h1>
          <p className="text-xl text-emerald-200 max-w-2xl mx-auto">
            Find an AME Church YPD congregation near you.
            We have churches across South Africa.
          </p>
        </div>
      </section>

      {/* Stats Bar */}
      <section className="bg-amber-500 py-8">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-3 gap-8 text-center text-white">
            <div>
              <div className="text-3xl font-bold">{charges.length}</div>
              <div className="text-amber-100">Churches</div>
            </div>
            <div>
              <div className="text-3xl font-bold">
                {charges.reduce((sum, c) => sum + c.memberCount, 0)}+
              </div>
              <div className="text-amber-100">Members</div>
            </div>
            <div>
              <div className="text-3xl font-bold">{districts.length - 1}</div>
              <div className="text-amber-100">Districts</div>
            </div>
          </div>
        </div>
      </section>

      {/* Search and Filter */}
      <section className="bg-white shadow-md py-6">
        <div className="container mx-auto px-4">
          {/* Search Bar */}
          <div className="max-w-md mx-auto mb-6">
            <input
              type="text"
              placeholder="Search by church name, city or pastor..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-emerald-500"
            />
          </div>

          {/* District Filter */}
          <div className="flex flex-wrap gap-3 justify-center">
            {districts.map((district) => (
              <button
                key={district}
                onClick={() => setSelectedDistrict(district)}
                className={`px-6 py-2 rounded-full font-semibold transition ${
                  selectedDistrict === district
                    ? 'bg-emerald-700 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-emerald-100'
                }`}
              >
                {district}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Charges Grid */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          {loading ? (
            <LoadingSpinner />
          ) : filteredCharges.length > 0 ? (
            <>
              <p className="text-gray-600 mb-8 text-center">
                Showing {filteredCharges.length} church{filteredCharges.length !== 1 ? 'es' : ''}
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredCharges.map((charge) => (
                  <ChargeCard key={charge.chargeId} charge={charge} />
                ))}
              </div>
            </>
          ) : (
            <div className="text-center py-16">
              <div className="text-6xl mb-4">⛪</div>
              <h3 className="text-2xl font-bold text-gray-600 mb-2">
                No churches found
              </h3>
              <p className="text-gray-500">
                Try adjusting your search or filter to find
                a church near you.
              </p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default ChargesPage;