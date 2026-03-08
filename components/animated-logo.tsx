"use client";

import { useEffect, useState, useId, useMemo } from "react";
import { motion } from "framer-motion";

// --- CONFIGURATION ---

// 1. YOUR ORIGINAL LOGO PATHS (Flipped Coordinate System)
const LOGO_PATHS = [
  "M2882 6002 c-136 -49 -241 -160 -283 -301 -13 -43 -15 -45 -124 -96 -574 -270 -1159 -417 -1792 -451 -113 -6 -124 -8 -148 -31 l-25 -26 0 -796 c0 -841 4 -937 50 -1186 122 -664 361 -1176 789 -1690 103 -124 434 -454 556 -554 235 -195 524 -397 811 -568 241 -145 310 -160 436 -93 195 101 588 354 792 508 316 238 633 546 837 812 377 492 610 1048 698 1665 39 274 44 389 45 1150 1 697 0 742 -17 766 -27 40 -57 47 -227 54 -508 21 -1149 179 -1662 409 -178 81 -170 75 -183 127 -31 119 -117 220 -235 277 -67 33 -84 37 -170 39 -73 3 -107 -1 -148 -15z m261 -12 c147 -45 257 -172 292 -335 6 -24 393 -187 627 -264 478 -157 813 -218 1332 -244 61 -3 71 -6 93 -31 l24 -29 -4 -811 c-4 -751 -6 -823 -25 -978 -77 -606 -260 -1103 -585 -1588 -217 -324 -548 -666 -927 -957 -310 -238 -801 -542 -912 -564 -81 -16 -134 3 -329 120 -454 271 -799 532 -1106 839 -572 579 -889 1152 -1037 1902 -64 324 -66 369 -66 1247 0 768 1 791 19 815 19 24 26 25 173 32 557 24 1161 175 1723 429 l159 73 24 69 c28 80 64 136 121 188 109 98 261 131 404 87z",
  "M2930 5794 c-127 -55 -165 -215 -78 -335 76 -105 240 -105 330 0 92 108 49 280 -84 335 -47 20 -122 20 -168 0z m158 -10 c77 -32 131 -111 132 -191 0 -57 -12 -85 -61 -138 -97 -105 -254 -81 -321 49 -31 61 -23 162 18 213 58 74 152 101 232 67z",
  "M2503 5399 c-234 -112 -591 -241 -841 -303 -307 -77 -629 -126 -824 -126 -55 0 -100 -4 -103 -10 -4 -7 12 -9 47 -5 29 2 103 7 163 10 281 14 700 99 1020 207 162 54 406 151 548 217 49 23 92 41 95 41 4 0 19 -22 34 -49 38 -68 133 -153 202 -181 l56 -22 0 -289 c0 -314 5 -358 53 -459 27 -57 70 -105 358 -395 325 -328 327 -330 338 -385 9 -41 11 -427 9 -1470 l-3 -1414 -189 -123 c-180 -117 -243 -161 -186 -133 14 7 107 67 208 133 l182 120 0 1429 c0 1009 -3 1443 -11 1476 -10 44 -33 68 -314 347 -308 306 -367 374 -407 474 -21 53 -23 72 -26 376 l-3 321 -68 31 c-77 36 -180 137 -202 197 -7 20 -18 36 -24 35 -5 0 -56 -23 -112 -50z",
  "M3392 5404 c-41 -85 -149 -180 -225 -200 -15 -3 -32 -14 -37 -24 -14 -25 -13 -590 0 -590 6 0 10 105 10 294 l0 293 67 33 c83 41 146 99 186 168 16 29 35 51 41 49 6 -3 72 -32 146 -64 503 -223 1248 -403 1661 -403 l79 0 0 -304 0 -303 -61 -6 c-123 -11 -149 -31 -515 -399 -323 -326 -331 -334 -352 -398 -22 -63 -22 -78 -22 -490 l0 -425 -56 -29 c-132 -69 -201 -227 -161 -367 32 -109 132 -213 230 -240 162 -45 347 49 406 206 57 151 -13 330 -158 405 l-41 20 0 393 c0 250 4 406 11 431 9 32 65 92 320 345 293 290 350 338 387 326 6 -3 12 0 12 5 0 13 -16 13 -59 0 -25 -7 -114 -88 -340 -312 -168 -167 -314 -319 -323 -338 -16 -31 -18 -77 -18 -445 l0 -410 49 -27 c60 -34 110 -88 141 -153 33 -67 34 -178 2 -247 -28 -64 -95 -134 -157 -166 -43 -22 -63 -26 -140 -27 -104 0 -148 17 -219 89 -101 100 -129 243 -72 360 31 63 109 139 161 156 l34 11 3 447 3 447 27 58 c23 49 78 109 350 381 357 357 376 371 501 383 l67 6 -2 311 -3 311 -50 2 c-539 24 -1205 187 -1730 424 -71 33 -130 59 -130 59 -1 0 -11 -21 -23 -46z",
  "M712 4658 l-2 -318 273 0 274 0 18 39 c25 57 106 135 173 168 50 25 68 28 152 28 77 0 104 -4 143 -22 65 -30 148 -112 182 -180 25 -49 29 -68 29 -142 1 -72 -4 -95 -26 -143 -34 -72 -102 -146 -170 -183 -75 -41 -196 -47 -283 -14 -80 30 -175 120 -206 195 l-23 54 -268 0 -268 0 2 -322 3 -323 775 -5 c586 -4 782 -8 803 -17 62 -28 116 -78 490 -450 348 -347 393 -395 421 -453 l31 -65 5 -1010 5 -1010 0 1015 0 1015 -32 65 c-28 57 -77 110 -425 456 -216 215 -411 402 -433 416 -91 57 -54 55 -1122 57 l-513 1 0 310 0 310 257 -2 256 -3 29 -55 c130 -242 430 -289 606 -95 25 27 57 75 71 105 22 47 26 68 26 150 0 84 -4 101 -28 150 -35 67 -115 147 -182 180 -43 21 -64 25 -150 25 -88 0 -107 -3 -157 -27 -70 -33 -147 -103 -179 -163 l-24 -45 -262 0 -263 0 -3 313 -2 312 -3 -317z",
  "M3130 4571 c0 -36 60 -104 350 -396 191 -192 326 -336 338 -360 48 -97 46 -36 52 -1514 l5 -1393 155 134 c413 359 708 723 913 1125 200 394 292 707 352 1208 15 116 32 758 21 730 -3 -5 -7 -136 -10 -290 -12 -645 -105 -1079 -335 -1570 -168 -357 -453 -738 -781 -1043 -117 -109 -295 -262 -304 -262 -3 0 -6 609 -6 1353 0 1491 2 1438 -62 1545 -22 35 -137 155 -335 350 -230 224 -309 307 -328 345 -14 28 -25 45 -25 38z",
  "M1540 4363 c-49 -18 -90 -83 -90 -144 0 -84 74 -144 167 -137 186 16 170 290 -17 287 -25 0 -52 -3 -60 -6z m156 -46 c39 -42 49 -73 40 -121 -21 -109 -162 -142 -240 -56 -41 46 -47 89 -19 147 25 53 66 75 132 70 47 -3 59 -9 87 -40z",
  "M740 3284 c0 -76 88 -471 141 -631 l21 -63 433 0 c480 0 482 0 561 -65 24 -20 173 -165 332 -323 221 -219 295 -299 313 -337 22 -46 24 -64 27 -246 l4 -196 50 -24 c57 -27 115 -88 149 -157 19 -37 24 -64 24 -122 0 -97 -24 -160 -87 -226 -208 -220 -558 -79 -558 225 0 56 5 79 31 129 33 67 110 144 163 163 l32 12 3 147 c2 117 -1 156 -14 186 -11 27 -104 127 -288 313 -150 150 -290 286 -311 302 l-39 29 -374 0 c-205 0 -373 -2 -373 -5 0 -16 168 -338 224 -429 238 -389 595 -774 1001 -1082 253 -191 756 -504 811 -504 17 0 24 8 29 31 4 18 4 485 0 1038 -6 832 -9 1011 -21 1036 -22 47 -762 781 -806 799 -33 14 -129 16 -758 16 -660 0 -720 -1 -720 -16z m1472 -12 c48 -22 779 -748 802 -796 14 -31 16 -133 16 -1055 0 -904 -2 -1022 -15 -1027 -14 -6 -86 32 -275 144 -106 63 -381 244 -377 248 2 2 31 -1 65 -6 101 -17 193 14 278 92 64 59 96 132 102 230 4 75 3 82 -32 153 -39 79 -92 132 -159 160 l-35 15 -4 197 c-4 276 36 213 -433 674 -148 146 -268 256 -295 270 l-45 24 -449 5 -448 5 -19 60 c-45 141 -138 558 -139 623 0 1 321 2 713 2 653 -1 715 -2 749 -18z m-485 -892 c37 -14 601 -576 619 -617 10 -23 14 -76 14 -182 l0 -149 -54 -31 c-55 -30 -110 -89 -140 -149 -43 -85 -40 -200 9 -294 13 -27 22 -48 19 -48 -13 0 -158 120 -281 232 -369 337 -663 720 -852 1110 -34 69 -61 128 -61 132 0 11 696 7 727 -4z",
  "M4400 2413 c-78 -70 -43 -196 57 -210 103 -14 175 86 128 177 -33 64 -131 81 -185 33z m155 -13 c89 -84 -16 -230 -128 -179 -74 34 -76 155 -2 198 31 18 102 7 130 -19z",
  "M2425 1226 c-46 -21 -67 -51 -73 -104 -4 -41 0 -52 23 -80 90 -107 257 -19 213 113 -22 66 -100 100 -163 71z m115 -25 c53 -39 56 -124 5 -168 -40 -35 -113 -32 -148 5 -36 38 -43 80 -21 127 30 63 105 80 164 36z",
];

