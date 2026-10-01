import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenAI } from '@google/genai';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      recipientName,
      occasion = 'birthday',
      relationship = 'Best Friend',
      tone = 'emotional',
      language = 'en',
      keyMemories = '',
      mode = 'full_letter',
    } = body;

    const apiKey = process.env.GEMINI_API_KEY;

    // If Gemini API Key is available, use Gemini 3.8 Flash
    if (apiKey) {
      try {
        const ai = new GoogleGenAI({
          apiKey,
          httpOptions: {
            headers: {
              'User-Agent': 'aistudio-build',
            },
          },
        });

        if (mode === 'short_wish') {
          const prompt = `You are a world-class empathetic writer creating a heartfelt guestbook wish for a celebration website.
Recipient: ${recipientName}
Occasion: ${occasion}
Relationship: ${relationship}
Tone: ${tone} (e.g. warm, poetic, hilarious, emotional, nostalgic)
Language: ${language} (en = English, hi = शुद्ध और भावुक हिंदी in Devanagari script, hinglish = natural conversational urban Hinglish)
Specific memories or inside details: ${keyMemories || 'None provided'}

Generate 3 distinct, beautiful, genuine wishes suitable for a digital celebration wall. Each should be 1-3 sentences long with fitting emojis.
Return strictly valid JSON in this structure:
{
  "wishes": [
    { "message": "wish text", "emoji": "🎂" },
    { "message": "wish text", "emoji": "✨" },
    { "message": "wish text", "emoji": "💖" }
  ]
}`;

          const response = await ai.models.generateContent({
            model: 'gemini-3.8-flash',
            contents: prompt,
            config: {
              responseMimeType: 'application/json',
              temperature: 0.85,
            },
          });

          const jsonText = response.text?.trim() || '{}';
          const parsed = JSON.parse(jsonText);
          return NextResponse.json(parsed);
        } else {
          // Full letter mode for Creator Studio
          const prompt = `You are a master creative writer and storyteller creating a deeply personalized occasion website for someone special.
Recipient Name: ${recipientName}
Occasion: ${occasion} (e.g. birthday, anniversary, graduation, milestone, love)
Relationship: ${relationship}
Tone: ${tone} (e.g. emotional, funny, poetic, filmi/bollywood, nostalgic, warm)
Language: ${language} (en = refined modern English; hi = authentic, soulful Hindi in Devanagari script; hinglish = warm contemporary Hinglish mixing English and Hindi naturally)
Special memories / inside jokes / qualities: ${keyMemories || 'Cherishing their contagious laugh, unwavering support, and bright presence'}

Write an unforgettable celebration tribute. Avoid generic Hallmark clichés. Make it feel authentic, vivid, and deeply touching.
Return strictly valid JSON with these exact keys:
{
  "headline": "A grand, captivating hero headline (e.g. Happy 25th Birthday, Priya! or 5 Years of Radiance & Laughter)",
  "subheadline": "A poetic 1-line dedication subtitle",
  "letterTitle": "An evocative letter title (e.g. A Quarter Century of Sunshine or To My Forever Anchor)",
  "paragraphs": [
    "First paragraph: Setting the stage, acknowledging the milestone, and reflecting on who they are.",
    "Second paragraph: Sharing deeper appreciation, inside moments, how they impact others.",
    "Third paragraph: Bold, inspiring blessings and wishes for the upcoming year or journey ahead."
  ],
  "secretNote": "A sweet, intimate, or playful final whisper to be revealed at the finale (e.g. PS: You will always be my emergency contact and my partner-in-crime forever.)"
}`;

          const response = await ai.models.generateContent({
            model: 'gemini-3.8-flash',
            contents: prompt,
            config: {
              responseMimeType: 'application/json',
              temperature: 0.85,
            },
          });

          const jsonText = response.text?.trim() || '{}';
          const parsed = JSON.parse(jsonText);
          return NextResponse.json(parsed);
        }
      } catch (geminiError) {
        console.error('Gemini API execution error, falling back to smart engine:', geminiError);
      }
    }

    // High quality intelligent fallback engine
    if (mode === 'short_wish') {
      const fallbackWishes = getFallbackShortWishes(recipientName, occasion, relationship, language, tone);
      return NextResponse.json({ wishes: fallbackWishes });
    }

    const fallbackLetter = getFallbackFullLetter(recipientName, occasion, relationship, language, tone, keyMemories);
    return NextResponse.json(fallbackLetter);
  } catch (error) {
    console.error('AI Wish generation error:', error);
    return NextResponse.json({ error: 'Failed to generate wish content' }, { status: 500 });
  }
}

