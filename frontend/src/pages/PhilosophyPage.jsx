import React from 'react';
import { useNavigate } from 'react-router-dom';
import NavBar from '../components/landing/NavBar';

const PhilosophyPage = () => {
  const navigate = useNavigate();

  return (
    <div className="bg-background-dark font-display text-white antialiased min-h-screen flex flex-col">
      <NavBar />
      
      {/* Add padding to account for fixed navbar */}
      <main className="flex flex-1 justify-center py-5 pt-20">
        <div className="flex max-w-[1000px] flex-1 flex-col">
          
          {/* Hero Section with Better Visual */}
          <div className="w-full mb-20">
            <div className="relative flex min-h-[70vh] flex-col items-center justify-center gap-8 bg-cover bg-center bg-no-repeat p-8 text-center overflow-hidden rounded-2xl mx-4">
              {/* Gradient background */}
              <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-background-dark to-background-dark"></div>
              
              {/* Geometric decoration */}
              <div className="absolute inset-0 opacity-10">
                <div className="absolute top-20 left-20 h-32 w-32 border border-primary rounded-full"></div>
                <div className="absolute bottom-32 right-32 h-48 w-48 border border-primary rounded-full"></div>
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 h-64 w-64 border border-primary/50 rounded-full"></div>
              </div>

              <div className="relative z-10 flex flex-col gap-6 max-w-4xl">
                <h1 className="text-5xl font-black leading-tight tracking-[-0.033em] text-white sm:text-6xl md:text-7xl">
                  We Transform, Not Just Track.
                </h1>
                <h2 className="text-xl font-normal leading-normal text-white/80 sm:text-2xl">
                  HUMAN is a premium personal evolution platform powered by AI, designed for intentional, transformative growth.
                </h2>
              </div>
            </div>
          </div>

          {/* Pull Quote with Enhanced Design */}
          <div className="w-full px-4 py-24 text-center relative">
            <div className="absolute inset-0 flex items-center justify-center opacity-5">
              <span className="text-[250px] font-bold">"</span>
            </div>
            <h1 className="relative text-3xl font-bold leading-tight tracking-tight text-white/90 sm:text-5xl max-w-4xl mx-auto italic">
              "The goal is not to live forever, the goal is to create something that will."
            </h1>
          </div>

          {/* Core Principles with Icons */}
          <div className="flex flex-col gap-12 px-4 py-16">
            <div className="flex flex-col gap-6 text-center max-w-3xl mx-auto">
              <h2 className="text-4xl font-black leading-tight tracking-[-0.033em] text-white sm:text-5xl">
                Our Core Principles
              </h2>
              <p className="text-lg font-normal leading-relaxed text-white/70">
                We built HUMAN on a foundation of trust, transparency, and a deep respect for your personal journey. Our philosophy is woven into every aspect of the platform.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-8">
              {/* Principle 1 */}
              <div className="flex flex-col gap-6 rounded-2xl border border-primary/30 bg-gradient-to-br from-primary/10 to-transparent p-8 hover:border-primary/50 transition-all duration-300 hover:shadow-[0_0_30px_rgba(13,242,242,0.2)]">
                <div className="flex items-center justify-center h-20 w-20 rounded-full bg-primary/20 border border-primary/30">
                  <span className="text-5xl">🔒</span>
                </div>
                <div>
                  <h3 className="text-2xl font-bold leading-tight text-white mb-3">Privacy as a Foundation</h3>
                  <p className="text-base font-normal leading-relaxed text-white/60">
                    Your data is yours alone. We use cutting-edge, privacy-preserving AI to power your growth without compromising your security.
                  </p>
                </div>
              </div>

              {/* Principle 2 */}
              <div className="flex flex-col gap-6 rounded-2xl border border-primary/30 bg-gradient-to-br from-primary/10 to-transparent p-8 hover:border-primary/50 transition-all duration-300 hover:shadow-[0_0_30px_rgba(13,242,242,0.2)]">
                <div className="flex items-center justify-center h-20 w-20 rounded-full bg-primary/20 border border-primary/30">
                  <span className="text-5xl">🎯</span>
                </div>
                <div>
                  <h3 className="text-2xl font-bold leading-tight text-white mb-3">Designed for Intention</h3>
                  <p className="text-base font-normal leading-relaxed text-white/60">
                    Every feature is crafted to foster focus and deep work. We help you eliminate distractions, not create them.
                  </p>
                </div>
              </div>

              {/* Principle 3 */}
              <div className="flex flex-col gap-6 rounded-2xl border border-primary/30 bg-gradient-to-br from-primary/10 to-transparent p-8 hover:border-primary/50 transition-all duration-300 hover:shadow-[0_0_30px_rgba(13,242,242,0.2)]">
                <div className="flex items-center justify-center h-20 w-20 rounded-full bg-primary/20 border border-primary/30">
                  <span className="text-5xl">✨</span>
                </div>
                <div>
                  <h3 className="text-2xl font-bold leading-tight text-white mb-3">No Dark Patterns</h3>
                  <p className="text-base font-normal leading-relaxed text-white/60">
                    Our platform is free of manipulative tactics. We succeed when you achieve genuine, lasting transformation, not by maximizing engagement.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* The HUMAN Difference */}
          <div className="px-4 py-20 max-w-3xl mx-auto">
            <div className="flex flex-col gap-6">
              <h2 className="text-3xl font-bold leading-tight tracking-[-0.015em] text-white sm:text-4xl">
                The HUMAN Difference
              </h2>
              <p className="text-lg font-normal leading-relaxed text-white/70">
                While other platforms focus on superficial tracking and vanity metrics, HUMAN is engineered for profound change. We provide the tools and insights for a deeper understanding of yourself, guiding you toward a more meaningful and purpose-driven life.
              </p>
              <p className="text-lg font-normal leading-relaxed text-white/70">
                Our approach contrasts the noisy, data-extractive model of competitors with a serene, focused, and truly personal experience.
              </p>
            </div>
          </div>

          {/* CTA with Enhanced Design */}
          <div className="relative flex flex-col items-center justify-center gap-8 px-4 py-24 text-center mx-4 mb-16 rounded-2xl border border-primary/20 bg-gradient-to-br from-primary/10 to-transparent overflow-hidden">
            {/* Background decoration */}
            <div className="absolute top-0 right-0 h-96 w-96 bg-primary/10 rounded-full blur-3xl"></div>
            <div className="absolute bottom-0 left-0 h-96 w-96 bg-primary/5 rounded-full blur-3xl"></div>

            <div className="relative z-10 flex flex-col gap-6 max-w-2xl">
              <h2 className="text-4xl font-black leading-tight tracking-[-0.033em] text-white sm:text-5xl">
                Begin Your Evolution
              </h2>
              <p className="text-lg text-white/70 leading-relaxed">
                Discover a new paradigm of personal growth. One that respects you, your data, and your potential.
              </p>
            </div>
            
            <button 
              onClick={() => navigate('/signup')}
              className="relative z-10 flex min-w-[200px] cursor-pointer items-center justify-center overflow-hidden rounded-xl h-14 px-8 bg-primary text-background-dark text-lg font-bold leading-normal tracking-[0.015em] transition-all duration-300 hover:shadow-[0_0_30px_0px_#0df2f2] hover:scale-105"
            >
              <span className="truncate">Begin Your Transformation</span>
            </button>
          </div>

          {/* Footer */}
          <footer className="w-full px-4 py-12">
            <div className="flex flex-col items-center justify-between gap-6 border-t border-primary/20 pt-8 text-sm text-white/50 sm:flex-row">
              <p>© 2024 HUMAN. All rights reserved.</p>
              <div className="flex gap-8">
                <a className="hover:text-primary transition-colors cursor-pointer" href="#">Privacy Policy</a>
                <a className="hover:text-primary transition-colors cursor-pointer" href="#">Terms of Service</a>
                <a className="hover:text-primary transition-colors cursor-pointer" href="#">Contact</a>
              </div>
            </div>
          </footer>

        </div>
      </main>
    </div>
  );
};

export default PhilosophyPage;
