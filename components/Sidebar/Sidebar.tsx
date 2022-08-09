import React, { Fragment } from "react";
import SidebarCard from "./SidebarCard";
import {
  HashtagIcon,
  HomeIcon,
  BellIcon,
  MailIcon,
  BookmarkIcon,
  CollectionIcon,
  UserIcon,
  DotsCircleHorizontalIcon,
} from "@heroicons/react/outline";
import { useSession, signIn, signOut } from "next-auth/react";

function Sidebar() {
  const { data: session } = useSession();

  return (
    <Fragment>
      <div className="flex flex-col col-span-2 items-center p-4 md:items-start">
        <img
          src="https://upload.wikimedia.org/wikipedia/commons/thumb/4/4f/Twitter-logo.svg/934px-Twitter-logo.svg.png"
          className="h-10 w-10 m-4"
          alt="twitter icon"
        />

        <SidebarCard Icon={HomeIcon} title="Home" />
        <SidebarCard Icon={HashtagIcon} title="Explore" />
        <SidebarCard Icon={BellIcon} title="Notification" />
        <SidebarCard Icon={MailIcon} title="Message" />
        <SidebarCard Icon={BookmarkIcon} title="Bookmark" />
        <SidebarCard Icon={CollectionIcon} title="List" />
        <SidebarCard
          onClick={session ? signOut : signIn}
          Icon={UserIcon}
          title={session ? "Sign Out" : "Sign In"}
        />

        <SidebarCard Icon={DotsCircleHorizontalIcon} title="More" />
      </div>
    </Fragment>
  );
}

export default Sidebar;
