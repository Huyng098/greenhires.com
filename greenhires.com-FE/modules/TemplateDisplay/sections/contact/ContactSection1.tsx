export const ContactSection1 = ({
  phone,
  address,
  email,
}: {
  phone: string;
  address: string;
  email: string;
}) => {
  return (
    <>
      {((phone !== "" && phone !== "<p></p>") ||
        (address !== "" && address !== "<p></p>") ||
        (email !== "" && email !== "<p></p>")) && (
        <div className="w-full flex flex-col gap-4">
          <h1 className="text-2xl font-bold text-td-primary">CONTACT</h1>
          {phone !== "" && phone !== "<p></p>" && (
            <div className="">
              <p className="text-xs font-light">PHONE:</p>
              <div
                className="prose"
                dangerouslySetInnerHTML={{
                  __html: phone,
                }}
              />
            </div>
          )}

          {address !== "" && address !== "<p></p>" && (
            <div className="">
              <p className="text-xs font-light">ADDRESS:</p>
              <div
                className="prose"
                dangerouslySetInnerHTML={{
                  __html: address,
                }}
              />
            </div>
          )}
          {email !== "" && email !== "<p></p>" && (
            <div className="">
              <p className="text-xs font-light">EMAIL:</p>
              <div
                className="prose"
                dangerouslySetInnerHTML={{
                  __html: email,
                }}
              />
            </div>
          )}
        </div>
      )}
    </>
  );
};
