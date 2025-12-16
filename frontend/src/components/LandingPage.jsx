import React from "react";
import { motion } from "framer-motion";
import { SignInButton, SignUpButton } from "@clerk/clerk-react";
import { 
  ArrowRight, 
  CheckCircle2, 
  BarChart3, 
  Brain, 
  Clock, 
  Shield, 
  Target, 
  Users,
  Sparkles,
  ChevronRight
} from "lucide-react";

const MathBackground = () => (
  <svg className="absolute inset-0 w-full h-full opacity-[0.03] pointer-events-none z-0" xmlns="http://www.w3.org/2000/svg">
    <pattern id="math-pattern" x="0" y="0" width="100" height="100" patternUnits="userSpaceOnUse">
      <text x="10" y="20" fontSize="20" fill="currentColor">∑</text>
      <text x="50" y="20" fontSize="20" fill="currentColor">∫</text>
      <text x="80" y="50" fontSize="20" fill="currentColor">π</text>
      <text x="20" y="60" fontSize="20" fill="currentColor">√</text>
      <text x="60" y="80" fontSize="20" fill="currentColor">∞</text>
      <text x="10" y="90" fontSize="14" fill="currentColor">x²</text>
    </pattern>
    <rect x="0" y="0" width="100%" height="100%" fill="url(#math-pattern)" />
  </svg>
);