// 2. STATE OUTLINE PATH (Standard Top-Left Coordinate System)
const STATE_PATH_DATA =
  "M 111.738281 237.5625 C 110.886719 237.5625 110.335938 236.671875 110.125 236.375 C 109.660156 235.695312 109.105469 235.101562 108.597656 234.550781 C 107.578125 233.492188 106.519531 232.386719 106.519531 230.734375 L 106.519531 225.515625 C 106.519531 224.203125 106.390625 222.929688 106.265625 222.164062 L 104.78125 222.164062 L 102.742188 223.609375 L 101.046875 227.976562 L 98.375 232.132812 L 90.1875 233.789062 L 86.753906 159.257812 L 101.300781 35.015625 L 95.789062 29.074219 L 194.410156 29.074219 L 194.496094 29.753906 C 194.582031 30.433594 203.191406 98.089844 205.566406 105.597656 C 207.984375 113.191406 209.046875 118.113281 209.046875 118.15625 L 209.046875 123.542969 C 209.046875 124.644531 208.789062 125.324219 208.621094 125.832031 C 208.367188 126.46875 208.324219 126.679688 208.917969 127.613281 C 209.765625 128.886719 210.105469 129.566406 210.488281 130.246094 C 210.699219 130.667969 210.953125 131.136719 211.378906 131.8125 C 212.269531 133.296875 214.304688 135.375 214.6875 135.757812 C 215.070312 136.011719 216.636719 137.117188 217.359375 138.855469 C 218.082031 140.59375 218.757812 143.011719 218.757812 143.097656 L 218.800781 143.222656 L 218.800781 143.351562 C 218.675781 145.003906 218.546875 147.636719 218.757812 148.230469 C 218.929688 148.738281 220.753906 150.605469 222.363281 152.046875 L 222.621094 152.300781 L 222.621094 157.011719 L 222.109375 157.222656 C 219.820312 158.070312 217.105469 159.257812 216.597656 159.683594 C 216.46875 159.894531 216.339844 160.105469 216.171875 160.320312 C 215.746094 160.914062 215.324219 161.589844 215.324219 162.355469 C 215.324219 163.753906 214.984375 167.785156 214.984375 167.953125 L 214.984375 168.039062 C 214.984375 168.125 214.644531 170.160156 214.261719 171.558594 C 214.09375 172.152344 213.882812 172.621094 213.710938 173.003906 C 213.457031 173.554688 213.246094 173.976562 213.246094 174.867188 C 213.246094 176.566406 213.585938 178.898438 213.921875 180.214844 C 214.261719 181.570312 214.941406 183.988281 214.941406 183.988281 L 214.941406 184.03125 C 214.984375 184.160156 215.707031 187.085938 214.898438 189.035156 C 214.261719 190.5625 213.667969 191.835938 213.5 192.132812 L 212.480469 195.910156 L 212.480469 195.949219 C 212.480469 195.992188 212.015625 197.222656 212.992188 198.199219 C 214.433594 199.640625 216.171875 202.738281 216.257812 202.863281 L 216.300781 202.949219 L 218.121094 207.488281 L 120.476562 207.488281 C 119.203125 208.675781 117.84375 210.289062 117.84375 210.839844 C 117.84375 211.433594 118.226562 212.453125 118.566406 213.300781 C 118.90625 214.234375 119.246094 215.039062 119.246094 215.675781 C 119.289062 216.101562 120.304688 217.625 121.449219 218.941406 L 125.054688 222.207031 L 126.160156 227.425781 L 126.160156 227.550781 C 126.117188 228.0625 125.777344 232.558594 125.4375 233.660156 C 125.394531 233.746094 125.394531 233.832031 125.351562 233.914062 C 125.054688 234.847656 124.757812 234.976562 123.65625 235.398438 C 123.359375 235.527344 123.019531 235.65625 122.597656 235.867188 C 121.410156 236.375 120.730469 236.289062 120.179688 235.613281 C 120.136719 235.570312 120.136719 235.527344 120.09375 235.527344 C 120.09375 235.527344 119.753906 235.398438 118.398438 235.910156 C 115.808594 236.84375 114.070312 236.714844 113.09375 236.460938 C 112.925781 236.886719 112.585938 237.308594 112.078125 237.4375 C 111.949219 237.5625 111.820312 237.5625 111.738281 237.5625 Z M 104.3125 220.554688 L 107.664062 220.554688 L 107.792969 221.230469 C 107.792969 221.316406 108.132812 223.394531 108.132812 225.515625 L 108.132812 230.734375 C 108.132812 231.753906 108.851562 232.515625 109.785156 233.492188 C 110.335938 234.085938 110.972656 234.722656 111.480469 235.527344 C 111.566406 235.65625 111.609375 235.738281 111.695312 235.78125 C 111.738281 235.65625 111.777344 235.527344 111.777344 235.398438 L 111.949219 234.085938 L 112.96875 234.804688 C 113.09375 234.847656 114.621094 235.613281 117.800781 234.46875 C 119.753906 233.746094 120.6875 233.832031 121.367188 234.679688 C 121.449219 234.679688 121.621094 234.59375 121.917969 234.46875 C 122.382812 234.253906 122.722656 234.128906 123.019531 234 C 123.316406 233.875 123.65625 233.746094 123.742188 233.660156 C 123.742188 233.617188 123.785156 233.535156 123.785156 233.492188 C 123.828125 233.40625 123.828125 233.320312 123.867188 233.195312 C 124.082031 232.515625 124.378906 229.460938 124.503906 227.59375 L 123.527344 223.097656 L 120.21875 220.128906 L 120.179688 220.085938 C 119.371094 219.195312 117.546875 216.949219 117.546875 215.761719 C 117.546875 215.421875 117.25 214.613281 116.996094 213.9375 C 116.574219 212.875 116.191406 211.773438 116.191406 210.882812 C 116.191406 209.269531 118.777344 206.851562 119.585938 206.132812 L 119.796875 205.917969 L 215.707031 205.917969 L 214.773438 203.585938 C 214.558594 203.203125 213.03125 200.488281 211.800781 199.300781 C 210.191406 197.691406 210.785156 195.738281 210.910156 195.355469 L 211.972656 191.496094 L 212.015625 191.410156 C 212.015625 191.410156 212.695312 190.011719 213.371094 188.359375 C 213.882812 187.128906 213.5 185.050781 213.328125 184.328125 C 213.289062 184.117188 212.609375 181.824219 212.269531 180.511719 C 211.929688 179.109375 211.546875 176.648438 211.546875 174.785156 C 211.546875 173.554688 211.886719 172.832031 212.183594 172.238281 C 212.355469 171.898438 212.523438 171.558594 212.609375 171.136719 C 212.90625 169.90625 213.246094 168.039062 213.289062 167.742188 C 213.328125 167.359375 213.625 163.585938 213.625 162.269531 C 213.625 160.996094 214.261719 160.023438 214.773438 159.34375 C 214.898438 159.132812 215.027344 158.960938 215.109375 158.792969 C 215.28125 158.410156 215.707031 157.984375 218.589844 156.753906 C 219.480469 156.375 220.371094 156.035156 220.921875 155.824219 L 220.921875 152.894531 C 219.863281 151.921875 217.488281 149.671875 217.148438 148.613281 C 216.808594 147.550781 217.019531 144.199219 217.105469 143.222656 C 216.933594 142.671875 216.339844 140.722656 215.789062 139.28125 C 215.195312 137.835938 213.710938 136.902344 213.667969 136.902344 L 213.585938 136.863281 L 213.5 136.777344 C 213.414062 136.691406 210.996094 134.273438 209.894531 132.449219 C 209.46875 131.730469 209.214844 131.261719 208.960938 130.839844 C 208.578125 130.160156 208.28125 129.566406 207.476562 128.335938 C 206.5 126.851562 206.628906 126.085938 207.007812 125.113281 C 207.179688 124.644531 207.347656 124.179688 207.347656 123.371094 L 207.347656 118.238281 C 207.222656 117.5625 206.117188 112.894531 203.914062 105.894531 C 201.578125 98.601562 193.859375 38.109375 192.882812 30.476562 L 99.433594 30.476562 L 102.957031 34.25 L 88.363281 159.300781 L 91.800781 231.835938 L 97.484375 230.691406 L 99.691406 227.214844 L 101.472656 222.546875 Z M 104.3125 220.554688";

