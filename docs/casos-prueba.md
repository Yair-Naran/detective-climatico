# 3 casos para calcular a mano (Mann-Kendall + pendiente de Sen)

Cada caso son 8 años (x = 1..8). **Calculen ustedes antes de abrir `respuestas-casos.md`.**

| Caso | Datos (año 1 → año 8) |
|---|---|
| A (temperatura, °C) | 20.1, 20.4, 20.3, 20.8, 21.0, 20.9, 21.3, 21.5 |
| B (lluvia, mm/día)  | 5.2, 4.1, 5.8, 4.6, 5.0, 4.4, 5.5, 4.8 |
| C (lluvia, mm/día, con empates) | 3.2, 3.0, 3.0, 2.7, 2.9, 2.5, 2.4, 2.4 |

## Pasos
1. **S**: para cada pareja (i < j) con 28 parejas, suma +1 si el dato j es mayor que el i, −1 si es menor, 0 si son iguales.
2. **Varianza de S**: `n(n−1)(2n+5)/18`. Si hay empates (valores repetidos t veces), resta `t(t−1)(2t+5)/18` por cada grupo.
3. **Z**: `(S−1)/√Var` si S>0; `(S+1)/√Var` si S<0; 0 si S=0.
4. **p** (dos colas): con la tabla normal, p = 2·(1 − Φ(|Z|)). Significativo si p < 0.05.
5. **Pendiente de Sen**: la mediana de las 28 pendientes (dato_j − dato_i)/(j − i).
6. Escriban una frase: ¿sube, baja o no hay evidencia? ¿cuánto por década (pendiente × 10)?
