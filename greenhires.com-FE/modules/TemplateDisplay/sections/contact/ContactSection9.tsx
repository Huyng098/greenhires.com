import { Mail, Phone, Map } from "@mui/icons-material";

export const ContactSection9 = ({
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
          <h1 className="text-xl font-bold">CONTACT</h1>
          {phone !== "" && phone !== "<p></p>" && (
            <div className="flex items-center">
              <Phone />
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

          {email !== "" && email !== "<p></p>" && (
            <div className="flex items-center">
              <Mail />
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

          {address !== "" && address !== "<p></p>" && (
            <div className="flex items-center">
              <Map />
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
