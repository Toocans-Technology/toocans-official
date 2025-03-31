import { useState, useEffect } from 'react';

interface Country {
  countryEnName?: string;
  countryName?: string;
  created?: number;
  customOrder?: string;
  domainShortName?: string;
  id?: number;
  nationalCode?: string;
  status?: number;
}

interface Response {
  code?: number;
  data?: Country[];
  msg?: string;
}

export const useCountryCodes = () => {
  const [countryCodes, setCountryCodes] = useState<Country[]>([]);
  const [selectedCountry, setSelectedCountry] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCountryCodes = async () => {
      setLoading(true);
      try {
        const response = await fetch('https://dev-api.bdy.tech/baseConfig/allSupportCountry', {
          method: 'GET',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          }
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const responseData: Response = await response.json();
        console.log('API Response:', responseData);

        if (responseData.data && Array.isArray(responseData.data)) {
          const activeCountries = responseData.data.filter(country => country.status === 1);
          console.log('Active Countries:', activeCountries);

          setCountryCodes(activeCountries);

          if (activeCountries.length > 0) {
            setSelectedCountry(activeCountries[0].nationalCode || '');
          }
        } else {
          console.error('Invalid data format:', responseData);
          setError('Invalid data format received');
        }
      } catch (error) {
        console.error('Error fetching country codes:', error);
        setError('Failed to fetch country codes');
      } finally {
        setLoading(false);
      }
    };

    fetchCountryCodes();
  }, []);

  return { countryCodes, selectedCountry, setSelectedCountry, loading, error };
};