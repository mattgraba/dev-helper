function FeatureCard({ icon, label, headline, offset = 0 }) {
  return (
    <div
      className="feature-card"
      style={{
        transform: `translateY(${offset}px)`,
        alignContent: 'center',
        alignItems: 'center',
        backgroundColor: 'var(--token-dbe12eec-d6ea-4e14-b331-3053c9d607dd, #0d0d0d)',
        borderRadius: '20px',
        display: 'flex',
        flex: '1 0 0px',
        flexDirection: 'column',
        flexWrap: 'nowrap',
        gap: 0,
        height: '440px',
        justifyContent: 'center',
        overflow: 'visible',
        padding: '40px',
        position: 'relative',
        width: '1px',
      }}
    >
      {/* SVG/Icon */}
      <div style={{ imageRendering: 'pixelated', flexShrink: 0, width: 80, height: 80, background: '#222', borderRadius: 16, marginBottom: 16, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        {icon}
      </div>
      {/* Label and Headline */}
      <div className="feature-label-headline" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <p
          className="feature-label"
          style={{
            fontFamily: 'Inter, Inter Placeholder, sans-serif',
            fontFeatureSettings: "'cv01' on, 'cv09' on, 'cv11' on, 'cv05' on",
            fontSize: '13px',
            fontWeight: 500,
            letterSpacing: '-0.01em',
            textAlign: 'center',
            color: 'var(--token-d3650bef-13f5-49bd-88f0-8a82034ef0d6, rgb(119, 119, 119))',
            lineHeight: '1em',
            margin: 0,
          }}
        >
          {label}
        </p>
        <h3
          className="feature-headline"
          style={{
            fontFamily: 'Inter Variable, Inter Placeholder, sans-serif',
            fontFeatureSettings: "'cv01' on, 'cv09' on, 'cv11' on, 'cv05' on, 'ss03' on",
            fontSize: '22px',
            fontWeight: 600,
            fontVariationSettings: '"opsz" 32, "wght" 600',
            letterSpacing: '-0.02em',
            lineHeight: '1em',
            textAlign: 'center',
            color: 'var(--token-8961fb69-0ea3-46ab-8b8e-1f9187ebd1a9, rgb(255, 255, 255))',
            margin: 0,
            marginTop: 8,
          }}
        >
          {headline}
        </h3>
      </div>
    </div>
  );
}

export default function Features() {
  return (
    <div
      className="features-row"
      style={{
        alignContent: 'flex-start',
        alignItems: 'flex-start',
        display: 'flex',
        flex: 'none',
        flexDirection: 'row',
        flexWrap: 'nowrap',
        gap: '20px',
        height: 'min-content',
        justifyContent: 'center',
        maxWidth: '100%',
        overflow: 'hidden',
        padding: '80px 0',
        position: 'relative',
        width: '960px',
      }}
    >
      <FeatureCard
        offset={-64}
        icon={<svg width="48" height="48" viewBox="0 0 48 48" fill="none"><rect width="48" height="48" rx="12" fill="#444" /></svg>}
        label="CLI"
        headline="For Terminal Pros"
      />
      <FeatureCard
        offset={-64}
        icon={<svg width="48" height="48" viewBox="0 0 48 48" fill="none"><rect width="48" height="48" rx="12" fill="#444" /></svg>}
        label="Web"
        headline="Visual & Simple"
      />
      <FeatureCard
        offset={-64}
        icon={<svg width="48" height="48" viewBox="0 0 48 48" fill="none"><rect width="48" height="48" rx="12" fill="#444" /></svg>}
        label="Choose"
        headline="Flex Your Workflow"
      />
    </div>
  );
}
  
  