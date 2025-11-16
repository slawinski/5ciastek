import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect } from "react";

export const Route = createFileRoute("/fermentation-calculator")({
  component: FermentationCalculator,
});

const expDecay = (x: number, a: number, b: number, c: number) => {
  return a * Math.exp(-b * x) + c;
};

const params = {
  bulk_fermentation_time: { a: 169.5076, b: 0.1872, c: 1.8512 },
  proofing_time: { a: 124.6544, b: 0.1873, c: 1.364 },
  total_fermentation_time: { a: 294.3115, b: 0.1873, c: 3.2132 },
};

function formatTime(time: number) {
  const hours = Math.floor(time);
  const minutes = Math.round((time * 60) % 60);
  return `${hours}h ${minutes}m`;
}

function FermentationCalculator() {
  const [temperature, setTemperature] = useState(23);
  const [hydration, setHydration] = useState(75);
  const [results, setResults] = useState({
    bulkFermentationTime: "",
    proofingTime: "",
    totalFermentationTime: "",
    bulkFermentationTimeDecimal: 0,
    proofingTimeDecimal: 0,
    totalFermentationTimeDecimal: 0,
  });

  useEffect(() => {
    const adjustmentFactor = 75 / hydration;

    const bulkTime =
      expDecay(
        temperature,
        params.bulk_fermentation_time.a,
        params.bulk_fermentation_time.b,
        params.bulk_fermentation_time.c
      ) * adjustmentFactor;
    const proofTime =
      expDecay(
        temperature,
        params.proofing_time.a,
        params.proofing_time.b,
        params.proofing_time.c
      ) * adjustmentFactor;
    const totalTime =
      expDecay(
        temperature,
        params.total_fermentation_time.a,
        params.total_fermentation_time.b,
        params.total_fermentation_time.c
      ) * adjustmentFactor;

    setResults({
      bulkFermentationTime: formatTime(bulkTime),
      proofingTime: formatTime(proofTime),
      totalFermentationTime: formatTime(totalTime),
      bulkFermentationTimeDecimal: parseFloat(bulkTime.toFixed(2)),
      proofingTimeDecimal: parseFloat(proofTime.toFixed(2)),
      totalFermentationTimeDecimal: parseFloat(totalTime.toFixed(2)),
    });
  }, [temperature, hydration]);

  const handleTemperatureChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTemperature(Number(e.target.value));
  };

  const handleHydrationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setHydration(Number(e.target.value));
  };

  return (
    <div className="p-2">
      <h3>Fermentation Calculator</h3>
      <div className="mt-4">
        <label
          htmlFor="temperature"
          className="block text-sm font-medium text-gray-700"
        >
          Dough Temperature (°C)
        </label>
        <div className="mt-1">
          <input
            type="number"
            name="temperature"
            id="temperature"
            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            value={temperature}
            onChange={handleTemperatureChange}
          />
        </div>
      </div>
      <div className="mt-4">
        <label className="block text-sm font-medium text-gray-700">
          Hydration
        </label>
        <div className="mt-1 flex">
          <div className="flex items-center mr-4">
            <input
              id="hydration75"
              name="hydration"
              type="radio"
              value="75"
              checked={hydration === 75}
              onChange={handleHydrationChange}
              className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300"
            />
            <label
              htmlFor="hydration75"
              className="ml-2 block text-sm text-gray-900"
            >
              75%
            </label>
          </div>
          <div className="flex items-center">
            <input
              id="hydration80"
              name="hydration"
              type="radio"
              value="80"
              checked={hydration === 80}
              onChange={handleHydrationChange}
              className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300"
            />
            <label
              htmlFor="hydration80"
              className="ml-2 block text-sm text-gray-900"
            >
              80%
            </label>
          </div>
        </div>
      </div>
      <div className="mt-4">
        <h4 className="text-lg font-medium">Results:</h4>
        <div className="mt-2">
          <p>
            Bulk Fermentation Time: {results.bulkFermentationTime} (
            {results.bulkFermentationTimeDecimal} hours)
          </p>
          <p>
            Proofing Time: {results.proofingTime} ({results.proofingTimeDecimal}{" "}
            hours)
          </p>
          <p>
            Total Fermentation Time: {results.totalFermentationTime} (
            {results.totalFermentationTimeDecimal} hours)
          </p>
        </div>
      </div>
    </div>
  );
}
