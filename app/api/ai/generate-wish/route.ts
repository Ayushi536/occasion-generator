import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenAI } from '@google/genai';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      type = 'full-story', // 'full-story' | 'guest-wish'
      occasion = 'birthday',
      recipientName = 'Best Friend',
      recipientNickname = '',
      relationship = 'Friend',
      tone = 'emotional', // 'emotional' | 'playful' | 'poetic' | 'nostalgic' | 'inspiring'
      language = 'hinglish', // 'en' | 'hi' | 'hinglish'
      details = '',
    } = body;

    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      // Intelligent fallback when API key is not present in local test
      return NextResponse.json(generateAlgorithmicFallback(type, occasion, recipientName, recipientNickname, relationship, tone, language, details));
    }

    const ai = new GoogleGenAI({ apiKey });

    if (type === 'guest-wish') {
      const prompt = `You are an expert celebratory speechwriter and heartfelt greeting card author.
Task: Write a touching, personalized wish for a guest leaving a message on a digital celebration wall.
Details:
- Occasion: ${occasion}
- Recipient: ${recipientName} ${recipientNickname ? `(Nickname: ${recipientNickname})` : ''}
- Relationship to recipient: ${relationship}
- Desired Tone: ${tone} (e.g. tear-jerker emotional, playful teasing, deeply poetic, nostalgic, inspiring)
- Language: ${language === 'hi' ? 'Pure Hindi in Devanagari script' : language === 'hinglish' ? 'Warm authentic urban Hinglish (mix of Hindi & English as spoken by youth/families in India)' : 'English with deep warmth'}
- Extra personal context or memories: ${details || 'None provided, write a deeply relatable and evocative wish'}

Output STRICTLY valid JSON with no markdown wrapping or extra commentary:
{
  "message": "A 2 to 4 sentence heartfelt wish formatted for maximum emotional impact",
  "emoji": "A single fitting celebration emoji (e.g. 🎂, 🥂, 💖, 👑, 🌸, 🪔)"
}`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
      });

      const rawText = response.text || '';
      try {
        const cleaned = rawText.replace(/```json/gi, '').replace(/```/g, '').trim();
        const parsed = JSON.parse(cleaned);
        return NextResponse.json(parsed);
      } catch {
        return NextResponse.json({
          message: rawText.replace(/```/g, '').trim(),
          emoji: '✨',
        });
      }
    }

    // Default: 'full-story' for creator
    const prompt = `You are a world-class ghostwriter and emotional storytelling artist creating a bespoke cinematic tribute website for someone special.
Generate a deeply moving, personalized letter and page copy.

Specifications:
- Occasion: ${occasion} (e.g. birthday, anniversary, graduation, milestone, love)
- Recipient Name: ${recipientName}
- Recipient Nickname: ${recipientNickname || recipientName}
- Creator's Relationship: ${relationship}
- Tone: ${tone} (e.g. emotional & tearful, playful & funny, poetic & romantic, inspiring & proud, nostalgic)
- Language: ${language === 'hi' ? 'Hindi in elegant Devanagari script' : language === 'hinglish' ? 'Heartfelt conversational Hinglish (blend of natural Hindi & English)' : 'Refined, evocative English with deep sincerity'}
- Shared Memories / Clues: ${details || 'From our first meeting to endless laughs and support through tough times'}

Return ONLY a JSON object with this exact structure:
{
  "headline": "A cinematic, poetic header (e.g. 'Happy 25th Birthday, Priya!')",
  "subheadline": "A moving one-line essence of their bond (max 15 words)",
  "letterTitle": "An evocative title for the main heartfelt letter",
  "paragraphs": [
    "First paragraph: Reminiscing about the journey, how they entered life, or how much they mean.",
    "Second paragraph: Highlighting their unique warmth, quirks, resilience, and what makes them irreplaceable.",
    "Third paragraph: Sincere blessing and dreams for their next chapter with boundless love."
  ],
  "secretNote": "A sweet, intimate 'PS' or hidden inside-joke / final emotional pledge (1-2 sentences)"
}`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
    });

    const rawText = response.text || '';
    try {
      const cleaned = rawText.replace(/```json/gi, '').replace(/```/g, '').trim();
      const parsed = JSON.parse(cleaned);
      return NextResponse.json(parsed);
    } catch {
      return NextResponse.json(generateAlgorithmicFallback(type, occasion, recipientName, recipientNickname, relationship, tone, language, details));
    }
  } catch (error) {
    console.error('AI Wish generation error:', error);
    return NextResponse.json(
      generateAlgorithmicFallback('full-story', 'birthday', 'Loved One', '', 'Friend', 'emotional', 'hinglish', '')
    );
  }
}

function generateAlgorithmicFallback(
  type: string,
  occasion: string,
  recipientName: string,
  nickname: string,
  relationship: string,
  tone: string,
  language: string,
  details: string
) {
  const name = nickname || recipientName || 'Special One';

  if (type === 'guest-wish') {
    if (language === 'hi') {
      return {
        message: `प्रिय ${name}, इस पावन अवसर पर आपको ढेर सारा प्यार और अनगिनत खुशियां मिलें। भगवान आपके जीवन को सदा खुशियों से रोशन रखे!`,
        emoji: '🪔',
      };
    } else if (language === 'hinglish') {
      return {
        message: `Happy ${occasion}, dear ${name}! Aap hamesha aise hi muskurate raho aur sabki life me positivity spread karte raho. May all your dreams come true! ✨`,
        emoji: '🎉',
      };
    } else {
      return {
        message: `Wishing you the most extraordinary ${occasion}, ${name}! You bring so much light and joy to everyone fortunate enough to know you. Here's to your happiest chapter yet!`,
        emoji: '💖',
      };
    }
  }

  // Full story fallback
  if (language === 'hi') {
    return {
      headline: `शुभकामनाएं, हमारे प्रिय ${name}!`,
      subheadline: 'प्यार, हंसी और अनमोल यादों से सजी एक सुनहरी यात्रा।',
      letterTitle: 'दिल की गहराइयों से एक खास पैगाम',
      paragraphs: [
        `आज का दिन सिर्फ आपका जन्मदिन या उत्सव नहीं है, बल्कि उस अनमोल उपहार का उत्सव है जो आप हम सबके जीवन में लेकर आए हैं। आपकी मुस्कान किसी भी उदास दिन को खुशियों में बदल देती है।`,
        `आपके साथ बिताया गया हर एक पल, हर बातचीत और हर छोटी-बड़ी खुशी हमारे दिल में हमेशा के लिए सुरक्षित है। आपकी निष्ठा और आपका अपनत्व वाकई दुर्लभ है।`,
        `प्रार्थना है कि आने वाला हर दिन आपके लिए नई उमंगें, सफलता और अपार शांति लेकर आए। हमेशा ऐसे ही चमकते रहें!`,
      ],
      secretNote: 'याद रखना, जब भी जिंदगी में थोड़ी सी भी धूप या छांव हो, हम हमेशा आपके साथ खड़े हैं।',
    };
  }

  if (language === 'hinglish') {
    return {
      headline: `Happy ${occasion.toUpperCase()}, ${name}!`,
      subheadline: 'To the one who makes every ordinary moment feel like a Bollywood celebration.',
      letterTitle: 'From Chai Dates to Lifelong Bonds',
      paragraphs: [
        `Happy ${occasion} to my absolute favorite human! Looking back at all the crazy memories we have created together, I genuinely cannot imagine this journey without your chaotic, joyful presence.`,
        `Tumhari sabse beautiful baat yeh hai ki chahe kitni bhi mushkil situation ho, you always find a reason to smile and make everyone around you feel loved. You are one in a billion, ${name}.`,
        `As you celebrate today, I wish you endless laughter, unstoppable success, and memories that stay golden forever. Keep shining with your electric warmth!`,
      ],
      secretNote: `PS: You will always be my number one crime partner and forever emergency contact!`,
    };
  }

  return {
    headline: `A Heartfelt Tribute to ${name}`,
    subheadline: 'Celebrating the laughter, depth, and magic you bring into our lives.',
    letterTitle: 'To The One Who Lightens Every Room',
    paragraphs: [
      `On this special ${occasion}, I wanted to take a moment to celebrate not just the milestone, but the extraordinary human being that you are. Having you in my life has been one of my greatest blessings.`,
      `Your kindness is effortless, your loyalty unwavering, and your spirit lights up every room you walk into. Even in the quietest moments, your presence brings comfort and inspiration.`,
      `Here is to another year of bold dreams turning into reality, unforgettable adventures, and love that surrounds you at every step. Thank you for simply being you.`,
    ],
    secretNote: `PS: No matter how far life takes us, you will always have a permanent home in my heart.`,
  };
}
