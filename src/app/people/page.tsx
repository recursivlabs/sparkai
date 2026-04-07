import PageHero from "@/components/ui/PageHero";
import Image from "next/image";

export const metadata = {
  title: "People — SPARK AI Network",
  description: "Researchers, advisors, and industry partners of the SPARK AI Network.",
};

const RESEARCHERS = [
  { name: "James Short", title: "Director", org: "SDSC", image: "/images/team/james-short-updated.png" },
  { name: "Mel Horwitch", title: "Visiting Scholar", org: "MIT", image: "/images/team/mel-horwitch.jpeg" },
  { name: "Maj Mirmirani", title: "Dean (ret.)", org: "Embry-Riddle", image: "/images/team/maj-mirmirani.jpeg" },
  { name: "Elena Naumova", title: "Professor", org: "Tufts University", image: "/images/team/elena-naumova.jpeg" },
  { name: "Ilya Zaslavsky", title: "Director, Spatial Info Systems Lab", org: "SDSC", image: "/images/team/ilya-zaslavsky.png" },
  { name: "Tim Mackey", title: "Professor", org: "UC San Diego", image: "/images/team/tim-mackey.png" },
  { name: "Samson Qian", title: "Independent Researcher", org: "", image: "/images/team/samson-qian.jpeg" },
];

const ADVISORS = [
  { name: "Barry Rudolph", title: "IBM (ret.)", org: "IBM", image: "/images/team/barry-rudolph.jpeg" },
  { name: "Jonathan Behnke", title: "CIO", org: "City of San Diego", image: "/images/team/jonathan-behnke.jpeg" },
  { name: "James Massa", title: "Sr. Exec Director, Software Eng.", org: "JP Morgan Chase", image: "/images/team/james-massa.png" },
  { name: "James Meng", title: "Research Scientist", org: "UCSD", image: "/images/team/james-meng.jpeg" },
  { name: "Archaana Pattabhii", title: "SVP, IT", org: "Citigroup", image: "/images/team/archaana-pattabhii.png" },
  { name: "Divya Joshi", title: "Independent Researcher", org: "", image: "/images/team/divya-joshi.jpeg" },
  { name: "Naguib Attia", title: "Distinguished Engineer, VP (ret.)", org: "IBM", image: "/images/team/naquib-attia.png" },
  { name: "Lina Parra Cartagena", title: "Global Finance Head", org: "Vertex Pharmaceuticals", image: "/images/team/lina-parra-cartagena.png" },
  { name: "Valquir Correa", title: "VP, Corporate Finance", org: "Baja Mar Resorts", image: "/images/team/valquir-correa.png" },
  { name: "Jack Ottman", title: "COO", org: "Minds.com", image: "/images/team/jack-ottman.png" },
  { name: "Bill Ottman", title: "CEO", org: "Minds.com", image: "/images/team/bill-ottman.webp" },
  { name: "James M. Cooper", title: "Professor", org: "California Western School of Law", image: "/images/team/james-cooper.png" },
];

const PARTNERS = [
  { name: "Raj Patil", title: "CEO", org: "AEEC", image: "/images/team/raj-patil.jpeg" },
  { name: "Ali Malihi", title: "Founder", org: "Back Bay Group", image: "/images/team/ali-malihi.jpeg" },
  { name: "Deborah Stokes", title: "Academic & External Research", org: "Dell Technologies", image: "/images/team/deborah-stokes.jpeg" },
  { name: "Ken Durazzo", title: "VP, AI Centric Engineering", org: "Dell Technologies", image: "/images/team/ken-durazzo.jpeg" },
  { name: "Steve Orrin", title: "Federal CTO", org: "Intel", image: "/images/team/steve-orrin.jpeg" },
  { name: "Steven Meltzer", title: "Partner", org: "Pillsbury", image: "/images/team/steven-meltzer-updated.png" },
  { name: "Prasanna Pendse", title: "Global VP AI Strategy", org: "Thoughtworks", image: "/images/team/prasanna-pendse.jpeg" },
  { name: "John Ottman", title: "Executive Chairman", org: "Solix Technologies", image: "/images/team/john-ottman.jpeg" },
  { name: "Sai Gundavelli", title: "Founder & CEO", org: "Solix Technologies", image: "/images/team/sai-gundavelli-updated.jpeg" },
  { name: "Michael Sossong", title: "Chief Scientist", org: "LifeVoxel", image: "/images/team/michael-sossong.jpeg" },
  { name: "Kovey Kovalan", title: "Founder", org: "LifeVoxel", image: "/images/team/kovey-kovalan.jpeg" },
];

type Person = { name: string; title: string; org: string; image: string };

function PersonCard({ name, title, org, image }: Person) {
  return (
    <div className="flex items-center gap-4 p-4 bg-slate-900 border border-slate-800 rounded-xl hover:border-slate-700 transition-colors">
      <div className="w-14 h-14 rounded-full overflow-hidden flex-shrink-0 bg-slate-800">
        <Image
          src={image}
          alt={name}
          width={56}
          height={56}
          className="w-full h-full object-cover"
        />
      </div>
      <div className="flex-1 min-w-0">
        <h3 className="text-base font-semibold text-white truncate">{name}</h3>
        <p className="text-sm text-slate-500 truncate">
          {title}{org ? ` — ${org}` : ""}
        </p>
      </div>
    </div>
  );
}

function PeopleSection({ title, description, people }: { title: string; description: string; people: Person[] }) {
  return (
    <div>
      <div className="mb-4">
        <h2 className="text-lg font-bold text-white">{title}</h2>
        <p className="text-xs text-slate-500">{description}</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {people.map((p) => (
          <PersonCard key={p.name} {...p} />
        ))}
      </div>
    </div>
  );
}

export default function PeoplePage() {
  return (
    <>
      <PageHero
        title="People"
        subtitle="The researchers, advisors, and industry partners driving AI innovation through the SPARK AI consortium"
        compact
      />

      <section className="py-16 px-4 md:px-6">
        <div className="container mx-auto max-w-5xl space-y-14">
          <PeopleSection
            title="Researchers"
            description={`${RESEARCHERS.length} members leading SPARK AI research initiatives`}
            people={RESEARCHERS}
          />
          <PeopleSection
            title="Advisors"
            description={`${ADVISORS.length} leaders guiding consortium strategy and direction`}
            people={ADVISORS}
          />
          <PeopleSection
            title="Industry Partners"
            description={`${PARTNERS.length} organizations collaborating on applied AI`}
            people={PARTNERS}
          />
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 px-4 md:px-6 bg-slate-900">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-2xl font-bold text-white mb-3">Join Our Network</h2>
          <p className="text-slate-400 text-sm mb-6">
            Interested in contributing to the future of AI in business?
          </p>
          <a
            href="mailto:jshort@ucsd.edu"
            className="inline-flex items-center h-10 px-8 bg-blue-600 text-white text-sm font-medium rounded-full hover:bg-blue-700 transition-colors"
          >
            Reach Out
          </a>
        </div>
      </section>
    </>
  );
}
