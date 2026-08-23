import { DATA } from "@/data/resume";

export default function ContactSection() {
  return (
    <div className="flex flex-col gap-y-3">
      <h2 className="text-xl font-bold">
        {DATA.sections.contact.label}
      </h2>
      <p className="text-muted-foreground">
        {DATA.sections.contact.text}
      </p>
    </div>
  );
}

