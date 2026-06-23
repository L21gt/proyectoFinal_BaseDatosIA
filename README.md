# Sistema Inteligente de Consulta para Call Center de Ventas

## Descripción del Negocio y Arquitectura

Este proyecto es un backend inteligente en Node.js y TypeScript diseñado para un call center de ventas. Permite consultar tanto datos estructurados (campañas, prospectos, llamadas) almacenados en PostgreSQL, como documentos internos (guiones, objeciones) mediante la técnica RAG (Retrieval-Augmented Generation). No es un chatbot con memoria, sino una API RESTful sin estado donde cada petición se procesa independientemente y devuelve una respuesta generada en español.

## Requisitos y Configuración de Entorno

Crea un archivo `.env` basado en `.env.example`:

- `PORT`: Puerto del servidor (ej. 3000).
- `SUPABASE_URL`: URL de tu proyecto en Supabase.
- `SUPABASE_SERVICE_ROLE_KEY`: Clave de servicio para omitir RLS.
- `OLLAMA_BASE_URL`: URL de tu instancia local de Ollama (usualmente `http://localhost:11434`).
- `OLLAMA_CHAT_MODEL`: `llama3.2:1b` (Elegido por su bajo consumo de recursos y alta velocidad de inferencia).
- `OLLAMA_EMBEDDING_MODEL`: `nomic-embed-text`.

## Instalación y Ejecución

1. Instalar dependencias: `npm install`
2. Ejecutar base de datos: Correr el script `database.sql` en Supabase (asegurarse de tener habilitada la extensión `vector`).
3. Modelos IA: Ejecutar en terminal `ollama pull llama3.2:1b` y `ollama pull nomic-embed-text`.
4. Levantar entorno de desarrollo: `npm run dev`
5. Compilar a producción: `npm run build` y luego `npm start`.

## Funcionamiento Técnico

### 1. Clasificador de Intención

Utiliza `ChatPromptTemplate` y `StructuredOutputParser` con **Zod** para obligar al LLM a devolver un JSON estricto. Clasifica las consultas en 5 tipos: `database`, `rag`, `hybrid`, `general` y `unsupported`, extrayendo también entidades clave (nombre de tabla, estados, etc.).

### 2. Recuperación (RAG y DB)

Dependiendo de la clasificación, el sistema orquesta:

- **Database:** Búsquedas estructuradas en Supabase (evitando generación libre de SQL por seguridad).
- **RAG:** Búsqueda de similitud vectorial en PostgreSQL usando `pgvector`. Los documentos ingresan vía endpoint HTTP, se dividen con `RecursiveCharacterTextSplitter` y se incrustan con Ollama Embeddings.

### 3. Generación Final (Separación de Responsabilidades)

Una vez recuperado el contexto (`databaseContext` y `documentContext`), un segundo flujo con un prompt independiente redacta la respuesta final en español, asegurando que no se inventen datos.

## Ejemplos de Prueba (cURL)

**1. Ingesta de Documento RAG (Asegúrate de tener un archivo .txt en la ruta indicada)**

```bash
curl -X POST http://localhost:3000/api/documents/ingest \
  -F "file=@./docs/guion_llamada_inicial.txt" \
  -F "title=Guion inicial" \
  -F "category=Ventas"
```

**2. Consulta a Base de Datos**

```bash
curl -X POST http://localhost:3000/api/query \
  -H "Content-Type: application/json" \
  -d "{\"question\":\"¿Qué campañas activas están disponibles?\"}"
```

**3. Consulta Híbrida**

```bash
curl -X POST http://localhost:3000/api/query \
  -H "Content-Type: application/json" \
  -d "{\"question\":\"¿Qué prospectos de alto interés necesitan seguimiento y qué guion debo usar?\"}"
```

---
