import { useState, useEffect } from 'react'
import { ArrowLeft } from 'lucide-react'
import toast from 'react-hot-toast'

export default function ModoLupa({
  day, currentBug, processIndividual, experimentData, getNextStage, currentCheckIndex, individuals, onUndo, onCancel
}) {
  const [eggsToday, setEggsToday] = useState('')
  const [localSex, setLocalSex] = useState(null)

  useEffect(() => {
    setEggsToday('')
    setLocalSex(currentBug.sex || null) 
  }, [currentBug.id, currentBug.sex])

  const handleAction = (action) => {
    if (currentBug.stage === 'ADULTO' && !localSex) {
      toast.error("Por favor, seleccioná Macho o Hembra antes de continuar.");
      return;
    }
    const huevos = eggsToday === '' ? 0 : parseInt(eggsToday)
    processIndividual(action, { sex: localSex, eggs: huevos })
  }

  // LÓGICA DE CONFIRMACIÓN CON TOAST INTERACTIVO
  const handleCancelReview = () => {
    toast((t) => (
      <div style={{ textAlign: 'center' }}>
        <p style={{ margin: '0 0 10px 0', fontWeight: 'bold', fontSize: '1.1rem', color: '#fff' }}>
          ¿Salir sin guardar?
        </p>
        <p style={{ margin: '0 0 15px 0', fontSize: '0.9rem', color: '#aaa' }}>
          Se perderá todo el progreso de la revisión de hoy.
        </p>
        <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
          <button 
            onClick={() => toast.dismiss(t.id)}
            style={{ 
              background: 'transparent', color: '#fff', border: '1px solid #666', 
              padding: '8px 16px', borderRadius: '6px', fontSize: '0.9rem', 
              cursor: 'pointer', fontWeight: '500', margin: 0
            }}
          >
            No, seguir
          </button>
          <button 
            onClick={() => {
              toast.dismiss(t.id);
              if (onCancel) onCancel();
            }}
            style={{ 
              background: '#ff5252', color: '#ffffff', border: 'none', 
              padding: '8px 16px', borderRadius: '6px', fontSize: '0.9rem', 
              cursor: 'pointer', fontWeight: 'bold', margin: 0
            }}
          >
            Sí, salir
          </button>
        </div>
      </div>
    ), { 
      duration: Infinity, 
      id: 'confirm-cancel',
      style: { background: '#2a2a2a', border: '1px solid #444', padding: '20px' }
    });
  }

  return (
    <div className="lupa-overlay screen-transition">
      <div className="lupa-header">
        
        {/* BARRA SUPERIOR: Cancelar a la izquierda, Deshacer al medio */}
        <div style={{ position: 'relative', display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '40px', marginBottom: '10px' }}>
          <button className="btn-cancel-review" onClick={handleCancelReview} style={{ position: 'absolute', left: 0 }}>
            <ArrowLeft size={18} /> Cancelar Revisión
          </button>

          {currentCheckIndex > 0 && (
            <button className="btn-undo" onClick={onUndo} style={{ margin: 0 }}>
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
              
              {/* BOTONES DE SEXO (DISEÑO ORIGINAL FUNCIONAL) */}
              <button
                style={{
                  background: localSex === 'M' ? '#2196F3' : 'transparent',
                  border: '2px solid #2196F3', color: localSex === 'M' ? 'white' : '#2196F3',
                  padding: '10px', borderRadius: '8px', cursor: 'pointer', flex: 1, fontSize: '1.1rem', fontWeight: 'bold',
                  //opacity: !!currentBug.sex ? 0.5 : 1 // Lo hace un poco transparente si ya estaba bloqueado
                }}
                onClick={() => setLocalSex('M')}
                disabled={!!currentBug.sex}
              >♂️ MACHO</button>

              <button
                style={{
                  background: localSex === 'F' ? '#E91E63' : 'transparent',
                  border: '2px solid #E91E63', color: localSex === 'F' ? 'white' : '#E91E63',
                  padding: '10px', borderRadius: '8px', cursor: 'pointer', flex: 1, fontSize: '1.1rem', fontWeight: 'bold',
                  //opacity: !!currentBug.sex ? 0.5 : 1
                }}
                onClick={() => setLocalSex('F')}
                disabled={!!currentBug.sex}
              >♀️ HEMBRA</button>

            </div>
          </div>
        )}

        {/* INPUT DE HUEVOS */}
        {experimentData.checkFecundity !== false && currentBug.stage === 'ADULTO' && localSex === 'F' && (
          <div style={{background: 'rgba(233, 30, 99, 0.1)', border: '1px solid #E91E63', padding: '15px', borderRadius: '8px', marginBottom: '20px', textAlign: 'center'}}>
            <label style={{fontSize: '1.1rem', display: 'block', marginBottom: '10px', color: '#ffbadd'}}>
              Huevos puestos hoy:
            </label>
            <input
              type="number" min="0" value={eggsToday} onChange={(e) => setEggsToday(e.target.value)}
              style={{fontSize: '1.5rem', textAlign: 'center', width: '120px', padding: '10px', borderRadius: '8px', border: 'none'}}
              placeholder="0"
            />
          </div>
        )}

        {/* BOTONES DE SUPERVIVENCIA */}
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