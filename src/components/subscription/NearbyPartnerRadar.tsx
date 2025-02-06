import React, { useEffect, useState } from 'react';
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";

interface User {
  id: number;
  name: string;
  location: string;
  distance: string;
  interests: string[];
  joinedDate: string;
}

interface NearbyPartnerRadarProps {
  users: User[];
  onConnect: (userId: number) => void;
}

export const NearbyPartnerRadar = ({ users, onConnect }: NearbyPartnerRadarProps) => {
  const [scanning, setScanning] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setScanning(prev => !prev);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative w-full h-[400px] bg-black/5 dark:bg-white/5 rounded-lg mx-auto max-w-[400px] overflow-hidden backdrop-blur-sm">
      {/* Radar Animation */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 border border-primary/20 rounded-lg" />
        <div className="absolute inset-[15%] border border-primary/15 rounded-lg" />
        <div className="absolute inset-[30%] border border-primary/10 rounded-lg" />
        
        {/* Scanning Line Animation */}
        <motion.div
          className="absolute top-1/2 left-1/2 w-0.5 h-[200px] bg-primary/20 origin-bottom"
          initial={{ rotate: 0 }}
          animate={{ rotate: 360 }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "linear"
          }}
          style={{
            transformOrigin: 'bottom center',
          }}
        />
      </div>

      {/* Users Dots */}
      <AnimatePresence>
        {users.map((user, index) => {
          const angle = (360 / users.length) * index;
          const distance = parseInt(user.distance) / 10;
          const radius = 160 - (distance * 30);
          
          const x = Math.cos((angle * Math.PI) / 180) * radius;
          const y = Math.sin((angle * Math.PI) / 180) * radius;

          return (
            <motion.div
              key={user.id}
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0 }}
              className="absolute"
              style={{
                top: `calc(50% + ${y}px)`,
                left: `calc(50% + ${x}px)`,
                transform: 'translate(-50%, -50%)',
              }}
            >
              <div className="relative group">
                <div className="w-3 h-3 bg-primary/80 rounded-full animate-pulse" />
                
                {/* Hover Card */}
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 opacity-0 group-hover:opacity-100 transition-opacity z-50">
                  <div className="bg-card/95 backdrop-blur-sm p-2.5 rounded-lg shadow-lg min-w-[180px] space-y-1.5">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium text-sm">{user.name}</h4>
                      <Badge variant="secondary" className="text-xs px-1.5">{user.distance}</Badge>
                    </div>
                    <p className="text-xs text-muted-foreground">{user.location}</p>
                    <div className="flex flex-wrap gap-1">
                      {user.interests.map((interest) => (
                        <Badge key={interest} variant="outline" className="text-[10px] px-1">
                          {interest}
                        </Badge>
                      ))}
                    </div>
                    <Button 
                      size="sm" 
                      className="w-full mt-1.5 h-7 text-xs"
                      onClick={() => onConnect(user.id)}
                    >
                      Connect
                    </Button>
                  </div>
                </div>
              </div>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
};