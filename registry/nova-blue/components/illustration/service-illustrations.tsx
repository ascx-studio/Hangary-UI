"use client";
import React from "react";
import type { Variants } from "motion/react";
import * as motion from "motion/react-client";
import {
  Database,
  ShieldCheck,
  Globe2,
  Box,
  Cpu,
  Cloud,
  CheckCircle2,
  GitBranch,
  Search,
  MousePointer2,
} from "lucide-react";

// --- Standardized Style Tokens ---
const COLORS = {
  accent: "#2883ff",
  zinc: {
    950: "#020203",
    900: "#09090b",
    800: "#18181b",
    700: "#27272a",
    600: "#3f3f46",
    500: "#71717a",
    300: "#d4d4d8",
    400: "#a1a1aa",
    200: "#e4e4e7",
  },
};

// --- Framer Motion Variants ---
const draw = {
  hidden: { pathLength: 0, opacity: 0 },
  visible: {
    pathLength: 1,
    opacity: 1,
    transition: {
      pathLength: { type: "spring", duration: 1.5, bounce: 0 },
      opacity: { duration: 0.01 },
    },
  },
} satisfies Variants;

const FullStackIllustration = () => (
  <motion.svg
    viewBox="0 0 400 240"
    className="w-full h-full"
    whileHover="hover"
  >
    <rect
      x="40"
      y="60"
      width="120"
      height="100"
      rx="4"
      fill={COLORS.zinc[950]}
      stroke={COLORS.zinc[800]}
      strokeWidth="2"
    />
    <rect
      x="40"
      y="60"
      width="120"
      height="20"
      rx="4"
      fill={COLORS.zinc[900]}
    />
    <motion.circle
      cx="55"
      cy="70"
      r="3"
      fill={COLORS.accent}
      animate={{ opacity: [0.4, 1, 0.4] }}
      transition={{ repeat: Number.POSITIVE_INFINITY, duration: 1.5 }}
    />
    <motion.g
      variants={{ hover: { x: -10 } }}
      transition={{ type: "spring", stiffness: 100 }}
    >
      <rect
        x="240"
        y="80"
        width="130"
        height="110"
        rx="4"
        fill={COLORS.zinc[900]}
        stroke={COLORS.zinc[700]}
        strokeWidth="2"
      />
      <text
        x="255"
        y="105"
        fill={COLORS.accent}
        fontSize="10"
        fontFamily="monospace"
        fontWeight="bold"
      >
        {"SERVER_V2"}
      </text>
      <Database x="255" y="145" size={24} color={COLORS.zinc[600]} />
      <motion.rect
        x="240"
        y="80"
        width="130"
        height="110"
        rx="4"
        fill="transparent"
        stroke={COLORS.accent}
        animate={{ strokeWidth: [0, 4, 0], opacity: [0, 0.3, 0] }}
        transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
      />
    </motion.g>
    <motion.path
      d="M170 110h60"
      stroke={COLORS.accent}
      strokeWidth="2"
      strokeDasharray="6 4"
      animate={{ strokeDashoffset: [0, -24] }}
      transition={{ repeat: Number.POSITIVE_INFINITY, duration: 1, ease: "linear" }}
    />
    <motion.path
      d="M230 145h-60"
      stroke={COLORS.zinc[400]}
      strokeWidth="1.5"
      strokeDasharray="6 4"
      animate={{ strokeDashoffset: [0, 24] }}
      transition={{ repeat: Number.POSITIVE_INFINITY, duration: 1, ease: "linear" }}
    />
  </motion.svg>
);

