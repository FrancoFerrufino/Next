import { useRouter } from 'next/router';
import { useEffect, useState, Suspense } from 'react';

export async function generateStaticParams() {
  const res = await fetch(
    'https://vpic.nhtsa.dot.gov/api/vehicles/GetMakesForVehicleType/car?format=json'
  );
  const data = await res.json();

  const paths = data.Results.map((type) => {
    const years = Array.from(
      { length: new Date().getFullYear() - 2014 },
      (_, i) => 2015 + i
    );
    return years.map((year) => ({
      params: { makeId: type.MakeId.toString(), year: year.toString() },
    }));
  }).flat();

  return paths;
}

async function fetchModels(makeId, year) {
  const res = await fetch(
    `https://vpic.nhtsa.dot.gov/api/vehicles/GetModelsForMakeIdYear/makeId/${makeId}/modelyear/${year}?format=json`
  );
  const data = await res.json();
  return data.Results || [];
}

function ResultPageContent({ makeId, year }) {
  const [models, setModels] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadModels() {
      try {
        const models = await fetchModels(makeId, year);
        setModels(models);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching models:', error);
        setModels([]);
        setLoading(false);
      }
    }
    loadModels();
  }, [makeId, year]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        Loading...
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h1 className="text-2xl font-bold mb-4">Vehicle Models for {year}</h1>
      <ul className="space-y-2">
        {models.length > 0 ? (
          models.map((model) => (
            <li
              key={model.Model_ID}
              className="p-2 border border-gray-300 rounded"
            >
              {model.Model_Name}
            </li>
          ))
        ) : (
          <p>No models found for this make and year.</p>
        )}
      </ul>
    </div>
  );
}

export default function ResultPage() {
  const router = useRouter();
  const { makeId, year } = router.query;

  return (
    <Suspense fallback={<div>Loading page...</div>}>
      <ResultPageContent makeId={makeId} year={year} />
    </Suspense>
  );
}
