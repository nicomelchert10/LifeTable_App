import { useState } from 'react'

export default function PanelResultados({
  setCurrentStep, experimentData, day, saveSession, startDailyCheck, exportLifeTableCSV, exportMatrixCSV, lifeTable, stageNames, individuals, calculateTotalNymphDays
}) {

  const [showStats, setShowStats] = useState(false)

  const sumEggs = (oviposition) => {
    if (!oviposition) return 0;
    return Object.values(oviposition).reduce((total, cantidadDiaria) => total + cantidadDiaria, 0);
  };

  const calculatePopulationParameters = () => {
    const initialFemales = individuals.filter(bug => bug.sex === 'F').length;
    if (initialFemales === 0 || day === 0) return null;

    let sumLxMx = 0;
    let sumXLxMx = 0;
    const fertilityTable = []; 

    for (let x = 0; x < day; x++) {
      let aliveFemalesDayX = 0;
      let totalEggsDayX = 0;

      individuals.forEach(bug => {
        if (bug.sex === 'F') {
          let diedOnDay = Infinity;
          if (bug.status === 'DEAD' && bug.history['Muerte']) {
            const match = bug.history['Muerte'].match(/\d+/);
            if (match) diedOnDay = parseInt(match[0]) - 1; 
          }
          if (x < diedOnDay) aliveFemalesDayX++;
          if (bug.oviposition && bug.oviposition[x]) totalEggsDayX += bug.oviposition[x];
        }
      });

      const femaleEggsDayX = totalEggsDayX * 0.5; 
      const mx = aliveFemalesDayX > 0 ? femaleEggsDayX / aliveFemalesDayX : 0;
      const lx_female = aliveFemalesDayX / initialFemales;
      
      const lxmx = lx_female * mx;
      const xlxmx = x * lxmx;

      sumLxMx += lxmx;
      sumXLxMx += xlxmx;

      fertilityTable.push({
        x, aliveFemalesDayX, totalEggsDayX, mx, lx_female, lxmx, xlxmx
      });
    }
    /// Tasa neta de reproducción
    const R0 = sumLxMx;
    /// Tiempo generacional
    const T = R0 > 0 ? sumXLxMx / R0 : 0;
    /// Tasa intrinseca de crecimiento poblacional
    const rm = T > 0 ? Math.log(R0) / T : 0;
    /// Tasa finita de multiplicación
    const lambda = rm !== 0 ? Math.exp(rm) : 0;
    ///  Tiempo de Duplicación
    const DT = rm > 0 ? Math.log(2) / rm : 0;

    return { stats: { R0, T, rm, lambda, DT }, fertilityTable };
  };

  const popData = calculatePopulationParameters();

  // Lx, Tx, Ex 

  const extendedLifeTable = lifeTable.map((row, index,  array)  =>  {
    const nextRow =  array[index + 1];
    const nextLx  = nextRow ? parseFloat(nextRow.lx)  : parseFloat(row.lx);
    const Lx  = (parseFloat(row.lx) + nextLx) / 2;
    return  {...row,  Lx  };
  });

  let accumulatedT = 0;
  for (let i = extendedLifeTable.length - 1; i >= 0; i--) {
    accumulatedT += extendedLifeTable[i].Lx;
    extendedLifeTable[i].Tx = accumulatedT;
    const lxValue = parseFloat(extendedLifeTable[i].lx);
    extendedLifeTable[i].ex = lxValue > 0 ? (accumulatedT / lxValue) : 0;
  }

  //------------

  return (
    <div>
      <div className="table-header">
        <div className="header-info">
          <h2 style={{margin: '0 0 5px 0'}}>{experimentData.name}</h2>
          <p className="text-muted" style={{margin: 0}}>
            Día {day} | N0: {experimentData.n0}
            {experimentData.checkMolt ?` | Estadíos: ${experimentData.stageCount}` : ''}
          </p>
        </div>
      
      <div className="header-actions">
        <div style={{ display: 'flex', gap: '30px', alignItems: 'center' }}>

        <button className="btn-back" onClick={() => setCurrentStep('dashboard')}>
          &larr; Volver al Panel de Ensayos
        </button>
        
        <button className="btn-back" onClick={saveSession}>
          Descargar respaldo
        </button>
        </div>
        <small style={{ fontSize: '0.75rem', color: '#888', maxWidth: '250px', textAlign: 'right' }}>
          Guarda el estado actual del ensayo. Para analizar en R o Excel, exportá los CSV más abajo.
        </small>
        
        </div>
        
      </div>

      <button className="btn-large-action" onClick={startDailyCheck}>
          Iniciar Revisión del Día {day + 1}
      </button>

      {/* TABLA 1: RESUMEN POBLACIONAL */}
      <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '40px', marginBottom: '15px'}}>
        <h3 style={{margin: 0}}>📊 Tabla de Vida General</h3>
        <button className="btn-export" onClick={exportLifeTableCSV}>
          📥 Exportar CSV
        </button>
      </div>

      <div className="table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>Edad (x)</th>
              <th>Vivos (nx)</th>
              <th>Muertos (dx)</th>
              <th>Supervivencia (lx)</th>
              <th>Prob. de mortalidad (qx)</th>
              <th style={{borderLeft: '2px solid #444'}}>Sobrev. Media (Lx)</th>
              <th>Días por vivir (Tx)</th>
              <th style={{color: '#03A9F4'}}>Esperanza de vida (ex)</th>
            </tr>
          </thead>
          <tbody>
            {extendedLifeTable.map((row) => (
              <tr key={row.x}>
                <td>{row.x}</td>
                <td>{row.nx}</td>
                <td style={{ color: row.dx > 0 ? '#ff5252' : 'inherit' }}>{row.dx}</td>
                <td>{row.lx}</td>
                <td>{row.qx}</td>
                {/* Nuevas columnas*/}
                <td style={{borderLeft: '2px solid #444'}}>{row.Lx.toFixed(3)}</td>
                <td>{row.Tx.toFixed(3)}</td>
                <td style={{color: '#03A9F4', fontWeight: 'bold'}}>{row.ex.toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* TABLA 2: DETALLE INDIVIDUAL (TABLA COMPLETA) */}
      <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop:'50px', marginBottom:'15px'}}>
        <h3 style={{margin: 0}}> Tabla de Seguimiento Individual</h3>
        <button className="btn-export" onClick={exportMatrixCSV}>
          📥 Exportar CSV
        </button>
      </div>
      
      <div className="table-container">
        <table className="data-table" style={{fontSize: '0.9rem'}}>
          <thead>
            <tr>
              <th>ID</th>
              <th>Estado</th>
              <th>Sexo</th>
              {stageNames.map(stage => (
                <th key={stage}>Días {stage}</th>
              ))}
              <th style={{ background: 'rgba(255, 255, 255, 0.1)' }}>Total Inmaduro</th>
              <th style={{ background: 'rgba(33, 150, 243, 0.1)' }}>Días Adulto</th>
              <th style={{ background: 'rgba(33, 150, 243, 0.1)' }}>Longevidad Total</th>
              {experimentData.checkFecundity != false ?  ( //oculta la columna si checkFecundity es falso
                <th style={{ background: 'rgba(233, 30, 99, 0.1)' }}>Total Huevos</th>
              ) : null}
              
            </tr>
          </thead>
          <tbody>
            {individuals.map((bug) => {
              const totalEggs = bug.sex === 'F' ? sumEggs(bug.oviposition) : '-';
              const sexIcon = bug.sex === 'M' ? '♂️' : (bug.sex === 'F' ? '♀️' : '-');
              const isAdult = bug.stage === 'ADULTO' || (bug.history['Muerte'] && bug.history['Muerte'].includes('ADULTO'));
              const adultDays = isAdult ? bug.daysInStage : '-';

              let totalLongevity  = bug.daysInStage;
              Object.values(bug.history).forEach(val  =>  {
                if  (typeof val === 'number') {
                  totalLongevity  +=  val;
                }
              });
              

              return (
                <tr key={bug.id}>
                  <td>#{bug.id}</td>
                  <td style={{fontWeight: 'bold', color: bug.status === 'DEAD' ? '#ff5252' : '#4CAF50'}}>
                    {bug.status === 'DEAD' ? '✝ Muerto' : 'Vivo'}
                  </td>
                  <td style={{fontSize: '1.2rem'}}>{sexIcon}</td>
                  
                  {stageNames.map(stage => {
                    const hasCompleted = bug.history[stage] !== undefined;
                    const isCurrent = bug.stage === stage;
                    

                    let cellContent = '-';
                    let cellStyle = {};

                    if (hasCompleted) {
                      cellContent = bug.history[stage];
                    } else if (isCurrent) {
                      /// Muestra los días vividos en el estadio actual, aún si está muerto
                      cellContent = bug.status  === 'DEAD'  ? bug.daysInStage : `(${bug.daysInStage}...)`;
                    } else if (bug.status === 'DEAD') {
                      /// Si está muerto y no completó este estadio, ni era el actual, pone MI
                      cellContent = 'MI';
                      cellStyle = { backgroundColor: '#d32f2f', color: 'white', fontWeight: 'bold' };
                    }

                    return (
                      <td key={stage} style={cellStyle}>
                        {cellContent}
                      </td>
                    );
                  })}
                  
                  <td style={{ fontWeight: 'bold', background: bug.status === 'DEAD' && bug.stage !== 'ADULTO' ? '#d32f2f' : 'rgba(255, 255, 255, 0.05)', color: bug.status === 'DEAD' && bug.stage !== 'ADULTO' ? 'white' : 'inherit' }}>
                    {bug.status === 'DEAD' && bug.stage !== 'ADULTO' ? 'MI' : calculateTotalNymphDays(bug)}
                  </td>

                  <td style={{ fontWeight: 'bold', color: '#64B5F6' }}>{adultDays}</td>

                  <td style={{  fontWeight: 'bold', color: '#FFCA28' }}>{totalLongevity }</td>
              
                  {experimentData.checkFecundity  !== false ? 
                    (<td style={{ fontWeight: 'bold', color: '#F06292' }}>{totalEggs}</td>
                  ): null}
                
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      {/* BOTÓN DESPLEGABLE ESTADÍSTICO  */}
      { experimentData.checkFecundity !== false && popData && popData.stats.R0 > 0 && (
        <div style={{marginTop: '50px', textAlign: 'center'}}>
          <button 
            onClick={() => setShowStats(!showStats)}
            style={{
              background: showStats ? 'rgba(76, 175, 80, 0.2)' : 'transparent',
              border: '2px solid #4CAF50', color: '#4CAF50', padding: '10px 20px',
              borderRadius: '8px', cursor: 'pointer', fontSize: '1.1rem', fontWeight: 'bold', width: '100%'
            }}
          >
            {showStats ? 'Ocultar Análisis de Fecundidad ▴' : '📊 Ver Análisis Reproductivo ▾'}
          </button>
        </div>
      )}

      {/* PANEL ESTADÍSTICO */}
      { experimentData.checkFecundity !== false &&  showStats && popData && (
        <div style={{ background: 'linear-gradient(145deg, #1e1e1e, #2a2a2a)', border: '1px solid #4CAF50', borderRadius: '12px', padding: '20px', marginTop: '15px', boxShadow: '0 4px 15px rgba(0,0,0,0.3)', marginBottom: '40px'}}>
          
          <div style={{display: 'flex', flexWrap: 'wrap', gap: '20px', justifyContent: 'space-between', marginBottom: '30px'}}>
            <div style={{flex: '1 1 18%'}}>
              <p className="text-muted" style={{margin: '0 0 5px 0', fontSize: '0.9rem'}}>Tasa Neta Rep. (R₀)</p>
              <h2 style={{margin: 0, color: 'white'}}>{popData.stats.R0.toFixed(2)} <span style={{fontSize:'0.9rem', color:'#888'}}>♀/♀</span></h2>
            </div>
            <div style={{flex: '1 1 18%'}}>
              <p className="text-muted" style={{margin: '0 0 5px 0', fontSize: '0.9rem'}}>Tiempo Gen. (T)</p>
              <h2 style={{margin: 0, color: 'white'}}>{popData.stats.T.toFixed(2)} <span style={{fontSize:'0.9rem', color:'#888'}}>días</span></h2>
            </div>
            <div style={{flex: '1 1 18%'}}>
              <p className="text-muted" style={{margin: '0 0 5px 0', fontSize: '0.9rem'}}>Tasa Intrínseca (rₘ)</p>
              <h2 style={{margin: 0, color: '#FFCA28'}}>{popData.stats.rm.toFixed(4)} <span style={{fontSize:'0.9rem', color:'#888'}}>días⁻¹</span></h2>
            </div>
            <div style={{flex: '1 1 18%'}}>
              <p className="text-muted" style={{margin: '0 0 5px 0', fontSize: '0.9rem'}}>Tasa Finita (λ)</p>
              <h2 style={{margin: 0, color: 'white'}}>{popData.stats.lambda.toFixed(4)} <span style={{fontSize:'0.9rem', color:'#888'}}>ind/día</span></h2>
            </div>
            <div style={{flex: '1 1 18%'}}>
              <p className="text-muted" style={{margin: '0 0 5px 0', fontSize: '0.9rem'}}>T. Duplicación (DT)</p>
              <h2 style={{margin: 0, color: 'white'}}>{popData.stats.DT.toFixed(2)} <span style={{fontSize:'0.9rem', color:'#888'}}>días</span></h2>
            </div>
          </div>

          <h4 style={{color: '#4CAF50', borderBottom: '1px solid #4CAF50', paddingBottom: '10px'}}>Detalle de Fecundidad Específica por Edad</h4>
          <div className="table-container">
            <table className="data-table" style={{fontSize: '0.85rem'}}>
              <thead>
                <tr>
                  <th>Edad (x)</th>
                  <th>♀ Vivas</th>
                  <th>Huevos (Totales)</th>
                  <th>mx <br/><small>(Hijas / ♀)</small></th>
                  <th>lx <br/><small>(Superv. ♀)</small></th>
                  <th style={{color: '#FFCA28'}}>lx * mx</th>
                  <th style={{color: '#64B5F6'}}>x * lx * mx</th>
                </tr>
              </thead>
              <tbody>
                {popData.fertilityTable.map((row) => (
                  <tr key={row.x}>
                    <td>{row.x}</td>
                    <td>{row.aliveFemalesDayX}</td>
                    <td>{row.totalEggsDayX}</td>
                    <td>{row.mx.toFixed(3)}</td>
                    <td>{row.lx_female.toFixed(3)}</td>
                    <td style={{color: '#FFCA28', fontWeight: 'bold'}}>{row.lxmx.toFixed(3)}</td>
                    <td style={{color: '#64B5F6', fontWeight: 'bold'}}>{row.xlxmx.toFixed(3)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p style={{margin: '15px 0 0 0', fontSize: '0.8rem', color: '#888', textAlign: 'right'}}>
            * mx asume proporción sexual 1:1 (Huevos Totales × 0.5)
          </p>
        </div>
      )}

    </div>
  )
}