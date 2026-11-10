import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

interface NotionPropertyValue {
  type: string;
  [key: string]: any;
}

interface NotionPage {
  id: string;
  properties: Record<string, NotionPropertyValue>;
  cover?: { type: string; external?: { url: string }; file?: { url: string } };
  last_edited_time: string;
}

function extractPropertyValue(property: NotionPropertyValue): any {
  if (!property) return null;

  switch (property.type) {
    case "title":
      return property.title?.[0]?.plain_text || "";
    case "rich_text":
      return property.rich_text?.[0]?.plain_text || "";
    case "number":
      return property.number;
    case "select":
      return property.select?.name || null;
    case "multi_select":
      return property.multi_select?.map((item: any) => item.name) || [];
    case "checkbox":
      return property.checkbox || false;
    case "files":
      return property.files?.map((file: any) => {
        if (file.type === "external") return file.external?.url;
        if (file.type === "file") return file.file?.url;
        return null;
      }).filter(Boolean) || [];
    case "date":
      return property.date?.start || null;
    default:
      return null;
  }
}

async function normalizeProperty(page: NotionPage) {
  const props = page.properties;

  const titulo = extractPropertyValue(props["PROPIEDAD"]) ||
                 extractPropertyValue(props["Título"]) ||
                 extractPropertyValue(props["Title"]) ||
                 extractPropertyValue(props["Name"]);
  const slug = extractPropertyValue(props["Slug"]);
  const estado = extractPropertyValue(props["Estado"]);
  const destacado = extractPropertyValue(props["Destacado"]) || false;
  const fechaPublicacion = extractPropertyValue(props["Fecha de publicación"]) || page.last_edited_time;

  const isPublished = estado === "Publicada";

  if (!isPublished) return null;

  const barrio = extractPropertyValue(props["Barrio"]) || "";
  const ciudad = extractPropertyValue(props["Ciudad"]) || "Valencia";
  const provincia = extractPropertyValue(props["Provincia"]) || "Valencia";

  const precio = extractPropertyValue(props["Precio"]) || 0;
  const moneda = "EUR";

  const superficie = extractPropertyValue(props["Superficie m²"]) || 0;
  const habitaciones = extractPropertyValue(props["Habitaciones"]) || 0;
  const banos = extractPropertyValue(props["Baños"]) || 0;
  const planta = extractPropertyValue(props["Planta"]);
  const ascensor = extractPropertyValue(props["Ascensor"]) || false;
  const garaje = extractPropertyValue(props["Plaza de garaje"]) || false;
  const terraza = extractPropertyValue(props["Terraza o Balcón"]) || false;
  const anoConstruct = extractPropertyValue(props["Año de construcción"]);
  const estadoInmueble = extractPropertyValue(props["Estado del inmueble"]);
  const certificado = extractPropertyValue(props["Certificado energético"]);

  const descripcionCorta = extractPropertyValue(props["Descripcion"]) || "";
  const caracteristicas = extractPropertyValue(props["Características"]) || [];

  const imagenPortada = extractPropertyValue(props["Imagen portada"]);
  const galeria = extractPropertyValue(props["Galería"]) || [];
  const plano = extractPropertyValue(props["Plano"]);

  const coverImage = imagenPortada?.[0] || (page.cover?.type === "external" ? page.cover.external?.url : page.cover?.file?.url) || null;
  const galleryImages = galeria.length > 0 ? galeria : (coverImage ? [coverImage] : []);

  return {
    id: page.id,
    slug: slug || titulo.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, ""),
    estado: estado,
    destacado: destacado,
    titulo: titulo,
    descripcion: descripcionCorta,
    barrio: barrio,
    ciudad: ciudad,
    provincia: provincia,
    precio: precio,
    superficieM2: superficie,
    habitaciones: habitaciones,
    banos: banos,
    planta: planta,
    ascensor: ascensor,
    garaje: garaje,
    terraza: terraza,
    estadoInmueble: estadoInmueble,
    fechaPublicacion: fechaPublicacion,
    anoConstruccion: anoConstruct,
    imagenPortada: coverImage,
    galeria: galleryImages,
    plano: plano?.[0] || null,
    updatedAt: page.last_edited_time,
  };
}

async function fetchNotionDatabase(databaseId: string, secretKey: string, connectionKey: string) {
  const res = await fetch(
    `https://api.picaos.com/v1/passthrough/v1/databases/${databaseId}`,
    {
      method: "GET",
      headers: {
        "x-pica-secret": secretKey,
        "x-pica-connection-key": connectionKey,
        "x-pica-action-id": "conn_mod_def::GHfWYW_uJ4s::iK4x1-LFRzSF3oXLlDdhrA",
        "Content-Type": "application/json",
      },
    }
  );

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`Failed to fetch database: ${errorText}`);
  }

  return res.json();
}

async function fetchAllDatabaseItems(dataSourceId: string, secretKey: string, connectionKey: string) {
  const res = await fetch(
    `https://api.picaos.com/v1/passthrough/data_sources/${dataSourceId}/query`,
    {
      method: "POST",
      headers: {
        "x-pica-secret": secretKey,
        "x-pica-connection-key": connectionKey,
        "x-pica-action-id": "conn_mod_def::GHfWZCu-4SU::-mgQyb4cQjeJWdQMXbTlAg",
        "Content-Type": "application/json",
        "Notion-Version": "2025-09-03",
      },
      body: JSON.stringify({}),
    }
  );

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`Failed to fetch items: ${errorText}`);
  }

  return res.json();
}

async function getFullNotionDatabaseWithItems(databaseId: string, secretKey: string, connectionKey: string) {
  const db = await fetchNotionDatabase(databaseId, secretKey, connectionKey);
  const dataSourceIds = db.data_sources.map((ds: { id: string }) => ds.id);

  const allData = await Promise.all(
    dataSourceIds.map((dsid: string) => fetchAllDatabaseItems(dsid, secretKey, connectionKey))
  );

  return {
    database: db,
    allItems: allData.map((r: any) => r.results).flat(),
  };
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  const PICA_SECRET_KEY = Deno.env.get("PICA_SECRET_KEY_prop");
  const PICA_CONNECTION_KEY = Deno.env.get("PICA_NOTION_CONNECTION_KEY_prop");

  if (!PICA_SECRET_KEY || !PICA_CONNECTION_KEY) {
    return new Response(
      JSON.stringify({
        error: "Missing Pica env vars for properties"
      }),
      {
        status: 500,
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      }
    );
  }

  try {
    const databaseId = "2cd4fdc2d1b680e18502f3d427883216";

    const { allItems } = await getFullNotionDatabaseWithItems(databaseId, PICA_SECRET_KEY, PICA_CONNECTION_KEY);

    const propertiesPromises = allItems.map((page: NotionPage) => normalizeProperty(page));
    const propertiesResolved = await Promise.all(propertiesPromises);

    const items = propertiesResolved
      .filter((prop: any) => prop !== null)
      .sort((a: any, b: any) => {
        return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
      });

    return new Response(JSON.stringify({ items }), {
      headers: {
        ...corsHeaders,
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    console.error("Error fetching properties:", error);

    return new Response(
      JSON.stringify({
        error: "Failed to fetch properties",
        message: error instanceof Error ? error.message : "Unknown error",
      }),
      {
        status: 500,
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      }
    );
  }
});