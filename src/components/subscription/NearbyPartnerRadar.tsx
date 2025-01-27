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
    <div className="relative w-full h-[500px] bg-background rounded-full mx-auto max-w-[500px] overflow-hidden">
      {/* Radar Animation */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 border-4 border-primary/20 rounded-full" />
        <div className="absolute inset-[25%] border-2 border-primary/15 rounded-full" />
        <div className="absolute inset-[50%] border border-primary/10 rounded-full" />
        
        {/* Scanning Line Animation */}
        <motion.div
          className="absolute top-1/2 left-1/2 w-1 h-[250px] bg-primary/30 origin-bottom"
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
          // Calculate position based on distance
          const angle = (360 / users.length) * index;
          const distance = parseInt(user.distance) / 10; // Normalize distance
          const radius = 200 - (distance * 40); // Adjust dot position based on distance
          
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
                <div className="w-4 h-4 bg-primary rounded-full animate-pulse" />
                
                {/* Hover Card */}
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="bg-card p-3 rounded-lg shadow-lg min-w-[200px] space-y-2">
                    <div className="flex items-center justify-between">
                      <h4 className="font-semibold">{user.name}</h4>
                      <Badge variant="secondary">{user.distance}</Badge>
                    </div>
                    <p className="text-xs text-muted-foreground">{user.location}</p>
                    <div className="flex flex-wrap gap-1">
                      {user.interests.map((interest) => (
                        <Badge key={interest} variant="outline" className="text-xs">
                          {interest}
                        </Badge>
                      ))}
                    </div>
                    <Button 
                      size="sm" 
                      className="w-full mt-2"
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