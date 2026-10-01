"use client";

import { useState } from "react";
import Link from "next/link";
import BrandLogo from "@/components/BrandLogo";
import {
  ArrowRight,
  ArrowUpRight,
  Sparkles,
  Heart,
  Gift,
  Play,
  Check,
  Music2,
  Image as ImageIcon,
  MessageCircle,
  WandSparkles,
  Menu,
  X,
  ChevronDown,
  Copy,
  LoaderCircle,
} from "lucide-react";
import confetti from "canvas-confetti";
import "@/styles/landing.css";
import "@/styles/landing-themes.css";
import "@/styles/landing-ornaments.css";

const themes = [
  {
    id: "coral",
    name: "Birthday confetti",
    occasion: "Birthday",
    symbol: "✷",
    description: "A little joy. A lot of you.",
  },
  {
    id: "rose",
    name: "Love letters",
    occasion: "Anniversary",
    symbol: "♡",
    description: "For your favorite forever.",
  },
  {
    id: "sage",
    name: "The next chapter",
    occasion: "Milestone",
    symbol: "✦",
    description: "Big dreams deserve a big moment.",
  },
  {
    id: "lavender",
    name: "Pastel daydream",
    occasion: "Birthday",
    symbol: "❋",
    description: "Soft colors, sweetest memories.",
  },
  {
    id: "gold",
    name: "Golden hour",
    occasion: "Anniversary",
    symbol: "☀",
    description: "A love that only gets brighter.",
  },
  {
    id: "midnight",
    name: "Written in the stars",
    occasion: "Milestone",
    symbol: "☾",
    description: "Your moment to shine.",
  },
];
const faqs = [
  [
    "How does Wishly work?",
    "Choose a theme, add your message and favorite memories, then publish a celebration page. Share its unique link with someone special.",
  ],
  [
    "Can I add my own photos and music?",
    "Yes. The creator flow lets you add photos, video, a memory timeline, and an audio track to make the page feel personal.",
  ],
  [
    "Can friends leave their own wishes?",
    "Yes! Your published page includes a wishes wall where guests can add messages, plus an interactive candle celebration.",
  ],
  [
    "Can I edit my page after creating it?",
    "You can open your page from the dashboard and edit its message, memories, and theme whenever you need to.",
  ],
];

