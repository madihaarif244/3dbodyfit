
interface ChatResponse {
  keywords: string[];
  response: string;
}

export const predefinedResponses: ChatResponse[] = [
  {
    keywords: ["picture", "photo", "image", "safe", "security", "privacy"],
    response: "Your pictures are completely safe! We process all images with end-to-end encryption, and they are not stored on our servers. We only process them in memory for measurements and immediately discard them. We are fully GDPR compliant and take your privacy very seriously."
  },
  {
    keywords: ["accuracy", "accurate", "measurement", "precise", "deviation"],
    response: "Our measurement system achieves high accuracy with typical deviations of ±1.5-2cm for most measurements. The accuracy depends on image quality and positioning - with high-quality images, we can achieve even better results. Each measurement comes with a confidence score that indicates its reliability."
  },
  {
    keywords: ["what", "app", "application", "purpose", "do", "help"],
    response: "This application uses advanced AI and computer vision technology to generate accurate body measurements from your photos. It helps you get precise measurements for clothing sizing, fitness tracking, and custom tailoring - all while ensuring your privacy and data security. You can use these measurements for online shopping, tracking fitness progress, or getting custom-fitted clothing."
  }
];

export const findBestResponse = (input: string): string => {
  const lowercaseInput = input.toLowerCase();
  
  // Find the response with the most keyword matches
  let bestMatch = {
    response: "I'm sorry, I don't understand. Try asking about image privacy, measurement accuracy, or what this application does!",
    matches: 0
  };

  predefinedResponses.forEach(item => {
    const matches = item.keywords.filter(keyword => 
      lowercaseInput.includes(keyword.toLowerCase())
    ).length;
    
    if (matches > bestMatch.matches) {
      bestMatch = {
        response: item.response,
        matches: matches
      };
    }
  });

  return bestMatch.response;
};
