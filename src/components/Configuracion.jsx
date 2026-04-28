export default function Configuracion({ 
  setCurrentStep, 
  experimentData, 
  handleConfigChange, 
  startTable,
  treatments 
}) {
  return (
    <div className="card screen-transition">
      <button className="btn-secondary" onClick={() => {
        if (treatments && treatments.length > 0){
          setCurrentStep('dashboard');
        } else  {
          setCurrentStep('menu');
        }
      }}>&larr; Volver</button>
      
      <h2 style={{textAlign: 'center', margin: '20px 0'}}>Configurar Experimento</h2>
      
      <div className="form-group">
        <label>Nombre del Tratamiento:</label>
        <input className="tour-nombre" type="text" name="name" value={experimentData.name} onChange={handleConfigChange} placeholder="Ej: Control" />
      </div>
      
      <div className="form-group">
        <label>Condiciones del Experimento:</label>
        <input type="text" name="settings" value={experimentData.settings} onChange={handleConfigChange} placeholder="25°C" />
      </div>
      
      <div className="form-group">
        <label>Fecha de Inicio:</label>
        <input type="date" name="date" value={experimentData.date} onChange={handleConfigChange} />
      </div>
      
      <div className="form-group">
        <label>N° Inicial de Individuos (N0):</label>
        <input className="tour-n0" type="number" name="n0" value={experimentData.n0} onChange={handleConfigChange} placeholder="Ej: 30" />
      </div>

      {/* EL CHECKBOX DE MUDAS */}
      <div className="form-group molt-toggle-box" >
        <label className="toggle-label">
          <input 
            type="checkbox" 
            name="checkMolt" 
            checked={experimentData.checkMolt} 
            onChange={handleConfigChange} 
            className="toggle-checkbox" 
          />
          ¿Registrar Mudas (Estadíos inmaduros)?
        </label>
        <p className  = "toggle-helper-text">
          No marques esta opción si el ensayo comienza directamente con individuos adultos.
        </p>
      </div>

      {/* --- CHECKBOX DE FECUNDIDAD --- */}
      <div className="form-group molt-toggle-box" style={{borderLeftColor: '#E91E63'}}>
        <label className="toggle-label">
          <input 
            type="checkbox" 
            name="checkFecundity" 
            checked={experimentData.checkFecundity !== false} // Si es undefined (archivos viejos), asume true
            onChange={handleConfigChange} 
            className="toggle-checkbox"
          />
          ¿Registrar Fecundidad?
        </label>
        <p className="toggle-helper-text">
          Desmarcá esta opción si solo querés evaluar supervivencia (ej. ensayos de toxicidad o longevidad).
        </p>
      </div>

      {/* SECCIÓN CONDICIONAL */}
      {experimentData.checkMolt && (
        <div className="fade-in-section">
          
          <div className ="form-group">
            <label className="dev-type-header">Tipo de Desarrollo</label>
            <div className="radio-group-box">
              <label className="radio-label">
                <input
                  type="radio"
                  name="cycleType"
                  value="hemimetabolous"
                  checked={experimentData.cycleType === 'hemimetabolous'}
                  onChange={handleConfigChange}
                />
                Hemimetábolo (Ninfas)
              </label>
              <label className="radio-label">
                <input
                  type="radio"
                  name="cycleType"
                  value="holometabolous"
                  checked={experimentData.cycleType === 'holometabolous'}
                  onChange={handleConfigChange}
                />
                Holometábolo (Larvas + Pupa)
              </label>
            </div>
          </div>
          
          <div className="form-group stages-box" >
            <label style={{fontWeight: 'bold'}}>
              N° de Estadíos {experimentData.cycleType === 'hemimetabolous' ? 'Ninfales'  : 'Larvales'}:
            </label>
            <input
              className="tour-estadios" 
              type="number" 
              name="stageCount" 
              value={experimentData.stageCount} 
              onChange={handleConfigChange} 
              placeholder={experimentData.cycleType === 'hemimetabolous'  ? "Ej: 5 (para Dalbulus maidis)" : "Ej: 6 (para Spodoptera)"} 
              style={{marginTop: '10px'}}
            />
            <small className="text-muted stages-helper-text">
              {experimentData.cycleType === 'hemimetabolous'
                ? "La tabla generará columnas de N1 a Nx."
                : "La tabla generará columnas de L1 a Lx, y agregará automaticamente la Pupa."}
            </small>
          </div>
          
        </div>
      )}
      {/* ----------------------------------------------------------------- */}

      <button className="btn-primary" onClick={startTable} style={{marginTop: '20px'}}>Comenzar Tabla &rarr;</button>
    </div>
  )
}