import React from "react";

export interface ContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: "default" | "wide" | "narrow" | "full" | "admin";
  as?: "div" | "section" | "main" | "article" | "header" | "footer";
}

const sizeStyles: Record<NonNullable<ContainerProps["size"]>, string> = {
  default: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8",
  wide: "max-w-[1760px] mx-auto px-4 sm:px-8 lg:px-12 xl:px-16",
  narrow: "max-w-4xl mx-auto px-4 sm:px-6",
  full: "w-full px-4 sm:px-6 lg:px-8",
  admin: "w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8",
};

export const Container: React.FC<ContainerProps> = ({
  children,
  size = "default",
  as: Component = "div",
  className = "",
  ...props
}) => {
  return (
    <Component className={`${sizeStyles[size]} ${className}`} {...props}>
      {children}
    </Component>
  );
};

