import { useState, useEffect } from 'react'
import './App.css'
import { Toaster, toast}  from  'react-hot-toast'


import MenuPrincipal from './components/MenuPrincipal'
import Configuracion from './components/Configuracion'
import ModoLupa from './components/ModoLupa'
import PanelResultados from './components/PanelResultados'
import Dashboard from './components/Dashboard'


function App() {
  //  CONTROL DE PANTALLAS
  const [currentStep, setCurrentStep] = useState('menu');
  const [isCounting, setIsCounting] = useState(false);
  const [currentCheckIndex, setCurrentCheckIndex] = useState(0);

  /// Acá guardamos los tratamientos en una sola lista
  const [treatments,  setTreatments]  = useState([]);

  /// Anotamos el ID del tratamiento que el usuario eligió revisar
  const [activeTreatmentId, setActiveTreatmentId] = useState(null);

  const [setupData, setSetupData] = useState({
    name: '',
    settings: '',
    date: '',
    n0: '',
    cycleType:  'hemimetabolous',
    stageCount: '',
    checkMolt:'false',
  })

  /// Variables derivadas
  /// Buscamos el tratamiento activo (const treatment)
  /// Si existe, sacamos los datos, sino, se devuelve cosas vacias
  const activeTreatment = treatments.find(t =>  t.id  === activeTreatmentId);
  const experimentData  = activeTreatment ? activeTreatment.config  : setupData;
  const individuals = activeTreatment ? activeTreatment.individuals:  [];
  const lifeTable = activeTreatment ? activeTreatment.lifeTable : [];
  const day = activeTreatment ? activeTreatment.day : 0;
  const stageNames  = activeTreatment ? activeTreatment.stageNames  : [];
  
   

  // 
  //  SISTEMA DE AUTOGUARDADO (en localStorage)
  // 

  // AL ABRIR LA APP: Buscar si hay un experimento guardado
  useEffect(() => {
    const sesionGuardada = localStorage.getItem('lifeTableAutosave')
    if (sesionGuardada) {
      if (window.confirm("Hay un experimento en curso guardado automáticamente. ¿Querés retomarlo?")) {
        try {
          const data = JSON.parse(sesionGuardada)
          
          // Ahora cargamos los tratamientos
          setTreatments(data.treatments || [])
          setActiveTreatmentId(data.activeTreatmentId || null)
          setCurrentStep(data.currentStep || 'dashboard') // Lo mandamos al panel general
          
          setIsCounting(data.isCounting || false)
          setCurrentCheckIndex(data.currentCheckIndex || 0)
        } catch (error) {
          console.error("Error al cargar el autoguardado")
        }
      } else {
        localStorage.removeItem('lifeTableAutosave')
      }
    }
  }, [])

  // GUARDAR AUTOMÁTICAMENTE cada vez que hacés un clic
  useEffect(() => {
    // Solo guardamos si hay al menos un tratamiento creado
    if (treatments.length > 0) { 
      const sesionActual = {
        treatments, 
        activeTreatmentId,
        currentStep, 
        isCounting, 
        currentCheckIndex
      }
      localStorage.setItem('lifeTableAutosave', JSON.stringify(sesionActual))
    }
  }, [treatments, activeTreatmentId, currentStep, isCounting, currentCheckIndex])

  // 

  // FUNCIONES AUXILIARES 
  const getNextStage = (currentStage) => {
    const fullStages = [...stageNames, 'ADULTO']
    const currentIndex = fullStages.indexOf(currentStage)
    if (currentIndex >= 0 && currentIndex < fullStages.length - 1) {
      return fullStages[currentIndex + 1]
    }
    return 'ADULTO' 
  }

  const getNextAliveIndex = (startIndex, indsArray) => {
    for (let i = startIndex; i < indsArray.length; i++) {
      if (indsArray[i].status !== 'DEAD') {
        return i;
      }
    }
    return -1;
  }

  const calculateTotalNymphDays = (bug) => {
    let total = 0;
    stageNames.forEach(stage => {
      if (typeof bug.history[stage] === 'number') {
        total += bug.history[stage];
      } else if (bug.stage === stage && bug.status !== 'DEAD') {
        total += bug.daysInStage;
      }
    });
    return total > 0 ? total : '-';
  }

  //  FUNCIONES DE GUARDADO MANUAL Y EXPORTACIÓN 
  const saveSession = () => {
    // Empaquetamos todo el ensayo completo
    const sessionData = { 
      treatments, 
      activeTreatmentId, 
      currentStep: 'dashboard' 
    };
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(sessionData));
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataStr);
    
    // Le ponemos la fecha de hoy al archivo para que no se pisen
    const fecha = new Date().toISOString().split('T')[0];
    downloadAnchorNode.setAttribute("download", `Respaldo_EnsayoCompleto_${fecha}.json`);
    
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
  }

  const loadSession = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    
    if (!file.name.endsWith('.json')) {
      alert("Por favor, selecciona un archivo .json válido generado por esta app.");
      e.target.value = null; 
      return;
    }
    

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const loadedData = JSON.parse(event.target.result);
        
        // Verificamos si el archivo tiene el formato nuevo (con treatments)
        if (loadedData.treatments) {
          setTreatments(loadedData.treatments);
          setActiveTreatmentId(loadedData.activeTreatmentId || null);
          setCurrentStep(loadedData.currentStep || 'dashboard');
        } else {
          
          // MODO RETROCOMPATIBILIDAD
          
          const legacyTreatment = {
            id: Date.now().toString(),
            config: loadedData.experimentData,
            stageNames: loadedData.stageNames,
            individuals: loadedData.individuals,
            lifeTable: loadedData.lifeTable,
            day: loadedData.day
          };
          setTreatments([legacyTreatment]);
          setActiveTreatmentId(legacyTreatment.id);
          setCurrentStep('table');
          alert("Se cargó un archivo de versión anterior. Lo convertimos automáticamente al nuevo formato de tratamientos.");
        }
      } catch (error) {
        alert("Error al leer el archivo. Asegurate de que sea un archivo .json válido generado por esta app.");
      }
    };
    reader.readAsText(file);
    e.target.value = null; 
  }
  const exportLifeTableCSV = () => {
    // Calculamos Lx, Tx y ex para el archivo exportable
    const extendedLifeTable = lifeTable.map((row, index, array) => {
      const nextRow = array[index + 1];
      const nextLx = nextRow ? parseFloat(nextRow.lx) : parseFloat(row.lx);
      const Lx = (parseFloat(row.lx) + nextLx) / 2;
      return { ...row, Lx };
    });

    let accumulatedT = 0;
    for (let i = extendedLifeTable.length - 1; i >= 0; i--) {
      accumulatedT += extendedLifeTable[i].Lx;
      extendedLifeTable[i].Tx = accumulatedT;
      const lxValue = parseFloat(extendedLifeTable[i].lx);
      extendedLifeTable[i].ex = lxValue > 0 ? (accumulatedT / lxValue) : 0;
    }

    // Armamos el encabezado con los nombres exactos
    let csvContent = "Edad (x),Vivos (nx),Muertos (dx),Supervivencia (lx),Prob. de mortalidad (qx),Sobrev. Media (Lx),Dias por vivir (Tx),Esperanza de vida (ex)\n";
    
    extendedLifeTable.forEach(row => {
      csvContent += `${row.x},${row.nx},${row.dx},${row.lx},${row.qx},${row.Lx.toFixed(3)},${row.Tx.toFixed(3)},${row.ex.toFixed(2)}\n`;
    });
    
    downloadCSV(csvContent, `TablaVida_${experimentData.name}_Dia${day}.csv`);
  }

  const exportMatrixCSV = () => {
    let headers = ["ID", "Estado", "Actual"];
    stageNames.forEach(stage => headers.push(`Dias ${stage}`));
    headers.push("Total Inmaduro");
    let csvContent = headers.join(",") + "\n";

    individuals.forEach(bug => {
      let row = [
        bug.id,
        bug.status === 'DEAD' ? 'Muerto' : 'Vivo',
        bug.status === 'DEAD' ? '-' : bug.stage
      ];

      stageNames.forEach(stage => {
        const hasCompleted = bug.history[stage] !== undefined;
        const isCurrent = bug.stage === stage;
        const isDead = bug.status === 'DEAD';

        if (hasCompleted) {
          row.push(bug.history[stage]);
        } else if (isCurrent && !isDead) {
          row.push(bug.daysInStage); 
        } else if (isDead && !hasCompleted) {
          row.push('MI');
        } else {
          row.push('-');
        }
      });

      const totalNymph = bug.status === 'DEAD' ? 'MI' : calculateTotalNymphDays(bug);
      row.push(totalNymph);
      csvContent += row.join(",") + "\n";
    });
    downloadCSV(csvContent, `MatrizIndividuos_${experimentData.name}_Dia${day}.csv`);
  }

  const downloadCSV = (csvContent, fileName) => {
    const blob = new Blob(["\uFEFF" + csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", fileName);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  const handleConfigChange = (e) => {
    const { name, value, type, checked } = e.target
    setSetupData({ ...experimentData, [name]: type === 'checkbox' ? checked : value })
  }
  
  // LÓGICA CENTRAL
  const startTable = () => {
    const n0 = parseInt(setupData.n0)
    const stages = parseInt(setupData.stageCount)
    
    if (!setupData.name || isNaN(n0) || n0 <= 0 || isNaN(stages) || stages <= 0) {
      toast.error("Por favor completá el nombre, el N° inicial y la cantidad de estadíos (mayores a 0)", {
        style:  {borderRadius:'8px', background:  '#333', color:  '#fff'}
      });
      return
    }

    const generatedStages = []
    if (setupData.cycleType === 'hemimetabolous') {
      for (let i = 1; i <= stages; i++) generatedStages.push(`N${i}`)
    } else {
      for (let i = 1; i <= stages; i++) generatedStages.push(`L${i}`)
      generatedStages.push('PUPA')
    }
    
    
    const newIndividuals = []
    for (let i = 1; i <= n0; i++) {
      
      newIndividuals.push({ 
        id: i, status: 'ALIVE', stage: generatedStages[0], daysInStage: 0, history: {}, 
        sex: null, oviposition: {} 
      })
    }

    /// Empaquetar todo en un tratamiento
    const newTreatment  ={
      id: Date.now().toString(),  // generamos un codigo unico usando el reloj del sistema
      config: { ...setupData  },  // Guardamos las condiciones del exp
      stageNames: generatedStages,
      individuals:  newIndividuals,
      lifeTable:  [{ x: 0, nx: n0, lx: 1.000, dx: 0, qx: 0}],
      day:  0
    }
    
    setTreatments([...treatments, newTreatment])
    setActiveTreatmentId(newTreatment.id)
    setSetupData({name: '', settings: '', date: '', n0: '', cycleType: 'hemimetabolous', stageCount: '', checkMolt: false})
    
    setCurrentStep('table')
  }

  const startDailyCheck = () => {
    const firstAliveIndex = getNextAliveIndex(0, individuals);
    if (firstAliveIndex === -1){
      toast.error("Ya no quedan sobrevivientes en tu cohorte",  {
        icon:'',
        style:  {borderRadius:  '8px', background:'#333', color:'#fff'}
      });
      return;
    }
    setCurrentCheckIndex(firstAliveIndex); 
    setIsCounting(true); 
  }

  const processIndividual = (action, payload = { sex: null, eggs: 0 }) => {
    const updatedIndividuals = [...individuals]
    const bug = { ...updatedIndividuals[currentCheckIndex] }

    if (!bug.oviposition) bug.oviposition = {}

    // Si la lupa mandó un sexo, se lo guardamos
    if (payload.sex) {
      bug.sex = payload.sex
    }

    // Si es hembra adulta, guardamos los huevos
    if (bug.stage === 'ADULTO' && bug.sex === 'F') {
      bug.oviposition = { ...bug.oviposition, [day]: payload.eggs || 0 }
    }

    // Lógica principal de supervivencia
    if (action === 'DEAD') {
      bug.status = 'DEAD'
      bug.history = { ...bug.history, ['Muerte']: `Día ${day + 1} en ${bug.stage}` }
    } else if (action === 'MOLT') {
      bug.history = { ...bug.history, [bug.stage]: bug.daysInStage + 1 }
      bug.stage = getNextStage(bug.stage)
      bug.daysInStage = 0 
    } else if (action === 'ALIVE') {
      bug.daysInStage += 1
    }

    updatedIndividuals[currentCheckIndex] = bug
    
    ///Guardar los bichos actualizados en la carpeta correcta

    setTreatments(prevTreatments  =>  prevTreatments.map(t  =>  {
      if  (t.id === activeTreatmentId)  {
        //Si es la carpeta que estamos mirando, reemplazamos los individuos
        return  { ...t, individuals:  updatedIndividuals};
      }
      /// Si es otra carpeta, la dejamos intacta
      return t;
    }));

    const nextAliveIndex = getNextAliveIndex(currentCheckIndex + 1, updatedIndividuals);
    if (nextAliveIndex !== -1) {
      setCurrentCheckIndex(nextAliveIndex);
    } else {
      finishDailyCheck(updatedIndividuals)
    }
  }

  const finishDailyCheck = (finalIndividuals) => {
    const survivorsCount = finalIndividuals.filter(bug => bug.status !== 'DEAD').length
    const previousRow = lifeTable[lifeTable.length - 1]
    const n0 = parseInt(experimentData.n0)

    const newLifeRow = {
      x: day + 1,
      nx: survivorsCount,
      lx: (survivorsCount / n0).toFixed(3),
      dx: previousRow.nx - survivorsCount,
      qx: previousRow.nx > 0 ? ((previousRow.nx - survivorsCount) / previousRow.nx).toFixed(3) : 0
    }

    /// Guardar la nueva tabla de vida y avanzar el dia en la carpeta
    setTreatments(prevTreatments  =>prevTreatments.map(t  =>  {
      if  (t.id === activeTreatmentId)  {
        return  {
          ...t,
          individuals: finalIndividuals,
          lifeTable:  [...t.lifeTable,  newLifeRow],
          day:  t.day + 1
        };
      }
      return t;
    }))
    setIsCounting(false)
  }

  // FUNCIÓN PARA DESHACER EN LA LUPA

  const handleUndoLupa  = ()  =>  {
    setCurrentCheckIndex(prevIndex  =>  {
      if  (prevIndex  > 0)  {
        return  prevIndex -1;
      }
      return 0
    });
  };

  // RENDERIZADO PRINCIPAL 
  return (
    <div className="container">
      <Toaster position="bottom-right" reverseOrder={false}/>

      
      {currentStep === 'menu' && (
        <MenuPrincipal 
          setCurrentStep={setCurrentStep} 
          loadSession={loadSession} 
        />
      )}

      {currentStep === 'setup' && (
        <Configuracion 
          setCurrentStep={setCurrentStep}
          experimentData={setupData}
          handleConfigChange={handleConfigChange}
          startTable={startTable}
        />
      )}

      {currentStep === 'dashboard' && (
        <Dashboard 
          treatments={treatments}
          setActiveTreatmentId={setActiveTreatmentId}
          setCurrentStep={setCurrentStep}
          
        />
      )}

      {currentStep === 'table' && isCounting && individuals[currentCheckIndex] && (
        <ModoLupa 
          day={day}
          currentBug={individuals[currentCheckIndex]}
          processIndividual={processIndividual}
          experimentData={experimentData}
          getNextStage={getNextStage}
          currentCheckIndex={currentCheckIndex}
          individuals={individuals}
          onUndo={handleUndoLupa}
        />
      )}

      {currentStep === 'table' && !isCounting && (
        <PanelResultados
          setCurrentStep={setCurrentStep} 
          experimentData={experimentData}
          day={day}
          saveSession={saveSession}
          startDailyCheck={startDailyCheck}
          exportLifeTableCSV={exportLifeTableCSV}
          exportMatrixCSV={exportMatrixCSV}
          lifeTable={lifeTable}
          stageNames={stageNames}
          individuals={individuals}
          calculateTotalNymphDays={calculateTotalNymphDays}
        />
      )}

      {/* FOOTER */}
      <footer className="app-footer">
        <p>
          <strong>LifeTable App</strong> v1.0 &copy; {new Date().getFullYear()}
        </p>
        <p>
          Desarrollado por Alejandro Nicolás Melchert PhD
        </p>
        <p style={{ fontSize: '0.75rem', marginTop: '10px', opacity: 0.7 }}>
          Herramienta de código abierto para el cálculo de parámetros poblacionales y tablas de vida en laboratorio.
        </p>
      </footer>

    </div>
  )
}

export default App