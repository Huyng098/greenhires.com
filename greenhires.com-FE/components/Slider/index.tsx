import { ArrowForwardIos } from "@mui/icons-material";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import "slick-carousel/slick/slick-theme.css";
import "slick-carousel/slick/slick.css";
import "./slider-custom.css";

const SliderArrow = ({ to, onClick }: any) => (
  <>
    {to === "next" ? (
      <button
        onClick={onClick}
        className="z-50 absolute top-[120px] right-[-75px] hidden xl:block
                rounded-full border-black border p-2"
      >
        <ArrowForwardIos sx={{ fontSize: 20, color: "dark" }} />
      </button>
    ) : (
      <button
        onClick={onClick}
        className="z-50 absolute top-[120px] left-[-75px] 
                rounded-full border-black border p-2"
      >
        <ArrowBackIosNewIcon sx={{ fontSize: 20, color: "dark" }} />
      </button>
    )}
  </>
);
export const settings = {
  dots: true,
  infinite: true,
  speed: 500,
  autoplay: true,
  prevArrow: <SliderArrow to="prev" />,
  nextArrow: <SliderArrow to="next" />,
  slidesToShow: 3,
  slidesToScroll: 1,
  responsive: [
    {
      breakpoint: 900,
      settings: {
        slidesToShow: 1,
        slidesToScroll: 1,
      },
    },
    {
      breakpoint: 480,
      settings: {
        slidesToShow: 1,
        slidesToScroll: 1,
      },
    },
  ],
};
