

// Disabled for now to prevent crash on Github Pages without API Key
// const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateMatchSummary = async (
): Promise<string> => {
  return "AI disabled";
  /*
  try {
    // Construct a textual representation of the game flow
    const gameLog = history.map(h => {
      const time = new Date(h.timestamp).toLocaleTimeString();
      return `[${time}] ${h.type === 'POINT' ? 'Point' : h.type} for Team ${h.team}. Score: ${h.scoreSnapshot.a}-${h.scoreSnapshot.b}`;
    }).join('\n');

    const langInstruction = language === 'es' ? 'Respond in Spanish.' : 'Respond in English.';

    const prompt = `
      You are an energetic volleyball sportscaster. 
      Generate a short, exciting summary (max 3 paragraphs) of the match between ${teamA.name} and ${teamB.name}.
      
      ${langInstruction}
      
      Current Status: ${isMatchOver ? 'Match Finished' : 'In Progress'}
      Sets: ${teamA.name} (${teamA.setsWon}) - ${teamB.name} (${teamB.setsWon})
      Current Set Score: ${teamA.score} - ${teamB.score}
      
      Match Log:
      ${gameLog}
      
      Highlight momentum shifts, key scoring runs, and the current state of play. Use emojis!
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });

    return response.text || "No summary available.";
  } catch (error) {
    console.error("Error generating summary:", error);
    return language === 'es' 
      ? "No se pudo generar el resumen en este momento." 
      : "Could not generate match summary at this time.";
  }
  */
};