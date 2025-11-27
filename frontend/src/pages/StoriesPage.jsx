import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import NavBar from '../components/landing/NavBar';

const StoriesPage = () => {
  const navigate = useNavigate();

  return (
    <div className="relative flex min-h-screen w-full flex-col bg-background-dark overflow-x-hidden">
      <NavBar />
      
      {/* Add padding to account for fixed navbar */}
      <main className="flex flex-1 justify-center px-4 py-20 sm:px-8 sm:py-32 pt-24">
        <div className="flex w-full max-w-5xl flex-col gap-32">
          
          {/* Hero Section */}
          <section className="flex min-h-[480px] flex-col items-center justify-center gap-8 text-center">
            <h1 className="font-display text-white text-5xl font-black leading-tight tracking-tighter sm:text-6xl md:text-7xl max-w-4xl">
              Real stories, real evolution.
            </h1>
            <p className="font-display max-w-2xl text-lg text-white/70 sm:text-xl leading-relaxed">
              Discover the transformative journeys of our members, powered by AI. These are the authentic experiences of people just like you.
            </p>
          </section>

          {/* Testimonial 1: The Founder */}
          <section className="grid grid-cols-1 items-start gap-12 md:grid-cols-3 md:gap-16">
            <div className="flex flex-col gap-4 md:col-span-1">
              {/* Profile Image with Gradient */}
              <div className="relative h-32 w-32 rounded-full overflow-hidden border-2 border-primary/30">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-primary/5"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-6xl">👨‍💼</span>
                </div>
              </div>
              <div>
                <p className="text-white text-lg font-bold leading-tight">Alex D.</p>
                <p className="text-white/60 text-base font-normal leading-normal mt-1">Founder &amp; CEO</p>
              </div>
            </div>
            
            <div className="flex flex-col gap-10 md:col-span-2">
              <p className="font-display text-white text-3xl font-medium leading-snug sm:text-4xl">
                "My clarity in decision-making has gone from a 4/10 to a 9/10. It's been a complete game-changer for my leadership."
              </p>
              
              <div className="flex flex-col gap-4 rounded-xl border border-white/10 bg-white/5 p-8 backdrop-blur-sm">
                <div className="flex items-center justify-between gap-4">
                  <p className="text-white text-lg font-medium leading-normal">Clarity &amp; Decision Making</p>
                  <p className="font-display text-primary text-2xl font-bold">4 → 9/10</p>
                </div>
                <div className="relative h-3 w-full rounded-full bg-white/10 overflow-hidden">
                  <div className="absolute h-3 rounded-full bg-white/20" style={{ width: '40%' }}></div>
                  <div className="absolute h-3 rounded-full bg-primary shadow-[0_0_20px_rgba(13,242,242,0.5)]" style={{ left: '40%', width: '50%' }}></div>
                </div>
              </div>
            </div>
          </section>

          {/* Pull Quote with Visual Interest */}
          <section className="relative py-20">
            <div className="absolute inset-0 flex items-center justify-center opacity-5">
              <span className="text-[200px]">"</span>
            </div>
            <h2 className="relative font-display text-white tracking-tight text-4xl font-bold leading-tight text-center sm:text-5xl max-w-4xl mx-auto">
              "I finally broke through a creative block I've had for years."
            </h2>
          </section>

          {/* Testimonial 2: The Creative */}
          <section className="grid grid-cols-1 items-start gap-12 md:grid-cols-3 md:gap-16">
            <div className="flex flex-col gap-10 md:col-span-2 md:order-last">
              <p className="font-display text-white text-3xl font-medium leading-snug sm:text-4xl">
                "The AI wasn't just a tool; it was a collaborator. It helped me see patterns I missed and pushed my work into territories I was too afraid to explore."
              </p>
              
              <div className="flex flex-col gap-4 rounded-xl border border-white/10 bg-white/5 p-8 backdrop-blur-sm">
                <div className="flex items-center justify-between gap-4">
                  <p className="text-white text-lg font-medium leading-normal">Creative Output</p>
                  <p className="font-display text-primary text-2xl font-bold">+150%</p>
                </div>
                <div className="h-3 w-full rounded-full bg-white/10 overflow-hidden">
                  <div className="h-3 rounded-full bg-primary shadow-[0_0_20px_rgba(13,242,242,0.5)]" style={{ width: '75%' }}></div>
                </div>
              </div>
            </div>
            
            <div className="flex flex-col items-start gap-4 md:col-span-1 md:items-end md:text-right">
              {/* Profile Image with Gradient */}
              <div className="relative h-32 w-32 rounded-full overflow-hidden border-2 border-primary/30 md:ml-auto">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-primary/5"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-6xl">👩‍🎨</span>
                </div>
              </div>
              <div>
                <p className="text-white text-lg font-bold leading-tight">Maria K.</p>
                <p className="text-white/60 text-base font-normal leading-normal mt-1">Creative Director</p>
              </div>
            </div>
          </section>

          {/* Video Testimonial with Better Visuals */}
          <section className="flex flex-col items-center gap-8 text-center py-12">
            <h3 className="font-display text-white text-3xl font-bold leading-tight tracking-tighter sm:text-4xl">
              See the transformation.
            </h3>
            <div className="relative group w-full aspect-video max-w-3xl cursor-pointer overflow-hidden rounded-2xl border border-white/20 shadow-2xl">
              {/* Animated gradient background */}
              <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-background-dark to-background-dark"></div>
              
              {/* Geometric pattern overlay */}
              <div className="absolute inset-0 opacity-20">
                <div className="absolute top-10 left-10 h-40 w-40 rounded-full border border-primary/30"></div>
                <div className="absolute bottom-20 right-20 h-60 w-60 rounded-full border border-primary/20"></div>
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 h-80 w-80 rounded-full border border-primary/10"></div>
              </div>

              {/* Play button */}
              <div className="absolute inset-0 flex items-center justify-center z-10">
                <div className="flex h-24 w-24 items-center justify-center rounded-full bg-primary/20 backdrop-blur-md border border-primary/30 transition-all duration-300 group-hover:scale-110 group-hover:bg-primary/30">
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary">
                    <span className="text-background-dark text-3xl ml-1">▶</span>
                  </div>
                </div>
              </div>

              {/* Hover glow effect */}
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-primary/5"></div>
            </div>
          </section>

          {/* CTA Section with Enhanced Design */}
          <section className="relative flex flex-col items-center justify-center gap-8 rounded-2xl border border-primary/20 bg-gradient-to-br from-primary/10 to-transparent py-20 px-8 text-center backdrop-blur-sm overflow-hidden">
            {/* Background decoration */}
            <div className="absolute top-0 right-0 h-64 w-64 bg-primary/10 rounded-full blur-3xl"></div>
            <div className="absolute bottom-0 left-0 h-64 w-64 bg-primary/5 rounded-full blur-3xl"></div>
            
            <div className="relative z-10 flex flex-col gap-6 max-w-2xl">
              <h2 className="font-display text-white text-4xl font-black leading-tight tracking-tight sm:text-5xl">
                Ready to write your own story?
              </h2>
              <p className="text-lg text-white/70 leading-relaxed">
                Join a community of forward-thinkers and unlock your full potential with our proprietary AI. Your evolution starts now.
              </p>
            </div>
            
            <button 
              onClick={() => navigate('/signup')}
              className="relative z-10 flex min-w-[200px] cursor-pointer items-center justify-center overflow-hidden rounded-xl h-14 px-8 bg-primary text-background-dark text-lg font-bold leading-normal tracking-[0.015em] hover:shadow-[0_0_30px_0px_#0df2f2] transition-all duration-300 hover:scale-105"
            >
              <span className="truncate">Begin Your Evolution</span>
            </button>
          </section>

        </div>
      </main>
    </div>
  );
};

export default StoriesPage;
