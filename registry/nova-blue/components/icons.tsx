interface IconProps {
  width?: number | string;
  height?: number | string;
  className?: string;
}

const getSizeValue = (size?: number | string): string => {
  if (!size) return "80px";
  return typeof size === "number" ? `${size}px` : size;
};

export function ui({ width = 80, height = 80, className }: IconProps = {}) {
  const w = getSizeValue(width);
  const h = getSizeValue(height);

  return (
    <svg
      width={w}
      height={h}
      viewBox="0 0 400 400"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <g clipPath="url(#clip0_ui)">
        <path d="M106 88H266V248H106V88Z" stroke="#2B4FFF" strokeWidth="2" />
        <path
          d="M136 118H296V278H136V118Z"
          stroke="#2B4FFF"
          strokeOpacity="0.5"
          strokeWidth="2"
        />
        <path
          d="M106 88L136 118M266 88L296 118M266 248L296 278M106 248L136 278"
          stroke="#2B4FFF"
          strokeOpacity="0.3"
        />
        <path
          d="M201 223C223.091 223 241 205.091 241 183C241 160.909 223.091 143 201 143C178.909 143 161 160.909 161 183C161 205.091 178.909 223 201 223Z"
          fill="#2B4FFF"
          fillOpacity="0.2"
          stroke="#2B4FFF"
          strokeWidth="3"
        />
      </g>
      <defs>
        <clipPath id="clip0_ui">
          <rect width="400" height="400" fill="white" />
        </clipPath>
      </defs>
    </svg>
  );
}

export function dbi({ width = 80, height = 80, className }: IconProps = {}) {
  const w = getSizeValue(width);
  const h = getSizeValue(height);

  return (
    <svg
      width={w}
      height={h}
      viewBox="0 0 400 400"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <g clipPath="url(#clip0_dbi)">
        <path
          d="M313.26 43H85.74C83.1222 43 81 45.358 81 48.2667V116.733C81 119.642 83.1222 122 85.74 122H313.26C315.878 122 318 119.642 318 116.733V48.2667C318 45.358 315.878 43 313.26 43Z"
          fill="#2B4FFF"
          fillOpacity="0.1"
          stroke="#2B4FFF"
          strokeWidth="3"
        />
        <path
          d="M313.26 147H85.74C83.1222 147 81 149.358 81 152.267V220.733C81 223.642 83.1222 226 85.74 226H313.26C315.878 226 318 223.642 318 220.733V152.267C318 149.358 315.878 147 313.26 147Z"
          fill="#2B4FFF"
          fillOpacity="0.1"
          stroke="#2B4FFF"
          strokeWidth="3"
        />
        <path
          d="M316.26 251H88.74C86.1222 251 84 253.358 84 256.267V324.733C84 327.642 86.1222 330 88.74 330H316.26C318.878 330 321 327.642 321 324.733V256.267C321 253.358 318.878 251 316.26 251Z"
          fill="#2B4FFF"
          fillOpacity="0.1"
          stroke="#2B4FFF"
          strokeWidth="3"
        />
        <path
          d="M135 68V305M264 68V305"
          stroke="#2B4FFF"
          strokeOpacity="0.3"
          strokeDasharray="4 4"
        />
      </g>
      <defs>
        <clipPath id="clip0_dbi">
          <rect width="400" height="400" fill="white" />
        </clipPath>
      </defs>
    </svg>
  );
}

export function graphic({
  width = 80,
  height = 80,
  className,
}: IconProps = {}) {
  const w = getSizeValue(width);
  const h = getSizeValue(height);

  return (
    <svg
      width={w}
      height={h}
      viewBox="0 0 400 400"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <g clipPath="url(#clip0_graphic)">
        <path
          d="M50 200L200 50L350 200L200 350L50 200Z"
          stroke="#2B4FFF"
          strokeOpacity="0.3"
        />
        <path
          d="M298.995 200L200 101.005L101.005 200L200 298.995L298.995 200Z"
          fill="#2B4FFF"
          fillOpacity="0.2"
          stroke="#2B4FFF"
          strokeWidth="4"
        />
        <path
          d="M200 50V350M50 200H350"
          stroke="#2B4FFF"
          strokeOpacity="0.5"
          strokeDasharray="4 4"
        />
      </g>
      <defs>
        <clipPath id="clip0_graphic">
          <rect width="400" height="400" fill="white" />
        </clipPath>
      </defs>
    </svg>
  );
}

export function stack({ width = 80, height = 80, className }: IconProps = {}) {
  const w = getSizeValue(width);
  const h = getSizeValue(height);

  return (
    <svg
      width={w}
      height={h}
      viewBox="0 0 400 400"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <g clipPath="url(#clip0_stack)">
        <path
          d="M100 240L200 280L300 240L200 200L100 240Z"
          fill="#2B4FFF"
          fillOpacity="0.05"
          stroke="#2B4FFF"
        />
        <path
          d="M100 200L200 240L300 200L200 160L100 200Z"
          fill="#2B4FFF"
          fillOpacity="0.1"
          stroke="#2B4FFF"
          strokeWidth="2"
        />
        <path
          d="M100 160L200 200L300 160L200 120L100 160Z"
          fill="#2B4FFF"
          fillOpacity="0.2"
          stroke="#2B4FFF"
          strokeWidth="3"
        />
        <path
          d="M200 120V280M100 160V240M300 160V240"
          stroke="#2B4FFF"
          strokeOpacity="0.3"
          strokeDasharray="4 2"
        />
        <path
          d="M200 210C205.523 210 210 205.523 210 200C210 194.477 205.523 190 200 190C194.477 190 190 194.477 190 200C190 205.523 194.477 210 200 210Z"
          fill="#2B4FFF"
        />
      </g>
      <defs>
        <clipPath id="clip0_stack">
          <rect width="400" height="400" fill="white" />
        </clipPath>
      </defs>
    </svg>
  );
}