const FadeIn = ({ children, delay = 0 }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.5, delay }}
    className="relative z-10"
  >
    {children}
  </motion.div>
);

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-background text-foreground font-sans selection:bg-primary/20">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 h-20 bg-background/80 backdrop-blur-md border-b border-border z-50">
        <div className="max-w-7xl mx-auto px-6 h-full flex items-center justify-between">
          <div className="flex items-center gap-2">
            {/* <div className="bg-primary p-2 rounded-lg shadow-sm"> */}
              {/* <Sparkles className="w-5 h-5 text-primary-foreground" /> */}
            {/* </div> */}
            <span className="text-xl font-bold tracking-tight text-foreground">Prepara</span>
          </div>
          
          <div className="flex items-center gap-4">
            <SignInButton mode="modal">
              <button className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
                Log in
              </button>
            </SignInButton>
            <SignUpButton mode="modal">
              <button className="bg-primary hover:opacity-90 text-primary-foreground px-5 py-2.5 rounded-full text-sm font-bold transition-all shadow-lg shadow-primary/20 flex items-center gap-2 cursor-pointer">
                Get Started <ArrowRight className="w-4 h-4" />
              </button>
            </SignUpButton>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 lg:pt-48 lg:pb-32 relative overflow-hidden bg-background">
        <MathBackground />
        {/* Background Gradients */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-7xl -z-10 opacity-40 pointer-events-none">
          <div className="absolute top-20 left-10 w-72 h-72 bg-primary/20 rounded-full mix-blend-multiply filter blur-3xl animate-blob"></div>
          <div className="absolute top-40 right-10 w-72 h-72 bg-secondary rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-2000"></div>
          <div className="absolute -bottom-8 left-1/2 w-72 h-72 bg-accent/20 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-4000"></div>
        </div>

        <div className="max-w-7xl mx-auto px-6 text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-secondary/50 border border-border shadow-sm mb-8 hover:border-primary/30 transition-colors"
          >
            <span className="flex h-2 w-2 rounded-full bg-primary animate-pulse"></span>
            <span className="text-sm font-medium text-muted-foreground">New GRE Pattern Updated</span>
          </motion.div>

          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-5xl lg:text-7xl font-bold tracking-tight text-foreground mb-6 max-w-4xl mx-auto leading-[1.1]"
          >
            Master the GRE with <span className="text-primary relative inline-block">
              Confidence
              <svg className="absolute w-full h-3 -bottom-1 left-0 text-primary opacity-30" viewBox="0 0 100 10" preserveAspectRatio="none">
                <path d="M0 5 Q 50 10 100 5" stroke="currentColor" strokeWidth="8" fill="none" />
              </svg>
            </span>
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-lg lg:text-xl text-muted-foreground mb-10 max-w-2xl mx-auto leading-relaxed"
          >
            The most advanced practice platform designed to boost your score. 
            Smart analytics, realistic simulations, and personalized study plans.
          </motion.p>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <SignUpButton mode="modal">
              <button className="w-full sm:w-auto px-8 py-4 bg-primary hover:opacity-90 text-primary-foreground rounded-full font-bold text-lg transition-all shadow-xl shadow-primary/25 hover:shadow-2xl hover:shadow-primary/30 transform hover:-translate-y-0.5 flex items-center justify-center gap-2 cursor-pointer">
                Start Practicing Free
                <ChevronRight className="w-5 h-5" />
              </button>
            </SignUpButton>
            
            <button className="w-full sm:w-auto px-8 py-4 bg-card hover:bg-secondary/50 text-foreground border border-input rounded-full font-semibold text-lg transition-all hover:border-primary/50 flex items-center justify-center gap-2 cursor-pointer">
              <Target className="w-5 h-5 text-primary" />
              <a href="#features">See Features</a>
            </button>
          </motion.div>

          {/* Metrics */}
          <motion.div 
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.5 }}
            className="mt-20 grid grid-cols-2 lg:grid-cols-4 gap-8 max-w-4xl mx-auto border-t border-border pt-10"
          >
            {[
              { label: "Active Students", value: "10k+" },
              { label: "Questions Solved", value: "1M+" },
              { label: "Avg Score Boost", value: "8-10 pts" },
              { label: "Success Rate", value: "94%" },
            ].map((stat, i) => (
              <div key={i} className="text-center">
                <div className="text-3xl font-bold text-foreground mb-1">{stat.value}</div>
                <div className="text-sm text-muted-foreground font-medium uppercase tracking-wider">{stat.label}</div>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-24 bg-background" id="features">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <FadeIn>
              <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">Everything you need to succeed</h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Our platform recreates the actual test environment so you're never caught off guard on exam day.
              </p>
            </FadeIn>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: <Clock className="w-6 h-6" />,
                title: "Real Exam Simulation",
                desc: "Practice with the exact timing and interface of the actual GRE to build stamina."
              },
              {
                icon: <BarChart3 className="w-6 h-6" />,
                title: "Advanced Analytics",
                desc: "Identify your weak spots instantly with deep performance breakdowns."
              },
              {
                icon: <Brain className="w-6 h-6" />,
                title: "Adaptive Learning",
                desc: "Our AI adjusts question difficulty based on your performance to maximize growth."
              },
              {
                icon: <Shield className="w-6 h-6" />,
                title: "Official Question Types",
                desc: "Practice with questions that mirror the style and difficulty of the real test."
              },
              {
                icon: <Target className="w-6 h-6" />,
                title: "Score Prediction",
                desc: "Get an accurate estimate of your potential score before you take the real exam."
              },
              {
                icon: <Users className="w-6 h-6" />,
                title: "Community Support",
                desc: "Join a community of thousands of students aiming for top scores."
              }
            ].map((feature, i) => (
              <FadeIn key={i} delay={i * 0.1}>
                <div className="group p-8 rounded-2xl bg-card hover:bg-secondary/50 hover:scale-105 border border-border transition-all duration-300">
                  <div className="w-12 h-12 bg-primary/10 rounded-xl shadow-sm flex items-center justify-center mb-6 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-bold text-foreground mb-3">{feature.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {feature.desc}
                  </p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* Social Proof / CTA */}
      <section className="py-24 bg-foreground text-background relative overflow-hidden">
        {/* Decorative Circles */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary opacity-10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-secondary opacity-10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2"></div>

        <div className="max-w-7xl mx-auto px-6 text-center relative z-10">
          <FadeIn>
            <h2 className="text-3xl lg:text-4xl font-bold mb-8">Ready to crush your goals?</h2>
            <div className="flex flex-col md:flex-row items-center justify-center gap-12 mb-12">
              <div className="flex items-center gap-4">
                <div className="flex -space-x-4">
                  {[1,2,3,4].map((i) => (
                    <div key={i} className="w-12 h-12 rounded-full border-2 border-foreground bg-muted overflow-hidden">
                      <img src={`https://i.pravatar.cc/100?img=${i+10}`} alt="User" />
                    </div>
                  ))}
                </div>
                <div className="text-left">
                  <div className="font-bold">4.9/5 Rating</div>
                  <div className="text-muted-foreground text-sm">from happy students</div>
                </div>
              </div>
            </div>

            <SignUpButton mode="modal">
              <button className="bg-background text-foreground px-10 py-4 rounded-full font-bold text-lg hover:bg-muted transition-colors shadow-xl shadow-white/5">
                Join Now for Free
              </button>
            </SignUpButton>
            <p className="mt-6 text-muted-foreground/80 text-sm">No credit card required • instant access</p>
          </FadeIn>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-muted text-muted-foreground py-12 border-t border-border">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center gap-2 mb-4">
                {/* <div className="bg-primary p-1.5 rounded-lg"> */}
                  {/* <Sparkles className="w-4 h-4 text-primary-foreground" /> */}
                {/* </div> */}
                <span className="text-lg font-bold text-foreground tracking-tight">Prepara</span>
              </div>
              <p className="max-w-xs text-sm">
                Empowering students to achieve their dream scores with cutting-edge technology and proven strategies.
              </p>
            </div>
            
            <div>
              <h4 className="text-foreground font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-sm">
                <li className="hover:text-primary cursor-pointer">Features</li>
                <li className="hover:text-primary cursor-pointer">Pricing</li>
                <li className="hover:text-primary cursor-pointer">Testimonials</li>
              </ul>
            </div>

            <div>
              <h4 className="text-foreground font-semibold mb-4">Legal</h4>
              <ul className="space-y-2 text-sm">
                <li className="hover:text-primary cursor-pointer">Privacy Policy</li>
                <li className="hover:text-primary cursor-pointer">Terms of Service</li>
              </ul>
            </div>
          </div>
          <div className="pt-8 border-t border-border text-center text-sm">
            © {new Date().getFullYear()} Prepara Inc. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
