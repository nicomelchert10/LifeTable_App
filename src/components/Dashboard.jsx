export default function Dashboard({ treatments, setActiveTreatmentId, setCurrentStep, setTreatments }) {
  
  
  
  return (
    <div className="card" style={{ maxWidth: '800px', margin: '0 auto', marginTop: '40px' }}>
      <h2 style={{ textAlign: 'center', marginBottom: '20px' }}>Panel de Tratamientos</h2>
      
      <p className="text-muted" style={{ textAlign: 'center', marginBottom: '30px' }}>
        Seleccioná el tratamiento que querés revisar hoy o agregá uno nuevo al ensayo.
      </p>

      {treatments.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '40px', background: 'rgba(255,255,255,0.02)', borderRadius: '8px' }}>
          <p className="text-muted">Todavía no hay tratamientos en este experimento.</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gap: '15px', marginBottom: '30px' }}>
          {treatments.map((t) => {
            const vivos = t.individuals.filter(bug => bug.status !== 'DEAD').length;
            return (
              <div key={t.id} style={{
                background: 'rgba(255,255,255,0.05)', 
                borderLeft: '4px solid #4CAF50',
                borderRadius: '8px', padding: '15px', 
                display: 'flex', justifyContent: 'space-between', alignItems: 'center'
              }}>
                <div>
                  <h3 style={{ margin: '0 0 5px 0', color: 'white' }}>{t.config.name}</h3>
                  <p className="text-muted" style={{ margin: 0, fontSize: '0.9rem' }}>
                    📅 Día actual: <strong>{t.day}</strong> | Sobrevivientes: <strong>{vivos} / {t.config.n0}</strong>
                  </p>
                </div>
                <button className="btn-primary" onClick={() => {
                  setActiveTreatmentId(t.id);
                  setCurrentStep('table');
                }}>
                  Abrir Mesada &rarr;
                </button>
              </div>
            );
          })}
        </div>
      )}

      <div style={{ textAlign: 'center', marginTop: '20px', borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '20px' }}>
        <button className="btn-secondary" onClick={() => {
          setActiveTreatmentId(null);
          setCurrentStep('setup');
        }}>
          + Agregar Nuevo Tratamiento
        </button>
      </div>
    </div>
  );
}