const BrandingIllustration = () => (
  <motion.svg
    viewBox="0 0 400 240"
    className="w-full h-full"
    initial="hidden"
    whileInView="visible"
    whileHover="hover"
  >
    <motion.path
      d="M40 40h320M40 80h320M40 120h320M40 160h320M40 200h320"
      stroke={COLORS.zinc[800]}
      strokeWidth="1"
      variants={draw}
    />
    <motion.path
      d="M40 40v160M120 40v160M200 40v160M280 40v160M360 40v160"
      stroke={COLORS.zinc[800]}
      strokeWidth="1"
      variants={draw}
    />
    <motion.g
      variants={{ hover: { scale: 1.05, rotate: 2 } }}
      transition={{ type: "spring", stiffness: 200 }}
    >
      <circle
        cx="100"
        cy="110"
        r="45"
        stroke={COLORS.accent}
        strokeWidth="2"
        fill="transparent"
        opacity="0.4"
      />
      <motion.circle
        cx="80"
        cy="110"
        r="45"
        stroke={COLORS.zinc[700]}
        strokeWidth="1.5"
        fill="transparent"
        strokeDasharray="4 2"
        animate={{ rotate: 360 }}
        transition={{ repeat: Number.POSITIVE_INFINITY, duration: 20, ease: "linear" }}
      />
      <motion.path
        d="M100 65 A 45 45 0 0 1 100 155"
        stroke={COLORS.accent}
        strokeWidth="4"
        fill="transparent"
        strokeLinecap="round"
        variants={draw}
      />
    </motion.g>
    <motion.g variants={{ hover: { x: 5 } }}>
      <text
        x="210"
        y="65"
        fill={COLORS.zinc[200]}
        fontSize="36"
        fontFamily="serif"
        fontWeight="900"
      >
        Ag
      </text>
      <motion.line
        x1="210"
        y1="65"
        x2="350"
        y2="65"
        stroke={COLORS.accent}
        strokeWidth="1"
        opacity="0.4"
        variants={draw}
      />
    </motion.g>
    <motion.g variants={{ hover: { y: -5 } }}>
      {[0, 1, 2, 3].map((i) => (
        <motion.rect
          key={i}
          x={210 + i * 38}
          y={135}
          width="34"
          height="45"
          rx="4"
          fill={i === 0 ? COLORS.accent : [COLORS.zinc[700], COLORS.zinc[600], COLORS.zinc[500], COLORS.zinc[400]][i]}
          stroke={COLORS.zinc[700]}
          strokeWidth="1.5"
          whileHover={{ height: 55, y: 125 }}
        />
      ))}
    </motion.g>
  </motion.svg>
);

