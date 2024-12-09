import { EnvelopeSimpleOpen, MapTrifold, Phone } from "@phosphor-icons/react";

export const ContactSection3 = ({
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
        <div className="flex flex-col gap-4">
          <h1 className="text-lg text-td-primary">CONTACT</h1>
          {phone !== "" && phone !== "<p></p>" && (
            <div className="flex items-center">
              <Phone weight="fill" size={25} />
              <div className="flex-1 flex justify-end">
                <div
                  className="prose"
                  dangerouslySetInnerHTML={{
                    __html: phone,
                  }}
                />
              </div>
            </div>
          )}

          {address !== "" && address !== "<p></p>" && (
            <div className="flex items-center">
              <EnvelopeSimpleOpen weight="fill" size={25} />
              <div className="flex-1 flex justify-end">
                <div
                  className="prose"
                  dangerouslySetInnerHTML={{
                    __html: email,
                  }}
                />
              </div>
            </div>
          )}

          {email !== "" && email !== "<p></p>" && (
            <div className="flex items-center">
              <MapTrifold weight="fill" size={25} />
              <div className="flex-1 flex justify-end">
                <div
                  className="prose"
                  dangerouslySetInnerHTML={{
                    __html: address,
                  }}
                />
              </div>
            </div>
          )}
        </div>
      )}
    </>
  );
};
