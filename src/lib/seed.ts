import type { OrgEvent, Section, SectionType, Snapshot, Theme } from "./types";
import { uid } from "./utils";
import { avatar, banner, bg, logo, orgMark } from "./placeholder";

type Variant = "ndss" | "generic";

const sec = (type: SectionType, data: Record<string, any>, navLabel = "", visible = true): Section => ({
  id: uid("sec"), type, visible, isSample: true, navLabel, data,
});

const ev = (o: Partial<OrgEvent> & { title: string; slug: string }): OrgEvent => ({
  id: uid("evt"), code: "", tagline: "", description: "", about: "", banner: banner(o.title, "#0ea5b7", "#6d5cf0", 1200, 500),
  date: "", time: "", location: "", startDate: "", tags: [], registrationFee: "Free", feeAmount: 0, prizes: [], totalPrizePool: "-",
  eligibility: "", teamSize: "Individual", maxMembers: 1, perks: [], whyJoin: [], process: [], resources: [],
  registrationOpen: true, featured: false, isSample: true, ...o,
});

function futureLocal(days: number, hour = 10) {
  const d = new Date(Date.now() + days * 86400000);
  d.setHours(hour, 0, 0, 0);
  const p = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}T${p(d.getHours())}:${p(d.getMinutes())}`;
}

export const DEFAULT_THEME: Theme = { primary: "#0e9bb8", secondary: "#6d5cf0", accent: "#e0892b", mode: "light", font: "modern", radius: "soft" };

export function makeSnapshot(variant: Variant, orgName = "Your Event Name", shortName = "EVENT 2027", theme?: Partial<Theme>): Snapshot {
  const N = variant === "ndss";
  const v = <T,>(a: T, b: T) => (N ? a : b);
  const startLocal = N ? "2026-07-12T10:00" : futureLocal(45);
  const place = v("Daffodil Smart City, Birulia, Dhaka-1216", "Your Venue, City");
  const dateStr = v("12.07.2026", "Event Day");

  const events: OrgEvent[] = [
    ev({
      slug: "data-hackathon", code: "EVT-01", title: v("Data Hackathon", "Hackathon"),
      tagline: "Five stages to build winning AI solutions.",
      description: "Data enthusiasts, AI experts, and innovators come together to tackle real-world problems, push the limits of machine learning, and dive into big data and AI.",
      about: "A high-intensity, time-bound build where data scientists, developers, and analysts collaborate to extract insights, train predictive models, and prototype data-driven solutions for a given problem statement and dataset.",
      date: dateStr, time: "11:00 AM – 03:00 PM", location: place, startDate: startLocal,
      tags: ["ML / AI", "Deep Learning", "Big Data", "AI Ethics"], registrationFee: "৳1,200 per team (2 members)", feeAmount: 1200,
      prizes: [{ place: "1st Place", amount: "৳15,000" }, { place: "2nd Place", amount: "৳10,000" }, { place: "3rd Place", amount: "৳5,000" }],
      totalPrizePool: "৳30,000", eligibility: "University, college, and school students (valid student ID required)",
      teamSize: "Up to 2 members", maxMembers: 2, perks: ["Event T-shirt", "Souvenirs", "Certificates"], featured: true,
      whyJoin: ["Tackle real-world educational challenges using cutting-edge AI and data science.", "Collaborate with the brightest minds and industry leaders.", "Gain hands-on experience and build solutions with real impact."],
      process: [
        { title: "Team Formation & Problem Understanding", detail: "Assemble a diverse team and study the challenge — define the scope, goals, and success metrics." },
        { title: "Data Preparation & EDA", detail: "Clean, process, and explore the dataset. Handle missing values and engineer valuable features." },
        { title: "Model Building & Training", detail: "Select the best-fit ML/AI algorithm, train the model, and begin hyperparameter tuning." },
        { title: "Evaluation & Validation", detail: "Validate accuracy on test data, iterate, and refine features, parameters, or algorithms." },
        { title: "Submission & Pitch", detail: "Submit final predictions to the leaderboard and present your solution and business insights to judges." },
      ],
      resources: [{ label: "Evaluation Rules & Guidelines", url: "#", type: "guide" }],
    }),
    ev({
      slug: "project-showcase", code: "EVT-02", title: "Project Showcase", tagline: "Ship your idea. Defend it on stage.",
      description: "Showcase innovative projects and compete in a high-energy event celebrating tech creativity and practical solutions.",
      about: "A stage for builders to present working projects that solve significant problems, judged on creativity, methodology, and real-world impact.",
      date: dateStr, time: "10:00 AM – 03:00 PM", location: place, startDate: startLocal,
      tags: ["Innovation", "Tech Projects", "Prototyping", "Showcase"], registrationFee: "৳1,000 per team (up to 2 members)", feeAmount: 1000,
      prizes: [{ place: "1st Place", amount: "৳10,000" }, { place: "2nd Place", amount: "৳6,000" }, { place: "3rd Place", amount: "৳4,000" }],
      totalPrizePool: "৳20,000", eligibility: "Open to students, researchers, and professionals", teamSize: "Up to 2 members", maxMembers: 2,
      perks: ["Event T-shirt", "Souvenir"],
      whyJoin: ["Present innovative projects tackling significant educational challenges.", "Get feedback from top academic and industry experts.", "Stand out with your creativity, methodology, and real-world impact."],
    }),
    ev({
      slug: "promptcraft", code: "EVT-03", title: v("Promptcraft Challenge", "Prompt Challenge"), tagline: "Engineer the perfect prompt.",
      description: "Craft powerful, impactful prompts in an interactive challenge designed for aspiring creators and innovators.",
      about: "A fast, creative arena where participants master prompt engineering to produce effective AI outputs under real constraints.",
      date: dateStr, time: "2:30 PM – 3:30 PM", location: place, startDate: startLocal,
      tags: ["Creativity", "Prompt Engineering", "Writing", "Innovation"], registrationFee: "৳200 per participant (includes certificate)", feeAmount: 200,
      prizes: [{ place: "1st Prize", amount: "৳8,000" }, { place: "2nd Prize", amount: "৳5,000" }, { place: "3rd Prize", amount: "৳2,000" }],
      totalPrizePool: "৳15,000", eligibility: "University, college, and school students (valid student ID required)", teamSize: "Individual only", maxMembers: 1,
      perks: ["Event T-shirt", "Certificate", "Snacks"],
      whyJoin: ["Master the art of prompt engineering for effective AI outputs.", "Showcase your creativity in solving educational challenges.", "Compete with top talents and gain national recognition."],
      resources: [{ label: "Prompt Cookbook", url: "#", type: "guide" }, { label: "AI Prompt Sandbox Tools", url: "#", type: "link" }],
    }),
    ev({
      slug: "hands-on-workshop", code: "EVT-04", title: v("Hands-On Workshop", "Workshop"), tagline: "Problems users face while vibe coding — live.",
      description: "A hands-on workshop on the real problems users hit while vibe coding — and how to debug, steer, and ship reliably with AI in the loop.",
      about: "Guided, hands-on session tackling the practical pitfalls of vibe coding: prompts that drift, broken context, silent bugs, and runaway scope. Bring a laptop and leave knowing how to keep AI-assisted builds on track.",
      date: dateStr, time: "11:30 AM – 12:30 PM", location: place, startDate: startLocal,
      tags: ["Vibe Coding", "AI Pair Programming", "Live Demo", "Hands-On"], registrationFee: "৳100 per participant", feeAmount: 100,
      totalPrizePool: "-", eligibility: "All students welcome", teamSize: "Individual participation", maxMembers: 1, perks: ["Certificate", "Training Materials"],
      whyJoin: ["Learn to spot and fix the common failure modes of vibe coding.", "Watch a live, hands-on debugging session with AI in the loop.", "Build habits that keep AI-assisted projects shippable."],
      resources: [{ label: "GitHub Code Repository", url: "#", type: "link" }, { label: "Setup Guide", url: "#", type: "guide" }],
    }),
    ev({
      slug: "research-poster", code: "EVT-05", title: v("Research Poster Presentation", "Poster Session"), tagline: "Turn research into a conversation.",
      description: "Present innovative ideas on AI, automation, and ethics in an engaging poster session that sparks discussion with experts.",
      about: "A poster session where researchers communicate ideas visually and defend them to academic and industry experts.",
      date: dateStr, time: "11:30 AM – 12:45 PM", location: place, startDate: startLocal,
      tags: ["Research", "Poster Session", "Knowledge Sharing", "Ideas"], registrationFee: "৳800 per team (up to 2 members)", feeAmount: 800,
      prizes: [{ place: "1st Prize", amount: "৳8,000" }, { place: "2nd Prize", amount: "৳5,000" }, { place: "3rd Prize", amount: "৳2,000" }],
      totalPrizePool: "৳15,000", eligibility: "University, college, and school students (valid student ID required)", teamSize: "Individual or team (up to 2 members)", maxMembers: 2,
      perks: ["Event T-shirt", "Souvenirs", "Certificates"],
      whyJoin: ["Present innovative ideas on how AI can transform entrepreneurship.", "Receive valuable feedback from academic and industry experts.", "Boost your communication and presentation skills on a national platform."],
      resources: [{ label: "Academic Poster Template", url: "#", type: "template" }],
    }),
  ];

  const sched = [
    ["08:00 AM", "09:30 AM", "Registration", "Check in, collect your kit, and get your check-in QR scanned.", "Student Lounge", "Main"],
    ["09:45 AM", "10:30 AM", v("Opening Ceremony – NDSS 2026", "Opening Ceremony"), "Official opening of the event.", "International Conference Hall, Level 3", "Main"],
    ["10:40 AM", "10:50 AM", "Photo Session", "Group photo with all participants and organizers.", "In front of Knowledge Tower", "Main"],
    ["11:00 AM", "02:00 PM", "Project Showcasing", "Teams present working projects and compete for the showcase prizes.", "Student Lounge", "Competition"],
    ["11:00 AM", "02:30 PM", "Hackathon", "A focused sprint of coding, modelling, and collaboration on real datasets.", "Computer Labs", "Competition"],
    ["11:30 AM", "12:30 PM", "Hands-on Workshop", "A practical session covering applied topics in technology and innovation.", "Seminar Hall, Level 6", "Session"],
    ["11:00 AM", "01:00 PM", "Research Poster Presentation", "Researchers present ideas and get feedback from peers and mentors.", "Student Lounge", "Competition"],
    ["12:30 PM", "01:30 PM", "Prompt Craft Challenge", "A creative, prompt-based challenge under real constraints.", "Computer Lab Rooms", "Competition"],
    ["01:00 PM", "02:00 PM", "Lunch Break", "Break for lunch.", "-", "Main"],
    ["02:30 PM", "02:45 PM", "All Participants Assemble", "Everyone gathers ahead of the industry talk and closing ceremony.", "International Conference Hall", "Main"],
    ["02:45 PM", "03:30 PM", "Industry Talk", "Experts discuss collaboration and AI's future role in business.", "International Conference Hall", "Main"],
    ["03:35 PM", "04:30 PM", "Closing Ceremony", "Celebrating the day with a closing ceremony and awards for winners.", "International Conference Hall", "Main"],
  ].map(([start, end, title, description, venue, track]) => ({ start, end, title, description, venue, track }));

  const uni = "Daffodil International University";
  const guestsN: [string, string, string, string][] = [
    ["Professor Dr. M. R. Kabir", "Vice Chancellor", uni, "Chief Guests"],
    ["Professor Mohammed Masum Iqbal, PhD", "Pro Vice Chancellor", uni, "Chief Guests"],
    ["Professor Dr. Md. Fokhray Hossain", "Dean & Professor, FSIT", uni, "Special Guests"],
    ["Prof. Dr. Bimal Chandra Das", "Associate Dean & Professor, FSIT", uni, "Special Guests"],
    ["Dr. Imran Mahmud", "Professor & Head, Software Engineering Department", uni, "Special Guests"],
    ["Professor Dr. Sheak Rashed Haider Noori", "Professor & Head, Computer Science & Engineering", uni, "Special Guests"],
    ["Dr. Md. Akhtaruzzaman", "Associate Professor & Head, Robotics and Mechatronics Engineering", uni, "Special Guests"],
    ["Ms. Nusrat Jahan", "Head, Information Technology Management (ITM)", uni, "Special Guests"],
    ["Dr. Md. Fazla Elahe", "Associate Head, Software Engineering Department", uni, "Special Guests"],
    ["Mr. Mohammad Ali", "Managing Director and Chief Executive Officer (CEO)", "", "Special Guests"],
    ["Sumit Saha", "Co-Founder & MD, Analyzen · Founder, Learn with Sumit (LWS)", "", "Speakers"],
    ["Mohammad Mizanur Rahman", "CTO | AWS Ambassador | Stanford GSB", "", "Speakers"],
    ["Abdullah Al Hasan", "Founder & Chief Executive Officer", "", "Speakers"],
    ["Sakhawat Hossain", "Senior Software Engineer", "", "Speakers"],
    ["Syed Refat Al Abrar", "Staff Consultant Engineer", "", "Speakers"],
  ];
  const guestsG: [string, string, string, string][] = [
    ["Chief Guest Name", "Vice Chancellor", "Your Institution", "Chief Guests"],
    ["Special Guest One", "Dean, Faculty of Science", "Your Institution", "Special Guests"],
    ["Special Guest Two", "Head of Department", "Your Institution", "Special Guests"],
    ["Speaker One", "Founder & CEO", "Company Name", "Speakers"],
    ["Speaker Two", "Senior Software Engineer", "Company Name", "Speakers"],
    ["Speaker Three", "Data Scientist", "Company Name", "Speakers"],
  ];
  const people = (N ? guestsN : guestsG).map(([name, title, organization, category], i) => ({ name, title, organization, category, topic: "", photo: avatar(name, i) }));

  const sponsorTiers = [
    { name: "Title Partner", blurb: v("Presenting the 5th National Data Science Summit.", "Presenting this event."), logos: [{ name: v("Pubali Bank", "Title Sponsor"), logo: logo(v("Pubali Bank", "Title Sponsor"), 0), url: "" }] },
    { name: v("Community Partners", "Gold Sponsors"), blurb: v("Clubs and communities amplifying the summit.", "Organizations supporting the event."),
      logos: (N ? ["Data Science Club DIU", "Software Engineering Club", "Data Science Lab DIU", "DIUPS", "Creative Park", "Robotics Club", "Cyber Security Club DIU", "SQA Testing Club"] : ["Sponsor One", "Sponsor Two", "Sponsor Three", "Sponsor Four"]).map((n, i) => ({ name: n, logo: logo(n, i + 1), url: "" })) },
  ];
  const clubs = (N ? ["BUBT Computer Club", "BUP InfoTech Club", "EWU Telecommunication Club", "GCPC", "IUBAT", "IUB Computer Society", "SAU Computer Club", "UFTB", "UIU Robotics Club", "JNU Computer Society", "MIST Computer Club"] : ["Partner Club One", "Partner Club Two", "Partner Club Three", "Partner Club Four", "Partner Club Five", "Partner Club Six"]).map((n, i) => ({ name: n, logo: logo(n, i + 2), url: "" }));

  const summits = [
    ["1st Data Summit", "2020", "11 December", "The inaugural Data Science Summit marked the beginning of our journey, bringing together pioneers in the field.", "50+", "8", "4"],
    ["2nd Data Summit", "2021", "11 December", "Expanded reach with industry leaders and hands-on workshops for practical learning.", "150+", "15", "8"],
    ["3rd Data Summit", "2022", "11 December", "Brought international perspectives with renowned speakers and enhanced networking.", "300+", "25", "12"],
    ["4th Data Summit", "2023", "11 December", "Transitioned to a hybrid model, reaching a global audience with cutting-edge topics.", "500+", "35", "16"],
  ].map(([title, year, date, description, participants, speakers, sessions], i) => ({
    title: v(title, `Edition ${i + 1}`), year, date, description, participants, speakers, sessions,
    image: banner(v(title, `Edition ${i + 1}`), ["#0ea5b7", "#e0892b", "#6d5cf0", "#2e9e6b"][i], "#1f2a44", 900, 520),
  }));

  const sections: Section[] = [
    sec("hero", {
      badge: v("5th Edition · AI in Entrepreneurship", "Annual Event · 2027"), title: orgName,
      highlight: v("NDSS 2026", shortName), subtitle: v("Where data skills meet entrepreneurial vision.", "A short, compelling line about your event goes here."),
      dateText: v("Sunday, July 12, 2026 · 09:00 — 17:00", "Event date · Event time"), locationText: place,
      banner: bg("#0e9bb8", "#6d5cf0", 1600, 800),
      ctaPrimaryLabel: "Register now", ctaPrimaryLink: "#events", ctaSecondaryLabel: "View schedule", ctaSecondaryLink: "#schedule",
      showCountdown: true, countdownTarget: startLocal,
      stats: [{ value: v("৳80,000", "$1,000"), label: "Total prize pool" }, { value: "5", label: "Competitions & sessions" }, { value: v("2,000+", "500+"), label: "Expected attendees" }],
    }),
    sec("about", {
      kicker: "About", heading: v("About the Summit", "About the Event"),
      body: v("The National Data Science Summit brings together students, researchers and industry experts for a day of competitions, workshops and talks. Hosted by the Data Science Lab and the Department of Software Engineering, DIU, it connects data skills with entrepreneurial vision.", "Tell visitors what your event is about, who it is for and why they should attend. Replace this sample text with your own story."),
      image: banner("About", "#6d5cf0", "#0ea5b7", 900, 700),
      highlights: [{ title: "Competitions", text: "Hackathon, showcase, prompt challenge and research posters with real prizes." }, { title: "Workshops", text: "Hands-on sessions with practitioners from industry." }, { title: "Networking", text: "Meet mentors, judges, sponsors and fellow participants." }],
      stats: [],
    }, "About"),
    sec("events", { kicker: "Competitions & Sessions", heading: v("Five stages. One summit.", "Our competitions"), subtitle: "Pick an event, read the details and register your team.", layout: "grid" }, "Events"),
    sec("schedule", { kicker: "Program", heading: "Event Schedule", subtitle: "A full day of competitions, sessions and ceremonies.", days: [{ label: v("Sunday, 12 July 2026", "Day 1"), items: sched }] }, "Schedule"),
    sec("speakers", { kicker: "Guests", heading: "Guests & Speakers", subtitle: "Academics and industry leaders joining us on the day.", people }, "Speakers"),
    sec("workshop", {
      kicker: "Featured Session", heading: "Workshop Spotlight", title: "Problems Users Face While Vibe Coding",
      description: "A hands-on workshop on the real problems users hit while vibe coding — and how to debug, steer, and ship reliably with AI in the loop.",
      image: banner("Workshop", "#e0892b", "#d6457a", 900, 600), speakerName: v("Sumit Saha", "Workshop Speaker"),
      speakerTitle: v("Co-Founder & MD, Analyzen · Founder, Learn with Sumit (LWS)", "Speaker title, company"), speakerPhoto: avatar(v("Sumit Saha", "Workshop Speaker"), 2),
      date: dateStr, time: "11:30 AM – 12:30 PM", location: place,
      points: ["Spot and fix common failure modes", "Live, hands-on debugging with AI in the loop", "Habits that keep AI-assisted projects shippable"],
      ctaLabel: "Register for the workshop", ctaLink: "/events/hands-on-workshop",
    }),
    sec("sponsors", { kicker: "Partners", heading: "Sponsors & Partners", subtitle: "Organizations that make this event possible.", tiers: sponsorTiers, reach: v("2,000+ attendees", "500+ attendees"), ctaLabel: "Become a sponsor", ctaLink: "mailto:hello@example.com" }, "Sponsors"),
    sec("partners", { kicker: "Community", heading: v("Club Partners", "Community Partners"), subtitle: "Clubs and communities across the country supporting the event.", logos: clubs }),
    sec("venue", {
      kicker: "Location", heading: "Venue", name: v("Daffodil Smart City", "Your Venue Name"), line1: v("Birulia, Savar", "Street address"), line2: v("Dhaka-1216, Bangladesh", "City, Country"),
      description: "Easy to reach by road with parking and food options on campus.", image: banner("Venue", "#2e9e6b", "#0ea5b7", 900, 600),
      mapLink: v("https://www.google.com/maps/search/?api=1&query=Daffodil+Smart+City%2C+Birulia%2C+Savar%2C+Dhaka", "https://maps.google.com"), mapEmbed: "",
      facilities: ["Parking", "Prayer room", "Food court", "Free Wi-Fi"], directions: ["From the main road take the campus entrance gate.", "Follow the signs to the registration desk."],
    }, "Venue"),
    sec("previous", { kicker: "History", heading: "Previous Editions", subtitle: "Every year the community grows.", editions: summits }),
    sec("gallery", { kicker: "Moments", heading: "Gallery", subtitle: "Highlights from past events.", images: ["Moment 1", "Moment 2", "Moment 3", "Moment 4", "Moment 5", "Moment 6"].map((c, i) => ({ image: banner(c, ["#0ea5b7", "#6d5cf0", "#e0892b", "#d6457a", "#2e9e6b", "#3b82f6"][i], "#1f2a44", 700, 500), caption: c })) }, "Gallery"),
    sec("faq", { kicker: "Help", heading: "Frequently Asked Questions", subtitle: "", items: [
      { q: "Who can participate?", a: "Check the eligibility on each event page. Most events are open to students with a valid ID." },
      { q: "How do I register?", a: "Open an event, click Register and submit your team details. Paid events need payment details for verification." },
      { q: "Can I join more than one event?", a: "Yes, as long as the schedules do not overlap." },
      { q: "Will I get a certificate?", a: "Participants of eligible events receive certificates after the event." },
    ] }, "FAQ"),
    sec("cta", { heading: "Ready to take part?", text: "Seats are limited. Pick your event and register before the deadline.", buttonLabel: "Browse events", buttonLink: "#events", secondaryLabel: "", secondaryLink: "" }),
    sec("contact", { kicker: "Contact", heading: "Get in touch", subtitle: "Questions about the event? Reach out to the organizing team.", email: v("dsclub@diu.edu.bd", "hello@example.com"), phone: "+880 1X XX-XXXXXX", address: v("Daffodil Smart City, Birulia, Savar, Dhaka-1216", "Your address"), hours: "Sat - Thu, 10:00 AM – 5:00 PM" }, "Contact"),
  ];

  const th: Theme = { ...DEFAULT_THEME, ...theme };
  return {
    site: {
      branding: { orgName, shortName, tagline: v("Where data skills meet entrepreneurial vision.", "Your event tagline"), logo: orgMark(orgName, th.primary), announcement: v("Registration is open for all competitions.", ""), theme: th },
      sections,
      footer: {
        about: v("Hosted by Data Science Lab & Department of Software Engineering, Daffodil International University.", "A short description of your organization."),
        email: v("dsclub@diu.edu.bd", "hello@example.com"), phone: "", address: place,
        socials: v([{ platform: "Facebook", url: "https://facebook.com" }, { platform: "LinkedIn", url: "https://linkedin.com" }], [{ platform: "Facebook", url: "https://facebook.com" }]),
        copyright: `© ${new Date().getFullYear()} ${orgName}. All rights reserved.`,
      },
      seo: { title: `${orgName} — ${shortName}`, description: v("Where data skills meet entrepreneurial vision.", "Official event website.") },
    },
    events,
  };
}

/** Base template given to every new organization. */
export const baseTemplate = (orgName: string) => makeSnapshot("generic", orgName, "EVENT 2027");
