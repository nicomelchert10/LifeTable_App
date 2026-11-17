import {useState} from 'react'

export default function MenuPrincipal ({setCurrentStep, loadSession}){
    const [mostrarOpciones, setMostrarOpciones] = useState(false);

    return(
      <div className="card screen-transition">
          <h1 className='dashboard-title'>LifeTable App </h1>
          <p className="text-muted dashboard-subtitle">
            Seguimiento individual de cohortes y cálculo de tabla de vida
          </p>

          {!mostrarOpciones ? (
          /*MENU DE SIEMPRE */  
          <div className='fade-in-section'>
            <button 
              className="btn-primary"
              onClick={() => setMostrarOpciones('true')}
            >
              + Nuevo Experimento
            </button>

            {/* BOTÓN DE CARGAR SESIÓN */}
            <label className="btn-upload">
              Cargar Respaldo del Ensayo
              <input
                type="file"
                accept="*/*"
                onChange={loadSession}
                style={{display:'none'}}
              />
            </label>

            <small className="text-muted dashboard-title" style={{display: 'block', marginTop:  '15px'}}>
              *Seleccioná el archivo de respaldo generado por la aplicación para continuar tu experimento.
            </small>
          </div>
        
          ) : (

          /*SUB-MENU DE ELECCION DE ENSAYO */
          <div className='fade-in-section'>
            <h3 className='dashboard-title'>
              Seleccioná el tipo de ensayo:
            </h3>
            <button
               className='btn-primary'
               onClick={() => setCurrentStep('setup')}
            >
              Tabla de Vida Clásica
              <small className='text-muted' style={{  display:  'block',  marginTop:  '5px'}}>
                Incluye control de mudas, sexado y fecundidad
              </small>
            </button>
            <button
              className='btn-primary'
              onClick={() => setCurrentStep('setup-survival')}
            >
              Ensayo de Supervivencia
              <small className='text-muted' style={{  display:  'block',  marginTop:  '5px'}}>
                Registra estado vital (vivo/muerto)
              </small>
            </button>

            <div style={{textAlign: 'center',  marginTop:  '25px'}}>
              <button
                className='btn-secondary'
                onClick={() =>  setMostrarOpciones(false)}
                >
                  &larr;  Volver atrás

                </button>
            </div>
          </div>
    )}
    </div>
    ) 
}