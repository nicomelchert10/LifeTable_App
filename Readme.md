# LifeTable App 🔬 📝

##### Herramienta web optimizada para para el seguimiento de cohortes y cálculo de tablas de vida en entomología.

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

[![React](https://img.shields.io/badge/React-18-blue.svg)](https://reactjs.org/)

![Version](https://img.shields.io/badge/version-1.0.0--beta-orange)

![Open Source](https://img.shields.io/badge/Open%20Source-Yes-brightgreen)

###### LifeTable App es una aplicación web de código abierto diseñada para agilizar y automatizar el registro de observaciones biológicas, el cálculo de parámetros poblacionales, el armado de tablas de vida y el análisis de supervivencia en condiciones de laboratorio, minimizando el error humano de la transcripción del papel al software y ofreciendo un dashboard analítico en tiempo real.

------------

### 🚀 Novedades en la Versión 2.0

- ** Arquitectura de flujo Dual:** Ahora podés seleccionar entre una "Tabla de vida clásica" y el nuevo "Ensayo de Supervivencia" (optimizado para bioensayos de toxicidad y longevidad)
- **Módulo de Supervivencia Dedicado:**
  - **Flujo rápido:** Omite la validación de sexo, mudas y huevos para cargar la mortalidad de manera más rápida
  - **Unidad de tiempo dinámica:** Permite registrar observaciones tanto en Días como en Horas.
  - **Visualización Avanzada (Kaplan-Meier):** Gráfico interactivo de la probabilidad de supervivencia integrado directamente en el panel de resultados, exclusivo para ensayos de supervivencia.
  - **Exportación lista para R:** El módulo de supervivencia genera matrices de datos depuradas de tres columnas ('ID', 'Estado', 'Tiempo Total'), formateadas específicamente para ser analizadas de inmediato en software estadístico como R o Python.
    
## ✨ Características Principales

- **Interfaz Adaptativa:** Configurá tu experimento según tus necesidades. Desactivá los registros de fecundidad o mudas para obtener una interfaz simplificada.
- **Modo Lupa:** Interfaz con botones grandes diseñada para ser usada con una sola mano mientras se observa por el microscópio estereoscópico, optimizada para tablets y celulares, con prevención de despliegue accidental del teclado.
- **Gestión de Múltiples Experimentos:** Panel de control (Dashboard) que permite tener varias cohortes o tratamientos guardados en simultáneo, ideal para comparar dosis o tratamientos de control.
- **Dashboard Analítico:** Visualizá métricas en tiempo real (Longevidad Media/Máxima, Desarrollo Ninfal, Proporción Sexual) y barras dinámicas de Supervivencia vs. Mortalidad sin salir del panel principal.
- **Estadísticas Descriptivas Automáticas:** Resumen dinámico y cálculo de parámetros en tiempo real para cada tratamiento.
- **Soporte Metamórfico:** Configuración adaptada tanto para insectos hemimetábolos como holometábolos.
- **Exportación Versátil:** Descarga de tablas crudas completas en formato `.csv` o matrices estructuradas para análisis complejos.


------------

## Demo 🚀

Accedé a la aplicación aqui : **[Life Table App](https://lifetableapp.vercel.app)**

--------

## 📱 Cómo utilizar LifeTable App

1. **Configuración:** Al iniciar, elegí entre "Tabla de Vida" o "Supervivencia".Definí el nombre del tratamiento, condiciones, número inicial de individuos, registro de mudas y el tipo de desarrollo (Hemimetábolo/Holometábolo). Podés elegir no registrar mudas ni fecundidad y hacer ensayos de supervivencia o toxicidad
2. **Registro Diario/Horario:** Usá el Modo Lupa para registrar el estado de cada individuo (Supervivencia, Mudas, Fecundidad) de forma secuencial y rápida.
3. **Monitoreo:** Revisá el panel de resultados y las curvas de Kaplan-Meier para observar la tendencia poblacional y el progreso de la cohorte.
4. **Análisis:** Al finalizar el ensayo, exportá los resultados en `.csv` para realizar contrastes de hipótesis o modelado estadístico en un software externo.

------------
## 💾 Privacidad y Datos
Los datos se almacenan localmente en tu navegador (**localStorage**).

- **Importante:** Si limpiás el caché o el historial del navegador, los datos se borrarán. Te recomendamos usar la función **"Descargar Respaldo (JSON)"** al finalizar cada jornada.

-----------
## 🧪 Metodología y cálculo de tablas de vida

La aplicación utiliza los modelos clásicos de ecología de poblaciones para generar las tablas de vida (Rabinovich J, 1978):

- **Edad:**

$$x$$

- **Individuos vivos a la edad x:**

$$nx$$

- **Individuos muertos a la edad x:**

$$dx$$

- **Supervivencia:**  Proporción de individuos vivos al inicio de cada intervalo.

$$lx$$

- **Probabilidad de mortalidad:** tasa de mortalidad específica por edad:

$$q_x = \frac{d_x}{n_{x-1}}$$

- **Media de la probabilidad de supervivencia entre dos edades sucesivas:**

$$L_x = \frac{l_x + l_{x+1}}{2}$$

* **Días por vivir ($T_x$):** Número total de días que quedan de vida a los sobrevivientes que han alcanzado la edad $x$.
$$T_x = \sum L_x$$

* **Esperanza de vida ($E_x$):**
$$E_x = \frac{T_x}{l_x}$$

* **Fecundidad específica ($m_x$):** Promedio de descendencia producida por unidad de tiempo.
$$m_x$$

* **Tasa neta de reproducción ($R_0$):** Número promedio de progenie hembra capaz de ser producido por cada hembra de la población durante toda su vida.
$$R_0 = \sum l_x m_x$$

* **Tiempo generacional ($T$):** Tiempo promedio entre dos generaciones sucesivas.
$$T = \frac{\sum x l_x m_x}{R_0}$$

* **Tasa intrínseca de crecimiento ($r_m$):** Capacidad de una población de multiplicarse en el lapso de una generación en condiciones ideales.
$$r_m = \frac{\ln R_0}{T}$$

- **Tasa finita de multiplicación ($\lambda$):** Número de individuos que se agregan a la población por individuo y por unidad de tiempo.
$$\lambda = e^{r_m}$$

- **Tiempo de duplicación ($DT$):** Tiempo necesario para que el tamaño de la población se duplique bajo las condiciones actuales de crecimiento.
$$DT = \frac{\ln 2}{r_m}$$

--------

## Referencias
-  Rabinovich, J. E. (1978). Ecología de poblaciones animales.
- Melchert, N. A., Manzano, C., Virla, E. G., & Luft‐Albarracín, É. (2025). High levels of nitrogen fertilization enhance the fitness of the vector of corn stunt disease, Dalbulus maidis. Entomologia Experimentalis et Applicata, 173(7), 737-746.

------------------

## 👤 Autor
**Dr. Alejandro Nicolás Melchert | Biólogo | Especialista en Entomología Agrícola**


-------

## 🤝 Contacto y Colaboración
Si tenés dudas técnicas, sugerencias de mejora o encontrás algún bug en el laboratorio, podés contactarme:

- **Email:** nicomelchert.10@gmail.com
