import { createFileRoute } from '@tanstack/react-router'
import { useState, useEffect } from 'react'
import '../styles/brutalism.css'

export const Route = createFileRoute('/')({
  component: FermentationCalculator,
})

const expDecay = (x: number, a: number, b: number, c: number) => {
  return a * Math.exp(-b * x) + c
}

const params = {
  bulk_fermentation_time: { a: 169.5076, b: 0.1872, c: 1.8512 },
  proofing_time: { a: 124.6544, b: 0.1873, c: 1.3640 },
  total_fermentation_time: { a: 294.3115, b: 0.1873, c: 3.2132 },
}

function formatTime(time: number) {
  const hours = Math.floor(time)
  const minutes = Math.trunc((time * 60) % 60)
  return `${hours}h ${minutes}m`
}

function FermentationCalculator() {
  const [temperature, setTemperature] = useState(23)
  const [hydration, setHydration] = useState(75)
  const [results, setResults] = useState({
    bulkFermentationTime: '',
    proofingTime: '',
    totalFermentationTime: '',
    bulkFermentationTimeDecimal: 0,
    proofingTimeDecimal: 0,
    totalFermentationTimeDecimal: 0,
  })

  useEffect(() => {
    const adjustmentFactor = 75 / hydration

    const bulkTime = expDecay(temperature, params.bulk_fermentation_time.a, params.bulk_fermentation_time.b, params.bulk_fermentation_time.c) * adjustmentFactor
    const proofTime = expDecay(temperature, params.proofing_time.a, params.proofing_time.b, params.proofing_time.c) * adjustmentFactor
    const totalTime = expDecay(temperature, params.total_fermentation_time.a, params.total_fermentation_time.b, params.total_fermentation_time.c) * adjustmentFactor

    setResults({
      bulkFermentationTime: formatTime(bulkTime),
      proofingTime: formatTime(proofTime),
      totalFermentationTime: formatTime(totalTime),
      bulkFermentationTimeDecimal: parseFloat(bulkTime.toFixed(2)),
      proofingTimeDecimal: parseFloat(proofTime.toFixed(2)),
      totalFermentationTimeDecimal: parseFloat(totalTime.toFixed(2)),
    })
  }, [temperature, hydration])

  const handleTemperatureChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTemperature(Number(e.target.value))
  }

  const handleHydrationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setHydration(Number(e.target.value))
  }

  return (
    <div className="brutalist-container">
      <h3 className="brutalist-h3">Fermentation Calculator</h3>
      <div>
        <label htmlFor="temperature">
          Dough Temperature (°C)
        </label>
        <div>
          <input
            type="number"
            name="temperature"
            id="temperature"
            className="brutalist-input"
            value={temperature}
            onChange={handleTemperatureChange}
            step="any"
          />
        </div>
      </div>
      <div>
        <label>Hydration</label>
        <div className="brutalist-radio-group">
          <label className="brutalist-radio-label">
            <input
              type="radio"
              value="75"
              checked={hydration === 75}
              onChange={handleHydrationChange}
              className="brutalist-radio-input"
            />
            75%
          </label>
          <label className="brutalist-radio-label">
            <input
              type="radio"
              value="80"
              checked={hydration === 80}
              onChange={handleHydrationChange}
              className="brutalist-radio-input"
            />
            80%
          </label>
        </div>
      </div>
      <div className="brutalist-results">
        <h4 className="brutalist-h4">Results:</h4>
        <div>
          <p>Bulk Fermentation Time: {results.bulkFermentationTime} ({results.bulkFermentationTimeDecimal} hours)</p>
          <p>Proofing Time: {results.proofingTime} ({results.proofingTimeDecimal} hours)</p>
          <p>Total Fermentation Time: {results.totalFermentationTime} ({results.totalFermentationTimeDecimal} hours)</p>
        </div>
      </div>
    </div>
  )
}