export default function HomePage() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [selectedTheme, setSelectedTheme] = useState("coral");
  const [revealed, setRevealed] = useState(false);
  const [filter, setFilter] = useState("All moments");
  const [name, setName] = useState("Ananya");
  const [occasion, setOccasion] = useState("birthday");
  const [tone, setTone] = useState("emotional");
  const [wish, setWish] = useState(
    "Here’s to your little joys, your big dreams, and all the beautiful moments still to come. The world is a warmer place with you in it. Happy birthday, Ananya!",
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  function celebrate() {
    setRevealed(true);
    confetti({
      particleCount: 110,
      spread: 80,
      origin: { y: 0.55 },
      colors: ["#ef745e", "#e9c966", "#91ad91", "#baa6d4"],
      disableForReducedMotion: true,
    });
  }

  async function generateWish() {
    setLoading(true);
    setError("");
    setCopied(false);
    try {
      const response = await fetch("/api/ai/wish", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          recipientName: name.trim() || "someone special",
          occasion,
          tone,
          language: "en",
          mode: "full_letter",
          relationship: "Friend",
        }),
      });
      if (!response.ok)
        throw new Error("Could not create a wish. Please try again.");
      const data = await response.json();
      if (!Array.isArray(data.paragraphs) || !data.paragraphs.length)
        throw new Error("No wish returned. Please try again.");
      setWish(data.paragraphs.join("\n\n"));
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Something went wrong. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  }

  async function copyWish() {
    try {
      await navigator.clipboard.writeText(wish);
      setCopied(true);
    } catch {
      setError(
        "Copy is unavailable in this browser. You can select and copy the message below.",
      );
    }
  }

  return (
    <div className="wl-landing">
      <a className="wl-skip" href="#main">
        Skip to content
      </a>
      <header className="wl-header">
        <Link href="/" className="wl-logo" aria-label="Wishly home">
          <BrandLogo />
        </Link>
        <nav
          className={`wl-nav ${menuOpen ? "wl-nav-open" : ""}`}
          aria-label="Main navigation"
        >
          <a href="#how-it-works" onClick={() => setMenuOpen(false)}>
            How it works
          </a>
          <a href="#templates" onClick={() => setMenuOpen(false)}>
            Explore themes
          </a>
          <a href="#wish-lab" onClick={() => setMenuOpen(false)}>
            A little AI magic <Sparkles size={13} />
          </a>
        </nav>
        <div className="wl-header-actions">
          <Link className="wl-signin" href="/login">
            Log in
          </Link>
          <Link className="wl-button wl-button-small" href="/create">
            Make a wish <ArrowUpRight size={16} />
          </Link>
          <button
            className="wl-menu"
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? <X /> : <Menu />}
          </button>
        </div>
      </header>

      <main id="main">
        <section className="wl-hero wl-container">
          <div className="wl-hero-copy">
            <div className="wl-eyebrow">
              <span className="wl-status-dot" /> MADE FOR YOUR FAVORITE PEOPLE
            </div>
            <h1>
              Some moments
              <br />
              deserve more
              <br />
              than a <em>message.</em>
              <span className="wl-heading-spark" aria-hidden="true">
                ✳
              </span>
            </h1>
            <p>
              Turn your wishes, memories, and little inside jokes into a
              beautiful celebration page. A gift that feels like <em>you.</em>
            </p>
            <div className="wl-hero-actions">
              <Link href="/create" className="wl-button">
                Create a celebration <ArrowUpRight size={19} />
              </Link>
              <button className="wl-text-button" onClick={celebrate}>
                <span className="wl-play">
                  <Play size={12} fill="currentColor" />
                </span>{" "}
                See the magic
              </button>
            </div>
            <div className="wl-hero-note">
              <Check size={14} /> Personalize it. Share it. Make their day.
            </div>
            <div className="wl-small-love">
              <div className="wl-avatars" aria-hidden="true">
                <span>A</span>
                <span>S</span>
                <span>M</span>
                <span>R</span>
              </div>
              <div>
                <span className="wl-star-rating" aria-label="Made with love">
                  ♥ ♥ ♥ ♥ ♥
                </span>
                <p>Little pages. Really big feelings.</p>
              </div>
            </div>
          </div>
          <div className="wl-hero-art" data-theme={selectedTheme}>
            <span className="wl-orbit wl-orbit-one" aria-hidden="true" />
            <span className="wl-orbit wl-orbit-two" aria-hidden="true" />
            <span className="wl-floating-star" aria-hidden="true">
              ✧
            </span>
            <span className="wl-floating-flower" aria-hidden="true">
              ✳
            </span>
            <div className="wl-memory-note">
              <Heart size={14} fill="currentColor" /> A whole page, just for
              you.
            </div>
            <article
              className={`wl-celebration-card ${revealed ? "wl-revealed" : ""}`}
            >
              <div className="wl-card-toolbar">
                <span>
                  <i />
                  <i />
                  <i />
                </span>
                <span>wishly / a-little-surprise</span>
                <Heart size={12} />
              </div>
              <div className="wl-card-content">
                <span className="wl-card-kicker">TODAY IS ALL ABOUT YOU</span>
                <div className="wl-cake" aria-hidden="true">
                  <div className="wl-candle">
                    <span />
                  </div>
                  <div className="wl-cake-top" />
                  <div className="wl-cake-body">
                    <i />
                    <i />
                    <i />
                    <i />
                    <i />
                  </div>
                  <div className="wl-cake-base" />
                </div>
                <h2>
                  {revealed ? "Make a wish," : "Happy birthday,"}
                  <em>Ananya.</em>
                </h2>
                <p>
                  {revealed
                    ? "Here’s to the memories we’ve made, and all the magic still ahead. You are so loved. ♡"
                    : "The world got a little brighter the day you arrived. Here’s a little reminder."}
                </p>
                <button className="wl-card-button" onClick={celebrate}>
                  {revealed ? "Celebrate again" : "Open your surprise"}{" "}
                  <Gift size={15} />
                </button>
                <span className="wl-card-signature">
                  made with love, just for you ♡
                </span>
              </div>
              <div className="wl-confetti" aria-hidden="true">
                {Array.from({ length: 24 }, (_, i) => (
                  <i key={i} className={`wl-particle wl-particle-${i + 1}`} />
                ))}
              </div>
            </article>
            <div className="wl-polaroid">
              <div className="wl-sunset" aria-hidden="true">
                <span>☀</span>
                <i />
                <b />
              </div>
              <p>our kind of happy ♡</p>
            </div>
            <div className="wl-music">
              <span className="wl-music-icon">
                <Music2 size={17} />
              </span>
              <div>
                <strong>Your favorite song</strong>
                <span>A soundtrack to your story</span>
              </div>
              <div className="wl-music-bars" aria-hidden="true">
                <i />
                <i />
                <i />
                <i />
              </div>
            </div>
            <div className="wl-theme-picker" aria-label="Preview color theme">
              {themes.slice(0, 4).map((theme) => (
                <button
                  key={theme.id}
                  data-theme={theme.id}
                  aria-label={`Preview ${theme.name}`}
                  aria-pressed={selectedTheme === theme.id}
                  className={selectedTheme === theme.id ? "is-selected" : ""}
                  onClick={() => setSelectedTheme(theme.id)}
                >
                  {selectedTheme === theme.id && <Check size={13} />}
                </button>
              ))}
              <span>Pick a little mood</span>
            </div>
          </div>
        </section>

        <div className="wl-occasion-strip" aria-label="Occasions">
          <span>BIRTHDAYS</span>
          <i>✳</i>
          <span>ANNIVERSARIES</span>
          <i>✳</i>
          <span>BIG LITTLE MILESTONES</span>
          <i>✳</i>
          <span>JUST BECAUSE</span>
          <i>✳</i>
          <span>YOUR KIND OF LOVE</span>
        </div>

        <section id="how-it-works" className="wl-section wl-container">
          <div className="wl-section-heading">
            <div>
              <span className="wl-eyebrow">
                A LITTLE EFFORT. A LOT OF HEART.
              </span>
              <h2>
                From a thought to
                <br />
                their <em>favorite surprise.</em>
              </h2>
            </div>
            <p>
              No design skills needed.
              <br />
              Just a person you want to make smile.
            </p>
          </div>
          <div className="wl-steps">
            {[
              {
                number: "01",
                icon: Sparkles,
                title: "Find their kind of magic",
                text: "Choose a theme that feels like them. Soft and dreamy, bold and bright, or a little golden.",
              },
              {
                number: "02",
                icon: ImageIcon,
                title: "Fill it with your story",
                text: "Add your favorite photos, a heartfelt letter, and the song that takes you right back.",
              },
              {
                number: "03",
                icon: Gift,
                title: "Send a little happiness",
                text: "Share a single link. Let them unwrap a whole world of memories made just for them.",
              },
            ].map((step) => (
              <article className="wl-step" key={step.number}>
                <div className="wl-step-top">
                  <span>{step.number}</span>
                  <step.icon size={23} strokeWidth={1.4} />
                </div>
                <h3>{step.title}</h3>
                <p>{step.text}</p>
              </article>
            ))}
          </div>
        </section>

        <section id="templates" className="wl-templates wl-section">
          <div className="wl-container">
            <div className="wl-section-heading">
              <div>
                <span className="wl-eyebrow">A MOOD FOR EVERY MOMENT</span>
                <h2>
                  Beautiful beginnings.
                  <br />
                  <em>Uniquely yours.</em>
                </h2>
              </div>
              <Link className="wl-text-link" href="/templates">
                Visit the template gallery <ArrowUpRight size={17} />
              </Link>
            </div>
            <div className="wl-filters" aria-label="Filter theme inspiration">
              {["All moments", "Birthday", "Anniversary", "Milestone"].map(
                (item) => (
                  <button
                    key={item}
                    aria-pressed={filter === item}
                    className={filter === item ? "is-active" : ""}
                    onClick={() => setFilter(item)}
                  >
                    {item}
                  </button>
                ),
              )}
            </div>
            <div className="wl-theme-grid">
              {themes
                .filter(
                  (theme) =>
                    filter === "All moments" || theme.occasion === filter,
                )
                .map((theme) => (
                  <Link
                    href="/templates"
                    className="wl-theme-card"
                    data-theme={theme.id}
                    key={theme.id}
                  >
                    <div className="wl-theme-art">
                      <span className="wl-theme-occasion">
                        {theme.occasion}
                      </span>
                      <span className="wl-theme-symbol" aria-hidden="true">
                        {theme.symbol}
                      </span>
                      <span className="wl-theme-art-title">
                        {theme.id === "rose" || theme.id === "gold"
                          ? "Always, you."
                          : theme.id === "sage" || theme.id === "midnight"
                            ? "Here’s to you."
                            : "Oh, happy day."}
                      </span>
                      <span className="wl-theme-art-caption">
                        a moment worth remembering
                      </span>
                      <span className="wl-theme-arrow">
                        <ArrowUpRight size={19} />
                      </span>
                    </div>
                    <div className="wl-theme-caption">
                      <h3>{theme.name}</h3>
                      <p>{theme.description}</p>
                    </div>
                  </Link>
                ))}
            </div>
            <p className="wl-gallery-note">
              A little inspiration for your page. Explore available templates in
              the gallery.
            </p>
          </div>
        </section>

        <section className="wl-section wl-container wl-features">
          <div className="wl-letter-art">
            <span className="wl-tape" />
            <span className="wl-eyebrow">A NOTE FROM THE HEART</span>
            <h3>Hey, favorite human.</h3>
            <p>
              Remember that evening we watched the sky turn pink and forgot what
              time it was?
            </p>
            <p>
              Here’s to a hundred more of those moments. And to you, for making
              the ordinary feel extraordinary.
            </p>
            <span className="wl-letter-signature">
              Always in your corner, ♡
            </span>
            <span className="wl-letter-flower" aria-hidden="true">
              ❋
            </span>
          </div>
          <div className="wl-features-copy">
            <span className="wl-eyebrow">IT’S THE LITTLE THINGS</span>
            <h2>
              More than a page.
              <br />
              <em>A feeling.</em>
            </h2>
            <p>
              A tiny corner of the internet, filled with everything that makes
              your person feel seen.
            </p>
            <ul>
              {[
                {
                  icon: Heart,
                  title: "Words that sound like you",
                  text: "Your own letter, with a little help when words are hard.",
                },
                {
                  icon: ImageIcon,
                  title: "Memories with a home",
                  text: "Photos, videos, and a timeline of your favorite moments.",
                },
                {
                  icon: MessageCircle,
                  title: "Everyone’s love, in one place",
                  text: "A wishes wall for friends and family to join the celebration.",
                },
                {
                  icon: Music2,
                  title: "A little extra magic",
                  text: "Music, virtual candles, and surprises to make it feel alive.",
                },
              ].map((feature) => (
                <li key={feature.title}>
                  <span>
                    <feature.icon size={20} strokeWidth={1.5} />
                  </span>
                  <div>
                    <h3>{feature.title}</h3>
                    <p>{feature.text}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section id="wish-lab" className="wl-lab wl-section">
          <div className="wl-container wl-lab-grid">
            <div>
              <span className="wl-eyebrow">
                <Sparkles size={14} /> WHEN WORDS NEED A LITTLE NUDGE
              </span>
              <h2>
                Big feelings.
                <br />
                <em>Found words.</em>
              </h2>
              <p>
                Tell us who you’re celebrating. Let our wish assistant help you
                get started, then make every word your own.
              </p>
              <form
                onSubmit={(event) => {
                  event.preventDefault();
                  void generateWish();
                }}
              >
                <label htmlFor="recipient">
                  Their name
                  <input
                    id="recipient"
                    value={name}
                    onChange={(event) => setName(event.target.value)}
                    maxLength={80}
                    placeholder="Someone special"
                  />
                </label>
                <div className="wl-form-row">
                  <label htmlFor="occasion">
                    The occasion
                    <select
                      id="occasion"
                      value={occasion}
                      onChange={(event) => setOccasion(event.target.value)}
                    >
                      <option value="birthday">Birthday</option>
                      <option value="anniversary">Anniversary</option>
                      <option value="graduation">Graduation</option>
                      <option value="milestone">Milestone</option>
                    </select>
                  </label>
                  <label htmlFor="tone">
                    The feeling
                    <select
                      id="tone"
                      value={tone}
                      onChange={(event) => setTone(event.target.value)}
                    >
                      <option value="emotional">Heartfelt</option>
                      <option value="funny">Playful</option>
                      <option value="poetic">Poetic</option>
                    </select>
                  </label>
                </div>
                <button className="wl-button" disabled={loading} type="submit">
                  {loading ? (
                    <LoaderCircle className="wl-spinner" size={17} />
                  ) : (
                    <WandSparkles size={17} />
                  )}
                  {loading ? "Finding the words…" : "Write a little magic"}
                </button>
                {error && (
                  <p className="wl-error" role="alert">
                    {error}
                  </p>
                )}
              </form>
            </div>
            <div className="wl-wish-output" aria-busy={loading}>
              <div className="wl-output-top">
                <span>
                  <Heart size={14} /> YOUR LITTLE LOVE NOTE
                </span>
                <button
                  aria-label={copied ? "Wish copied" : "Copy wish"}
                  onClick={copyWish}
                >
                  {copied ? <Check size={17} /> : <Copy size={17} />}
                </button>
              </div>
              <span className="wl-output-quote" aria-hidden="true">
                “
              </span>
              <p aria-live="polite">{wish}</p>
              <span className="wl-output-foot">
                A starting point for something personal. ♡
              </span>
            </div>
          </div>
        </section>

        <section className="wl-section wl-container wl-faq">
          <div>
            <span className="wl-eyebrow">A FEW LITTLE ANSWERS</span>
            <h2>
              Curious?
              <br />
              <em>We thought so.</em>
            </h2>
            <p>Everything you need to get your celebration started.</p>
          </div>
          <div>
            {faqs.map(([question, answer], index) => (
              <div className="wl-faq-item" key={question}>
                <h3>
                  <button
                    aria-expanded={openFaq === index}
                    aria-controls={`faq-${index}`}
                    onClick={() => setOpenFaq(openFaq === index ? null : index)}
                  >
                    {question}
                    <ChevronDown
                      size={18}
                      className={openFaq === index ? "is-open" : ""}
                    />
                  </button>
                </h3>
                <div id={`faq-${index}`} hidden={openFaq !== index}>
                  <p>{answer}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="wl-final-cta">
          <span className="wl-cta-star" aria-hidden="true">
            ✳
          </span>
          <span className="wl-eyebrow">
            SOMEONE’S DAY IS ABOUT TO GET BETTER
          </span>
          <h2>
            Make a little page.
            <br />
            <em>Leave a big smile.</em>
          </h2>
          <p>The best gifts say, “I was thinking of you.”</p>
          <Link className="wl-button" href="/create">
            Make their moment <ArrowUpRight size={19} />
          </Link>
          <span className="wl-cta-heart" aria-hidden="true">
            ♡
          </span>
        </section>
      </main>
      <footer className="wl-footer wl-container">
        <div>
          <Link href="/" className="wl-logo" aria-label="Wishly home">
            <BrandLogo compact />
          </Link>
          <p>For the moments. For the people. For the feeling.</p>
        </div>
        <nav aria-label="Footer navigation">
          <Link href="/templates">Templates</Link>
          <Link href="/dashboard">Your pages</Link>
          <Link href="/create">
            Create a page <ArrowRight size={14} />
          </Link>
        </nav>
        <span className="wl-footer-note">
          Made with a little extra heart. ♡
        </span>
      </footer>
    </div>
  );
}
