/**
 * Chat Bot Example - Build a conversational AI with cost tracking
 * 
 * This example shows how to:
 * - Create an interactive chat bot
 * - Track conversation costs in real-time
 * - Handle multi-turn conversations
 * - Display usage statistics
 */

import { chat } from '../src';
import * as readline from 'readline';

async function runChatBot() {
  console.log('🤖 Cost Katana Chat Bot\n');
  console.log('Type your messages and press Enter');
  console.log('Commands: /cost (show cost), /clear (reset), /quit (exit)\n');
  
  // Create chat session
  const bot = chat('gpt-3.5-turbo', {
    systemMessage: 'You are a helpful AI assistant. Be concise and friendly.',
    temperature: 0.7
  });
  
  // Setup readline interface
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });
  
  // Handle user input
  const askQuestion = () => {
    rl.question('You: ', async (input) => {
      const message = input.trim();
      
      // Handle commands
      if (message === '/quit') {
        console.log('\n--- Final Stats ---');
        console.log(`Total messages: ${bot.messages.length}`);
        console.log(`Total cost: $${bot.totalCost.toFixed(4)}`);
        console.log(`Total tokens: ${bot.totalTokens}`);
        rl.close();
        return;
      }
      
      if (message === '/cost') {
        console.log(`💰 Current cost: $${bot.totalCost.toFixed(4)} (${bot.totalTokens} tokens)`);
        askQuestion();
        return;
      }
      
      if (message === '/clear') {
        bot.clear();
        console.log('🔄 Conversation cleared\n');
        askQuestion();
        return;
      }
      
      // Skip empty messages
      if (!message) {
        askQuestion();
        return;
      }
      
      // Send message to AI
      try {
        const response = await bot.send(message);
        console.log(`Bot: ${response}\n`);
      } catch (error) {
        console.error('Error:', (error as Error).message);
      }
      
      // Show cost after each message
      console.log(`💰 Session cost: $${bot.totalCost.toFixed(4)}\n`);
      
      // Continue conversation
      askQuestion();
    });
  };
  
  // Start the conversation
  askQuestion();
}

// Run if executed directly
if (require.main === module) {
  runChatBot().catch(console.error);
}

export { runChatBot };
