import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";

const LockScreen = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate API call and maintain standard logic credentials.
    setTimeout(() => {
      if (username.toLowerCase() === 'cs castings' && password === '9855111991') {
        localStorage.setItem('isAuthenticated', 'true');
        navigate('/main');
        toast({
          title: "Access Granted",
          description: "Welcome back to MaterialCertify.",
          duration: 2000
        });
      } else {
        toast({
          title: "Access Denied",
          description: "Invalid credentials. Please try again.",
          variant: "destructive",
          duration: 2000
        });
      }
      setIsLoading(false);
    }, 1000);
  };

  return (
    <div className="flex min-h-screen w-full font-sans">
      {/* Left panel */}
      <div
        className="hidden md:flex md:w-1/2 lg:w-[58%] flex-col justify-center px-12 lg:px-24 xl:px-44 relative overflow-hidden"
        style={{ backgroundColor: '#212A18' }}
      >
        {/* Subtle background glow/noise to simulate the softly lit curtain/lighting effect */}
        <div className="absolute inset-0 opacity-40 pointer-events-none" style={{ background: 'radial-gradient(circle at 70% 30%, #303A1F 0%, transparent 60%), radial-gradient(circle at 30% 80%, #2A331B 0%, transparent 60%)' }} />

        <div className="max-w-[500px] w-full relative z-10 flex flex-col items-start gap-3">
          <h3 className="text-[#F3EFE9] text-[2.5rem] mb-2 leading-none italic" style={{ fontFamily: '"Playfair Display", serif' }}>
            Log in
          </h3>
          <h1
            className="text-[#F3EFE9] text-[7rem] lg:text-[8.5rem] xl:text-[10rem] leading-[0.85] tracking-[-0.04em] uppercase"
            style={{ fontFamily: '"Anton", sans-serif' }}
          >
            WELCOME<br />BACK
          </h1>
          <p className="text-[#F3EFE9] mt-6 text-sm lg:text-[1.05rem] font-medium leading-[1.6] tracking-tight max-w-[400px]">
            Sign back in to your account to access your App
          </p>
        </div>
        <p className="text-[#F3EFE9] mt-6 text-sm lg:text-[1.05rem] font-medium leading-[1.6] tracking-tight max-w-[400px]">
          a product of <span className="text-[#C4C969]">CS Castings PVT LTD</span>
        </p>
      </div>

      {/* Right panel */}
      <div
        className="w-full md:w-1/2 lg:w-[42%] flex flex-col justify-center px-8 sm:px-16 lg:px-24 xl:px-32 relative"
        style={{ backgroundColor: '#F3EFE9' }}
      >
        <div className="max-w-[400px] w-full mx-auto md:mx-0 pt-10">
          <h2
            className="text-[2.5rem] sm:text-[3rem] lg:text-[3.5rem] xl:text-[4.2rem] leading-[0.9] tracking-[-0.02em] uppercase mb-12 whitespace-nowrap"
            style={{ color: '#2B3519', fontFamily: '"Anton", sans-serif' }}
          >
            Material Certify
          </h2>

          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-1">
              <label className="text-[14px] font-black tracking-[0.05em] uppercase" style={{ color: '#2B3519', fontFamily: 'Inter, Arial, sans-serif' }}>
                EMAIL
              </label>
              <Input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="h-[3.2rem] bg-transparent border-[1.5px] border-[#D9D1C6] rounded-none focus-visible:ring-0 focus-visible:border-[#2B3519] px-4 shadow-none text-xl"
                style={{ color: '#2B3519' }}
              />
            </div>

            <div className="space-y-1">
              <label className="text-[14px] font-black tracking-[0.05em] uppercase" style={{ color: '#2B3519', fontFamily: 'Inter, Arial, sans-serif' }}>
                PASSWORD
              </label>
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="h-[3.2rem] bg-transparent border-[1.5px] border-[#D9D1C6] rounded-none focus-visible:ring-0 focus-visible:border-[#2B3519] px-4 shadow-none text-xl"
                style={{ color: '#2B3519' }}
              />
            </div>

            <div className="pt-4">
              <Button
                type="submit"
                disabled={isLoading}
                className="h-[3.2rem] px-10 text-[13px] hover:brightness-110 font-bold tracking-[0.08em] shadow-none rounded-none border-none transition-all"
                style={{ backgroundColor: '#C4C969', color: '#212A18', fontFamily: 'Inter, Arial, sans-serif' }}
              >
                {isLoading ? "LOGGING IN..." : "LOG IN"}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LockScreen;