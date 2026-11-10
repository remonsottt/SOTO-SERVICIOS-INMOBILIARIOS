import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

const DATABASE_ID = "2d34fdc2d1b680e287b2fe9728e0446f";

interface ContactPayload {
  name: string;
  email?: string;
  phone?: string;
  message: string;
  origin?: string;
  property_reference?: string;
  page_url?: string;
  utm?: string;
}

function sanitizeString(value: any): string | null {
  if (value === null || value === undefined || value === "") return null;
  return String(value).trim();
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

async function insertNotionContact(payload: ContactPayload) {
  const PICA_SECRET = Deno.env.get("PICA_SECRET_KEY_contact");
  const PICA_CONNECTION = Deno.env.get("PICA_NOTION_CONNECTION_KEY_contact");

  if (!PICA_SECRET || !PICA_CONNECTION) {
    return {
      success: false,
      stage: "credentials",
      error: "Missing Pica credentials",
    };
  }

  const name = sanitizeString(payload.name);
  const message = sanitizeString(payload.message);

  if (!name || !message) {
    return {
      success: false,
      stage: "validation",
      error: "Missing required fields: name or message",
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

    const rawOrigin = sanitizeString(payload.origin) || "General";
    const origin = rawOrigin === "General" ? "Contacto web" :
                   (rawOrigin === "Property" || rawOrigin === "Propiedad") ? "Propiedad" :
                   "Contacto web";

    const propertyReference = sanitizeString(payload.property_reference);

    await ensureOption("Origen", origin);

    const titleValue =
      origin === "Propiedad" && propertyReference
        ? `Consulta propiedad - ${propertyReference}`
        : `Contacto - ${name}`;

    properties[titlePropName] = {
      title: [{ text: { content: titleValue } }],
    };

    addPropIfExists("Nombre", {
      rich_text: [{ text: { content: name } }],
    });

    const phone = sanitizePhone(payload.phone);
    if (phone) {
      addPropIfExists("Teléfono", { phone_number: phone });
    }

    const email = sanitizeEmail(payload.email);
    if (email) {
      addPropIfExists("Email", { email });
    }

    addPropIfExists("Mensaje", {
      rich_text: [{ text: { content: message } }],
    });

    addPropIfExists("Origen", { select: { name: origin } });

    if (propertyReference) {
      addPropIfExists("Referencia propiedad", {
        rich_text: [{ text: { content: propertyReference } }],
      });
    }

    const pageUrl = sanitizeString(payload.page_url);
    if (pageUrl) {
      addPropIfExists("URL origen", { url: pageUrl });
    }

    const utm = sanitizeString(payload.utm);
    if (utm) {
      addPropIfExists("UTM source / medium / campaign", {
        rich_text: [{ text: { content: utm } }],
      });
    }

    const today = new Date().toISOString().slice(0, 10);
    addPropIfExists("created_at", {
      date: { start: today },
    });

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
    console.error("Error inserting contact:", error);
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
    const payload: ContactPayload = await req.json();
    const result = await insertNotionContact(payload);

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
