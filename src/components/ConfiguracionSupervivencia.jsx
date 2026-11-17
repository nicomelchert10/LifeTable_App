export default function ConfiguracionSupervivencia ({
    setCurrentStep,
    experimentData,
    handleConfigChange,
    startTable
}) {
    return  (
        <div className="card screen-transition">
            <h2 className="dashboard-title" style={{    color:  '#F44336'}}>
                Configurar Supervivencia
            </h2>
            <p className="text-muted dashboard-subtitle">
                Ensayo rápido para medir mortalidad. No incluye registro de mudas ni fecundidad
            </p>
            <div className="form-group">
                <label> Nombre del Tratamiento / Dosis:</label>
                <input
                  type="text"
                  name="name"
                  value={experimentData.name}
                  onChange={handleConfigChange}
                  placeholder="Ej: Control, Dosis x,..."/>
            </div>

            <div className="form-group">
                <label> Condiciones (Opcional):</label>
                <input
                  type="text"
                  name="settings"
                  value={experimentData.settings}
                  onChange={handleConfigChange}
                  placeholder="Ej: 25°C, 60% HR"/>
            </div>
            
            <div className="form-group">
                <label>Fecha de Inicio:</label>
                <input 
                  type="date" 
                  name="date" 
                  value={experimentData.date} 
                  onChange={handleConfigChange}/>
            </div>

            <div className="form-group">
                <label>N° Inicial de Individuos (N0)</label>
                <input
                  type="number"
                  name="n0"
                  value={experimentData.n0}
                  onChange={handleConfigChange}
                  placeholder="Ej:30"
                />
            </div>

            {/* SELECTOR DE UNIDAD DE TIEMPO */}

            <div className="form-group fade-in-section" style={{ marginTop:'30px'}}>
                <label className="dev-type-header" style={{ marginBottom: '15px'}}>
                    Unidad de tiempo para las observaciones:
                </label>
                <div className="radio-group-box" style={{ justifyContent: 'center'}}>
                    <label className="radio-label">
                        <input
                          type="radio"
                          name="timeUnit"
                          value="days"
                          checked={experimentData.timeUnit === 'days' || !experimentData.timeUnit}
                          onChange={handleConfigChange}
                          />
                          Días 
                    </label>
                    <label className="radio-label">
                        <input
                          type="radio"
                          name="timeUnit"
                          value="hours"
                          checked={experimentData.timeUnit === 'hours'}
                          onChange={handleConfigChange}
                          />
                          Horas 
                    </label>
                </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '15px', marginTop: '30px'}}>
                <button
                  className="btn-surviv"
                  onClick={startTable}
                  >

                    Comenzar Ensayo &rarr;
                </button>

                <button
                  className="btn-secondary"
                  onClick={() => setCurrentStep('menu')}
                >
                    &larr; Cancelar

                </button>
            </div>
        </div>
    )
}