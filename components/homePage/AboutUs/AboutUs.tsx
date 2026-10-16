import React from "react";
import Image from "next/image";
import { PawPrint, HeartHandshake, ShieldCheck, Users } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const features = [
  {
    title: "Easy Pet Discovery",
    icon: <PawPrint className="w-8 h-8 text-primary" />,
    description:
      "Medicenter offers comprehensive dental care for both adults and children from our office at Toronto.",
  },
  {
    title: "Verified Adoptions",
    icon: <HeartHandshake className="w-8 h-8 text-primary" />,
    description:
      "Only real users, real pets, and real adoption requests — all managed with verified accounts and secure data.",
  },
  {
    title: "Built for the Community",
    icon: <Users className="w-8 h-8 text-primary" />,
    description:
      "Whether you’re looking to adopt, donate, or help manage campaigns — this platform is designed for you.",
  },
  {
    title: "Security & Privacy",
    icon: <ShieldCheck className="w-8 h-8 text-primary" />,
    description:
      "Your personal information and adoption data are protected through role-based access and encrypted tokens.",
  },
];

export const AboutUs = () => {
  return (
    <section className="bg-[#f9f5ef] py-16 rounded-4xl">
      <div className="w-[95%] max-w-7xl mx-auto text-center">
        <div className="mb-8">
          <div className="flex items-center mb-2 gap-2 bg-white rounded-full w-fit px-5 py-1 mx-auto">
            <PawPrint className="text-primary" />
            <span className="uppercase text-sm font-semibold text-primary">
              Who we are
            </span>
          </div>
          <h2 className="text-3xl/tight sm:text-5xl/tight font-semibold text-secondary sm:max-w-xl text-center mx-auto">
            Connecting Loving Homes with Pets in Need
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 items-center">
          <div className="space-y-8">
            {features.slice(0, 2).map((item, idx) => (
              <Card
                key={idx}
                className="bg-transparent shadow-none text-left border-none"
              >
                <CardContent className="flex gap-4 items-start p-0">
                  <div className="bg-primary/10 p-3 rounded-full">
                    {item.icon}
                  </div>
                  <div>
                    <h3 className="sm:text-2xl font-semibold pb-2 sm:pb-3">
                      {item.title}
                    </h3>
                    <p className="text-muted-foreground">{item.description}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div>
            <Image
              src="/assets/about-img-dog.png"
              alt="Golden Retriever"
              width={516}
              height={647}
              sizes="(max-width: 640px) 100vw, 320px"
              quality={90}
              className="w-full max-w-xs mx-auto h-auto object-contain"
            />
          </div>

          <div className="space-y-8">
            {features.slice(2).map((item, idx) => (
              <Card
                key={idx}
                className="bg-transparent shadow-none text-left border-none"
              >
                <CardContent className="flex gap-4 items-start p-0">
                  <div className="bg-primary/10 p-3 rounded-full">
                    {item.icon}
                  </div>
                  <div>
                    <h3 className="sm:text-2xl font-semibold pb-2 sm:pb-3">
                      {item.title}
                    </h3>
                    <p className="text-muted-foreground">{item.description}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutUs;
