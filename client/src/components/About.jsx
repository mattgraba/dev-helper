export default function About() {
    return (
      <section className="flex flex-col justify-start items-start gap-[40px] px-0 py-[80px] w-[960px] max-w-full relative">
        {/* Name + Title */}
        <div className="flex flex-col">
          <h1 className="text-white text-[24px] font-semibold leading-[1em] tracking-[-0.02em] mb-[-15px]">
            Matt Graba
          </h1>
          <h1 className="text-[#777777] text-[24px] font-semibold leading-[1em] tracking-[-0.02em] mb-[-5px]">
            Developer
          </h1>
        </div>
  
        {/* Description */}
        <div className="flex flex-col gap-[12px]" >
          <h2 className="text-[#777777] text-[15px] font-medium leading-[1.3em] tracking-[-0.01em] mb-[-25px]"
            style={{ fontWeight: 400 }} >
            Iʼm a software engineer dedicated to helping
          </h2>
          <h2 className="text-[#777777] text-[15px] font-medium leading-[1.3em] tracking-[-0.01em] mb-[-5px]"
            style={{ fontWeight: 400 }} >
          fellow devs build better tools and fix bugs faster.
          </h2>
          <h2 className="text-[#777777] text-[15px] font-medium leading-[1.3em] tracking-[-0.01em] mb-[-25px]"
            style={{ fontWeight: 400 }} >
            Check out my work below
          </h2>
          <h2 className="text-[#777777] text-[15px] font-medium leading-[1.3em] tracking-[-0.01em]"
            style={{ fontWeight: 400 }} >
            or reach out for collaborations.
          </h2>
        </div>
      </section>
    );
  }
  