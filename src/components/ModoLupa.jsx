import { useState, useEffect } from 'react'

export default function ModoLupa({
  day, currentBug, processIndividual, experimentData, getNextStage, currentCheckIndex, individuals, onUndo
}) {
  const [eggsToday, setEggsToday] = useState('')
  const [localSex, setLocalSex] = useState(null)

  useEffect(() => {
    setEggsToday('')
    setLocalSex(currentBug.sex || null) 
  }, [currentBug.id, currentBug.sex])

  const handleAction = (action) => {
    if (currentBug.stage === 'ADULTO' && !localSex) {
      alert("Por favor, seleccioná Macho o Hembra antes de continuar.");
      return;
    }
    const huevos = eggsToday === '' ? 0 : parseInt(eggsToday)
    processIndividual(action, { sex: localSex, eggs: huevos })
  }

  return (
    <div className="lupa-overlay">
      <div className="lupa-header">

        {/* BOTÓN DESHACER */}
        <div style={{ textAlign:  'center', minHeight:  '40px'}}>
        {currentCheckIndex  > 0 &&  (
          <button className="btn-undo"
             onClick={onUndo}>
              Deshacer anterior
             </button>
        )}
        </div>

        <h2>Día {day + 1}</h2>
        <p className="text-muted" style={{fontSize: '1.2rem'}}>
          Revisando Individuo <strong>#{currentBug.id}</strong>
        </p>
        <p>Estadío Actual: <strong>{currentBug.stage}</strong></p>
      </div>

      <div className="lupa-controls">

        {currentBug.stage === 'ADULTO' && (
          <div style={{background: 'rgba(0,0,0,0.2)', padding: '15px', borderRadius: '8px', marginBottom: '20px'}}>
            <h4 style={{margin: '0 0 10px 0', textAlign: 'center'}}>Sexo del Individuo:</h4>
            <div style={{display: 'flex', gap: '10px', justifyContent: 'center'}}>
              <button
                style={{
                  background: localSex === 'M' ? '#2196F3' : 'transparent',
                  border: '2px solid #2196F3', color: localSex === 'M' ? 'white' : '#2196F3',
                  padding: '10px', borderRadius: '8px', cursor: 'pointer', flex: 1, fontSize: '1.1rem', fontWeight: 'bold'
                }}
                onClick={() => setLocalSex('M')}
                disabled={!!currentBug.sex}
              >♂️ MACHO</button>

              <button
                style={{
                  background: localSex === 'F' ? '#E91E63' : 'transparent',
                  border: '2px solid #E91E63', color: localSex === 'F' ? 'white' : '#E91E63',
                  padding: '10px', borderRadius: '8px', cursor: 'pointer', flex: 1, fontSize: '1.1rem', fontWeight: 'bold'
                }}
                onClick={() => setLocalSex('F')}
                disabled={!!currentBug.sex}
              >♀️ HEMBRA</button>
            </div>
          </div>
        )}

        
        {experimentData.checkFecundity !== false && currentBug.stage === 'ADULTO' && localSex === 'F' && (
          <div style={{background: 'rgba(233, 30, 99, 0.1)', border: '1px solid #E91E63', padding: '15px', borderRadius: '8px', marginBottom: '20px', textAlign: 'center'}}>
            <label style={{fontSize: '1.1rem', display: 'block', marginBottom: '10px', color: '#ffbadd'}}>
              Huevos puestos hoy:
            </label>
            <input
              type="number"
              min="0"
              value={eggsToday}
              onChange={(e) => setEggsToday(e.target.value)}
              style={{fontSize: '1.5rem', textAlign: 'center', width: '120px', padding: '10px', borderRadius: '8px', border: 'none'}}
              placeholder="0"
              //autoFocus
            />
          </div>
        )}

        {(currentBug.stage !== 'ADULTO' || localSex) && (
          <>
            <div className="main-buttons-row">
              <button className="btn-lupa btn-alive" onClick={() => handleAction('ALIVE')}>
                <span className="lupa-label">Sigue Vivo<br/><small>(Sin cambios)</small></span>
              </button>
              <button className="btn-lupa btn-dead" onClick={() => handleAction('DEAD')}>
                <span className="lupa-label">Murió</span>
              </button>
            </div>

            {experimentData.checkMolt && currentBug.stage !== 'ADULTO' && (
              <button className='btn-molt' onClick={() => handleAction('MOLT')}>
                <span className='lupa-label'> MUDÓ (Pasar a {getNextStage(currentBug.stage)})</span>
              </button>
            )}
          </>
        )}

      </div>

      <div className="progress-container">
        <div className="progress-bar" style={{ width: `${((currentCheckIndex + 1) / individuals.length) * 100}%` }} />
      </div>
    </div>
  )
}