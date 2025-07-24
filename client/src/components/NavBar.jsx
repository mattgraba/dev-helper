import { Link } from 'react-router-dom';

export default function NavBar() {
  return (
    <div
      className="1qqp9tp"
      data-name="Navigation"
      style={{
        alignContent: 'center',
        alignItems: 'center',
        backgroundColor: '#000000',
        display: 'flex',
        flex: 'none',
        flexDirection: 'row',
        flexWrap: 'nowrap',
        gap: 0,
        height: '64px',
        justifyContent: 'center',
        maxWidth: '100%',
        overflow: 'hidden',
        padding: 0,
        position: 'relative',
        width: '960px',
        zIndex: 1,
      }}
    >
      <div
        className="1xcjyhj"
        style={{
          outline: 'none',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'flex-start',
          flexShrink: 0,
          transform: 'none',
        }}
        data-component-type="RichTextContainer"
      >
        <p
          className="text"
          style={{
            letterSpacing: '-0.01em',
            lineHeight: '1em',
            textAlign: 'left',
            color: 'white',
            fontFamily: 'Inter Variable, Inter Placeholder, sans-serif',
            fontWeight: 700,
            fontVariationSettings: '"opsz" 32, "wght" 700',
          }}
        >
          DevHelper®
        </p>
      </div>

      {/* Spacer */}
      <div
        className="3y7wa2"
        data-name="Spacer"
        style={{
          flex: '1 0 0px',
          height: '100%',
          overflow: 'hidden',
          position: 'relative',
          width: '1px',
        }}
      />

      {/* Links */}
      <div
        className="14hq0vi"
        style={{
          alignContent: 'center',
          alignItems: 'center',
          display: 'flex',
          flex: 'none',
          flexDirection: 'row',
          flexWrap: 'nowrap',
          gap: '15px',
          height: 'min-content',
          justifyContent: 'center',
          overflow: 'visible',
          padding: 0,
          position: 'relative',
          width: 'min-content',
        }}
      >
        {/* CLI Usage */}
        <Link to="/about" style={linkStyle}>
          CLI Usage
        </Link>

        {/* Web App */}
        <Link to="/analyze" style={linkStyle}>
          Web App
        </Link>

        {/* Login */}
        <Link to="/login" style={linkStyle}>
          Login
        </Link>
      </div>
    </div>
  );
}

const linkStyle = {
  fontSize: '15px',
  letterSpacing: '-0.01em',
  lineHeight: '1em',
  textAlign: 'center',
  color: 'rgb(119, 119, 119)',
  fontFamily: 'Inter Variable, Inter Placeholder, sans-serif',
  fontWeight: 500,
  fontVariationSettings: '"opsz" 24, "wght" 500',
  textDecoration: 'none',
  cursor: 'pointer',
  transition: 'color 0.2s ease',
  whiteSpace: 'pre',
};
