import { createClient } from '@supabase/supabase-js';
import { uiSpanishCards } from './ui-spanish-flashcards.js';
import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing Supabase credentials!');
  console.error('Make sure VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY are set in .env');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function importUICards() {
  console.log(`📚 Starting import of ${uiSpanishCards.length} UI Spanish cards...\n`);

  let successCount = 0;
  let skipCount = 0;
  let errorCount = 0;

  for (const card of uiSpanishCards) {
    try {
      // Check if card already exists (by Spanish phrase)
      const { data: existing, error: checkError } = await supabase
        .from('cards')
        .select('id, spanish')
        .eq('spanish', card.spanish)
        .single();

      if (checkError && checkError.code !== 'PGRST116') {
        // PGRST116 = not found, which is fine
        throw checkError;
      }

      if (existing) {
        console.log(`⏭️  Skipping "${card.spanish}" - already exists`);
        skipCount++;
        continue;
      }

      // Insert the card
      const { error: insertError } = await supabase
        .from('cards')
        .insert({
          spanish: card.spanish,
          english: card.english,
          examples: card.examples,
        });

      if (insertError) throw insertError;

      console.log(`✅ Added: "${card.spanish}" → "${card.english}"`);
      successCount++;

      // Small delay to avoid rate limiting
      await new Promise(resolve => setTimeout(resolve, 100));

    } catch (error) {
      console.error(`❌ Error adding "${card.spanish}":`, error.message);
      errorCount++;
    }
  }

  console.log('\n📊 Import Summary:');
  console.log(`   ✅ Successfully added: ${successCount}`);
  console.log(`   ⏭️  Skipped (already exist): ${skipCount}`);
  console.log(`   ❌ Errors: ${errorCount}`);
  console.log(`   📚 Total processed: ${uiSpanishCards.length}`);
}

// Run the import
importUICards()
  .then(() => {
    console.log('\n🎉 Import complete!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n💥 Import failed:', error);
    process.exit(1);
  });
