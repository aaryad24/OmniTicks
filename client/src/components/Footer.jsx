import React from "react";
import { assets } from "../assets/assets";
import { ArrowRight, Facebook, Instagram, Twitter } from "lucide-react";

const Footer = () => {
  const socialLinks = [
    { 
      name: "instagram",
      url: "https://instagram.com",
      icon: <Instagram className="w-4 h-4 sm:w-5 sm:h-5" />,
    },
    { 
      name: "twitter",
      url: "https://twitter.com",
      icon: <Twitter className="w-4 h-4 sm:w-5 sm:h-5" />,
    },
    { 
      name: "facebook",
      url: "https://facebook.com",
      icon: <Facebook className="w-4 h-4 sm:w-5 sm:h-5" />,
    }
  ];

  return (
    <footer className="relative px-4 sm:px-6 md:px-12 lg:px-24 py-12 sm:py-16 md:py-20 w-full bg-gray-900">
      {/* Decorative background */}
      <div 
        className="absolute inset-0 w-full h-full z-0 pointer-events-none"
        style={{
          backgroundImage: "url('/spider.png')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          opacity: 0.15
        }}
        aria-hidden="true"
      ></div>
      
      {/* Timeline line */}
      
      <div className="max-w-6xl mx-auto relative z-10">
      <div className="absolute sm:left-6 md:left-12 lg:left-3 w-0.5 h-[80%] bg-gradient-to-b from-purple-500 to-cyan-500"></div>
        {/* Main footer content */}
        <div className="relative pl-8 sm:pl-12 md:pl-16 lg:pl-20 pb-12 md:pb-16">
          {/* Timeline dot */}
          <div className="absolute left-0 w-3 h-3 sm:w-4 sm:h-4 rounded-full bg-cyan-500 transform translate-x-[-50%]"></div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10 z-10 relative">
            {/* Logo and Description */}
            <div className="group">
              <div className="relative inline-block mb-4">
                <div className="absolute -inset-1 bg-gradient-to-r from-blue-700 to-cyan-500 rounded-lg blur opacity-0 group-hover:opacity-30 transition-all duration-300"></div>
                <img 
                  className="w-40 sm:w-48 h-auto z-10 relative" 
                  src="footerlogo.png" 
                  alt="logo" 
                />
              </div>
              <p className="text-gray-300 text-xs sm:text-sm leading-relaxed mb-4 sm:mb-6">
                OmniTicks. By using our site, you agree to our Terms of Service, Privacy Policy, and Cookie Policy.
              </p>
              <div className="flex items-center gap-2 sm:gap-3">
                {[assets.googlePlay, assets.appStore].map((app, index) => (
                  <a 
                    key={index} 
                    href="#" 
                    className="group relative transition-all"
                  >
                    <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-700 to-cyan-500 rounded-lg blur opacity-0 group-hover:opacity-30 transition-all"></div>
                    <img
                      src={app}
                      alt={index === 0 ? "google play" : "app store"}
                      className="h-8 sm:h-10 w-auto border border-gray-700 rounded-lg hover:border-blue-400 transition-all relative z-10"
                    />
                  </a>
                ))}
              </div>
            </div>

            {/* Navigation Links */}
            <div className="relative pl-6 sm:pl-8 md:pl-12">
              <div className="absolute left-3 sm:left-4 md:left-6 w-2 h-2 sm:w-3 sm:h-3 mt-1 sm:mt-2 rounded-full bg-purple-500 transform translate-x-[-50%]"></div>
              <h2 className="font-semibold mb-4 sm:mb-6 text-base sm:text-lg text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-cyan-400">
                Quick Links
              </h2>
              <ul className="space-y-2 sm:space-y-3 md:space-y-4">
                {['Home', 'Movies', 'Theaters', 'Pricing'].map((item) => (
                  <li key={item}>
                    <a 
                      href="#" 
                      className="text-xs sm:text-sm text-gray-300 hover:text-cyan-400 transition-colors flex items-center group"
                    >
                      <ArrowRight className="w-3 h-3 sm:w-4 sm:h-4 mr-2 text-cyan-400 opacity-0 group-hover:opacity-100 transition-all" />
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Contact Info */}
            <div className="relative pl-6 sm:pl-8 md:pl-12">
              <div className="absolute left-3 sm:left-4 md:left-6 w-2 h-2 sm:w-3 sm:h-3 mt-1 sm:mt-2 rounded-full bg-cyan-500 transform translate-x-[-50%]"></div>
              <h2 className="font-semibold mb-4 sm:mb-6 text-base sm:text-lg text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-400">
                Contact Us
              </h2>
              <div className="space-y-2 sm:space-y-3 md:space-y-4">
                <p className="text-xs sm:text-sm text-gray-300 hover:text-cyan-400 transition-colors flex items-center">
                  <svg className="w-3 h-3 sm:w-4 sm:h-4 mr-2 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  +1-234-567-890
                </p>
                <p className="text-xs sm:text-sm text-gray-300 hover:text-cyan-400 transition-colors flex items-center">
                  <svg className="w-3 h-3 sm:w-4 sm:h-4 mr-2 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  contact@example.com
                </p>
                <div>
                  <div className="flex gap-2 sm:gap-3 mt-4 sm:mt-6">
                    {socialLinks.map((social, index) => (
                      <a 
                        key={index}
                        href={social.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-1 sm:p-2 rounded-full bg-gray-800 hover:bg-cyan-500/10 hover:border-cyan-400 border border-gray-700 transition-all group"
                        aria-label={social.name}
                      >
                        {social.icon}
                      </a>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="relative pt-8 sm:pt-10 ml-8 sm:ml-14 border-t border-gray-800 text-center">
          <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-12 sm:w-16 h-0.5 sm:h-1 bg-gradient-to-r from-purple-500 to-cyan-500 rounded-full"></div>
          <p className="text-gray-400 text-xs sm:text-sm">
            Copyright {new Date().getFullYear()} © OmniTicks. All Right Reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;