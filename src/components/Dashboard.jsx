import { useState } from "react";
import {Calendar, ChevronDown, ChevronUp, ArrowRight, PlusCircle, Venus, Mars} from 'lucide-react'

export default function Dashboard({ treatments, setActiveTreatmentId, setCurrentStep, setTreatments }) {
  
  // Estado para controlar que resumen está abierto
  const [expandedId, setExpandedId] = useState(null);

  const toggleExpand  = (id)  =>  {
    setExpandedId(expandedId  === id  ? null  : id);
  };
  
  return (
    <div className="card dashboard-card screen-transition">
      <h2 className="dashboard-title">Panel de Ensayos</h2>
      
      <p className="text-muted dashboard-subtitle">
        Seleccioná el ensayo que querés revisar hoy o agregá uno nuevo.
      </p>

      {treatments.length === 0 ? (
        <div className="empty-treatments">
          <p className="text-muted">Todavía no hay ensayos en este experimento.</p>
        </div>
      ) : (
        <div className="treatments-grid">
          {treatments.map((t) => {

            //Cálculos básicos
            const n0  = parseInt(t.config.n0);
            const vivos = t.individuals.filter(bug  =>  bug.status  !== 'DEAD').length;
            const percVivo  = ((vivos/n0) * 100).toFixed(1);
            const percMuerto  = (100  - percVivo).toFixed(1);

            //Cálculos avanzados para el resumen
            let ninfalTotal = 0,  ninfalCount = 0;
            let longTotal = 0,  deadCount = 0;
            let eggsTotal = 0,  femaleCount = 0;
            let males = 0,  females = 0;
            let maxLongevidad = 0;
            let ninfasVivas = 0;

            t.individuals.forEach(bug =>  {
              //Proporción Sexual
              if  (bug.sex  === 'M') males++;
              if  (bug.sex  === 'F')  {
                females++;
                femaleCount++;
                // Huevos
                if  (bug.oviposition) {
                  Object.values(bug.oviposition).forEach(cant =>  eggsTotal +=  cant);
                }
              }
              // Longevidad (media y máxima)

              let diasVividos = bug.daysInStage;
              Object.values(bug.history).forEach(val  =>  {
                if  (typeof val === 'number') diasVividos +=  val;
              });

              if  (diasVividos  > maxLongevidad)  {
                maxLongevidad = diasVividos;
              }

              if  (bug.status === 'DEAD') {
                longTotal +=  diasVividos;
                deadCount++;
              }

              //REVISAR SI QUEDAN NINFAS O MURIERON/SON ADULTOS
              if (bug.status  !== 'DEAD'  &&  bug.stage !== 'ADULTO')  {
                ninfasVivas++;
              }

              // Desarrollo Ninfal (solo de los que llegaron a adulto)
              const isAdult = bug.stage === 'ADULTO'  ||  (bug.history['Muerte']  &&  bug.history['Muerte'].includes('ADULTO'));
              if  (isAdult  &&  t.config.checkMolt  !== false){
                let diasInmaduro  = 0;
                t.stageNames.forEach(stage  =>  {
                  if (typeof bug.history[stage] === 'number') diasInmaduro  +=  bug.history[stage];
                });
                if (diasInmaduro  > 0)  {
                  ninfalTotal +=  diasInmaduro;
                  ninfalCount++;
                }
              }
            });

            const isOngoing = vivos > 0;  // Verificamos si quedan vivos
            const isNinfalOngoing=  ninfasVivas > 0;
            const devNinfal = isNinfalOngoing ? 'En curso...' : (ninfalCount > 0 ? (ninfalTotal / ninfalCount).toFixed(1) + ' días' : '-');
            const longevidad = isOngoing  ? 'En curso...' : (deadCount > 0 ? (longTotal / deadCount).toFixed(1) + ' días' : '-');
            const promHuevos = femaleCount > 0 ? (eggsTotal / femaleCount).toFixed(1) + ' h/♀' : '-';
            const totalSexed = males + females;
            const propSexos = totalSexed > 0 ? (
              <span style={{display: 'inline-flex', alignItems: 'center', gap: '8px', fontWeight: '500'}}>
                <span style={{  color:  '#FF758F', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                  <Venus size={16}/>  {females}
                </span>
                <span style={{colro: '#777'}}>:</span>
                <span style={{ color: '#4DA6FF', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                  <Mars size={16}/> {males}
                </span>
              </span>
            ): '-';

            const isExpanded = expandedId === t.id;

            
            return (
              <div key={t.id} className="treatment-item">

                {/* CABECERA DE LA TARJETA */}
                <div className="treatment-header">
                  <div>
                    <h3 className="treatment-title">{t.config.name}</h3>
                    <p className="text-muted treatment-info">
                      <span ClassName="icon-text">
                      <Calendar size={16}/> Día actual: <strong>{t.day}</strong> </span> | Sobrevivientes: <strong>{vivos} / {n0}</strong>
                    </p>
                  </div>
                  
                  <div className="treatment-actions">
                    <button 
                      onClick={() => toggleExpand(t.id)}
                      className={`btn-toggle-resume ${isExpanded ? 'expanded' : ''}`}>
                      <span className="btn-icon-center">
                      {isExpanded ? 'Ocultar Resumen ' : 'Ver Resumen '}
                      {isExpanded ? <ChevronUp  size={18}/> : <ChevronDown size={18}/>}
                      </span>
                    </button>

                    <button className="btn-primary" onClick={() => {
                      setActiveTreatmentId(t.id);
                      setCurrentStep('table');
                    }}>
                      <span className="btn-icon-center">
                      Abrir Ensayo <ArrowRight size={18}/></span>
                    </button>
                  </div>
                </div>

                {/* PANEL DESPLEGABLE DE RESUMEN */}
                {isExpanded && (
                  <div className="treatment-summary-panel">
                    
                    {/* Barra de Supervivencia Apilada */}
                    <div className="survival-section">
                      <p className="survival-title">Mortalidad / Supervivencia</p>
                      <div className="survival-track">
                        <div style={{ width: `${percVivo}%`, background: '#4CAF50', height: '100%', transition: 'width 0.5s ease' }}></div>
                      </div>
                      <div className="survival-labels">
                        <span className="label-alive">Vivos: {percVivo}%</span>
                        <span className="label-dead">Muertos: {percMuerto}%</span>
                      </div>
                    </div>

                    {/* Grilla de Métricas */}
                    <div className="metrics-grid">
                      
                      {t.config.checkMolt !== false && (
                        <div className="metric-box">
                          <p className="metric-title" >Desarrollo Ninfal Medio</p>
                          <p 
                             className={`metric-value ${isNinfalOngoing ? 'status-ongoing' : ''}`}
                              style={{ 
                                         fontSize: isNinfalOngoing ? '0.95rem' : '1.1rem', 
                                         color: isNinfalOngoing ? '#FFCA28' : 'white'
                          }}>{devNinfal}</p>
                        </div>
                      )}

                      <div className="metric-box">
                        <p className="metric-title">Longevidad Media</p>
                        <p 
                           className={`metric-value ${isOngoing ? 'status-ongoing' : ''}`}
                            style={{ 
                                         fontSize: isOngoing ? '0.95rem' : '1.1rem', 
                                        color: isOngoing ? '#FFCA28' : 'white'}}>{longevidad}</p>
                      </div>

                      <div className="metric-box">
                        <p className="metric-title">Longevidad Máx. Actual</p>
                        <p className="metric-value">{maxLongevidad} días</p>
                      </div>

                      <div className="metric-box">
                        <p className="metric-title">Proporción Sexual</p>
                        <p className="metric-value">{propSexos}</p>
                      </div>

                      {t.config.checkFecundity !== false && (
                        <div className="metric-box eggs">
                          <p className="metric-title eggs">Promedio de Huevos</p>
                          <p className="metric-value eggs">{promHuevos}</p>
                        </div>
                      )}

                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      <div className="dashboard-footer">
        <button className="btn-secondary" onClick={() => {
          setActiveTreatmentId(null);
          setCurrentStep('setup');
        }}>
          <span className="btn-icon-center">
          <PlusCircle size={18} /> Agregar Nuevo</span>
        </button>
      </div>
    </div>
  );
}