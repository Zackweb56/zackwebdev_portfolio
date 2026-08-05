/**
 * /projects/[slug] — Project case study page
 * Placeholder — implemented in Task 6.7 (Build project detail route).
 */
export default async function ProjectCaseStudyPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  return (
    <main>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "100vh",
          fontFamily: "monospace",
          color: "#FFAA00",
          fontSize: "0.75rem",
          letterSpacing: "0.1em",
          gap: "0.5rem",
        }}
      >
        <p style={{ opacity: 0.4 }}>PROJECT // CASE STUDY</p>
        <p>SLUG: {slug}</p>
        <p style={{ opacity: 0.4 }}>placeholder — Task 6.7</p>
      </div>
    </main>
  );
}