type AnimationPhase =
  | "idle"
  | "welding"
  | "shrinking"
  | "drawingState"
  | "holding"
  | "fading";

interface AnimatedLogoProps {
  className?: string;
  size?: number | string;
  autoPlay?: boolean;
  onComplete?: () => void;
  color?: string;
  logoColor?: string;
  stateColor?: string;
  syncColors?: boolean;
  weldColor?: string;
  intensity?: number;
  animationSpeed?: number; // Duration in seconds for each animation segment
  // Feature Flag:
  showStateOutline?: boolean;
  // Static mode for freeze frames:
  staticMode?: "none" | "logo" | "logoWithState";
}

export default function AnimatedLogo({
  className = "",
  size = 600,
  autoPlay = true,
  onComplete,
  color = "#3b82f6",
  logoColor,
  stateColor,
  syncColors = true,
  weldColor = "#ffffff",
  intensity = 1.0,
  animationSpeed = 1.5, // Default 1.5 seconds per animation segment
  showStateOutline = false, // Set this to true to enable the state effect
  staticMode = "none",
}: AnimatedLogoProps) {
  const [phase, setPhase] = useState<AnimationPhase>("idle");
  const [currentPath, setCurrentPath] = useState(0);
  const [fadeKey, setFadeKey] = useState(0);

  const baseId = useId();
  const glowId = `${baseId}-glow`;
  const weldGlowId = `${baseId}-weld-glow`;

  // Determine actual colors based on sync setting
  const actualLogoColor = syncColors ? color : logoColor || color;
  const actualStateColor = syncColors ? color : stateColor || color;

  const blurRadius = 24 * intensity;
  const weldBlurRadius = 16 * intensity;

  // Memoized helper to determine if logo is scaled down
  const isScaledDown = useMemo(() => {
    return (
      (phase === "shrinking" ||
        phase === "drawingState" ||
        phase === "holding" ||
        phase === "fading") &&
      showStateOutline
    );
  }, [phase, showStateOutline]);

  // Helper to convert hex color to rgba
  function hexToRgba(hex: string, alpha: number): string {
    // Remove leading '#' if present
    hex = hex.replace(/^#/, "");
    // Parse r, g, b
    let r = 0,
      g = 0,
      b = 0;
    if (hex.length === 3) {
      r = parseInt(hex[0] + hex[0], 16);
      g = parseInt(hex[1] + hex[1], 16);
      b = parseInt(hex[2] + hex[2], 16);
    } else if (hex.length === 6) {
      r = parseInt(hex.slice(0, 2), 16);
      g = parseInt(hex.slice(2, 4), 16);
      b = parseInt(hex.slice(4, 6), 16);
    }
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  }
  const dropShadowStr = `drop-shadow(0 0 ${32 * intensity}px ${hexToRgba(actualLogoColor, 0.7)})`;

  const startAnimation = () => {
    setPhase("welding");
    setCurrentPath(0);
  };

  useEffect(() => {
    if (autoPlay) {
      const timer = setTimeout(() => {
        startAnimation();
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [autoPlay]);

  // Handle step-by-step logic
  const handlePathComplete = () => {
    if (currentPath < LOGO_PATHS.length - 1) {
      setCurrentPath((prev) => prev + 1);
    } else {
      // Welding Finished
      if (showStateOutline) {
        setPhase("shrinking");
      } else {
        setPhase("fading");
        triggerCompletion();
      }
    }
  };

  const handleShrinkComplete = () => {
    if (phase === "shrinking") {
      setPhase("drawingState");
    }
  };

  const handleStateDrawComplete = () => {
    if (phase === "drawingState") {
      setPhase("holding");
      // Hold state logo for 2 seconds before fading out
      setTimeout(() => {
        setPhase("fading");
        triggerCompletion();
      }, 2000);
    }
  };

  const triggerCompletion = () => {
    onComplete?.();
    if (autoPlay) {
      // Wait for fade (1.5s) + pause (0.5s) then restart
      setTimeout(() => {
        setPhase("idle");
        setFadeKey((k) => k + 1);
        startAnimation();
      }, 2000);
    }
  };

  // Static mode rendering - bypass animation logic but keep hooks above
  if (staticMode !== "none") {
    return (
      <div
        className={`relative ${className}`}
        style={{ width: size, height: size }}
      >
        <svg
          width="100%"
          height="100%"
          viewBox="0 0 6080 6110"
          className="absolute inset-0"
          style={{ filter: dropShadowStr }}
        >
          <defs>
            <filter id={`${baseId}-static-glow`}>
              <feGaussianBlur stdDeviation={blurRadius} result="coloredBlur" />
              <feMerge>
                <feMergeNode in="coloredBlur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* Static Logo */}
          <g
            style={{ transformOrigin: "3040px 3055px" }}
            transform={`translate(${staticMode === "logoWithState" ? 100 : 0}, ${staticMode === "logoWithState" ? -1400 : 0}) scale(${staticMode === "logoWithState" ? 0.4 : 1})`}
          >
            <g transform="scale(1, -1) translate(0, -6110)">
              {LOGO_PATHS.map((path, index) => (
                <path
                  key={`static-${index}`}
                  d={path}
                  fill="none"
                  stroke={actualLogoColor}
                  strokeWidth={staticMode === "logoWithState" ? "18" : "4.5"}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  filter={`url(#${baseId}-static-glow)`}
                />
              ))}
            </g>
          </g>

          {/* Static Alabama Outline */}
          {staticMode === "logoWithState" && (
            <g transform="translate(-1050, -700) scale(28, 28)">
              <path
                d={STATE_PATH_DATA}
                fill="none"
                stroke={actualStateColor}
                strokeWidth="1"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </g>
          )}
        </svg>
      </div>
    );
  }

  return (
    <div
      className={`relative ${className}`}
      style={{ width: size, height: size }}
    >
      <svg
        width="100%"
        height="100%"
        viewBox="0 0 6080 6110"
        className="absolute inset-0"
        style={{ filter: dropShadowStr }}
      >
        <defs>
          <filter id={glowId}>
            <feGaussianBlur stdDeviation={blurRadius} result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <filter id={weldGlowId}>
            <feGaussianBlur
              stdDeviation={weldBlurRadius}
              result="coloredBlur"
            />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* GROUP 1: THE WELDED LOGO 
           This group shrinks down.
           Note: 'transformOrigin' handles the shrinking center. 
           We use the center of your viewBox (3040 3055).
        */}
        <motion.g
          initial={{ scale: 1, x: 0, y: 0, opacity: 1 }}
          animate={{
            scale: isScaledDown ? 0.4 : 1,
            x: isScaledDown ? 100 : 0,
            y: isScaledDown ? -1400 : 0,
            opacity: phase === "fading" ? 0 : 1,
          }}
          transition={{
            scale: { duration: 1.2, ease: "easeInOut" },
            x: { duration: 1.2, ease: "easeInOut" },
            y: { duration: 1.2, ease: "easeInOut" },
            opacity: { duration: 1, ease: "easeInOut" },
          }}
          style={{ transformOrigin: "50% 50%" }}
          onAnimationComplete={() => {
            if (phase === "shrinking") handleShrinkComplete();
          }}
        >
          {/* Flipped coordinate system for the original logo */}
          <g transform="scale(1, -1) translate(0, -6110)">
            {(() => {
              return (
                <>
                  {/* Static Skeleton */}
                  {LOGO_PATHS.map((path, index) => (
                    <path
                      key={`static-${index}`}
                      d={path}
                      fill="none"
                      stroke="currentColor"
                      className="text-slate-700 opacity-20"
                      strokeWidth={isScaledDown ? "10" : "2.5"}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  ))}

                  {/* Active Weld Lines */}
                  {phase !== "idle" &&
                    LOGO_PATHS.map((path, index) => {
                      // If we are past welding phase, show full paths
                      if (phase !== "welding") {
                        return (
                          <path
                            key={`done-${index}`}
                            d={path}
                            fill="none"
                            stroke={actualLogoColor}
                            strokeWidth={isScaledDown ? "18" : "4.5"}
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            filter={`url(#${glowId})`}
                          />
                        );
                      }

                      if (index > currentPath) return null;
                      const isCurrentPath = index === currentPath;
                      const WELD_HEAD_LENGTH = 0.04;

                      return (
                        <g key={`animated-${index}`}>
                          <motion.path
                            d={path}
                            fill="none"
                            stroke={actualLogoColor}
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            filter={`url(#${glowId})`}
                            initial={{ pathLength: 0, strokeWidth: 4.5 }}
                            animate={{
                              pathLength:
                                index < currentPath ? 1 : isCurrentPath ? 1 : 0,
                              strokeWidth: isScaledDown ? 18 : 4.5,
                            }}
                            transition={{
                              duration: isCurrentPath ? animationSpeed : 0,
                              ease: "linear",
                              strokeWidth: { duration: 1.2, ease: "easeInOut" },
                            }}
                            onAnimationComplete={
                              isCurrentPath ? handlePathComplete : undefined
                            }
                          />

                          {isCurrentPath && (
                            <motion.path
                              d={path}
                              fill="none"
                              stroke={weldColor}
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              filter={`url(#${weldGlowId})`}
                              initial={{
                                pathLength: 0,
                                pathOffset: 0,
                                strokeWidth: 7,
                              }}
                              animate={{
                                pathLength: WELD_HEAD_LENGTH,
                                pathOffset: 1 - WELD_HEAD_LENGTH,
                                strokeWidth: isScaledDown ? 28 : 7,
                              }}
                              transition={{
                                duration: animationSpeed,
                                ease: "linear",
                                strokeWidth: {
                                  duration: 1.2,
                                  ease: "easeInOut",
                                },
                              }}
                              style={{ mixBlendMode: "screen" }}
                            />
                          )}
                        </g>
                      );
                    })}
                </>
              );
            })()}
          </g>
        </motion.g>

        {/* GROUP 2: THE STATE OUTLINE 
           This uses standard (non-flipped) coordinates.
           It appears only after shrinking.
           The state outline is centered and scaled appropriately.
        */}
        {showStateOutline && (
          <motion.g
            // Center and scale the state outline to fit around the shrunken logo
            transform="translate(-1050, -700) scale(28, 28)"
          >
            <motion.path
              d={STATE_PATH_DATA}
              fill="none"
              stroke={actualStateColor}
              strokeWidth={1}
              strokeLinecap="round"
              strokeLinejoin="round"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{
                pathLength:
                  phase === "drawingState" ||
                  phase === "holding" ||
                  phase === "fading"
                    ? 1
                    : 0,
                opacity:
                  phase === "fading"
                    ? 0
                    : phase === "drawingState" || phase === "holding"
                      ? 1
                      : 0,
              }}
              transition={{
                pathLength: {
                  duration: animationSpeed * 1.33,
                  ease: "easeInOut",
                },
                opacity: { duration: 1 },
              }}
              onAnimationComplete={() => {
                if (phase === "drawingState") handleStateDrawComplete();
              }}
            />
          </motion.g>
        )}
      </svg>

      {!autoPlay && phase === "idle" && staticMode === "none" && (
        <button
          onClick={startAnimation}
          disabled={phase !== "idle"}
          className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-full mt-4 px-4 py-2 bg-slate-800 text-white border border-slate-700 rounded-lg hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {phase === "idle" ? "Start Welding" : "Running..."}
        </button>
      )}
    </div>
  );
}
