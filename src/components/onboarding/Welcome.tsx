import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { ArrowRight, Heart, Smile } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface WelcomeProps {
  open: boolean;
  onClose: () => void;
}

const slides = [
  {
    title: "Welcome to SubsTracker! 👋",
    description: "We're excited to help you manage your subscriptions better.",
    icon: <Smile className="w-12 h-12 text-primary" />,
  },
  {
    title: "Track Everything in One Place",
    description: "Monitor all your subscriptions, set budgets, and never miss a payment.",
    icon: <Heart className="w-12 h-12 text-primary" />,
  },
  {
    title: "Let's Get Started!",
    description: "Swipe to begin your journey to better subscription management.",
    icon: <ArrowRight className="w-12 h-12 text-primary" />,
  },
];

export function Welcome({ open, onClose }: WelcomeProps) {
  const [currentSlide, setCurrentSlide] = useState(0);

  const handleNext = () => {
    if (currentSlide === slides.length - 1) {
      onClose();
    } else {
      setCurrentSlide((prev) => prev + 1);
    }
  };

  return (
    <Sheet open={open} onOpenChange={onClose}>
      <SheetContent
        side="bottom"
        className="h-[90vh] rounded-t-[30px] border-t-4 border-primary"
      >
        <div className="h-full flex flex-col items-center justify-center px-4">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentSlide}
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -100 }}
              transition={{ duration: 0.3 }}
              className="text-center space-y-8"
            >
              <div className="flex justify-center">{slides[currentSlide].icon}</div>
              <div className="space-y-4">
                <h2 className="text-3xl font-bold tracking-tight">
                  {slides[currentSlide].title}
                </h2>
                <p className="text-muted-foreground text-lg">
                  {slides[currentSlide].description}
                </p>
              </div>
            </motion.div>
          </AnimatePresence>

          <div className="mt-12 space-y-6 w-full max-w-sm">
            <Button
              className="w-full text-lg h-12"
              onClick={handleNext}
            >
              {currentSlide === slides.length - 1 ? "Get Started" : "Next"}
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>

            <div className="flex justify-center gap-2">
              {slides.map((_, index) => (
                <div
                  key={index}
                  className={`h-2 rounded-full transition-all duration-300 ${
                    index === currentSlide
                      ? "w-8 bg-primary"
                      : "w-2 bg-muted"
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}