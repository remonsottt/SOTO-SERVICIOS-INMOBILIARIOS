import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

const DATABASE_ID = "8c333119a6804e209e36fcae9c97e70f";

interface ValuationPayload {
  name: string;
  phone: string;
  email?: string;
  address: string;
  neighborhood?: string;
  city?: string;
  property_type?: string;
  built_m2?: number;
  bedrooms?: number;
  bathrooms?: number;
  valuation_avg?: number;
  valuation_min?: number;
  valuation_max?: number;
  confidence?: string;
  trend_3m?: number;
  dom_days?: number;
  utm?: string;
  notes?: string;
}

function sanitizeString(value: any): string | null {
  if (value === null || value === undefined || value === "") return null;
  return String(value).trim();
}

function sanitizeNumber(value: any): number | null {
  if (value === null || value === undefined || value === "") return null;
  const num = Number(value);
  if (isNaN(num) || !isFinite(num)) return null;
  return num;
}

function sanitizePhone(value: any): string | null {
  const str = sanitizeString(value);
  if (!str) return null;
  return str.replace(/[^\d+\s()-]/g, "").trim();
}

function sanitizeEmail(value: any): string | null {
  const str = sanitizeString(value);
  if (!str || !str.includes("@")) return null;
  return str;
}

async function insertNotionItem(payload: ValuationPayload) {
  const PICA_SECRET = Deno.env.get("PICA_SECRET_KEY_val");
  const PICA_CONNECTION = Deno.env.get("PICA_NOTION_CONNECTION_KEY_val");

  if (!PICA_SECRET || !PICA_CONNECTION) {
    return {
      success: false,
      stage: "credentials",
      error: "Missing Pica credentials",
    };
  }

  const name = sanitizeString(payload.name);
  const phone = sanitizePhone(payload.phone);
  const address = sanitizeString(payload.address);

  if (!name || !phone || !address) {
    return {
      success: false,
      stage: "validation",
      error: "Missing required fields: name, phone, or address",
    };
  }

  try {
    const dbResp = await fetch(
      `https://api.picaos.com/v1/passthrough/v1/databases/${DATABASE_ID}`,
      {
        method: "GET",
        headers: {
          "x-pica-secret": PICA_SECRET,
          "x-pica-connection-key": PICA_CONNECTION,
          "x-pica-action-id": "conn_mod_def::GHfWYW_uJ4s::iK4x1-LFRzSF3oXLlDdhrA",
          "Content-Type": "application/json",
        },
      }
    );

    if (!dbResp.ok) {
      const errorText = await dbResp.text();
      return {
        success: false,
        stage: "get_database",
        status: dbResp.status,
        error: "Failed to get Notion database",
        details: errorText,
      };
    }

    const dbJson = await dbResp.json();
    const dataSourceId = dbJson.data_sources?.[0]?.id;

    if (!dataSourceId) {
      return {
        success: false,
        stage: "get_database",
        error: "No data source found in database",
      };
    }

    const dsResp = await fetch(
      `https://api.picaos.com/v1/passthrough/v1/data_sources/${dataSourceId}`,
      {
        method: "GET",
        headers: {
          "x-pica-secret": PICA_SECRET,
          "x-pica-connection-key": PICA_CONNECTION,
          "x-pica-action-id": "conn_mod_def::GHfWY4YcpAE::RiRga8aMQrCFJlJgPO02NA",
          "Content-Type": "application/json",
        },
      }
    );

    if (!dsResp.ok) {
      const errorText = await dsResp.text();
      return {
        success: false,
        stage: "get_data_source",
        status: dsResp.status,
        error: "Failed to get data source",
        details: errorText,
      };
    }

    const dsJson = await dsResp.json();

    const schemaProps = dsJson.properties ?? {};
    const titlePropName = Object.keys(schemaProps).find(
      (k) => schemaProps[k]?.type === "title"
    );

    if (!titlePropName) {
      return {
        success: false,
        stage: "schema",
        error: "No title property found in data source schema",
        details: Object.keys(schemaProps),
      };
    }

    const ensureOption = async (prop: string, value: string) => {
      if (!value) return;

      const propDef = schemaProps[prop];
      if (!propDef || !["select", "multi_select"].includes(propDef.type)) return;

      const options = propDef[propDef.type]?.options || [];
      const exists = options.some((opt: any) => opt.name === value);

      if (!exists) {
        const newOptions = [...options, { name: value, color: "default" }];
        const body = {
          properties: {
            [prop]: {
              type: propDef.type,
              [propDef.type]: { options: newOptions },
            },
          },
        };

        const patchResp = await fetch(
          `https://api.picaos.com/v1/passthrough/v1/data_sources/${dataSourceId}`,
          {
            method: "PATCH",
            headers: {
              "x-pica-secret": PICA_SECRET,
              "x-pica-connection-key": PICA_CONNECTION,
              "x-pica-action-id": "conn_mod_def::GHfWYuPRKX4::3NsEKDBJQ4uFlxeVsWbBJQ",
              "Content-Type": "application/json",
            },
            body: JSON.stringify(body),
          }
        );

        if (!patchResp.ok) {
          const errorText = await patchResp.text();
          console.warn(`Failed to add select option for ${prop}:`, errorText);
        }
      }
    };

    const properties: Record<string, any> = {};

    const addPropIfExists = (name: string, value: any) => {
      if (value === null || value === undefined) return;

      if (!schemaProps[name]) {
        console.warn(`Property "${name}" not found in schema, skipping`);
        return;
      }

      properties[name] = value;
    };

    const propertyType = sanitizeString(payload.property_type);
    // Solo hay confianza cuando viene de una valoración automática. En los leads
    // cualitativos (formulario "Vender mi piso") se deja vacío en lugar de "Media".
    const confidence = sanitizeString(payload.confidence);

    if (propertyType) {
      await ensureOption("Tipo inmueble", propertyType);
    }
    if (confidence) {
      await ensureOption("Confianza", confidence);
    }

    const today = new Date().toISOString().slice(0, 10);

    properties[titlePropName] = {
      title: [{ text: { content: `Valoración - ${address}` } }],
    };

    addPropIfExists("Nombre", {
      rich_text: [{ text: { content: name } }],
    });

    addPropIfExists("Teléfono", {
      phone_number: phone,
    });

    addPropIfExists("updated_at", {
      date: { start: today },
    });

    const email = sanitizeEmail(payload.email);
    if (email) {
      addPropIfExists("Email", { email });
    }

    addPropIfExists("Dirección", {
      rich_text: [{ text: { content: address } }],
    });

    const neighborhood = sanitizeString(payload.neighborhood);
    if (neighborhood) {
      addPropIfExists("Barrio", {
        rich_text: [{ text: { content: neighborhood } }],
      });
    }

    const city = sanitizeString(payload.city);
    if (city) {
      addPropIfExists("Municipio", {
        rich_text: [{ text: { content: city } }],
      });
    }

    if (propertyType) {
      addPropIfExists("Tipo inmueble", { select: { name: propertyType } });
    }

    const builtM2 = sanitizeNumber(payload.built_m2);
    if (builtM2 !== null) {
      addPropIfExists("M² construidos", { number: builtM2 });
    }

    const bedrooms = sanitizeNumber(payload.bedrooms);
    if (bedrooms !== null) {
      addPropIfExists("Dormitorios", { number: bedrooms });
    }

    const bathrooms = sanitizeNumber(payload.bathrooms);
    if (bathrooms !== null) {
      addPropIfExists("Baños", { number: bathrooms });
    }

    const valuationAvg = sanitizeNumber(payload.valuation_avg);
    if (valuationAvg !== null) {
      addPropIfExists("Valoración media (€)", { number: valuationAvg });
    }

    const valuationMin = sanitizeNumber(payload.valuation_min);
    if (valuationMin !== null) {
      addPropIfExists("Rango min (€)", { number: valuationMin });
    }

    const valuationMax = sanitizeNumber(payload.valuation_max);
    if (valuationMax !== null) {
      addPropIfExists("Rango max (€)", { number: valuationMax });
    }

    if (confidence) {
      addPropIfExists("Confianza", { select: { name: confidence } });
    }

    const trend3m = sanitizeNumber(payload.trend_3m);
    if (trend3m !== null) {
      addPropIfExists("Tendencia 3m (%)", { number: trend3m });
    }

    const domDays = sanitizeNumber(payload.dom_days);
    if (domDays !== null) {
      addPropIfExists("DOM (días)", { number: domDays });
    }

    const utm = sanitizeString(payload.utm);
    if (utm) {
      addPropIfExists("UTM source / medium / campaign", {
        rich_text: [{ text: { content: utm } }],
      });
    }

    const notes = sanitizeString(payload.notes);
    if (notes) {
      addPropIfExists("Notas", {
        rich_text: [{ text: { content: notes } }],
      });
    }

    const createResp = await fetch(`https://api.picaos.com/v1/passthrough/pages`, {
      method: "POST",
      headers: {
        "x-pica-secret": PICA_SECRET,
        "x-pica-connection-key": PICA_CONNECTION,
        "x-pica-action-id": "conn_mod_def::GHfWaZEpgwM::MD-EsgOiTrqaPIyodz5ZVg",
        "Content-Type": "application/json",
        "Notion-Version": "2025-09-03",
      },
      body: JSON.stringify({
        parent: { data_source_id: dataSourceId },
        properties,
      }),
    });

    const resultJson = await createResp.json();

    if (!createResp.ok) {
      return {
        success: false,
        stage: "create_page",
        status: createResp.status,
        error: resultJson.message || resultJson.error || "Failed to insert page",
        details: resultJson,
      };
    }

    return { success: true };
  } catch (error) {
    console.error("Error inserting valuation:", error);
    return {
      success: false,
      stage: "exception",
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  try {
    const payload: ValuationPayload = await req.json();
    const result = await insertNotionItem(payload);

    return new Response(JSON.stringify(result), {
      status: result.success ? 200 : 400,
      headers: {
        ...corsHeaders,
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    console.error("Request error:", error);
    return new Response(
      JSON.stringify({
        success: false,
        error: error instanceof Error ? error.message : "Invalid request",
      }),
      {
        status: 400,
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      }
    );
  }
});
