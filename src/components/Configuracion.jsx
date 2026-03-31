export default function Configuracion({ 
  setCurrentStep, 
  experimentData, 
  handleConfigChange, 
  startTable,
  treatments 
}) {
  return (
    <div className="card">
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

      <div className ="form-group">
        <label>Tipo de Desarrollo</label>
        <div style={{ display:  'flex', gap:  '20px', marginTop:'10px', background: 'rgba(255,255,255,0.005)',  padding:  '15px', borderRadius:'8px'}}>
          <label style={{ display:  'flex', alignItems: 'center', gap:  '8px',  cursor: 'pointer',  fontWeight: 'normal', margin: 0}}>
            <input
              type="radio"
              name="cycleType"
              value="hemimetabolous"
              checked={experimentData.cycleType === 'hemimetabolous'}
              onChange={handleConfigChange}
            />
            Hemimetábolo (Ninfas)
          </label>
          <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontWeight: 'normal', margin: 0 }}>
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
      
      <div className="form-group" style={{borderLeft: '4px solid #4CAF50', paddingLeft: '10px', background: 'rgba(76, 175, 80, 0.1)', padding: '10px'}}>
        <label>
          N° de Estadíos {experimentData.cycleType === 'hemimetabolous' ? 'Ninfales'  : 'Larvales'}:
        </label>
        <input
          className="tour-estadios" 
          type="number" 
          name="stageCount" 
          value={experimentData.stageCount} 
          onChange={handleConfigChange} 
          placeholder={experimentData.cycleType === 'hemimetabolous'  ? "Ej: 5 (para Dalbulus maidis)" : "Ej: 6 (para Spodoptera)"} 
        />
        <small className="text-muted">
          {experimentData.cycleType === 'hemimetabolous'
            ? "La tabla generará columnas de N1 a Nx."
            : "La tabla generará columnas de L1 a Lx, y agregará automaticamente la Pupa."}
        </small>
      </div>

      <div className="form-group" style={{marginTop: '15px'}}>
        <label style={{marginBottom: 0, cursor: 'pointer'}}>¿Registrar Mudas?</label>
        <input type="checkbox" name="checkMolt" checked={experimentData.checkMolt} onChange={handleConfigChange} style={{width: '20px', height: '20px'}} />
      </div>

      <button className="btn-primary" onClick={startTable}>Comenzar Tabla &rarr;</button>
    </div>
  )
}