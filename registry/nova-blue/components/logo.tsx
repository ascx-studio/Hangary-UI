interface LogoProps {
  width?: number;
  height?: number;
  className?: string;
}

export default function Logo({
  width = 601,
  height = 201,
  className = "",
}: Readonly<LogoProps>) {
  return (
    <svg
      width={width}
      height={height}
      className={className}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g clipPath="url(#clip0_56_3)">
        <rect width={width} height={height} fill="black" />
        <path
          d="M12 26H8V6H20V10H12V14H20V18H12V26ZM24 14H20V10H24V14ZM24 26H20V18H24V26Z"
          fill="white"
        />
      </g>
      <defs>
        <clipPath id="clip0_56_3">
          <rect width={width} height={height} fill="white" />
        </clipPath>
      </defs>
    </svg>
  );
}
