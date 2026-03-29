export default function MenuPrincipal ({setCurrentStep, loadSession}){
    return(
        <div className="card" style={{textAlign: 'center', marginTop: '100px'}}>
          <h1>LifeTable App </h1>
          <p className="text-muted">Seguimiento individual de cohortes y cálculo de tabla de vida</p>
          <div style={{marginTop: '30px'}}>
            <button className="btn-primary" onClick={() => setCurrentStep('setup')}>
              + Nuevo Experimento
            </button>
            {/* BOTÓN DE CARGAR SESIÓN */}
            <label className="btn-upload">
              Cargar Respaldo del Ensayo
              <input
                type="file"
                accept=".json"
                onChange={loadSession}
                style={{display:'none'}}/>
            </label>
            <small className="text-muted" style={{marginTop:  '8px',  fontSize: '0.85rem',  maxWidth: '300px'}}>
              *Seleccioná el archivo de respaldo generado por la aplicación para continuar tu experimento.
            </small>

          </div>
        
        </div>

    )
}