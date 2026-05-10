import React, { useState, useEffect, useRef } from 'react';
import Slide from './components/Slide';
import SecretInterface from './components/SecretInterface';

function App() {
  const [activeSlide, setActiveSlide] = useState(1);
  const containerRef = useRef(null);
  const answerSlideRef = useRef(null);

  // RAG state
  const [isGenerating, setIsGenerating] = useState(false);
  const [response, setResponse] = useState('');
  const [displayedResponse, setDisplayedResponse] = useState('');

  // Track active slide on scroll
  useEffect(() => {
    const handleScroll = () => {
      if (!containerRef.current) return;
      const pageHeight = window.innerHeight;
      const scrollPosition = containerRef.current.scrollTop;
      const currentSlide = Math.round(scrollPosition / pageHeight) + 1;
      setActiveSlide(currentSlide);
    };
    const container = containerRef.current;
    if (container) {
      container.addEventListener('scroll', handleScroll);
      return () => container.removeEventListener('scroll', handleScroll);
    }
  }, []);

  // Called by SecretInterface when the answer arrives
  const handleResponseReceived = (_question, answer) => {
    setDisplayedResponse('');
    setResponse(answer);
  };

  // Escape key clears the answer slide — use capture so it runs before any other listener
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && response) {
        e.stopPropagation(); // prevent SecretInterface from also firing
        setResponse('');
        setDisplayedResponse('');
      }
    };
    window.addEventListener('keydown', handleEscape, { capture: true });
    return () => window.removeEventListener('keydown', handleEscape, { capture: true });
  }, [response]);

  // Typewriter effect for the answer slide
  useEffect(() => {
    if (!response) { setDisplayedResponse(''); return; }
    let i = 0;
    setDisplayedResponse('');
    const interval = setInterval(() => {
      i++;
      if (i > response.length) { clearInterval(interval); return; }
      setDisplayedResponse(response.substring(0, i));
    }, 12);
    return () => clearInterval(interval);
  }, [response]);

  return (
    <>
      {/* Global Cmd+F find bar — lives outside the scroll container so it's always on top */}
      <SecretInterface
        onResponseReceived={handleResponseReceived}
        isGenerating={isGenerating}
        setIsGenerating={setIsGenerating}
      />

      <div id="slide-container" ref={containerRef} className="snap-y snap-mandatory h-screen overflow-y-auto relative">

        {/* --- Slide 1 --- */}
        <Slide pageNumber={1}>
          <div className="flex items-center justify-center h-full w-full">
            <h1 className="text-5xl font-bold text-black text-center leading-tight">Economics of sustainable<br />development</h1>
          </div>
        </Slide>

        {/* --- Slide 2 --- */}
        <Slide pageNumber={2}>
          <h2 className="text-3xl font-bold text-black text-center mb-6">Sustainability</h2>
          <h1 className="text-5xl font-bold text-black mb-4">Issues pertaining to</h1>
          <ul className="list-disc pl-8 space-y-3 text-2xl text-black italic">
            <li>Biophysical limits.</li>
            <li>Fairness, equity and distribution with a time dimension (often involving several human generations), and including  considerations of the well-being of species other than humans.</li>
            <li>Scrutiny of <span className="italic">technological choices</span>, re-examination of <span className="font-bold">our social and value systems</span></li>
            <li className="font-bold not-italic">Uncertainty</li>
            <li className="font-bold not-italic">Irreversibility</li>
          </ul>
        </Slide>

        {/* --- Slide 3 --- */}
        <div className="relative h-screen w-full snap-start">
          <Slide pageNumber={3}>
            <h1 className="text-4xl font-bold mb-6 text-black text-center">Concept of Sustainable Development</h1>
            <ul className="list-disc pl-8 space-y-4 text-2xl text-black">
              <li>Brundtland Commission Report, <span className="italic">Our Common Future</span> (World Commission on Environment and Development 1987) defined sustainable development as <span className="italic">development which meets the needs of the present without sacrificing the ability of the future to meet its needs</span>.</li>
            </ul>
          </Slide>
        </div>

        {/* --- Slide 4 --- */}
        <div className="relative h-screen w-full snap-start">
          <Slide pageNumber={4}>
            <h1 className="text-4xl font-bold mb-6 text-black text-center">Challenges</h1>
            <ul className="list-disc pl-8 space-y-4 text-2xl text-black">
              <li>Definition of sustainable development <span className="italic">is not explicit about the physical and technological dimensions of the resource constraints required for sustainability</span>.</li>
              <li>It is not clear from the Brundtland Report definition <span className="italic">what the term &lsquo;development&rsquo; implies or how it is (or should be) measured if it is to be used as an indicator of intergenerational &lsquo;well-being&rsquo;</span>.
                <ul className="list-none pl-8 mt-3 space-y-3 text-xl">
                  <li>– Does development refer to the conventional conception of economic growth: an increase in the <span className="italic">quantity</span> of goods and services?</li>
                  <li>– Or does it refer to the kind of <span className="italic">qualitative</span> economic growth in conjunction with Herman Daly&rsquo;s notion of the steady-state economy?</li>
                  <li>– Is development measured using the conventional national accounting system (gross national product, GNP)?</li>
                  <li>– Does it matter how the depreciation of human versus natural capital stocks is treated?</li>
                </ul>
              </li>
            </ul>
          </Slide>
        </div>

        {/* --- Slide 5 --- */}
        <div className="relative h-screen w-full snap-start">
          <Slide pageNumber={5}>
            <h1 className="text-4xl font-bold mb-6 text-black text-center">Challenges</h1>
            <ul className="list-disc pl-8 space-y-6 text-2xl text-black">
              <li><span className="italic">Trade-off between equity and efficiency</span>. The report simply emphasizes the importance of equity in any considerations of sustainable development.</li>
              <li className="font-bold">Does this mean that the efficiency consideration is irrelevant?</li>
            </ul>
          </Slide>
        </div>

        {/* --- Slide 6 --- */}
        <div className="relative h-screen w-full snap-start">
          <Slide pageNumber={6}>
            <div className="flex flex-col items-center justify-center h-full w-full">
              {/* SVG Graph */}
              <svg viewBox="0 0 500 380" className="w-full max-w-lg mb-6" xmlns="http://www.w3.org/2000/svg">
                {/* Axes */}
                <line x1="80" y1="20" x2="80" y2="300" stroke="black" strokeWidth="2" />
                <line x1="80" y1="300" x2="440" y2="300" stroke="black" strokeWidth="2" />
                {/* Arrowheads */}
                <polygon points="80,20 75,32 85,32" fill="black" />
                <polygon points="440,300 428,295 428,305" fill="black" />

                {/* Y-axis label */}
                <text x="20" y="30" fontSize="13" fontStyle="italic" fontWeight="bold">GNP</text>
                <text x="20" y="46" fontSize="11">: future</text>
                <text x="20" y="60" fontSize="11">generation</text>

                {/* X-axis labels */}
                <text x="150" y="340" fontSize="13" fontStyle="italic" fontWeight="bold">GNP</text>
                <text x="172" y="340" fontSize="11" fontStyle="italic">p</text>
                <text x="280" y="340" fontSize="13" fontStyle="italic" fontWeight="bold">GNP</text>
                <text x="302" y="340" fontSize="11">: present generation</text>

                {/* PPF curve (outer) */}
                <path d="M 100,40 Q 120,60 160,100 Q 220,160 380,280" fill="none" stroke="black" strokeWidth="2" />
                {/* Inner curve through J and H */}
                <path d="M 200,80 Q 240,140 320,270" fill="none" stroke="black" strokeWidth="2" />

                {/* GNPf horizontal dashed line */}
                <line x1="80" y1="170" x2="300" y2="170" stroke="black" strokeWidth="1" strokeDasharray="4,3" />
                {/* GNPp vertical dashed line */}
                <line x1="160" y1="100" x2="160" y2="300" stroke="black" strokeWidth="1" strokeDasharray="4,3" />

                {/* Point I */}
                <circle cx="160" cy="100" r="5" fill="black" />
                <text x="168" y="95" fontSize="14" fontStyle="italic" fontWeight="bold">I</text>

                {/* Point G */}
                <circle cx="160" cy="170" r="5" fill="black" />
                <text x="145" y="162" fontSize="14" fontWeight="bold">G</text>

                {/* Point J on inner curve at GNPf level */}
                <circle cx="270" cy="170" r="5" fill="black" />
                <text x="278" y="165" fontSize="14" fontStyle="italic" fontWeight="bold">J</text>

                {/* Vertical dashed from J down */}
                <line x1="270" y1="170" x2="270" y2="300" stroke="black" strokeWidth="1" strokeDasharray="4,3" />

                {/* Point H */}
                <circle cx="270" cy="220" r="5" fill="black" />
                <text x="280" y="225" fontSize="14" fontStyle="italic" fontWeight="bold">H</text>

                {/* GNPf label */}
                <text x="30" y="174" fontSize="13" fontStyle="italic" fontWeight="bold">GNP</text>
                <text x="56" y="178" fontSize="10" fontStyle="italic">f</text>
              </svg>

              {/* Explanatory text */}
              <p className="text-lg text-black leading-relaxed max-w-2xl text-justify">
                The trade-off between intergenerational efficiency and equity. Clearly a move from point <span className="italic">G</span> to point <span className="italic">H</span> would be desirable on efficiency grounds. However, relative to point <span className="italic">G</span>, point <span className="italic">H</span> may not be sustainable because it entails a much lower level of income for future generations. Thus, not all efficient points are sustainable.
              </p>
            </div>
          </Slide>
        </div>

        {/* --- Slide 7 --- */}
        {/* --- Slide 7 --- */}
        <div className="relative h-screen w-full snap-start">
          <Slide pageNumber={7}>
            <h1 className="text-4xl font-bold mb-6 text-black text-center">Summary</h1>
            <ul className="list-disc pl-8 space-y-6 text-2xl text-black italic">
              <li>The concept of sustainable development has far-reaching implications beyond the significance of intergenerational equity.</li>
              <li>Include careful considerations of the exact nature of the resource (capital) constraints; technological options and their limits; economic efficiency; intergenerational equity; and aspects of human values and institutions consistent with sustainable development.</li>
            </ul>
          </Slide>
        </div>

        {/* --- Slide 8 --- */}
        <div className="relative h-screen w-full snap-start">
          <Slide pageNumber={8}>
            <h1 className="text-4xl font-bold mb-8 text-black text-center">Sustainability Approaches</h1>
            <ul className="list-disc pl-8 space-y-4 text-2xl text-black font-bold">
              <li>Hartwick–Solow approach to sustainability</li>
              <li>Ecological Economics Approach</li>
              <li>Safe Minimum standard (SMS) approach</li>
            </ul>
          </Slide>
        </div>

        {/* --- Slide 9 --- */}
        <div className="relative h-screen w-full snap-start">
          <Slide pageNumber={9}>
            <h1 className="text-4xl font-bold mb-6 text-black">Hartwick–Solow approach</h1>
            <ul className="list-disc pl-8 space-y-4 text-xl text-black">
              <li>Maintaining <span className="italic">constant real consumption</span> (of goods and services) over an indefinite period of time (scarcity of resource endowments).</li>
              <li>Core problem of sustainability- how consumption of goods and services sustained over several generations with exhaustible resources.</li>
              <li>Notion of consumption related to an equivalent concept of <span className="italic">net income</span> by using Hicks&rsquo;s (1946: 172) definition of sustainable net income</li>
              <li>Income calculations provide people an indication of the amount which they can consume without impoverishing themselves.</li>
              <li>Eg: Set maximum man&rsquo;s income so that he can consume during a week, and remain well off at the end of the week. A person saves - he plans to be better off in the future; He lives beyond his income - he plans to be worse off.</li>
            </ul>
          </Slide>
        </div>

        {/* --- Slide 10 --- */}
        <div className="relative h-screen w-full snap-start">
          <Slide pageNumber={10}>
            <h1 className="text-4xl font-bold mb-6 text-black">Hartwick–Solow approach</h1>
            <ul className="list-disc pl-8 space-y-4 text-xl text-black">
              <li>Due to depreciation of capital assets (buildings, machines, highways, etc.) and the degradation of the natural environment, sustainable economic development (or net national income) would <span className="italic">require maintenance of a nondeclining capital stock – composed of natural and human capital</span>.</li>
              <li>Replacement of the depreciated capital assets requires constant withdrawal of both renewable and exhaustible resources from nature.</li>
              <li>In conventional income accounting system, net national income (NNI), obtained by subtracting the depreciation of human capital (machines, buildings, roads, etc.) from the gross national income (GNI) but not the depreciation of natural capital assets (forests, fisheries, mineral deposits, etc.)</li>
              <li>Thus, for a sustainable net national income, GNI account for the depreciation of natural capital.</li>
            </ul>
          </Slide>
        </div>

        {/* --- Slide 11 --- */}
        <div className="relative h-screen w-full snap-start">
          <Slide pageNumber={11}>
            <h1 className="text-4xl font-bold mb-4 text-black">Hartwick–Solow approach</h1>
            <ul className="list-disc pl-8 space-y-3 text-xl text-black">
              <li>Hartwick–Solow sustainability - conception of <span className="italic">capital stocks assumes that natural and human capital as substitutes</span></li>
              <li>Hartwick–Solow criterion referred to as the weak sustainability criterion</li>
              <li className="italic">&lsquo;Adequate&rsquo; compensatory investments made to protect the interests of future generations- partially addressed by Hartwick <span className="italic">sustainability rule</span>.</li>
              <li className="italic">Rule states that maintaining constant real consumption of goods and services or real income (in the Hicksian sense) possible in the face of exhaustible resources provided rent derived from &lsquo;an intertemporal efficient use&rsquo; of resources re-invested in renewable capital assets.</li>
              <li>However, Hartwick applied &lsquo;sustainability rule&rsquo; to trace the <span className="italic">optimal</span> intertemporal sustainable path (or course of action).  Lot of assumption and dependence on market mechanism  makes it week</li>
            </ul>
          </Slide>
        </div>

        {/* --- Slide 12 --- */}
        <div className="relative h-screen w-full snap-start">
          <Slide pageNumber={12}>
            <h1 className="text-4xl font-bold mb-6 text-black">Weakness of H-S Aproach</h1>
            <ul className="list-disc pl-8 space-y-4 text-2xl text-black">
              <li>Human-generated and natural capital are <span className="italic">substitutes</span>.</li>
              <li><span className="italic">Intergenerational efficiency</span> requires that the prices of all goods and services (including environmental goods) should reflect their social values.</li>
              <li>Very idea of positive discounting debatable.</li>
              <li>Determination of the sustainable constraints (the actual size of the nondeclining capital stock) can not be independent of the current level and pattern of human economic development</li>
              <li><span className="italic">Uncertainty</span> associated with long-term natural resource assessment and management ignored.</li>
            </ul>
          </Slide>
        </div>

        {/* --- Slide 13 --- */}
        <div className="relative h-screen w-full snap-start">
          <Slide pageNumber={13}>
            <h1 className="text-4xl font-bold mb-2 text-black">The ecological economics approach to sustainability</h1>
            <p className="text-2xl text-black mb-4">Daly&rsquo;s Steady state Economy</p>
            <ul className="list-disc pl-8 space-y-4 text-2xl text-black italic">
              <li>Ecological economics approach to sustainability (worldview): Natural world not only finite, but also nongrowing and materially closed.</li>
              <li className="not-italic">Natural world strained by the size of the human economy.</li>
              <li>Ecological economics approach defines  sustainability in terms of a nondeclining (constant) &lsquo;natural&rsquo; capital.</li>
              <li>The ideal size of the constant natural capital constraint be adequate to ensure that, future generations left no worse off than current generations</li>
            </ul>
          </Slide>
        </div>

        {/* --- Slide 14 --- */}
        <div className="relative h-screen w-full snap-start">
          <Slide pageNumber={14}>
            <h1 className="text-4xl font-bold mb-6 text-black italic">Sustainability Rule</h1>
            <ul className="list-disc pl-8 space-y-4 text-2xl text-black">
              <li>The rate of exploitation of renewable resources should not exceed the regeneration rate.</li>
              <li>Waste emission (pollution) be kept below waste-absorptive capacity of the environment. For persistent wastes rates of discharge be zero</li>
              <li>Extraction of nonrenewable resources (such as oil) be consistent with the development of renewable substitutes- Equivalent to the compensatory investment rule advocated by Hartwick.</li>
              <li>Conventional measures of national income accounting should make explicit account for the depreciation of natural capital assets</li>
            </ul>
          </Slide>
        </div>

        {/* --- Slide 15 --- */}
        <div className="relative h-screen w-full snap-start">
          <Slide pageNumber={15}>
            <h1 className="text-4xl font-bold mb-8 text-black text-center">Safe minimum standard approach to sustainability</h1>
            <ul className="list-disc pl-8 space-y-6 text-2xl text-black italic">
              <li>Considerable uncertainty exists regarding both the cost and the irreversibility of particular human impacts on the natural environment- <span className="not-italic">uncertainty is central to the concept of SMS.</span></li>
              <li>In this respect, then, sustainability warrants maintenance of non declining natural capital as the safe minimum.</li>
            </ul>
          </Slide>
        </div>

        {/* --- Dynamic Answer Slide (appears only when there's a response) --- */}
        {response && (
          <div ref={answerSlideRef} className="flex flex-col h-screen w-full bg-white text-black snap-start justify-center items-center px-16 border-b border-gray-300 relative">

            <div className="w-full max-w-5xl prose prose-lg prose-gray">
              <div className="text-2xl text-black leading-relaxed whitespace-pre-wrap overflow-y-auto max-h-[75vh] scrollbar-hide">
                {displayedResponse}
                {displayedResponse.length < response.length && (
                  <span className="answer-cursor" />
                )}
              </div>
            </div>
          </div>
        )}

      </div>
    </>
  );
}

export default App;
