\<div *align*="center">

  \<img src="./docs/assets/wishly-logo.png" alt="Wishly logo" width="420" />



**&#xA0; # Wishly**



**&#xA0; ### Turn a moment into a page worth remembering.**



  **\*\*Custom Occasion Page Generator · W3Grads Full Stack Development · PS02\*\***



  \<p>

    \<img src="https\://img.shields.io/badge/Next.js-15-black?logo=next.js" alt="Next.js 15" />

    \<img src="https\://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=111827" alt="React 19" />

    \<img src="https\://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript&logoColor=white" alt="TypeScript" />

    \<img src="https\://img.shields.io/badge/Bun-1.x-fbf0df?logo=bun&logoColor=111827" alt="Bun" />

    \<img src="https\://img.shields.io/badge/Cloudinary-Media-3448C5?logo=cloudinary&logoColor=white" alt="Cloudinary" />

    \<img src="https\://img.shields.io/badge/GitHub%20Actions-CI-2088FF?logo=githubactions&logoColor=white" alt="GitHub Actions" />

  \</p>



  \<p>

    \<a href="#-what-is-wishly">What is Wishly?\</a> ·

    \<a href="#-feature-tour">Feature Tour\</a> ·

    \<a href="#-architecture">Architecture\</a> ·

    \<a href="#-quick-start">Quick Start\</a> ·

    \<a href="#-api-surface">API\</a> ·

    \<a href="#-team">Team\</a>

  \</p>

\</div>



**---**



**## 💌 What is Wishly?**



Wishly is a full-stack web app for creating **\*\*personalized celebration pages\*\*** for birthdays, anniversaries, friendships and other meaningful occasions.



Instead of sending a plain message, a creator can build a small, shareable experience with a themed page, memories, media and interactive moments — then publish it through a unique URL.



\> **\*\*The idea:\*\*** less "Happy Birthday 🎂" in a chat, more "I made this whole page for you." 💗



**---**



**## ✨ Feature Tour**



\| Experience | What Wishly provides |

\|---|---|

\| 🪄 Creator flow | Guided page creation, review and publishing flow |

\| 🎨 Templates | Dedicated template gallery and reusable visual themes |

\| ✍️ AI writing | Server-side AI endpoints for wish/message generation |

\| 🖼️ Media | Image upload pipeline backed by Cloudinary |

\| 🔐 Authentication | Signup, login, logout, session checks and protected creator areas |

\| 📊 Creator workspace | Dashboard, edit flow and page insights |

