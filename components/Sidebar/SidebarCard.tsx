import React from "react";

interface Props {
  Icon: (props: React.ComponentProps<"svg">) => JSX.Element;
  title: string;
  onClick?: () => {};
}

function SidebarCard({ Icon, title, onClick }: Props) {
  return (
    <div
      onClick={onClick}
      className="flex max-w-fit items-center space-x-2 p-3 cursor-pointer rounded-full hover:bg-gray-100 transition-all duration-150 group"
    >
      <Icon className="h-8 w-8" />
      <p className="group-hover:text-[#00ADED] hidden md:inline-flex text-base font-light lg:text-lg lg:font-semibold">
        {title}
      </p>
    </div>
  );
}

export default SidebarCard;
