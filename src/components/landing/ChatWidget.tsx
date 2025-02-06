import { useState } from "react";
import { Button } from "@/components/ui/button";
import { MessageCircle, X, Send } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";

export function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Here you would typically send the message to your support system
    console.log("Message sent:", message);
    setMessage("");
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {isOpen ? (
        <div className="bg-white rounded-lg shadow-lg w-80 h-96 flex flex-col animate-fade-in">
          <div className="p-4 bg-gradient-to-r from-violet-600 to-blue-600 text-white rounded-t-lg flex justify-between items-center">
            <h3 className="font-semibold">Live Support</h3>
            <Button 
              variant="ghost" 
              size="icon"
              onClick={() => setIsOpen(false)}
              className="text-white hover:text-white/80"
            >
              <X className="h-5 w-5" />
            </Button>
          </div>
          <div className="flex-1 p-4 overflow-y-auto">
            <div className="text-gray-500 text-center">
              How can we help you today?
            </div>
          </div>
          <form onSubmit={handleSubmit} className="p-4 border-t">
            <div className="flex gap-2">
              <Textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Type your message..."
                className="min-h-[80px] resize-none"
              />
              <Button type="submit" size="icon" className="bg-gradient-to-r from-violet-600 to-blue-600">
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </form>
        </div>
      ) : (
        <Button
          onClick={() => setIsOpen(true)}
          className="rounded-full w-14 h-14 bg-gradient-to-r from-violet-600 to-blue-600 hover:from-violet-700 hover:to-blue-700 shadow-lg animate-fade-in"
        >
          <MessageCircle className="h-6 w-6" />
        </Button>
      )}
    </div>
  );
}