const DatabaseIllustration = () => (
  <motion.svg
    viewBox="0 0 400 240"
    className="w-full h-full"
    whileHover="hover"
  >
    {/* Table UI Shell - Slightly Larger */}
    <rect
      x="20"
      y="20"
      width="310"
      height="200"
      rx="4"
      fill={COLORS.zinc[950]}
      stroke={COLORS.zinc[800]}
      strokeWidth="1.5"
    />
    <rect
      x="20"
      y="20"
      width="310"
      height="32"
      rx="4"
      fill={COLORS.zinc[900]}
    />
    <text
      x="40"
      y="41"
      fill={COLORS.zinc[200]}
      fontSize="11"
      fontFamily="monospace"
      fontWeight="bold"
    >
      TBL_ANALYTICS_V4
    </text>
    <text
      x="215"
      y="41"
      fill={COLORS.zinc[600]}
      fontSize="9"
      fontFamily="monospace"
    >
      SCHEMA: PUBLIC
    </text>

    {/* Table Headers - Larger and Clearer */}
    <g transform="translate(40, 75)">
      <text
        x="0"
        y="0"
        fill={COLORS.accent}
        fontSize="10"
        fontFamily="monospace"
        fontWeight="bold"
      >
        ID
      </text>
      <text
        x="45"
        y="0"
        fill={COLORS.zinc[400]}
        fontSize="10"
        fontFamily="monospace"
        fontWeight="bold"
      >
        TYPE
      </text>
      <text
        x="110"
        y="0"
        fill={COLORS.zinc[400]}
        fontSize="10"
        fontFamily="monospace"
        fontWeight="bold"
      >
        SOURCE_IP
      </text>
      <text
        x="220"
        y="0"
        fill={COLORS.zinc[400]}
        fontSize="10"
        fontFamily="monospace"
        fontWeight="bold"
      >
        STATUS
      </text>
      <line
        x1="-20"
        y1="12"
        x2="270"
        y2="12"
        stroke={COLORS.zinc[800]}
        strokeWidth="2"
      />
    </g>

    {/* Row Data - High Legibility */}
    {[
      {
        id: "101",
        type: "REQ",
        ip: "192.168.1.1",
        status: "OK",
        color: "#10b981",
      },
      {
        id: "102",
        type: "SET",
        ip: "10.0.0.42",
        status: "OK",
        color: "#10b981",
      },
      {
        id: "103",
        type: "GET",
        ip: "172.16.0.12",
        status: "WAIT",
        color: "#f59e0b",
      },
      {
        id: "104",
        type: "DEL",
        ip: "192.168.1.5",
        status: "OK",
        color: "#10b981",
      },
      {
        id: "105",
        type: "UPD",
        ip: "10.0.0.88",
        status: "FAIL",
        color: "#ef4444",
      },
    ].map((row) => (
      <motion.g
        key={row.id}
        transform={`translate(40, ${100 + (Number(row.id) - 101) * 24})`}
        initial={{ opacity: 0.8 }}
        whileHover={{ opacity: 1, x: 2 }}
      >
        <text
          x="0"
          y="0"
          fill={COLORS.zinc[300]}
          fontSize="9"
          fontFamily="monospace"
        >
          {row.id}
        </text>
        <text
          x="45"
          y="0"
          fill={COLORS.accent}
          fontSize="9"
          fontFamily="monospace"
        >
          {row.type}
        </text>
        <text
          x="110"
          y="0"
          fill={COLORS.zinc[500]}
          fontSize="9"
          fontFamily="monospace"
        >
          {row.ip}
        </text>

        {/* Status indicator pill */}
        <rect
          x="218"
          y="-8"
          width="35"
          height="12"
          rx="2"
          fill={`${row.color}15`}
          stroke={`${row.color}40`}
          strokeWidth="1"
        />
        <text
          x="235"
          y="1"
          textAnchor="middle"
          fill={row.color}
          fontSize="7"
          fontFamily="monospace"
          fontWeight="bold"
        >
          {row.status}
        </text>

        <line
          x1="-20"
          y1="8"
          x2="270"
          y2="8"
          stroke={COLORS.zinc[900]}
          strokeWidth="1"
        />

        {/* Real-time row scanning effect */}
        <motion.rect
          x="-20"
          y="-16"
          width="310"
          height="24"
          fill={COLORS.accent}
          opacity="0"
          variants={{ hover: { opacity: row.id === "103" ? 0.1 : 0 } }}
        />
      </motion.g>
    ))}

    {/* B-Tree / Index Visualization Sidebar */}
    <g transform="translate(340, 30)">
      <text
        x="0"
        y="0"
        fill={COLORS.zinc[500]}
        fontSize="8"
        fontFamily="monospace"
        fontWeight="bold"
      >
        INDEX: BTREE
      </text>
      {[0, 1, 2].map((i) => (
        <React.Fragment key={`index-node-${i}`}>
          <rect
            x={10}
            y={15 + i * 45}
            width="30"
            height="18"
            rx="2"
            fill={COLORS.zinc[950]}
            stroke={COLORS.zinc[700]}
          />
          {i < 2 && (
            <line
              x1="25"
              y1={33 + i * 45}
              x2="25"
              y2={60 + i * 45}
              stroke={COLORS.zinc[800]}
              strokeWidth="1.5"
            />
          )}
        </React.Fragment>
      ))}
      <motion.circle
        cx="25"
        cy="24"
        r="3"
        fill={COLORS.accent}
        animate={{ cy: [24, 69, 114, 24] }}
        transition={{ duration: 3, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
      />
    </g>

    {/* SQL Execution Overlay - More Prominent */}
    <motion.g
      variants={{ hover: { y: -15, opacity: 1, scale: 1.02 } }}
      initial={{ opacity: 0, y: 0, scale: 1 }}
      className="pointer-events-none"
    >
      <rect
        x="50"
        y="150"
        width="250"
        height="70"
        rx="8"
        fill={COLORS.zinc[900]}
        stroke={COLORS.accent}
        strokeWidth="2"
      />
      <Search x="65" y="165" size={14} color={COLORS.accent} />
      <text
        x="88"
        y="176"
        fill={COLORS.accent}
        fontSize="10"
        fontFamily="monospace"
        fontWeight="bold"
      >
        EXPLAIN ANALYZE
      </text>
      <text
        x="65"
        y="195"
        fill={COLORS.zinc[200]}
        fontSize="9"
        fontFamily="monospace"
      >
        SELECT * FROM analytics WHERE id=103
      </text>
      <text
        x="65"
        y="210"
        fill={COLORS.zinc[500]}
        fontSize="8"
        fontFamily="monospace"
      >
        Result: Index Scan [id_pk] | Latency: 0.02ms
      </text>

      <motion.rect
        x="50"
        y="150"
        width="250"
        height="70"
        rx="8"
        fill="transparent"
        stroke={COLORS.accent}
        animate={{ opacity: [0, 0.4, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
      />
    </motion.g>
  </motion.svg>
);

const ArchitectureIllustration = () => (
  <motion.svg
    viewBox="0 0 400 240"
    className="w-full h-full"
    whileHover="hover"
  >
    <motion.g
      animate={{ y: [0, -3, 0] }}
      transition={{ repeat: Infinity, duration: 3 }}
    >
      <rect
        x="170"
        y="15"
        width="60"
        height="40"
        rx="6"
        fill={COLORS.zinc[950]}
        stroke={COLORS.accent}
        strokeWidth="2.5"
      />
      <Globe2 x="188" y="24" size={24} color={COLORS.accent} />
    </motion.g>
    <motion.path
      d="M200 55 L80 95 M200 55 L160 95 M200 55 L240 95 M200 55 L320 95"
      stroke={COLORS.zinc[700]}
      strokeWidth="2"
      fill="transparent"
      variants={{ hover: { stroke: COLORS.accent, opacity: 0.8 } }}
    />
    {[50, 130, 210, 290].map((x, i) => (
      <motion.g key={x} whileHover={{ scale: 1.1 }}>
        <rect
          x={x}
          y={95}
          width="60"
          height="45"
          rx="4"
          fill={COLORS.zinc[950]}
          stroke={COLORS.zinc[600]}
          strokeWidth="1.5"
        />
        <Box x={x + 20} y={105} size={20} color={COLORS.accent} opacity="0.7" />
      </motion.g>
    ))}
    {[0, 1, 2, 3].map((i) => (
      <motion.circle
        key={i}
        cx="200"
        cy="55"
        r="3"
        fill={COLORS.accent}
        animate={{
          cx: [200, 80 + i * 80, 80 + i * 80, 80 + i * 80],
          cy: [55, 95, 130, 165],
          opacity: [0, 1, 1, 0],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          delay: i * 0.8,
          ease: "easeInOut",
        }}
      />
    ))}
  </motion.svg>
);

const DevOpsIllustration = () => (
  <motion.svg
    viewBox="0 0 400 240"
    className="w-full h-full"
    whileHover="hover"
  >
    <line
      x1="40"
      y1="120"
      x2="360"
      y2="120"
      stroke={COLORS.zinc[800]}
      strokeWidth="4"
      strokeLinecap="round"
    />
    <motion.g whileHover={{ y: -5 }}>
      <rect
        x="40"
        y="90"
        width="60"
        height="60"
        rx="8"
        fill={COLORS.zinc[950]}
        stroke={COLORS.zinc[700]}
        strokeWidth="2"
      />
      <GitBranch x="55" y="105" size={30} color={COLORS.accent} />
      <text
        x="70"
        y="165"
        textAnchor="middle"
        fill={COLORS.zinc[500]}
        fontSize="10"
        fontWeight="bold"
      >
        COMMIT
      </text>
    </motion.g>
    <motion.g whileHover={{ y: -5 }}>
      <rect
        x="130"
        y="90"
        width="60"
        height="60"
        rx="8"
        fill={COLORS.zinc[950]}
        stroke={COLORS.zinc[700]}
        strokeWidth="2"
      />
      <Cpu x="145" y="105" size={30} color={COLORS.accent} />
      <text
        x="160"
        y="165"
        textAnchor="middle"
        fill={COLORS.zinc[500]}
        fontSize="10"
        fontWeight="bold"
      >
        BUILD
      </text>
      <motion.path
        d="M130 90 L190 90 L190 150 L130 150 Z"
        fill="transparent"
        stroke={COLORS.accent}
        strokeWidth="2"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: [0, 1, 0] }}
        transition={{ duration: 3, repeat: Infinity }}
      />
    </motion.g>
    <motion.g whileHover={{ y: -5 }}>
      <rect
        x="220"
        y="90"
        width="60"
        height="60"
        rx="8"
        fill={COLORS.zinc[950]}
        stroke={COLORS.zinc[700]}
        strokeWidth="2"
      />
      <ShieldCheck x="235" y="105" size={30} color={COLORS.accent} />
      <text
        x="250"
        y="165"
        textAnchor="middle"
        fill={COLORS.zinc[500]}
        fontSize="10"
        fontWeight="bold"
      >
        SCAN
      </text>
    </motion.g>
    <motion.g whileHover={{ y: -5 }}>
      <rect
        x="310"
        y="90"
        width="60"
        height="60"
        rx="8"
        fill={COLORS.zinc[950]}
        stroke={COLORS.accent}
        strokeWidth="2"
      />
      <Cloud x="325" y="105" size={30} color={COLORS.accent} />
      <text
        x="340"
        y="165"
        textAnchor="middle"
        fill={COLORS.accent}
        fontSize="10"
        fontWeight="bold"
      >
        DEPLOY
      </text>
    </motion.g>
    {[0, 1, 2].map((i) => (
      <motion.circle
        key={i}
        r="3"
        fill={COLORS.accent}
        animate={{ cx: [70, 160, 250, 340], opacity: [0, 1, 1, 0] }}
        transition={{
          duration: 4,
          repeat: Infinity,
          delay: i * 1.3,
          ease: "linear",
        }}
        cy="120"
      />
    ))}
    <motion.g variants={{ hover: { opacity: 1 } }} initial={{ opacity: 0 }}>
      <CheckCircle2 x="85" y="85" size={16} color={COLORS.accent} />
      <CheckCircle2 x="175" y="85" size={16} color={COLORS.accent} />
    </motion.g>
  </motion.svg>
);

const UIUXIllustration = () => (
  <motion.svg
    viewBox="0 0 400 240"
    className="w-full h-full"
    whileHover="hover"
  >
    <rect
      x="60"
      y="40"
      width="280"
      height="160"
      rx="12"
      fill={COLORS.zinc[950]}
      stroke={COLORS.zinc[800]}
      strokeWidth="2.5"
    />

    <motion.g variants={{ hover: { y: -5 } }}>
      <rect
        x="80"
        y="60"
        width="240"
        height="50"
        rx="8"
        fill={COLORS.zinc[900]}
        stroke={COLORS.zinc[700]}
        strokeWidth="1.5"
      />
      <motion.circle
        cx="105"
        cy="85"
        r="14"
        fill={COLORS.accent}
        opacity="0.15"
        stroke={COLORS.accent}
        strokeWidth="2"
        animate={{ r: [14, 18, 14] }}
        transition={{ repeat: Infinity, duration: 2 }}
      />

      {/* Redlines Spacing */}
      <motion.g initial={{ opacity: 0 }} variants={{ hover: { opacity: 1 } }}>
        <path
          d="M80 85h25M80 80v10M105 80v10"
          stroke={COLORS.accent}
          strokeWidth="1.5"
        />
        <motion.path
          d="M200 110v20M192 110h16M192 130h16"
          stroke={COLORS.accent}
          strokeWidth="1.5"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
        />
      </motion.g>

      <rect
        x="80"
        y="130"
        width="110"
        height="40"
        rx="6"
        fill={COLORS.accent}
      />
      <rect
        x="205"
        y="130"
        width="115"
        height="40"
        rx="6"
        fill="transparent"
        stroke={COLORS.zinc[700]}
        strokeWidth="1.5"
      />
    </motion.g>

    <motion.g
      animate={{ x: [0, 10, 0], y: [0, -10, 0] }}
      transition={{ duration: 4, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
    >
      <MousePointer2
        x="320"
        y="180"
        size={28}
        color={COLORS.accent}
        strokeWidth={2.5}
      />
    </motion.g>
  </motion.svg>
);
export { FullStackIllustration, BrandingIllustration, DatabaseIllustration, ArchitectureIllustration, DevOpsIllustration, UIUXIllustration };
