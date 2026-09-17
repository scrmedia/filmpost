// Final editing pass, distilled from the humanizer skill (v2.8.0, ~/.claude/skills/humanizer)
// plus the seo-content-writer "humanizer contract" so the pass can't damage SEO structure.
import { callClaude } from "./utils";

const RULES = `Remove these signs of AI writing (Wikipedia "Signs of AI writing"):
1. Puffed-up significance: "stands as", "a testament to", "pivotal moment", "sets the stage", "indelible mark", "deeply rooted".
2. Notability name-dropping and media-coverage claims.
3. Tacked-on -ing clauses that add fake analysis ("..., highlighting the couple's love").
4. Promotional language: breathtaking, stunning, nestled, picturesque, must-see, boasts.
5. Vague attributions ("many say", "experts agree").
6. Formulaic "challenges and future" or wrap-up sections.
7. AI vocabulary: additionally, align with, crucial, delve, enduring, enhance, fostering, garner, highlight (verb), interplay, intricate, key (adjective), landscape (abstract), pivotal, showcase, tapestry, testament, underscore, valuable, vibrant.
8. Copula avoidance: use "is", "are", "has" instead of "serves as", "features", "offers", "boasts".
9. "Not only... but", "It's not just X, it's Y", and clipped tailing negations ("no fuss").
10. Reflexive groups of three.
11. Synonym cycling for the same thing.
12. False ranges ("from X to Y" that aren't a real range).
13. Needless passive voice and subjectless fragments.
14. Em dashes and en dashes: none at all. Use commas, full stops or brackets.
15-19. Excess bold, inline-header lists, emojis, curly quotes.
20-22. Chatbot artefacts ("I hope this helps"), knowledge-cutoff hedges, sycophancy.
23-25. Filler phrases, stacked hedging, generic upbeat conclusions.
26. Overused hyphenated pairs.
27. Authority tropes ("the truth is", "make no mistake").
28. Signposting ("let's dive in", "here's what you need to know").
29-33. Diff-anchored writing, staccato drama, aphorism formulas ("love isn't X, it's Y"), rhetorical openers.

Keep what reads as human: specific, hard-to-invent details, varied sentence length, plain words.
Look for clusters of tells. Don't flatten sentences that are already fine.
Before answering, ask yourself "what still makes this obviously AI-written?" and fix it.`;

export async function humanize(text, { keywords = [], html = false } = {}) {
  if (!text?.trim()) return text;
  const out = await callClaude(
    `You are an editor who makes text sound like a real wedding videographer wrote it. Plain British English, warm, specific, first person where the original uses it.\n\n${RULES}`,
    `Rewrite the text below following the rules.

Hard constraints:
- Output ONLY the final rewrite. No notes, no summary, no code fences.
- Keep every heading's text, order and level exactly.${html ? `
- Keep all HTML exactly as structured: same tags, same order, links keep their URLs and anchor text. Leave any <script> block and any <!-- ... --> SEO block (and the labelled lines inside it) completely unchanged.` : ""}
${keywords.length ? `- Keep these phrases word for word wherever they appear: ${keywords.map(k => `"${k}"`).join(", ")}.\n` : ""}- Keep the length within 10 percent. Rewrite, don't cut.
- Never add, sharpen or invent a fact, name, date, number or quote. If something is vague, leave it as vague.

TEXT:
${text}`,
  );
  return out.trim();
}
