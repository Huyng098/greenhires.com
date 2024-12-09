import { usePathname } from "next/navigation";
import {
  FacebookIcon,
  FacebookShareButton,
  LinkedinIcon,
  LinkedinShareButton,
  TwitterIcon,
  TwitterShareButton,
} from "react-share";

const SharePost = () => {
  const pathname = usePathname();
  return (
    <div className="flex items-center gap-2">
      <p>Share this post:</p>
      <div className="flex items-center gap-2">
        <FacebookShareButton className="hover:opacity-75" url={pathname}>
          <FacebookIcon size={20} round />
        </FacebookShareButton>
        <TwitterShareButton className="hover:opacity-75" url={pathname}>
          <TwitterIcon size={20} round />
        </TwitterShareButton>
        <LinkedinShareButton className="hover:opacity-75" url={pathname}>
          <LinkedinIcon size={20} round />
        </LinkedinShareButton>
      </div>
    </div>
  );
};

export default SharePost;
