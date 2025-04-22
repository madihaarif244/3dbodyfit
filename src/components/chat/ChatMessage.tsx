
import { cn } from "@/lib/utils";

interface ChatMessageProps {
  text: string;
  isBot: boolean;
  timestamp: Date;
}

export function ChatMessage({ text, isBot, timestamp }: ChatMessageProps) {
  return (
    <div
      className={cn(
        "flex w-full mb-4 animate-in fade-in duration-300",
        isBot ? "justify-start" : "justify-end"
      )}
    >
      <div
        className={cn(
          "max-w-[80%] rounded-lg px-4 py-2 shadow-sm",
          isBot
            ? "bg-secondary text-secondary-foreground"
            : "bg-primary text-primary-foreground"
        )}
      >
        <p className="text-sm whitespace-pre-wrap break-words">{text}</p>
        <time className="text-xs opacity-50 mt-1 block">
          {timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </time>
      </div>
    </div>
  );
}
