---
title: "Relatividad Especial: Problemas Resueltos y Ejercicios Prácticos"
description: "Pon a prueba tu comprensión de la relatividad especial con 9 problemas resueltos paso a paso y 12 ejercicios propuestos. Dilatación del tiempo, contracción de longitudes, E=mc² y la paradoja de los gemelos."
slug: "relatividad-especial-practica"
author: "Aeterna"
category: "ciencias"
subcategory: "fisica"
tags: ["física", "relatividad especial", "Einstein", "dilatación del tiempo", "contracción de longitudes", "E=mc²", "paradoja de los gemelos", "problemas resueltos", "ejercicios de física"]
image: "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?q=80&w=2070&auto=format&fit=crop"
date: "2026-05-09"
nivel: 3
orden : 2
insignia: "Explorador de lo Oculto"
tipo: practice
---

## Índice

- [🧪 Bienvenida: Calculando lo imposible](#-bienvenida-calculando-lo-imposible)
- [1. El factor de Lorentz: la llave de la relatividad](#1-el-factor-de-lorentz-la-llave-de-la-relatividad)
- [2. Problemas de dilatación del tiempo](#2-problemas-de-dilatación-del-tiempo)
- [3. Problemas de contracción de longitudes](#3-problemas-de-contracción-de-longitudes)
- [4. Problemas de masa y energía (E=mc²)](#4-problemas-de-masa-y-energía-emc)
- [5. La paradoja de los gemelos](#5-la-paradoja-de-los-gemelos)
- [6. Ejercicios propuestos](#6-ejercicios-propuestos)
- [🧠 Autoevaluación: ¿Qué tal lo has hecho?](#-autoevaluación-qué-tal-lo-has-hecho)

---

## 🧪 Bienvenida: Calculando lo imposible

La relatividad especial es una teoría que desafía el sentido común. Pero sus matemáticas son sorprendentemente accesibles. Con una calculadora, un poco de álgebra y las fórmulas adecuadas, puedes calcular exactamente cuánto envejece el gemelo viajero, cuánto se contrae una nave espacial y cuánta energía contiene un simple terrón de azúcar.

En esta parada vas a ensuciarte las manos. Todos los problemas están resueltos paso a paso, y al final encontrarás ejercicios propuestos para practicar por tu cuenta.

> **💡 Cómo usar esta parada**
>
> No leas las soluciones directamente. Intenta resolver cada problema antes de mirar la respuesta. La física se aprende con el lápiz, no con los ojos.

---

## 1. El factor de Lorentz: la llave de la relatividad

Antes de lanzarnos a los problemas, necesitas dominar una herramienta matemática que aparece en casi todas las ecuaciones de la relatividad especial: el **factor de Lorentz**, representado por la letra griega γ (gamma).

### La fórmula

**γ = 1 / √(1 - v²/c²)**

Donde:
- `v` es la velocidad relativa del objeto o del observador.
- `c` es la velocidad de la luz en el vacío (c ≈ 3 × 10⁸ m/s).

### ¿Para qué sirve γ?

El factor de Lorentz es el "multiplicador mágico" de la relatividad. Te dice cuánto se dilata el tiempo, cuánto se contrae el espacio y cuánto aumenta la masa con la velocidad.

| Valor de v (fracción de c) | γ ≈ | ¿Qué significa? |
| :--- | :--- | :--- |
| 0.1c (10% de c) | 1.005 | Efectos relativistas casi imperceptibles |
| 0.5c (50% de c) | 1.155 | Empiezan a notarse |
| 0.9c (90% de c) | 2.294 | El tiempo se dilata al doble |
| 0.99c (99% de c) | 7.089 | El tiempo se dilata 7 veces |
| 0.999c (99.9% de c) | 22.37 | El tiempo se dilata 22 veces |

### ✅ Problema resuelto 1.1: Calcular γ para v = 0.8c

**Enunciado:** Una nave viaja al 80% de la velocidad de la luz (v = 0.8c). Calcula el factor de Lorentz γ.

**Solución paso a paso:**

1. La fórmula es: `γ = 1 / √(1 - v²/c²)`.
2. Como `v = 0.8c`, entonces `v/c = 0.8`, y `v²/c² = (0.8)² = 0.64`.
3. Calculamos el interior de la raíz: `1 - 0.64 = 0.36`.
4. La raíz cuadrada: `√0.36 = 0.6`.
5. Finalmente: `γ = 1 / 0.6 ≈ 1.667`.

**Respuesta:** Para v = 0.8c, el factor de Lorentz es **γ ≈ 1.667**. Esto significa que el tiempo se dilata aproximadamente 1.67 veces y las longitudes se contraen en la misma proporción.

---

## 2. Problemas de dilatación del tiempo

La fórmula de la **dilatación del tiempo** es:

**Δt = γ · Δt₀**

Donde:
- `Δt₀` es el **tiempo propio**: el intervalo medido por un observador en reposo respecto al reloj.
- `Δt` es el tiempo medido por un observador que ve el reloj moverse a velocidad `v`.

### ✅ Problema resuelto 2.1: El vuelo del muón

**Enunciado:** Los muones son partículas subatómicas que se crean en la alta atmósfera cuando los rayos cósmicos chocan con los átomos del aire. En reposo, un muón tiene una vida media de solo 2.2 microsegundos (2.2 × 10⁻⁶ s) antes de desintegrarse. Sin la relatividad, viajando casi a la velocidad de la luz, recorrerían apenas unos 660 metros antes de desaparecer. Sin embargo, los detectamos en la superficie terrestre, ¡a más de 10 km de altura! Esto es posible porque viajan a 0.999c (γ ≈ 22.4). ¿Cuál es su vida media desde nuestro punto de vista?

**Solución paso a paso:**

1. Datos: `Δt₀ = 2.2 × 10⁻⁶ s`, `γ ≈ 22.4`, `Δt = ?`.
2. Aplica la fórmula: `Δt = γ · Δt₀`.
3. Sustituye: `Δt = 22.4 × (2.2 × 10⁻⁶ s) = 4.928 × 10⁻⁵ s ≈ 49.3 µs`.
4. ¿Qué distancia pueden recorrer a 0.999c en 49.3 µs? `d = v × t ≈ (3 × 10⁸ m/s) × (4.93 × 10⁻⁵ s) ≈ 14.800 m ≈ 15 km`.

**Respuesta:** Desde nuestro punto de vista, los muones viven **49.3 µs** (22 veces más) y pueden recorrer **15 km**, suficiente para llegar a la superficie terrestre. Sin relatividad, no detectaríamos muones al nivel del mar. Es una de las confirmaciones más elegantes de la dilatación temporal.

### ✅ Problema resuelto 2.2: El astronauta y su reloj

**Enunciado:** Un astronauta viaja al 90% de la velocidad de la luz (v = 0.9c). Según su reloj, el viaje dura 5 años. ¿Cuánto tiempo ha transcurrido en la Tierra?

**Solución paso a paso:**

1. Datos: `v = 0.9c`, `Δt₀ = 5 años`, `Δt = ?`.
2. Primero calculamos γ: `γ = 1 / √(1 - 0.9²) = 1 / √(1 - 0.81) = 1 / √0.19 ≈ 1 / 0.4359 ≈ 2.294`.
3. Aplica la fórmula: `Δt = γ · Δt₀ = 2.294 × 5 años ≈ 11.47 años`.
4. Diferencia: `11.47 - 5 = 6.47 años`. El astronauta ha "saltado" casi 6 años y medio hacia el futuro terrestre.

**Respuesta:** En la Tierra han transcurrido **11.47 años** mientras que para el astronauta solo pasaron 5 años. El astronauta ha viajado 6.47 años al futuro.

### ✅ Problema resuelto 2.3: Viaje al centro de la galaxia

**Enunciado:** Una nave viaja al 99.9% de la velocidad de la luz (v = 0.999c) hacia el centro de la Vía Láctea. Para los astronautas, el viaje dura 10 años. ¿Cuánto tiempo pasa en la Tierra?

**Solución paso a paso:**

1. Datos: `v = 0.999c`, `Δt₀ = 10 años`, `Δt = ?`.
2. Calculamos γ: `γ = 1 / √(1 - 0.999²) = 1 / √(1 - 0.998001) = 1 / √0.001999 ≈ 1 / 0.04471 ≈ 22.37`.
3. Aplica la fórmula: `Δt = γ · Δt₀ = 22.37 × 10 años = 223.7 años`.

**Respuesta:** En la Tierra han pasado **224 años**. Los astronautas regresarían a un mundo completamente distinto, aunque para ellos solo habría sido una década.

---

## 3. Problemas de contracción de longitudes

La fórmula de la **contracción de longitudes** es:

**L = L₀ / γ**

Donde:
- `L₀` es la **longitud propia**: la medida por un observador en reposo respecto al objeto.
- `L` es la longitud medida por un observador que ve el objeto moverse a velocidad `v`.

### ✅ Problema resuelto 3.1: La nave que se encoge

**Enunciado:** Una nave espacial mide 200 metros en reposo. Viaja al 80% de la velocidad de la luz (v = 0.8c, γ ≈ 1.667). ¿Cuánto mide para un observador en la Tierra?

**Solución paso a paso:**

1. Datos: `L₀ = 200 m`, `γ ≈ 1.667`, `L = ?`.
2. Aplica la fórmula: `L = L₀ / γ`.
3. Sustituye: `L = 200 m / 1.667 ≈ 120 metros`.

**Respuesta:** Para el observador terrestre, la nave mide **120 metros** en la dirección del movimiento. Para los astronautas sigue midiendo 200 metros. La contracción solo se da en la dirección del movimiento y no es una ilusión: es una consecuencia real de la geometría del espacio-tiempo.

### ✅ Problema resuelto 3.2: El tubo del acelerador de partículas

**Enunciado:** En el acelerador de partículas del CERN, los protones viajan a una velocidad de 0.999999c. Su factor de Lorentz es γ ≈ 707. Si un tubo del acelerador mide 1 km en el laboratorio, ¿cuánto mide desde la perspectiva del protón?

**Solución paso a paso:**

1. Datos: `L₀ = 1.000 m = 1 km`, `γ ≈ 707`, `L = ?`.
2. Aplica la fórmula: `L = L₀ / γ`.
3. Sustituye: `L = 1.000 m / 707 ≈ 1.41 metros`.

**Respuesta:** Desde la perspectiva del protón, el tubo de 1 km mide poco más de **1.4 metros**. Para el protón, recorrer esos 1.4 metros a una velocidad casi igual a c es casi instantáneo. Para nosotros, recorre 1 km en 3.3 microsegundos.

---

## 4. Problemas de masa y energía (E=mc²)

La fórmula de la **equivalencia masa-energía** es:

**E = m · c²**

Donde:
- `E` es la energía equivalente a la masa `m`.
- `c` es la velocidad de la luz (c ≈ 3 × 10⁸ m/s).

### ✅ Problema resuelto 4.1: Energía contenida en un terrón de azúcar

**Enunciado:** Un terrón de azúcar tiene una masa de 4 gramos (0.004 kg). Si toda esa masa pudiera convertirse en energía, ¿cuánta energía se liberaría? Compárala con el consumo eléctrico anual de un hogar medio español (unos 3.500 kWh, equivalentes a 1.26 × 10¹⁰ J).

**Solución paso a paso:**

1. Datos: `m = 0.004 kg`, `c = 3 × 10⁸ m/s`, `E = ?`.
2. Aplica la fórmula: `E = m · c²`.
3. Sustituye: `E = 0.004 kg × (3 × 10⁸ m/s)² = 0.004 × 9 × 10¹⁶ = 3.6 × 10¹⁴ julios`.
4. Compáralo con el consumo anual del hogar: `(3.6 × 10¹⁴ J) / (1.26 × 10¹⁰ J) ≈ 28.571`.

**Respuesta:** Un terrón de azúcar contiene **360 billones de julios**, suficiente para alimentar casi **29.000 hogares** durante un año.

### ✅ Problema resuelto 4.2: La energía del Sol

**Enunciado:** El Sol convierte aproximadamente 4.3 millones de toneladas de masa en energía cada segundo (4.3 × 10⁹ kg/s). ¿Cuánta energía produce el Sol por segundo?

**Solución paso a paso:**

1. Datos: `m = 4.3 × 10⁹ kg`, `c = 3 × 10⁸ m/s`, `E = ?`.
2. Aplica la fórmula: `E = m · c²`.
3. Sustituye: `E = (4.3 × 10⁹ kg) × (3 × 10⁸ m/s)² = 4.3 × 10⁹ × 9 × 10¹⁶ = 3.87 × 10²⁶ W`.

**Respuesta:** El Sol produce **3.87 × 10²⁶ vatios** cada segundo. Esa energía bastaría para alimentar a la humanidad durante medio millón de años.

---

## 5. La paradoja de los gemelos

### ✅ Problema resuelto 5.1: El reencuentro

**Enunciado:** Dos gemelos, Ana y Luis, tienen 25 años. Ana viaja a una estrella situada a 20 años luz de la Tierra en una nave que viaja al 80% de la velocidad de la luz (v = 0.8c). Al llegar, da la vuelta y regresa a la misma velocidad. ¿Qué edad tiene cada uno cuando se reencuentran?

**Solución paso a paso:**

1. Datos: `v = 0.8c`, distancia total = 40 años luz (ida y vuelta), `γ = 1 / √(1 - 0.8²) = 1 / 0.6 ≈ 1.667`.
2. Tiempo en la Tierra (Δt): `Δt = distancia / velocidad = 40 años luz / 0.8c = 50 años`. Luis tendrá 25 + 50 = **75 años**.
3. Tiempo para Ana (Δt₀): `Δt₀ = Δt / γ = 50 años / 1.667 ≈ 30 años`. Ana tendrá 25 + 30 = **55 años**.
4. Diferencia de edad: Ana ha rejuvenecido 20 años respecto a su gemelo.

**Respuesta:** Cuando se reencuentran, **Luis tiene 75 años y Ana tiene 55 años**. Ana ha vivido 20 años menos que su gemelo terrestre.

---

## 6. Ejercicios propuestos

Intenta resolver estos ejercicios por tu cuenta y pon a prueba todo lo aprendido en la guía. Recuerda que el factor de Lorentz (γ) debes calcularlo en cada caso a partir de la velocidad dada.

### ✏️ Dilatación del tiempo

```aeterna-exercise
**Ejercicio 1:** Una nave viaja al 85% de la velocidad de la luz (v = 0.85c). Según el reloj de la nave, el viaje dura 4 años. ¿Cuánto tiempo transcurre en la Tierra?
PISTA: Calcula primero el factor gamma (γ = 1 / √(1 - v²/c²)) y luego aplícalo para hallar el tiempo dilatado en la Tierra (Δt = γ · Δt₀).
RESPUESTA_CORRECTA: 7.59 años
```

```aeterna-exercise
**Ejercicio 2:** Un astronauta quiere viajar a una estrella situada a 50 años luz y regresar. Si dispone de 20 años de tiempo propio (según su reloj), ¿a qué velocidad constante (en fracción de c) debe viajar?
PISTA: Usa la fórmula de la dilatación del tiempo e itera probando velocidades, o despeja v de Δt₀ = (distancia / v) / γ.
RESPUESTA_CORRECTA: 0.981c
```

```aeterna-exercise
**Ejercicio 3:** Un reloj atómico en un satélite GPS viaja a 14.000 km/h (~3.888 m/s). Si el reloj en tierra mide un intervalo de 24 horas exactas, ¿cuánto tiempo menos mide el reloj del satélite debido a la relatividad especial?
PISTA: Usa la aproximación γ ≈ 1 + v²/(2c²) para velocidades bajas, calcula el tiempo dilatado Δt = γ · Δt₀ y obtén la diferencia Δt - Δt₀.
RESPUESTA_CORRECTA: 7.3 microsegundos
```

### ✏️ Contracción de longitudes

```aeterna-exercise
**Ejercicio 4:** Una barra metálica de 10 metros en reposo se mueve al 60% de la velocidad de la luz. ¿Qué longitud mide un observador en reposo?
PISTA: Calcula el factor gamma para v = 0.6c y aplica la fórmula de la contracción de longitudes: L = L₀ / γ.
RESPUESTA_CORRECTA: 8 metros
```

```aeterna-exercise
**Ejercicio 5:** Desde la Tierra, una nave espacial mide 80 metros de largo cuando viaja al 95% de c. ¿Cuál es su longitud en reposo?
PISTA: Despeja la longitud propia (L₀) de la fórmula de la contracción de longitudes: L₀ = L · γ.
RESPUESTA_CORRECTA: 256 metros
```

```aeterna-exercise
**Ejercicio 6:** Un electrón se mueve a 0.9999c. ¿Cuánto se contrae un objeto de 1 metro en su dirección de movimiento?
PISTA: Calcula el factor γ para 0.9999c y aplica la contracción a 1 metro.
RESPUESTA_CORRECTA: 1.41 cm
```

### ✏️ Equivalencia masa-energía

```aeterna-exercise
**Ejercicio 7:** Una central nuclear consume 1 kg de uranio en un día. Si solo el 0.1% de esa masa se convierte en energía, ¿cuánta energía se libera?
PISTA: Calcula el 0.1% de 1 kg y usa la ecuación E = mc².
RESPUESTA_CORRECTA: 9 × 10¹³ J
```

```aeterna-exercise
**Ejercicio 8:** ¿Cuánta masa se convierte en energía en una bomba atómica que libera 8.4 × 10¹³ J?
PISTA: Despeja la masa de la ecuación de Einstein: m = E / c².
RESPUESTA_CORRECTA: 0.93 gramos
```

```aeterna-exercise
**Ejercicio 9:** El Sol pierde 4.3 millones de toneladas por segundo. ¿Cuánta masa perderá en 5 mil millones de años? Exprésala en porciento de masa solar de pérdida (Masa del Sol ≈ 2 × 10³⁰ kg y 1 año ≈ 3.15 × 10⁷ s).
PISTA: Multiplica la pérdida de masa por segundo por el total de segundos en 5 mil millones de años, y divídelo entre la masa total del Sol.
RESPUESTA_CORRECTA: 0.034% de la masa solar
```

### ✏️ Paradoja de los gemelos y viajes interestelares

```aeterna-exercise
**Ejercicio 10:** Un gemelo viaja a 0.8c a una estrella a 30 años luz y vuelve. ¿Cuánto envejece cada uno durante el viaje de ida y vuelta?
PISTA: El viaje total es 60 años luz ida y vuelta. Calcula el tiempo en la Tierra (distancia / velocidad) y el tiempo del viajero dividiendo por el factor γ.
RESPUESTA_CORRECTA: Terrestre: 75 años, Viajero: 45 años
```

```aeterna-exercise
**Ejercicio 11:** Una nave viaja al 99% de c hacia la galaxia de Andrómeda, situada a 2.5 millones de años luz. ¿Cuánto tiempo experimentan los tripulantes?
PISTA: La distancia a Andrómeda es 2.5 millones de años luz. Calcula el tiempo del viaje terrestre asumiendo que solo es ida y divídelo por γ.
RESPUESTA_CORRECTA: 356 mil años
```

```aeterna-exercise
**Ejercicio 12:** Un astronauta de 40 años viaja a 0.7c durante 15 años según su reloj. Al regresar, su hijo tiene 50 años. ¿Qué edad tenía el hijo cuando el astronauta partió?
PISTA: Calcula el tiempo transcurrido en la Tierra (Δt = Δt₀ · γ) donde Δt₀ es 15 años. Resta este valor a la edad actual del hijo para saber cuántos años tenía cuando el viaje inició.
RESPUESTA_CORRECTA: 29 años

```

### Soluciones a los ejercicios propuestos

**Ejercicio 1:**
- `γ = 1 / √(1 - 0.85²) ≈ 1.898`. `Δt = γ × 4 años ≈ 7.59 años`. **Respuesta:** 7.59 años.

**Ejercicio 2:**
- Método iterativo: Δt = 100 años luz / v. Debe cumplirse Δt₀ = 20 = Δt / γ. Se prueba con v = 0.98c (γ ≈ 5.0): Δt = 100/0.98 ≈ 102 años, Δt₀ = 102/5 ≈ 20.4 años (cercano). Con v = 0.981c (γ ≈ 5.1): Δt ≈ 101.9, Δt₀ ≈ 19.98. **Respuesta:** v ≈ 0.981c.

**Ejercicio 3:**
- v²/c² ≈ 1.68 × 10⁻¹⁰; γ ≈ 1 + 8.4 × 10⁻¹¹; Δt₀ ≈ 24 h × 3600 s/h = 86.400 s; Δt = γ × Δt₀ ≈ 86.400 + 7.26 × 10⁻⁶ s. Diferencia: ~7.3 microsegundos. **Respuesta:** El reloj del satélite atrasa unos 7.3 µs por día (solo por relatividad especial; en realidad, el efecto gravitatorio lo adelanta más).

**Ejercicio 4:**
- γ = 1 / √(1 - 0.36) = 1.25; L = 10 m / 1.25 = 8 m. **Respuesta:** 8 metros.

**Ejercicio 5:**
- γ = 1 / √(1 - 0.95²) ≈ 3.202; L₀ = L × γ = 80 m × 3.202 ≈ 256 m. **Respuesta:** 256 metros.

**Ejercicio 6:**
- γ = 1 / √(1 - 0.9999²) ≈ 70.71; L = 1 m / 70.71 ≈ 0.0141 m = 1.41 cm. **Respuesta:** Mide 1.41 cm.

**Ejercicio 7:**
- masa convertida: 0.001 kg; E = 0.001 × (3×10⁸)² = 9 × 10¹³ J. **Respuesta:** 9 × 10¹³ J.

**Ejercicio 8:**
- m = E / c² = (8.4 × 10¹³) / (9 × 10¹⁶) ≈ 0.00093 kg = 0.93 gramos. **Respuesta:** Aproximadamente 0.93 gramos.

**Ejercicio 9:**
- Pérdida total = (4.3×10⁹ kg/s) × (1.577×10¹⁷ s) ≈ 6.78×10²⁶ kg. En masas solares: 6.78×10²⁶ / 2×10³⁰ ≈ 0.00034 masas solares. **Respuesta:** ~0.034% de la masa solar.

**Ejercicio 10:**
- γ = 1.667; Δt = 60/0.8 = 75 años (Tierra); Δt₀ = 75/1.667 ≈ 45 años (viajero). **Respuesta:** El terrestre suma 75 años; el viajero, 45 años.

**Ejercicio 11:**
- γ para 0.99c ≈ 7.09; Δt (Tierra) ≈ 2.5×10⁶ / 0.99 ≈ 2.525×10⁶ años; Δt₀ = 2.525×10⁶ / 7.09 ≈ 356.000 años. **Respuesta:** Los tripulantes envejecen 356 mil años.

**Ejercicio 12:**
- γ = 1 / √(1 - 0.7²) ≈ 1.4; Δt (Tierra) = 15 × 1.4 = 21 años. Si el hijo tiene ahora 50 años, al partir tenía 50 - 21 = 29 años. **Respuesta:** El hijo tenía 29 años cuando el astronauta partió.

---
---

## 🧠 Autoevaluación: ¿Qué tal lo has hecho?

| Ejercicios correctos | Diagnóstico |
| :--- | :--- |
| 0-4 | Repasa la parada teórica de relatividad especial. |
| 5-8 | Buen trabajo. Conceptos generales claros, pero afina los detalles. |
| 9-11 | Excelente. Dominas la relatividad especial cuantitativa. |
| 12 | Sobresaliente. Listo para relatividad general. |

---

> **⚠️ Siguiente parada: Relatividad General**
>
> Has dominado la relatividad especial. Ahora prepárate para la relatividad general: la gravedad como curvatura del espacio-tiempo, los agujeros negros, las ondas gravitacionales y la expansión del universo. [Sigue la ruta →](#)

---

```aeterna-affiliate
TITLE: Física para la ciencia y la tecnología
AUTHOR: Tipler y Mosca
IMAGE: https://m.media-amazon.com/images/I/81gLKAAE0rL._SL1500_.jpg
LINK: https://amzn.to/4wjkLdf
RATING: 4.8
DESCRIPTION: Contiene capítulos enteros dedicados a la relatividad especial con decenas de problemas resueltos. Es una referencia imprescindible si quieres seguir practicando y profundizar en la física moderna.
```