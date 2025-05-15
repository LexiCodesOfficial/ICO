
import React, { useEffect } from 'react';
import Navbar from '@/components/Navbar';
import { Users, Target, Eye } from 'lucide-react';
import gsap from 'gsap';

const About = () => {
  useEffect(() => {
    // Animate the title
    gsap.fromTo(
      ".about-title",
      { opacity: 0, y: -30 },
      { opacity: 1, y: 0, duration: 0.8, ease: "power2.out" }
    );

    // Animate the sections with staggered effect
    gsap.fromTo(
      ".about-section",
      { 
        opacity: 0, 
        x: -30,
        scale: 0.95,
      },
      { 
        opacity: 1, 
        x: 0,
        scale: 1,
        duration: 0.7,
        stagger: 0.2,
        ease: "power2.out"
      }
    );

    // Animate icons with a bounce effect
    gsap.fromTo(
      ".about-icon",
      { scale: 0, opacity: 0 },
      { scale: 1, opacity: 1, duration: 0.5, delay: 0.3, stagger: 0.2, ease: "back.out(1.7)" }
    );
  }, []);

  return (
    <div className="min-h-screen bg-slate-950 dark:bg-slate-950 text-white">
      <Navbar />
      
      <div className="py-20 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-white mb-10 about-title">
            About CSViewer
          </h1>
        </div>
        
        <div className="space-y-20">
          <div className="flex flex-col md:flex-row items-start gap-6 about-section">
            <div className="flex items-center justify-center p-4 bg-green-600/20 rounded-full about-icon">
              <Users className="h-8 w-8 text-green-500" />
            </div>
            <div>
              <h2 className="text-2xl font-bold mb-4 text-white">Who We Are</h2>
              <p className="text-gray-300 text-lg leading-relaxed">
                We are a passionate team of developers and data enthusiasts dedicated to making data analysis accessible to everyone. 
                We believe in the power of visualization to uncover insights and tell compelling stories from raw data.
              </p>
            </div>
          </div>
          
          <div className="flex flex-col md:flex-row items-start gap-6 about-section">
            <div className="flex items-center justify-center p-4 bg-green-600/20 rounded-full about-icon">
              <Target className="h-8 w-8 text-green-500" />
            </div>
            <div>
              <h2 className="text-2xl font-bold mb-4 text-white">Our Mission</h2>
              <p className="text-gray-300 text-lg leading-relaxed">
                Our mission is to provide an intuitive, powerful, and free tool that empowers users to quickly transform their CSV data into meaningful charts and dashboards. 
                We aim to simplify the data visualization process, removing technical barriers and fostering data-driven decision-making.
              </p>
            </div>
          </div>
          
          <div className="flex flex-col md:flex-row items-start gap-6 about-section">
            <div className="flex items-center justify-center p-4 bg-green-600/20 rounded-full about-icon">
              <Eye className="h-8 w-8 text-green-500" />
            </div>
            <div>
              <h2 className="text-2xl font-bold mb-4 text-white">Our Vision</h2>
              <p className="text-gray-300 text-lg leading-relaxed">
                We envision a future where anyone, regardless of their technical skills, can easily explore and understand their data. 
                CSVision is the first step towards building a comprehensive suite of tools that make data interaction seamless and insightful.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
