import { NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getProfileForEmail } from "@/lib/profileStore";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    const userEmail = session?.user?.email || "ouerhaiadem0805@gmail.com";
    const profile = getProfileForEmail(userEmail);

    const body = await request.json();
    const {
      jobTitle,
      companyName,
      location,
      requirements,
      description,
      language = "fr",
    } = body;

    if (!jobTitle) {
      return NextResponse.json(
        { success: false, error: "Titre du poste manquant." },
        { status: 400 }
      );
    }

    const candidateName =
      profile.firstName && profile.lastName
        ? `${profile.firstName} ${profile.lastName}`
        : "Adem Ouerhani";

    const skillsStr =
      profile.atsScore && profile.atsScore > 50
        ? "JavaScript, Vue.js, Node.js, Express.js, MongoDB, Next.js, Python, PostgreSQL, Tailwind CSS, Git"
        : "JavaScript, TypeScript, React, Next.js, Node.js, PostgreSQL, Git";

    const prompt = `
Vous êtes un expert en recrutement et en rédaction de candidatures pour le marché de l'emploi en Tunisie.
Rédigez une lettre de motivation professionnelle, percutante et hautement personnalisée (${
      language === "en" ? "en anglais" : "en français"
    }).

INFORMATIONS SUR LE CANDIDAT :
- Nom : ${candidateName}
- Compétences clés : ${skillsStr}
- Profil : Développeur Full-Stack & Systèmes d'Information

INFORMATIONS SUR L'OFFRE D'EMPLOI :
- Poste : ${jobTitle}
- Entreprise : ${companyName || "Entreprise en Tunisie"}
- Localisation : ${location || "Tunisie"}
- Exigences : ${requirements || "Compétences techniques et esprit d'équipe"}
- Description : ${(description || "").slice(0, 800)}

CONSIGNES :
1. Adoptez un ton professionnel, motivé et respectueux des normes de recrutement tunisiennes et internationales.
2. Mettez en valeur l'adéquation directe entre les compétences du candidat et les exigences du poste.
3. Mentionnez l'intérêt pour l'entreprise et la disponibilité immédiate (éligibilité aux contrats CIVP / Karama ou CDI selon le cas).
4. Fournissez une lettre complète structurée avec Objet, Salutations, Corps (3 paragraphes concis) et Formule de politesse.
5. Ne pas inclure de placeholders comme "[Votre nom]", utilisez directement les informations fournies.

Renvoyez UNIQUEMENT le texte de la lettre, prêt à être copié.
`;

    const apiKey = process.env.GEMINI_API_KEY;
    let coverLetterText = "";

    if (apiKey && apiKey.length > 5) {
      try {
        const client = new GoogleGenAI({ apiKey });
        try {
          const response = await client.models.generateContent({
            model: "gemini-3.5-flash-lite",
            contents: prompt,
          });
          coverLetterText = response.text || "";
        } catch {
          const fallbackResponse = await client.models.generateContent({
            model: "gemini-3.8-flash",
            contents: prompt,
          });
          coverLetterText = fallbackResponse.text || "";
        }
      } catch (geminiErr) {
        console.warn("[Gemini CoverLetter Warning]:", geminiErr);
      }
    }

    // High quality resilient fallback letter if offline
    if (!coverLetterText || coverLetterText.trim().length < 50) {
      coverLetterText = `Objet : Candidature au poste de ${jobTitle} chez ${companyName || "votre entreprise"}

Madame, Monsieur,

C'est avec un vif intérêt que je vous soumets ma candidature pour le poste de ${jobTitle} au sein de ${companyName || "votre structure"}. Fort d'une formation solide en développement et systèmes d'information, et passionné par les technologies du web moderne, je suis convaincu que mon profil saura répondre avec rigueur à vos attentes.

Maîtrisant un ensemble d'outils et de technologies clés tels que ${skillsStr}, j'ai développé au cours de mes projets académiques et personnels une solide capacité à concevoir des applications performantes, scalables et centrées sur l'expérience utilisateur. Autonome et rigoureux, j'accorde une attention particulière aux bonnes pratiques de code et au travail en équipe collaborative.

Intégrer ${companyName || "votre équipe"} représente pour moi l'opportunité de mettre mon énergie, mon sens des responsabilités et mes compétences techniques au service de vos projets innovants. Également éligible aux dispositifs d'insertion professionnelle (CIVP / Karama), je suis immédiatement disponible pour échanger lors d'un entretien.

Dans l'attente d'un retour favorable, je vous prie d'agréer, Madame, Monsieur, l'expression de mes salutations distinguées.

${candidateName}
Tunisie`;
    }

    return NextResponse.json({
      success: true,
      coverLetter: coverLetterText.trim(),
      jobTitle,
      companyName,
      generatedAt: new Date().toISOString(),
    });
  } catch (error: any) {
    console.error("[Cover Letter API Error]:", error);
    return NextResponse.json(
      { success: false, error: "Erreur lors de la génération de la lettre de motivation." },
      { status: 500 }
    );
  }
}
