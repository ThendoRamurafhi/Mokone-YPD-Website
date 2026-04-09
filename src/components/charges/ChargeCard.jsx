import React from 'react';

const ChargeCard = ({ charge }) => {
  const mapsUrl = "https://www.google.com/maps?q=" + charge.latitude + "," + charge.longitude;
  const telUrl = "tel:" + charge.phone;
  const mailUrl = "mailto:" + charge.email;

  const getStatusStyle = (status) => {
    if (status === 'ACTIVE') {
      return 'bg-green-100 text-green-800';
    }
    return 'bg-red-100 text-red-800';
  };

  const openMap = () => {
    window.open(mapsUrl);
  };

  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 overflow-hidden">
      <div className="bg-emerald-700 p-4">
        <h3 className="text-xl font-bold text-white">
          {charge.chargeName}
        </h3>
        <p className="text-emerald-200 text-sm">
          {charge.district} District
        </p>
      </div>

      <div className="p-6">
        <div className="space-y-3 mb-4">
          {charge.address && (
            <div className="flex items-start space-x-2 text-gray-600">
              <span>📍</span>
              <span>{charge.address}, {charge.city}</span>
            </div>
          )}
          {charge.phone && (
            <div className="flex items-center space-x-2 text-gray-600">
              <span>📞</span>
              <a href={telUrl} className="hover:text-emerald-700">
                {charge.phone}
              </a>
            </div>
          )}
          {charge.email && (
            <div className="flex items-center space-x-2 text-gray-600">
              <span>📧</span>
              <a href={mailUrl} className="hover:text-emerald-700">
                {charge.email}
              </a>
            </div>
          )}
          {charge.pastorName && (
            <div className="flex items-center space-x-2 text-gray-600">
              <span>👤</span>
              <span>Pastor: {charge.pastorName}</span>
            </div>
          )}
          {charge.memberCount && (
            <div className="flex items-center space-x-2 text-gray-600">
              <span>👥</span>
              <span>{charge.memberCount} Members</span>
            </div>
          )}
        </div>

        <div className="flex items-center justify-between">
          <span className={"px-3 py-1 rounded-full text-xs font-semibold " + getStatusStyle(charge.status)}>
            {charge.status}
          </span>
          {charge.latitude && charge.longitude && (
            <button
              onClick={openMap}
              className="bg-emerald-700 hover:bg-emerald-800 text-white text-sm font-semibold py-2 px-4 rounded transition"
            >
              Get Directions
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChargeCard;