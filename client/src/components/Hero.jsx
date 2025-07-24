export default function Hero() {
  return (
    <section className="w-full min-h-screen flex justify-center items-center bg-black text-center px-4 mb-[-400px]">
      <div className="w-[960px] h-[500px] max-w-full flex flex-col justify-top items-center gap-10 overflow-hidden mb-[100px]">
      
        {/* Headline + Subheadline */}
        <div className="flex flex-col items-center text-center">
          <h1 
            className="text-[2.0vw] font-extrabold leading-none tracking-[-0.05em] mb-[-38px]"
            style={{ color: 'rgb(255, 255, 255)', fontWeight: 700 }}>
            Your AI Debugging Assistant.
          </h1>
          <p
            className="text-[2.0vw] leading-none tracking-[-0.05em]"
            style={{ color: 'rgb(119, 119, 119)', fontWeight: 700 }}
          >
            Analyze and fix code errors fast with AI.
          </p>
        </div>


        {/* Bottom Divider */}
        <div className="mx-auto h-1 w-10 bg-pink-400 rounded-full mb-10" />

        {/* Buttons */}
        <div className="flex" style={{ gap: '10px' }}>
          {/* Light button */}
          <button
            style={{
              backgroundColor: 'rgb(255, 255, 255)',
              color: 'rgb(0, 0, 0)',
              padding: '0.5rem 1rem',
              borderRadius: '9999px',
              fontSize: '14px',
              fontWeight: '600'
            }}
          >
            Use the CLI
          </button>

          {/* Dark button */}
          <button
            style={{
              backgroundColor: 'rgb(25, 25, 25)',
              color: 'white',
              padding: '0.8rem 1rem',
              border: '1px',
              borderRadius: '9999px',
              fontSize: '14px',
              fontWeight: '600'
            }}
            onMouseOver={(e) => {
              e.target.style.backgroundColor = 'white';
              e.target.style.color = 'black';
            }}
            onMouseOut={(e) => {
              e.target.style.backgroundColor = 'black';
              e.target.style.color = 'white';
            }}
          >
            Use the Web App
          </button>
        </div>

        

      </div>
    </section>
  );
}
