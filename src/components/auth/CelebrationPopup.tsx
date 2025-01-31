import { Dialog, DialogContent } from "@/components/ui/dialog";
import { motion, AnimatePresence } from "framer-motion";
import { PartyPopper } from "lucide-react";

interface CelebrationPopupProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CelebrationPopup({ open, onOpenChange }: CelebrationPopupProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md bg-gradient-to-br from-violet-50 via-white to-blue-50">
        <div className="flex flex-col items-center justify-center py-6 space-y-6">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5, type: "spring" }}
          >
            <PartyPopper className="w-16 h-16 text-yellow-500" />
          </motion.div>
          
          <AnimatePresence>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-4 text-center"
            >
              <motion.h2 
                className="text-2xl font-bold bg-gradient-to-r from-violet-600 to-indigo-600 bg-clip-text text-transparent"
                animate={{ 
                  scale: [1, 1.1, 1],
                }}
                transition={{ duration: 1, repeat: Infinity }}
              >
                Welcome to EasyCancely! 🎉
              </motion.h2>
              
              <p className="text-gray-600">
                Thank you for joining us! We're excited to help you manage your subscriptions better.
              </p>
            </motion.div>
          </AnimatePresence>

          <motion.div 
            className="absolute -top-10 left-1/2 transform -translate-x-1/2"
            initial={{ y: -100 }}
            animate={{ y: [-100, 0] }}
            transition={{ duration: 0.5, type: "spring" }}
          >
            {[...Array(3)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute"
                animate={{
                  y: [0, -100],
                  x: [(i - 1) * 30, (i - 1) * 60],
                  opacity: [1, 0],
                  scale: [1, 0.5]
                }}
                transition={{
                  duration: 1,
                  delay: i * 0.2,
                  repeat: Infinity,
                  repeatDelay: 2
                }}
              >
                <div className="w-2 h-2 rounded-full bg-yellow-400" />
              </motion.div>
            ))}
          </motion.div>
        </div>
      </DialogContent>
    </Dialog>
  );
}