\| 🌐 Public pages | Shareable \`/w/[slug]\` celebration experiences |

\| 🕯️ Interaction | Public wish/candle interactions on generated pages |

\| 🛡️ Admin | Admin dashboard and moderation-oriented endpoints |

\| ⚙️ CI | GitHub Actions install → lint → production build workflow |



\<details>

\<summary>\<strong>🎯 Product flow\</strong>\</summary>



\`\`\`text

Creator

  ↓

Sign up / Login

  ↓

Create occasion

  ↓

Choose / configure theme

  ↓

Add story, memories & media

  ↓

Use AI assistance where needed

  ↓

Review

  ↓

Publish

  ↓

Unique public URL: /w/[slug]

  ↓

Recipient + guests interact with the page

\`\`\`

\</details>



**---**



**## 🧭 Feature Tour by Route**



\| Route | Purpose |

\|---|---|

\| \`/\` | Landing / public entry point |

\| \`/login\` | Creator login |

\| \`/signup\` | Creator signup |

\| \`/dashboard\` | Creator workspace |

\| \`/create\` | Create an occasion page |

\| \`/create/[id]/review\` | Review before publish |

\| \`/templates\` | Browse templates |

\| \`/pages/[id]/edit\` | Edit a page |

\| \`/pages/[id]/insights\` | Page-level insights |

\| \`/admin\` | Admin workspace |

\| \`/w/[slug]\` | Public generated wish page |



**---**



**## 🧱 Architecture**



\`\`\`mermaid

flowchart LR

    U[Creator / Guest Browser]

    UI[Next.js + React UI]

    API[Next.js Route Handlers]

    AUTH[JWT + bcrypt]

    STORE[Wishly Store\nJSON-backed persistent file + in-memory cache]

    CLOUD[Cloudinary]

    AI[AI Wish APIs]



    U --> UI

    UI --> API

    API --> AUTH

    API --> STORE

    API --> CLOUD

    API --> AI

    API --> U

\`\`\`



**### Current implementation note**



The current main branch uses a **\*\*file-backed JSON store with an in-memory runtime cache\*\*** in \`lib/db.ts\`. MongoDB was part of the original problem-statement architecture, but the current implementation is not wired to MongoDB. The documentation intentionally reflects the code that is actually in the repository.



**---**



**## 🛠️ Tech Stack**



**\*\*Frontend\*\***



\`Next.js 15\` · \`React 19\` · \`TypeScript\` · \`Tailwind CSS\`



**\*\*Application / API\*\***



\`Next.js Route Handlers\` · \`JWT\` · \`bcryptjs\` · \`Zod\` where validation is applied



**\*\*Media\*\***



\`Cloudinary\`



**\*\*Development\*\***



\`Bun\` · \`ESLint\` · \`Git\` · \`GitHub Actions\`



**---**



**## 🚀 Quick Start**



**### 1. Clone**



\`\`\`bash

git clone https\://github.com/Ayushi536/occasion-generator.git

cd occasion-generator

\`\`\`



**### 2. Install dependencies**



\`\`\`bash

bun install

\`\`\`



**### 3. Configure environment**



\`\`\`bash

cp .env.example .env.local

\`\`\`



Fill the required values before using media upload or production deployments.



**### 4. Run locally**



\`\`\`bash

bun run dev

\`\`\`



Open \`http\://localhost:3000\`.



**### 5. Validate before pushing**



\`\`\`bash

bun run lint

bun run build

\`\`\`



**---**



**## 🔐 Demo / Local Seed Accounts**



The current store contains development defaults used for local/demo flows.



\| Role | Email | Password |

\|---|---|---|

\| Creator | \`creator\@wishly.app\` | \`wishly123\` |

\| Admin | \`admin\@wishly.app\` | \`admin123\` |



\> ⚠️ These are development/demo credentials. Replace seeded credentials and secrets before any real deployment.



**---**



**## ☁️ Media Uploads**



Wishly uses Cloudinary for media handling. The application exposes a dedicated upload route and keeps the Cloudinary credentials server-side.



Expected variables:



\`\`\`env

CLOUDINARY_CLOUD_NAME=

CLOUDINARY_API_KEY=

CLOUDINARY_API_SECRET=

CLOUDINARY_UPLOAD_FOLDER=wishly

\`\`\`



**---**



**## 🤖 AI Surface**



Wishly currently exposes server-side routes for AI-assisted wish generation, including:



\`\`\`text

POST /api/ai/wish

POST /api/ai/generate-wish

\`\`\`



The UI can use these routes to turn occasion/context inputs into personalized message content while keeping provider credentials out of the browser.



**---**



**## 🔌 API Surface**



**### Authentication**



\`\`\`text

POST /api/auth/signup

POST /api/auth/login

POST /api/auth/logout

GET  /api/auth/me

\`\`\`



**### Occasion pages**



\`\`\`text

GET    /api/pages

POST   /api/pages

GET    /api/pages/[id]

PATCH  /api/pages/[id]

DELETE /api/pages/[id]

POST   /api/pages/[id]/duplicate

\`\`\`



**### Public wish pages**



\`\`\`text

GET  /api/w/[slug]

POST /api/w/[slug]/wish

POST /api/w/[slug]/candle

\`\`\`



**### Media**



\`\`\`text

POST /api/upload

\`\`\`



**### Admin**



\`\`\`text

GET /api/admin

\`\`\`



\> Endpoint behavior and payload details are defined by the corresponding route handlers under \`app/api/\*\*\`.



**---**



**## 🧪 CI / Quality Gate**



The repository contains a GitHub Actions workflow at:



\`\`\`text

.github/workflows/ci.yml

\`\`\`



The workflow runs on pushes to \`dev\`, \`main\` and feature branches, and on pull requests into \`dev\` / \`main\`.



Current checks:



\`\`\`text

1\. Checkout

2\. Setup Bun

3\. bun install --frozen-lockfile

4\. bun run lint

5\. bun run build

\`\`\`



This creates a repeatable quality gate before integration.



**---**



**## 👥 Team**



\| Module | GitHub | Primary responsibility | Integration |

\|---|---|---|---|

\| M1 | \`Ayush-Agrawal673\` | Public Wish Page / Templates | ✅ merged into \`dev\` |

\| M2 | \`Aryan-222005\` | Creator Frontend / Wizard / Dashboard | ✅ merged into \`dev\` |

\| M3 | \`Ayushibansal805\` | Backend / Auth / APIs / Data Layer | ✅ merged into \`dev\` |

\| M4 | \`ayushagrawalgla\` | Cloudinary Media Upload | ✅ merged into \`dev\` |

\| M5 | \`Ayushi536\` | DevOps / Integration / QA / Documentation | ✅ merged into \`dev\` |



**### Branch strategy**



\`\`\`text

feature/m1-templates ─┐

feature/m2-wizard ─────┤

feature/m3-backend ────┤

feature/m4-media ──────┼──→ dev ───→ main

feature/m5-devops ─────┘

\`\`\`



**---**



**## 📂 Project Structure**



\`\`\`text

occasion-generator/

├── app/

│   ├── admin/

│   ├── api/

│   │   ├── admin/

│   │   ├── ai/

│   │   ├── auth/

│   │   ├── pages/

│   │   ├── upload/

│   │   └── w/[slug]/

│   ├── create/

│   ├── dashboard/

│   ├── login/

│   ├── pages/

│   ├── signup/

│   ├── templates/

│   └── w/[slug]/

├── components/

│   └── wish-page/

├── hooks/

├── lib/

│   ├── auth.ts

│   ├── db.ts

│   ├── types.ts

│   └── utils.ts

├── .github/

│   └── workflows/

│       └── ci.yml

├── .env.example

├── package.json

├── bun.lock

├── SPEC.md

├── TEAM_TASKS.md

└── PROMPTS.md

\`\`\`



**---**



**---

## 🚀 Production Deployment

**Production URL:** https://occasion-generator.vercel.app

**Vercel Project:** https://vercel.com/ayu704sharma32-8523s-projects/occasion-generator

**Deployment status:** ✅ READY

**Live check:** ✅ HTTP 200

---

**## 🔭 Current Status**



\| Area | Status |

\|---|---|

\| Team branch integration | ✅ complete |

\| \`dev\` integration | ✅ complete |

\| \`dev\` → \`main\` integration | ✅ complete |

\| Auth APIs | ✅ implemented |

\| Creator pages / dashboard | ✅ implemented |

\| Cloudinary upload route | ✅ implemented |

\| AI wish endpoints | ✅ implemented |

\| Public wish interactions | ✅ implemented |

\| GitHub Actions CI | ✅ committed and integrated |

\| Production deployment | ✅ deployed and verified |

\| Final end-to-end QA | 🟡 pending verification |

\| Live URL / demo video | ✅ production URL available |



**---**



**## 🗺️ Roadmap**



\`\`\`text

✅ Team foundation

✅ M1 public experience

✅ M2 creator experience

✅ M3 backend + auth

✅ M4 media pipeline

✅ M5 CI + integration

⬜ Final QA matrix

✅ Production deployment

⬜ Demo polish / assets

⬜ Final submission package

\`\`\`



**---**



**## 🔗 Repository**



**\*\*GitHub:\*\*** https\://github.com/Ayushi536/occasion-generator



**---**



\<div *align*="center">



**### Built for meaningful moments. 💗**



*\*Create it. Personalize it. Share it. Remember it.\**



\</div>
