import QuickLinks from "./QuickLinks";
import FooterInput from "./FooterInput";

export const Footer = () => {
  const openingHour = (days: string, time: string) => (
    <>
      <div className="flex justify-between my-2">
        <p>{days}</p>
        <p>{time}</p>
      </div>
      <hr />
    </>
  );

  return (
    <footer className="bg-secondary text-white">
      <div className="w-[95%] mx-auto 2xl:w-9/11 py-12 sm:py-16 grid gap-10 md:grid-cols-2 lg:grid-cols-3">
        {/* Left (Logo + Input) */}
        <FooterInput />

        {/* Center (Quick Links) */}
        <QuickLinks />

        {/* Right (Opening Hours) */}
        <div className="space-y-4">
          <h3 className="font-[Paytone_One] text-xl text-center md:text-left">
            Opening Hours
          </h3>
          {openingHour("Sun - Thurs", "09:00AM - 06:00PM")}
          {openingHour("Friday", "Emergency Only")}
          {openingHour("Saturday", "11:00AM - 05:00PM")}
        </div>
      </div>
    </footer>
  );
};

export default Footer;
