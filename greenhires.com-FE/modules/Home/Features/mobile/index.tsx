import SectionTitle from "@/components/Common/SectionTitle";
import featuresData from "../featuresData";
import SingleFeatureMobile from "./SingleFeature";

const FeaturesMobile = () => {
  return (
    <>
      <section id="features" className="py-16 md:py-20 lg:py-28">
        <div className="container">
          <SectionTitle
            title="Main Features"
            paragraph="Features designed to help you win your dream job"
            center
          />

          <div className="grid grid-cols-1 gap-x-8 gap-y-14 md:grid-cols-2 lg:grid-cols-2">
            {featuresData.map((feature) => (
              <SingleFeatureMobile
                key={feature.id}
                feature={feature}
                isMobile
              />
            ))}
          </div>
        </div>
      </section>
    </>
  );
};

export default FeaturesMobile;
