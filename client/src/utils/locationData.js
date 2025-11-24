// Location data - countries, states, and cities
export const LOCATION_DATA = {
      'India': {
            'Maharashtra': ['Mumbai', 'Pune', 'Nagpur', 'Nashik', 'Aurangabad'],
            'Delhi': ['New Delhi', 'Delhi'],
            'Karnataka': ['Bangalore', 'Mysore', 'Mangalore'],
            'Tamil Nadu': ['Chennai', 'Coimbatore', 'Madurai'],
            'Rajasthan': ['Jaipur', 'Udaipur', 'Jodhpur', 'Jaisalmer'],
            'Goa': ['Panaji', 'Margao', 'Vasco da Gama'],
            'Uttar Pradesh': ['Agra', 'Lucknow', 'Varanasi', 'Noida', 'Hardoi'],
            'West Bengal': ['Kolkata', 'Darjeeling'],
            'Kerala': ['Kochi', 'Trivandrum', 'Munnar'],
            'Gujarat': ['Ahmedabad', 'Surat', 'Vadodara']
      },
      'USA': {
            'California': ['Los Angeles', 'San Francisco', 'San Diego', 'Sacramento'],
            'New York': ['New York City', 'Buffalo', 'Albany'],
            'Texas': ['Houston', 'Dallas', 'Austin', 'San Antonio'],
            'Florida': ['Miami', 'Orlando', 'Tampa'],
            'Nevada': ['Las Vegas', 'Reno'],
            'Massachusetts': ['Boston', 'Cambridge']
      },
      'UK': {
            'England': ['London', 'Manchester', 'Birmingham', 'Liverpool', 'Bristol'],
            'Scotland': ['Edinburgh', 'Glasgow', 'Aberdeen'],
            'Wales': ['Cardiff', 'Swansea'],
            'Northern Ireland': ['Belfast']
      },
      'France': {
            'Île-de-France': ['Paris'],
            'Provence-Alpes-Côte d\'Azur': ['Nice', 'Marseille', 'Cannes'],
            'Auvergne-Rhône-Alpes': ['Lyon'],
            'Nouvelle-Aquitaine': ['Bordeaux']
      },
      'Italy': {
            'Lazio': ['Rome'],
            'Veneto': ['Venice', 'Verona'],
            'Lombardy': ['Milan'],
            'Tuscany': ['Florence', 'Pisa'],
            'Campania': ['Naples']
      },
      'Spain': {
            'Madrid': ['Madrid'],
            'Catalonia': ['Barcelona'],
            'Andalusia': ['Seville', 'Granada'],
            'Valencia': ['Valencia'],
            'Balearic Islands': ['Ibiza', 'Palma']
      },
      'Japan': {
            'Tokyo': ['Tokyo'],
            'Kyoto': ['Kyoto'],
            'Osaka': ['Osaka'],
            'Hiroshima': ['Hiroshima'],
            'Hokkaido': ['Sapporo']
      },
      'Thailand': {
            'Bangkok': ['Bangkok'],
            'Phuket': ['Phuket'],
            'Chiang Mai': ['Chiang Mai'],
            'Chonburi': ['Pattaya'],
            'Krabi': ['Krabi']
      },
      'Australia': {
            'New South Wales': ['Sydney'],
            'Victoria': ['Melbourne'],
            'Queensland': ['Brisbane', 'Gold Coast', 'Cairns'],
            'Western Australia': ['Perth']
      },
      'UAE': {
            'Dubai': ['Dubai'],
            'Abu Dhabi': ['Abu Dhabi'],
            'Sharjah': ['Sharjah']
      }
};

export const getCountryList = () => Object.keys(LOCATION_DATA).sort();

export const getStatesByCountry = (country) => {
      if (!country || !LOCATION_DATA[country]) return [];
      return Object.keys(LOCATION_DATA[country]).sort();
};

export const getCitiesByState = (country, state) => {
      if (!country || !state || !LOCATION_DATA[country] || !LOCATION_DATA[country][state]) return [];
      return LOCATION_DATA[country][state].sort();
};
