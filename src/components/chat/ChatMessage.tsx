
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
        "flex w-full mb-4",
        isBot ? "justify-start" : "justify-end"
      )}
    >
      <div
        className={cn(
          "max-w-[80%] rounded-lg px-4 py-2",
          isBot
            ? "bg-secondary text-secondary-foreground"
            : "bg-primary text-primary-foreground"
        )}
      >
        <p className="text-sm">{text}</p>
        <time className="text-xs opacity-50">
          {timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </time>
      </div>
    </div>
  );
}
