export default function Footer() {
  return (
    <footer className="w-[960px] max-w-full mx-auto px-4 py-24 border-t border-[#191919] flex flex-row flex-wrap justify-center gap-10 text-sm z-[1]">
      {/* Left Spacer (acts like margin between edge and columns) */}
        <div className="flex-none w-[700px] h-[100px]"></div>

      {/* Column 1: Dev Helper */}
      <div className="flex flex-col items-start gap-[6px] w-[140px]">
        <p className="text-white font-medium mb-[-15px]">
        Dev Helper</p>
        <p className="mb-[-15px]"
        style={{ color: 'rgb(119, 119, 119)', fontWeight: 400 }}>
        CLI Usage</p>
        <p className="mb-[-15px]"
        style={{ color: 'rgb(119, 119, 119)', fontWeight: 400 }}>
        Web App</p>
        <p className="mb-[-15px]"
        style={{ color: 'rgb(119, 119, 119)', fontWeight: 400 }}>
        Docs</p>
      </div>

      {/* Column 2: Connect */}
      <div className="flex flex-col items-start gap-[6px] w-[0px]">
        <p className="text-white font-medium mb-[-15px]">
          Connect</p>
        <p className="mb-[-15px]"
          style={{ color: 'rgb(119, 119, 119)', fontWeight: 400 }}>
        GitHub</p>
        <p className="mb-[-15px]"
          style={{ color: 'rgb(119, 119, 119)', fontWeight: 400 }}>
        Portfolio</p>
        <p className= "mb-[35px]"
        style={{ color: 'rgb(119, 119, 119)', fontWeight: 400 }}>
        Contact</p>
      </div>
    </footer>
  );
}