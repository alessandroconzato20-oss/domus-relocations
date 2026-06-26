/**
 * DOMUS Relocations — Client Dashboard: My Documents
 * S3-backed document storage with pre-signed download URLs
 */
import { useEffect, useState } from "react";
import { trpc } from "@/lib/trpc";
import ClientDashboardLayout from "@/components/ClientDashboardLayout";
import { toast } from "sonner";

function FileIcon({ ext }: { ext: string }) {
  const icons: Record<string, string> = {
    pdf: "📄",
    docx: "📝",
    xlsx: "📊",
    jpg: "🖼️",
    jpeg: "🖼️",
    png: "🖼️",
  };
  return <span>{icons[ext.toLowerCase()] ?? "📎"}</span>;
}

export default function DashboardDocuments() {
  const [downloadingId, setDownloadingId] = useState<number | null>(null);
  const [downloadDocId, setDownloadDocId] = useState<number | null>(null);

  const docsQuery = trpc.clientDashboard.getMyDocuments.useQuery();

  // Pre-signed URL query — fires when downloadDocId is set
  const downloadUrlQuery = trpc.clientDashboard.getDocumentDownloadUrl.useQuery(
    { documentId: downloadDocId ?? 0 },
    { enabled: downloadDocId !== null }
  );

  useEffect(() => {
    if (downloadUrlQuery.data && downloadDocId !== null) {
      const { url, fileName } = downloadUrlQuery.data;
      const a = document.createElement("a");
      a.href = url;
      a.download = fileName;
      a.target = "_blank";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      setDownloadDocId(null);
      setDownloadingId(null);
    }
  }, [downloadUrlQuery.data, downloadDocId]);

  useEffect(() => {
    if (downloadUrlQuery.error && downloadDocId !== null) {
      toast.error("Download failed. Please try again.");
      setDownloadDocId(null);
      setDownloadingId(null);
    }
  }, [downloadUrlQuery.error, downloadDocId]);

  const documents = docsQuery.data ?? [];

  const handleDownload = (docId: number) => {
    setDownloadingId(docId);
    setDownloadDocId(docId);
  };

  const formatSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  return (
    <ClientDashboardLayout title="My Documents">
      {/* Info banner */}
      <div
        style={{
          marginBottom: "2rem",
          padding: "1rem 1.5rem",
          backgroundColor: "rgba(180,155,110,0.06)",
          border: "1px solid rgba(180,155,110,0.2)",
          borderRadius: "2px",
          fontSize: "0.8rem",
          color: "#6b6b6b",
        }}
      >
        Documents are added to your portal by your DOMUS advisor. To request a document upload, contact{" "}
        <a href="mailto:milano@domusrelocations.com" style={{ color: "#b49b6e" }}>
          milano@domusrelocations.com
        </a>
        .
      </div>

      {/* Loading */}
      {docsQuery.isLoading && (
        <div style={{ color: "#6b6b6b", fontSize: "0.875rem" }}>Loading documents…</div>
      )}

      {/* Empty state */}
      {!docsQuery.isLoading && documents.length === 0 && (
        <div
          style={{
            padding: "3rem 2rem",
            textAlign: "center",
            backgroundColor: "#ffffff",
            border: "1px solid rgba(180,155,110,0.15)",
            borderRadius: "2px",
          }}
        >
          <div
            style={{
              fontFamily: "Georgia, serif",
              fontSize: "1.125rem",
              color: "#1a1a1a",
              marginBottom: "0.5rem",
            }}
          >
            No documents yet
          </div>
          <p style={{ fontSize: "0.8rem", color: "#6b6b6b" }}>
            Your DOMUS advisor will add documents here for you.
          </p>
        </div>
      )}

      {/* Documents list */}
      {documents.length > 0 && (
        <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
          {documents.map((doc) => {
            const ext = doc.fileName.split(".").pop()?.toLowerCase() ?? "";
            return (
              <div
                key={doc.id}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "1rem",
                  padding: "1rem 1.25rem",
                  backgroundColor: "#ffffff",
                  border: "1px solid rgba(180,155,110,0.12)",
                  borderRadius: "2px",
                }}
              >
                <div style={{ fontSize: "1.5rem", flexShrink: 0 }}>
                  <FileIcon ext={ext} />
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div
                    style={{
                      fontSize: "0.875rem",
                      color: "#1a1a1a",
                      fontWeight: 500,
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {doc.originalName}
                  </div>
                  <div style={{ fontSize: "0.7rem", color: "#9b9b9b", marginTop: "0.125rem" }}>
                    {doc.fileSize ? formatSize(doc.fileSize) : ""}
                    {doc.uploadedAt
                      ? ` · ${new Date(doc.uploadedAt).toLocaleDateString("en-GB", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })}`
                      : ""}
                    {doc.category ? ` · ${doc.category}` : ""}
                  </div>
                </div>
                <button
                  onClick={() => handleDownload(doc.id)}
                  disabled={downloadingId === doc.id}
                  style={{
                    padding: "0.5rem 1rem",
                    backgroundColor: "transparent",
                    border: "1px solid rgba(180,155,110,0.4)",
                    borderRadius: "2px",
                    fontSize: "0.7rem",
                    letterSpacing: "0.1em",
                    textTransform: "uppercase",
                    color: "#b49b6e",
                    cursor: downloadingId === doc.id ? "not-allowed" : "pointer",
                    flexShrink: 0,
                  }}
                >
                  {downloadingId === doc.id ? "…" : "Download"}
                </button>
              </div>
            );
          })}
        </div>
      )}
    </ClientDashboardLayout>
  );
}
