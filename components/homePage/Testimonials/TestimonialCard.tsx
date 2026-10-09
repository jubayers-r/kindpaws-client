import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Star, Quote } from "lucide-react";
import { TestimonialItem } from "@/types";

interface TestimonialCardProps {
  testimonial: TestimonialItem;
}

export const TestimonialCard: React.FC<TestimonialCardProps> = ({
  testimonial,
}) => {
  const { starsCount, quote, img, adopterName, adopterDesignation } =
    testimonial;
  const imgSrc = typeof img === "string" ? img : img?.src || "";

  return (
    <Card className="keen-slider__slide relative w-full max-w-sm bg-white sm:px-10 px-6 sm:py-12 py-8 text-left rounded-4xl shadow-md">
      <div className="absolute top-5 right-5 bg-primary rounded-full p-3 z-10 shadow-md">
        <Quote className="text-white fill-white w-6 h-6 rotate-180" />
      </div>

      <CardContent className="space-y-4">
        <div className="flex gap-1 text-yellow-300">
          {[...Array(starsCount)].map((_, i) => (
            <Star key={i} className="w-5 h-5 fill-yellow-300" />
          ))}
        </div>

        <blockquote className="text-muted-foreground text-lg leading-relaxed">
          &ldquo;{quote}&rdquo;
        </blockquote>

        {/* User Info */}
        <div className="flex items-center gap-4 pt-4">
          <Avatar className="size-20">
            <AvatarImage src={imgSrc} alt={adopterName} className="object-cover" />
            <AvatarFallback>{adopterName?.[0] || "U"}</AvatarFallback>
          </Avatar>
          <div>
            <p className="font-semibold text-black text-lg">{adopterName}</p>
            <p className="text-sm text-muted-foreground">
              {adopterDesignation}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default TestimonialCard;
