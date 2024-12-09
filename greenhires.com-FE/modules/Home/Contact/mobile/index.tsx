"use client";
import { Input } from "@/components/controls";
import { useI18n } from "@/config/i18n/client";

const ContactMobile = () => {
  const t = useI18n();
  return (
    <section id="contact" className="overflow-hidden py-8 md:py-10 lg:py-14">
      <div className="container">
        <div className="-mx-4 flex flex-wrap">
          <div className="w-full px-4">
            <div
              className="wow fadeInUp shadow-three dark:bg-gray-dark mb-12 rounded-sm bg-white px-8 py-11 sm:p-[55px] lg:mb-5 lg:px-8 xl:p-[55px]"
              data-wow-delay=".15s
              "
            >
              <h2 className="mb-3 text-center text-2xl font-bold text-primary dark:text-white sm:text-3xl lg:text-2xl xl:text-3xl">
                {t("contact.title")}
              </h2>
              <form>
                <div className="flex flex-col w-full gap-5 items-center">
                  <div className="w-full flex flex-col gap-5">
                      <Input label="Name" required type="text" placeholder="Enter your name" />
                      <Input label="Email" required type="email" placeholder="Enter your email" />
                      <Input label="Phone" required type="text" placeholder="Enter your phone number" />
                  </div>
                  <div className="w-full">
                    <div className="mb-8">
                      <label
                        htmlFor="message"
                        className="mb-3 block text-sm text-dark dark:text-white"
                      >
                        Your Message
                      </label>
                      <textarea
                        name="message"
                        rows={6}
                        placeholder="Enter your Message"
                        className="border-stroke dark:text-body-color-dark dark:shadow-two w-full 
                          resize-none rounded-sm border bg-[#f8f8f8] px-6 py-3 
                          text-base text-body-color outline-none focus:border-primary 
                          dark:border-transparent dark:bg-[#2C303B] dark:focus:border-primary dark:focus:shadow-none"
                      >
                      </textarea>
                    </div>
                  </div>
                </div>
                <div className="flex flex-col  justify-center">
                    <p className="mb-12 text-base font-medium text-body-color">
                      {t("contact.privacy")}
                    </p>
                    <div className="ml-auto mr-3">
                      <button className="shadow-submit dark:shadow-submit-dark rounded-sm bg-primary-main
                       px-9 py-4 text-base font-medium text-white duration-300 hover:bg-primary-main/90">
                        SEND MESSAGE
                      </button>
                    </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactMobile;
