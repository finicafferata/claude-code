/**
 * Página placeholder.
 *
 * El frontend definitivo (Hero, Countdown, EventDetails, PracticalInfo,
 * RsvpForm, etc.) lo vas a generar con Claude usando el DESIGN_BRIEF.md.
 * Esta página solo confirma que el proyecto levanta y que el backend
 * (/api/rsvp) está listo para recibir el formulario.
 */
export default function Home() {
  return (
    <main
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "system-ui, sans-serif",
        textAlign: "center",
        gap: "0.5rem",
        padding: "2rem",
      }}
    >
      <h1>💍 Casamiento — sitio en construcción</h1>
      <p>
        El backend está listo. El RSVP se envía por <code>POST /api/rsvp</code>{" "}
        y se guarda en Google Sheets.
      </p>
      <p style={{ opacity: 0.6 }}>
        El frontend definitivo se genera con el DESIGN_BRIEF.md.
      </p>
    </main>
  );
}
