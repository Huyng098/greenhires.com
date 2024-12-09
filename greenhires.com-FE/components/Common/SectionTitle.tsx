const SectionTitle = ({
  title,
  paragraph,
  width = "570px",
  center,
  mb = "100px",
}: {
  title: string;
  paragraph: string;
  width?: string;
  center?: boolean;
  mb?: string;
}) => {
  return (
    <>
      <div
        className={`wow fadeInUp w-full ${center ? "mx-auto text-center" : ""}`}
        data-wow-delay=".1s"
        style={{ maxWidth: width, marginBottom: mb }}
      >
        <h2 className="mb-4 text-xl text-transparent bg-clip-text bg-gradient-to-b from-[#2F566B] to-[#06B2B9]">
          {title}
        </h2>
        <p className="mb-4 text-xl text-transparent bg-clip-text bg-gradient-to-b from-[#2F566B] to-[#06B2B9]">
          {paragraph}
        </p>
      </div>
    </>
  );
};

export default SectionTitle;
