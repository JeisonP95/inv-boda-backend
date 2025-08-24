# Sistema de Gestión de Invitados

Este sistema permite gestionar una lista de invitados con restricciones de acompañantes para confirmaciones de asistencia.

## Estructura de Datos

### Modelo Invitado
- `name`: Nombre completo del invitado
- `phone`: Número de teléfono
- `maxGuests`: Número máximo de personas permitidas
  - `1`: Solo el invitado
  - `2`: El invitado + 1 acompañante

## Cómo Usar

### 1. Cargar Lista de Invitados

#### Opción A: Usar lista predefinida
```bash
npm run load-invitados
```

#### Opción B: Usar archivo CSV (Recomendado)
1. Crea un archivo `invitados.csv` en la raíz del backend con este formato:
```csv
name,phone,maxGuests
Valentina,3001234567,1
Yeison,3007654321,2
María García,3001111111,2
Juan Pérez,3002222222,1
```

2. Ejecuta el script:
```bash
npm run load-invitados-csv
```

### 2. Formato del CSV
- **name**: Nombre completo del invitado
- **phone**: Número de teléfono (sin espacios ni guiones)
- **maxGuests**: 1 o 2 (número máximo de personas)

### 3. Endpoints Disponibles

#### Buscar Invitado
```
POST /api/invitados/find
Body: { "name": "Nombre", "phone": "3001234567" }
```

#### Crear Invitado (Administración)
```
POST /api/invitados
Body: { "name": "Nombre", "phone": "3001234567", "maxGuests": 2 }
```

#### Listar Invitados (Administración)
```
GET /api/invitados
```

#### Crear RSVP
```
POST /api/rsvp
Body: { "name": "Nombre", "phone": "3001234567", "attending": true, "guests": 2 }
```

## Flujo de Funcionamiento

1. **Usuario ingresa nombre y teléfono** en el formulario de confirmación
2. **Sistema busca al invitado** en la base de datos
3. **Si se encuentra**, se muestra el select con opciones según `maxGuests`:
   - Si `maxGuests = 1`: Solo "Solo yo"
   - Si `maxGuests = 2`: "Solo yo" y "Yo + 1 acompañante"
4. **Usuario confirma asistencia** y se guarda en la base de datos

## Ejemplos de Restricciones

- **Valentina**: `maxGuests = 1` → Solo puede ir ella
- **Yeison**: `maxGuests = 2` → Puede ir él + 1 acompañante
- **María García**: `maxGuests = 2` → Puede ir ella + 1 acompañante

## Notas Importantes

- Los nombres se buscan ignorando mayúsculas/minúsculas
- El teléfono debe coincidir exactamente
- Si no se encuentra el invitado, se muestra un mensaje de error
- El campo `guests` solo se valida cuando `attending = true`