function getFallbackShortWishes(name: string, occasion: string, rel: string, lang: string, tone: string) {
  if (lang === 'hi') {
    return [
      {
        message: `${name}, ईश्वर करे तुम्हारा जीवन खुशियों, सफलता और प्यार से हमेशा महकता रहे। जन्मदिन की ढेरों शुभकामनाएं!`,
        emoji: '🪔',
      },
      {
        message: `तुम जैसे प्यारे इंसान का हमारी ज़िंदगी में होना किसी वरदान से कम नहीं। हमेशा ऐसे ही मुस्कुराते रहो!`,
        emoji: '🌸',
      },
      {
        message: `हर सपना पूरा हो, हर राह आसान हो, तुम्हारी ज़िंदगी का हर पल खुशियों से भरपूर हो। बहुत-बहुत प्यार!`,
        emoji: '✨',
      },
    ];
  }
  if (lang === 'hinglish') {
    return [
      {
        message: `Happy ${occasion}, ${name}! You truly are the life of every gathering. Keep shining and never change!`,
        emoji: '⚡',
      },
      {
        message: `Tere jaisa dost milna is rare blessing. May this year bring crazy adventures and massive wins!`,
        emoji: '🎉',
      },
      {
        message: `Sending you the biggest virtual hug on your special day. Keep being your authentic rockstar self!`,
        emoji: '🥂',
      },
    ];
  }
  return [
    {
      message: `Happy ${occasion}, ${name}! May your day be as radiant, joyful, and wonderful as your spirit.`,
      emoji: '🎂',
    },
    {
      message: `So grateful for the laughter and memories we share. Here's to making countless more together!`,
      emoji: '💖',
    },
    {
      message: `Wishing you endless adventures, quiet moments of peace, and everything your heart desires!`,
      emoji: '✨',
    },
  ];
}

function getFallbackFullLetter(name: string, occasion: string, rel: string, lang: string, tone: string, memories: string) {
  if (lang === 'hi') {
    return {
      headline: `जन्मदिन की अनंत शुभकामनाएं, ${name}!`,
      subheadline: `तुम्हारी हंसी हमारे जीवन का सबसे अनमोल तोहफा है।`,
      letterTitle: `दुआओं और प्यार से भरा एक संदेश`,
      paragraphs: [
        `आज का दिन केवल तुम्हारे जीवन का एक और साल नहीं, बल्कि उन अनगिनत खुशियों का उत्सव है जो तुमने हमारे दिलों में भरी हैं। जब भी तुम मुस्कुराते हो, हर उदास पल रोशन हो जाता है।`,
        memories
          ? `हमारी वो यादें—${memories}—हमेशा दिल के करीब रहेंगी। तुम्हारी मासूमियत और समझदारी हर रिश्ते को संजो कर रखती है।`
          : `तुमने हमेशा सिखाया है कि जिंदगी को पूरे उत्साह और सच्चाई के साथ कैसे जिया जाता है। तुम हमारे लिए एक अनमोल प्रेरणा हो।`,
        `भगवान से बस यही प्रार्थना है कि आने वाले सफर में तुम्हें हर कदम पर सफलता, सेहत और अपार प्रेम मिले। तुम्हारा यह खास दिन हमेशा यादगार रहे!`,
      ],
      secretNote: `हमेशा याद रखना—चाहे दुनिया कितनी भी बदल जाए, हमारी यह मोहब्बत कभी कम नहीं होगी।`,
    };
  }

  if (lang === 'hinglish') {
    return {
      headline: `Happy ${occasion}, ${name}!`,
      subheadline: `To the human who turns every ordinary day into a Bollywood movie scene.`,
      letterTitle: `A Quarter Century of Pure Magic & Madness`,
      paragraphs: [
        `Happy celebration to my favorite human in the entire universe! From all our crazy gossip sessions to celebrating every tiny win together, you have always been the brightest spark in the room.`,
        memories
          ? `Especially remembering moments like ${memories}—bhai, we really made memories that we will laugh about even when we are eighty!`
          : `Tumhari positivity aur sense of humor is literally contagious. You have this effortless superpower to make everyone feel so special and valued.`,
        `As you step into this next chapter, I wish you wild adventures, peaceful mornings, and dreams that turn into reality faster than you can imagine. Keep shining, rockstar!`,
      ],
      secretNote: `PS: You will always be my 3 AM emergency contact and my permanent crime partner forever.`,
    };
  }

  return {
    headline: `Happy ${occasion}, ${name}!`,
    subheadline: `To the one who brings warmth, wonder, and authentic joy into every space.`,
    letterTitle: `A Tribute to an Extraordinary Soul`,
    paragraphs: [
      `Today is a celebration of the day the world became a significantly brighter place. Watching your journey unfold has been an absolute privilege, and your courage inspires everyone around you.`,
      memories
        ? `Reflecting back on memories like ${memories} brings the biggest smile to my face. Your warmth and loyalty make everyday moments feel timeless.`
        : `You have this rare, beautiful gift of listening with genuine empathy and showing up when it matters most. Life is undeniably richer with you in it.`,
      `May this upcoming year shower you with bold new opportunities, deep peace, spontaneous adventures, and love that knows no bounds. You deserve every ounce of joy this universe can offer.`,
    ],
    secretNote: `PS: No matter where life takes us, you will always have my unwavering love and pride in your corner.`,
  };
}
