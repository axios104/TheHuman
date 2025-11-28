import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import NavBar from '../components/landing/NavBar';

const LandingPage = () => {
  const navigate = useNavigate();
  const [hoveredBar, setHoveredBar] = useState(null);

  return (
    <div className="relative min-h-screen w-full overflow-x-hidden">
      {/* Full Screen Background Image - FIXED */}
      <div 
        className="fixed inset-0 z-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuDE3DmIkoAeTpWauV12XBtzqAuW7kAfOselWJuhGrMRngXv09JkNEo-Xy7CiIfdiXYsB2x13Kcyhd1ti7u2y17RPMEjHZNwP2yL1HQ1WI4BRlKbOj8qai0x1ZCEm_EKI2h6vakvuOzDydj7sGp6vWO0JMcBI2IrRqO9WPZtWhwOrvYVHmF8GgcwH7bzHuePYhZ093XE_dVl__EbsYH2LhsFJ2SjvQWtaAsdf00WLGUICM8kVZsEK57cfo3hCiPp9jKULKzrl5r9ea4C")',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/70 to-black/85"></div>
      </div>

      {/* Content - Relative to show above background */}
      <div className="relative z-10 flex min-h-screen w-full flex-col bg-transparent text-text-primary">
        <NavBar />
        
        <div className="flex w-full flex-1 flex-col items-center">
          <div className="flex w-full max-w-[1100px] flex-1 flex-col px-4 sm:px-10">

            <main className="flex w-full flex-1 flex-col items-center pt-16">

              {/* HERO SECTION */}
              <section className="w-full py-20 sm:py-32">
                <div className="flex min-h-[480px] flex-col items-center justify-center gap-6 rounded-xl p-4 text-center sm:gap-8">
                  <motion.div
                    className="flex flex-col gap-2"
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                  >
                    <h1 className="text-4xl font-black leading-tight tracking-[-0.033em] text-white sm:text-6xl">
                      Evolve Beyond Your Limits.
                    </h1>
                    <h2 className="max-w-xl text-base font-normal leading-normal text-[#EAEAEA] sm:text-lg">
                      Experience a new era of personal growth with an AI that understands you, empowers you, and grows with you.
                    </h2>
                  </motion.div>
                  <motion.button
                    onClick={() => navigate('/signup')}
                    className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-12 px-5 bg-primary text-background-dark text-base font-bold leading-normal tracking-[0.015em] transition-all hover:shadow-[0_0_20px_0px_#0df2f2]"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.4, duration: 0.6 }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <span className="truncate">Begin Your Journey</span>
                  </motion.button>
                </div>
              </section>

              {/* PROGRESS VISUALIZATION SECTION */}
              <section className="w-full py-16 sm:py-24">
                <div className="flex flex-col items-center gap-12 px-4 text-center">
                  <div className="flex flex-col items-center gap-4">
                    <h2 className="text-[32px] font-bold leading-tight tracking-[-0.033em] text-white sm:text-4xl">
                      See Your Progress. Feel the Growth.
                    </h2>
                    <p className="max-w-2xl text-base font-normal leading-normal text-[#EAEAEA]">
                      HUMAN helps you visualize your journey, turning abstract feelings of progress into tangible, data-driven insights. Watch your evolution unfold.
                    </p>
                  </div>

                  <div className="grid w-full grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">

                    {/* FOCUS SCORE - Interactive Circle Chart */}
                    <motion.div
                      className="flex flex-col gap-6 rounded-xl border border-white/10 bg-black/20 backdrop-blur-sm p-6"
                      initial={{ opacity: 0, y: 30 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.6 }}
                      whileHover={{ scale: 1.02, borderColor: 'rgba(13, 242, 242, 0.3)' }}
                    >
                      <div className="flex flex-col items-start text-left">
                        <h3 className="text-lg font-bold leading-tight text-white">Focus Score</h3>
                        <p className="text-sm font-normal leading-normal text-white/70">Monthly progress in mindfulness.</p>
                      </div>
                      <div className="flex flex-1 items-center justify-center">
                        <div className="relative size-40">
                          <svg className="size-full -rotate-90" viewBox="0 0 100 100">
                            ircle
                              className="text-white/10"
                              cx="50"
                              cy="50"
                              fill="transparent"
                              r="45"
                              stroke="currentColor"
                              strokeWidth="10"
                            />
                            <motion.circle
                              className="text-primary"
                              cx="50"
                              cy="50"
                              fill="transparent"
                              r="45"
                              stroke="currentColor"
                              strokeDasharray="282.7"
                              strokeLinecap="round"
                              strokeWidth="10"
                              initial={{ strokeDashoffset: 282.7 }}
                              whileInView={{ strokeDashoffset: 62.2 }}
                              viewport={{ once: true }}
                              transition={{ duration: 1.5, ease: "easeOut" }}
                            />
                          </svg>
                          <div className="absolute inset-0 flex flex-col items-center justify-center">
                            <motion.span
                              className="text-3xl font-bold text-white"
                              initial={{ opacity: 0 }}
                              whileInView={{ opacity: 1 }}
                              viewport={{ once: true }}
                              transition={{ delay: 0.5 }}
                            >
                              78%
                            </motion.span>
                            <motion.span
                              className="text-sm font-medium text-primary"
                              initial={{ opacity: 0, y: 10 }}
                              whileInView={{ opacity: 1, y: 0 }}
                              viewport={{ once: true }}
                              transition={{ delay: 0.8 }}
                            >
                              +12%
                            </motion.span>
                          </div>
                        </div>
                      </div>
                    </motion.div>

                    {/* WEEKLY INSIGHTS - Interactive Bar Chart */}
                    <motion.div
                      className="flex flex-col gap-6 rounded-xl border border-white/10 bg-black/20 backdrop-blur-sm p-6"
                      initial={{ opacity: 0, y: 30 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.6, delay: 0.1 }}
                      whileHover={{ scale: 1.02, borderColor: 'rgba(13, 242, 242, 0.3)' }}
                    >
                      <div className="flex flex-col items-start text-left">
                        <h3 className="text-lg font-bold leading-tight text-white">Weekly Insights</h3>
                        <p className="text-sm font-normal leading-normal text-white/70">Key areas of development.</p>
                      </div>
                      <div className="flex h-full flex-col justify-end gap-3 pt-4">
                        {[
                          { label: 'Creativity', value: 75, color: '#0df2f2' },
                          { label: 'Clarity', value: 60, color: '#0df2f2' },
                          { label: 'Discipline', value: 85, color: '#0df2f2' },
                          { label: 'Energy', value: 50, color: '#0df2f2' }
                        ].map((item, idx) => (
                          <div key={idx} className="flex items-end gap-2">
                            <span className="w-16 shrink-0 text-right text-xs font-medium text-white/70">
                              {item.label}
                            </span>
                            <div
                              className="h-4 w-full rounded-full bg-white/10 relative overflow-hidden cursor-pointer"
                              onMouseEnter={() => setHoveredBar(idx)}
                              onMouseLeave={() => setHoveredBar(null)}
                            >
                              <motion.div
                                className="h-4 rounded-full bg-primary"
                                initial={{ width: 0 }}
                                whileInView={{ width: `${item.value}%` }}
                                viewport={{ once: true }}
                                transition={{ duration: 1, delay: idx * 0.1 }}
                                animate={{
                                  boxShadow: hoveredBar === idx ? '0 0 15px rgba(13, 242, 242, 0.6)' : '0 0 0px rgba(13, 242, 242, 0)'
                                }}
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    </motion.div>

                    {/* EVOLUTION TRAJECTORY - Interactive Line Chart */}
                    <motion.div
                      className="flex flex-col gap-6 rounded-xl border border-white/10 bg-black/20 backdrop-blur-sm p-6 sm:col-span-2 lg:col-span-1"
                      initial={{ opacity: 0, y: 30 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.6, delay: 0.2 }}
                      whileHover={{ scale: 1.02, borderColor: 'rgba(13, 242, 242, 0.3)' }}
                    >
                      <div className="flex flex-col items-start text-left">
                        <h3 className="text-lg font-bold leading-tight text-white">Evolution Trajectory</h3>
                        <p className="text-sm font-normal leading-normal text-white/70">Overall growth over time.</p>
                      </div>
                      <div className="relative flex h-full min-h-[160px] w-full flex-col justify-between">
                        <svg className="absolute inset-0 h-full w-full" fill="none" preserveAspectRatio="none" viewBox="0 0 100 100">
                          <motion.path
                            className="text-primary"
                            d="M 0 85 Q 25 70, 50 50 T 100 20"
                            stroke="currentColor"
                            strokeWidth="2"
                            fill="none"
                            initial={{ pathLength: 0 }}
                            whileInView={{ pathLength: 1 }}
                            viewport={{ once: true }}
                            transition={{ duration: 2, ease: "easeOut" }}
                          />
                          <path d="M 0 85 Q 25 70, 50 50 T 100 20" fill="url(#gradient)" stroke="none" />
                          <defs>
                            <linearGradient id="gradient" x1="0" x2="0" y1="0" y2="100%">
                              <stop offset="0%" stopColor="#0df2f2" stopOpacity="0.2" />
                              <stop offset="100%" stopColor="#0df2f2" stopOpacity="0" />
                            </linearGradient>
                          </defs>
                        </svg>
                        <div className="h-full w-full border-b border-l border-dashed border-white/10" />
                        <div className="absolute bottom-0 left-0 -mb-5 flex w-full justify-between text-xs text-white/50">
                          <span>Past</span>
                          <span>Present</span>
                        </div>
                      </div>
                    </motion.div>

                  </div>
                </div>
              </section>

              {/* INTELLIGENT DIALOGUE & PRIVACY SECTION */}
              <section className="w-full py-16 sm:py-24">
                <div className="grid grid-cols-1 gap-8 px-4 sm:grid-cols-2">

                  {/* Intelligent Dialogue */}
                  <motion.div
                    className="flex flex-col gap-4"
                    initial={{ opacity: 0, x: -30 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                  >
                    <div className="flex flex-col items-start text-left">
                      <h3 className="text-2xl font-bold leading-tight tracking-[-0.033em] text-white">Intelligent Dialogue</h3>
                      <p className="text-base font-normal leading-normal text-[#EAEAEA]">
                        Engage in deep, meaningful dialogue that goes beyond generic responses.
                      </p>
                    </div>
                    <motion.div
                      className="w-full rounded-xl border border-white/10 bg-black/20 backdrop-blur-sm p-6 font-mono text-sm text-[#EAEAEA]"
                      whileHover={{ borderColor: 'rgba(13, 242, 242, 0.3)' }}
                    >
                      <div className="flex flex-col gap-4">
                        <motion.p
                          className="text-primary"
                          initial={{ opacity: 0, x: -20 }}
                          whileInView={{ opacity: 1, x: 0 }}
                          viewport={{ once: true }}
                          transition={{ delay: 0.2 }}
                        >
                          &gt; You: I feel stuck.
                        </motion.p>
                        <motion.p
                          className="text-white"
                          initial={{ opacity: 0, x: -20 }}
                          whileInView={{ opacity: 1, x: 0 }}
                          viewport={{ once: true }}
                          transition={{ delay: 0.5 }}
                        >
                          &gt; HUMAN: I understand. Your journal entries mention a peak in creative energy on Tuesdays. That's also when you have the most meetings. Is there a connection?
                        </motion.p>
                        <div className="flex animate-pulse items-center gap-2">
                          <p className="text-primary">&gt; You:</p>
                          <div className="h-4 w-1 bg-primary" />
                        </div>
                      </div>
                    </motion.div>
                  </motion.div>

                  {/* Absolute Privacy */}
                  <motion.div
                    className="flex flex-col gap-4"
                    initial={{ opacity: 0, x: 30 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                  >
                    <div className="flex flex-col items-start text-left">
                      <h3 className="text-2xl font-bold leading-tight tracking-[-0.033em] text-white">Absolute Privacy</h3>
                      <p className="text-base font-normal leading-normal text-[#EAEAEA]">
                        Your data is encrypted, anonymized, and never shared. You are in complete control.
                      </p>
                    </div>
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                      <motion.div
                        className="flex flex-col gap-3 rounded-xl border border-white/10 bg-black/20 backdrop-blur-sm p-4 items-center text-center cursor-pointer"
                        whileHover={{ scale: 1.05, borderColor: 'rgba(13, 242, 242, 0.5)' }}
                      >
                        <div className="text-primary text-4xl">🔒</div>
                        <h4 className="text-base font-bold leading-tight text-white">E2E Encryption</h4>
                      </motion.div>
                      <motion.div
                        className="flex flex-col gap-3 rounded-xl border border-white/10 bg-black/20 backdrop-blur-sm p-4 items-center text-center cursor-pointer"
                        whileHover={{ scale: 1.05, borderColor: 'rgba(13, 242, 242, 0.5)' }}
                      >
                        <div className="text-primary text-4xl">✓</div>
                        <h4 className="text-base font-bold leading-tight text-white">User Controlled</h4>
                      </motion.div>
                    </div>
                  </motion.div>

                </div>
              </section>

              {/* FINAL CTA SECTION */}
              <section className="w-full py-20 sm:py-32">
                <motion.div
                  className="flex flex-col items-center justify-center gap-6 rounded-xl p-4 text-center"
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8 }}
                >
                  <div className="flex flex-col gap-2">
                    <h2 className="text-4xl font-black leading-tight tracking-[-0.033em] text-white sm:text-5xl">
                      Ready to Evolve?
                    </h2>
                    <p className="mx-auto max-w-xl text-base font-normal leading-normal text-[#EAEAEA] sm:text-lg">
                      Your journey to a more intentional, insightful, and empowered self begins now. Discover the potential within.
                    </p>
                  </div>
                  <motion.button
                    onClick={() => navigate('/signup')}
                    className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-12 px-5 bg-primary text-background-dark text-base font-bold leading-normal tracking-[0.015em] transition-all hover:shadow-[0_0_20px_0px_#0df2f2]"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <span className="truncate">Start Your Free Trial</span>
                  </motion.button>
                </motion.div>
              </section>

            </main>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
