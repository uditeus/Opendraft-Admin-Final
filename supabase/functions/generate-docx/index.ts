import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.7";
import JSZip from "npm:jszip@3.10.1";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

/**
 * Escapes characters for XML.
 */
function escapeXml(text: string): string {
  return (text || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

/**
 * Robust markdown to DOCX XML converter.
 */
function markdownToDocx(title: string, content: string): string {
  const lines = content.split("\n");
  const bodyXml = lines.map(line => {
    const t = line.trim();
    if (!t) return "<w:p><w:r><w:t> </w:t></w:r></w:p>";

    let style = "";
    let text = t;

    if (t.startsWith("## ")) {
      style = '<w:pPr><w:pStyle w:val="Heading1"/></w:pPr>';
      text = t.slice(3);
    } else if (t.startsWith("### ")) {
      style = '<w:pPr><w:pStyle w:val="Heading2"/></w:pPr>';
      text = t.slice(4);
    } else if (t.startsWith("# ")) {
      style = '<w:pPr><w:pStyle w:val="Title"/></w:pPr>';
      text = t.slice(2);
    }

    // Basic bold handling
    const parts = text.split("**");
    const runs = parts.map((part, i) => {
      const isBold = i % 2 === 1;
      return `<w:r>${isBold ? "<w:rPr><w:b/></w:rPr>" : ""}<w:t xml:space="preserve">${escapeXml(part)}</w:t></w:r>`;
    }).join("");

    return `<w:p>${style}${runs}</w:p>`;
  }).join("");

  return `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<w:document xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main">
  <w:body>
    <w:p><w:pPr><w:pStyle w:val="Title"/></w:pPr><w:r><w:t>${escapeXml(title)}</w:t></w:r></w:p>
    ${bodyXml}
    <w:sectPr><w:pgSz w:w="12240" w:h="15840"/><w:pgMar w:top="1440" w:right="1440" w:bottom="1440" w:left="1440"/></w:sectPr>
  </w:body>
</w:document>`;
}

serve(async (req: Request) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  try {
    const body = await req.json();
    const { title, content, projectId } = body;

    console.log(`[DOCX] Request for: ${title}`);

    const authHeader = req.headers.get("Authorization");
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_ANON_KEY")!
    );

    const token = authHeader?.replace("Bearer ", "");
    const { data: { user }, error: userError } = await supabase.auth.getUser(token);
    if (userError || !user) throw new Error("Unauthorized");

    // 1. Generate ZIP using JSZip (npm)
    const zip = new JSZip();

    zip.file("[Content_Types].xml", `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">
  <Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/>
  <Default Extension="xml" ContentType="application/xml"/>
  <Override PartName="/word/document.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.document.main+xml"/>
  <Override PartName="/word/styles.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.styles+xml"/>
</Types>`);

    zip.folder("_rels")!.file(".rels", `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
  <Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="word/document.xml"/>
</Relationships>`);

    zip.folder("word")!.folder("_rels")!.file("document.xml.rels", `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
  <Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/styles" Target="styles.xml"/>
</Relationships>`);

    zip.folder("word")!.file("document.xml", markdownToDocx(title, content));

    zip.folder("word")!.file("styles.xml", `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<w:styles xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main">
  <w:style w:type="paragraph" w:styleId="Title"><w:name w:val="Title"/><w:rPr><w:b/><w:sz w:val="48"/></w:rPr></w:style>
  <w:style w:type="paragraph" w:styleId="Heading1"><w:name w:val="heading 1"/><w:rPr><w:b/><w:sz w:val="32"/></w:rPr></w:style>
  <w:style w:type="paragraph" w:styleId="Heading2"><w:name w:val="heading 2"/><w:rPr><w:b/><w:sz w:val="28"/></w:rPr></w:style>
</w:styles>`);

    const docxBlob = await zip.generateAsync({ type: "uint8array" });
    console.log(`[DOCX] ZIP created: ${docxBlob.length} bytes`);

    // 2. Upload using Service Role
    const serviceClient = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    const safeTitle = title.toLowerCase().trim().replace(/[^a-z0-9]/g, "_").slice(0, 30);
    const fileName = `${Date.now()}_${safeTitle}.docx`;
    const path = `${user.id}/${projectId || "general"}/${fileName}`;

    // Best effort bucket creation
    try {
      await serviceClient.storage.createBucket("documents", { public: true });
    } catch (_) {
      // Probably exists
    }

    const { error: uploadError } = await serviceClient.storage
      .from("documents")
      .upload(path, docxBlob, {
        contentType: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        upsert: true
      });

    if (uploadError) {
      console.error("[DOCX] Upload Error:", uploadError);
      throw new Error(`Storage error: ${uploadError.message}`);
    }

    const { data: { publicUrl } } = serviceClient.storage
      .from("documents")
      .getPublicUrl(path);

    console.log(`[DOCX] Done: ${publicUrl}`);

    return new Response(JSON.stringify({
      url: publicUrl,
      fileName,
      storagePath: path,
      sizeBytes: docxBlob.length
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200
    });

  } catch (error: any) {
    console.error("[DOCX] Error:", error);
    return new Response(JSON.stringify({
      error: error.message || "Internal error",
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500
    });
  }
});
