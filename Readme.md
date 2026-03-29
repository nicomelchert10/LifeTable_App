# LifeTable App 🔬 📝

##### Herramienta web optimizada para para el seguimiento de cohortes y cálculo de tablas de vida en entomología.

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

[![React](https://img.shields.io/badge/React-18-blue.svg)](https://reactjs.org/)

![Version](https://img.shields.io/badge/version-1.0.0--beta-orange)

![Open Source](https://img.shields.io/badge/Open%20Source-Yes-brightgreen)

###### LifeTable App nace para modernizar el trabajo de mesada. Permite a los investigadores registrar supervivencia, mudas y fecundidad directamente frente al estereomicroscopio, minimizando el error humano de la transcripción del papel al software.

------------


### Características

- **Modo Lupa:** Interfaz con botones grandes diseñada para ser usada con una sola mano mientras se observa por el microscópio estereoscópico

- **Soporte para múltiples experimentos**: Panel de control que permite tener varios experimentos guardados, especialmente útil cuando se quieren comparar tratamientos.

- **Cálculos en Tiempo Real:** Generación automática de parámetros poblacionales.

- **Soporte para dos modelos de metamorfosis:** Configuración para insectos hemimetábolos y holometábolos.

- **Exportación de tablas**: Descarga de tablas con datos en formato `.csv` listas para analizar en **R**,  **Excel**, o el software estadístico de preferencia.


------------

## Demo 🚀

Accedé a la aplicación aqui : **[https://tu-usuario.github.io/lifetable-app/](https://tu-usuario.github.io/lifetable-app/)**

--------

## 📱 Cómo utilizar LifeTable App

1. **Configuración:** Definí el nombre del tratamiento, condiciones del experimento, número inicial de individuos y el tipo de desarrollo (Hemimetábolo/Holometábolo).
2. **Registro Diario:** Usá el **Modo Lupa** para marcar Supervivencia, Mudas o Fecundidad.
3. **Monitoreo:** Revisá la el panel de resultados para obtener los parámetros poblacionales y ver el progreso de cada individuo.
4. **Análisis:** Una vez finalizado el ciclo, exportá los resultados en `.csv` si querés realizar análisis estadísticos utilizando un software externo

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
