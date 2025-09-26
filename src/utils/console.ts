// Simple console styling utility to replace chalk dependency
// Using ANSI escape codes for colors and formatting

type ConsoleStyle = {
  // Colors
  black: (text: string) => string;
  red: (text: string) => string;
  green: (text: string) => string;
  yellow: (text: string) => string;
  blue: (text: string) => string;
  magenta: (text: string) => string;
  cyan: (text: string) => string;
  white: (text: string) => string;
  gray: (text: string) => string;

  // Bright colors
  redBright: (text: string) => string;
  greenBright: (text: string) => string;
  yellowBright: (text: string) => string;
  blueBright: (text: string) => string;
  magentaBright: (text: string) => string;
  cyanBright: (text: string) => string;
  whiteBright: (text: string) => string;

  // Styles
  bold: (text: string) => string;
  dim: (text: string) => string;
  italic: (text: string) => string;
  underline: (text: string) => string;

  // Background colors
  bgRed: (text: string) => string;
  bgGreen: (text: string) => string;
  bgYellow: (text: string) => string;
  bgBlue: (text: string) => string;
  bgMagenta: (text: string) => string;
  bgCyan: (text: string) => string;
  bgWhite: (text: string) => string;
};

// ANSI escape codes
const ANSI = {
  // Reset
  reset: '\x1b[0m',

  // Colors
  black: '\x1b[30m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
  white: '\x1b[37m',
  gray: '\x1b[90m',

  // Bright colors
  redBright: '\x1b[91m',
  greenBright: '\x1b[92m',
  yellowBright: '\x1b[93m',
  blueBright: '\x1b[94m',
  magentaBright: '\x1b[95m',
  cyanBright: '\x1b[96m',
  whiteBright: '\x1b[97m',

  // Styles
  bold: '\x1b[1m',
  dim: '\x1b[2m',
  italic: '\x1b[3m',
  underline: '\x1b[4m',

  // Background colors
  bgRed: '\x1b[41m',
  bgGreen: '\x1b[42m',
  bgYellow: '\x1b[43m',
  bgBlue: '\x1b[44m',
  bgMagenta: '\x1b[45m',
  bgCyan: '\x1b[46m',
  bgWhite: '\x1b[47m',
} as const;

// Helper function to create styled text
function createStyledFunction(ansiCode: string) {
  return (text: string): string => {
    // Check if colors are supported (not in CI or when NO_COLOR is set)
    const supportsColor = !process.env.NO_COLOR && process.env.FORCE_COLOR !== '0' && (process.env.FORCE_COLOR || process.stdout.isTTY);

    if (!supportsColor) {
      return text;
    }

    return `${ansiCode}${text}${ANSI.reset}`;
  };
}

// Create the console styling utility
export const console_style: ConsoleStyle = {
  // Colors
  black: createStyledFunction(ANSI.black),
  red: createStyledFunction(ANSI.red),
  green: createStyledFunction(ANSI.green),
  yellow: createStyledFunction(ANSI.yellow),
  blue: createStyledFunction(ANSI.blue),
  magenta: createStyledFunction(ANSI.magenta),
  cyan: createStyledFunction(ANSI.cyan),
  white: createStyledFunction(ANSI.white),
  gray: createStyledFunction(ANSI.gray),

  // Bright colors
  redBright: createStyledFunction(ANSI.redBright),
  greenBright: createStyledFunction(ANSI.greenBright),
  yellowBright: createStyledFunction(ANSI.yellowBright),
  blueBright: createStyledFunction(ANSI.blueBright),
  magentaBright: createStyledFunction(ANSI.magentaBright),
  cyanBright: createStyledFunction(ANSI.cyanBright),
  whiteBright: createStyledFunction(ANSI.whiteBright),

  // Styles
  bold: createStyledFunction(ANSI.bold),
  dim: createStyledFunction(ANSI.dim),
  italic: createStyledFunction(ANSI.italic),
  underline: createStyledFunction(ANSI.underline),

  // Background colors
  bgRed: createStyledFunction(ANSI.bgRed),
  bgGreen: createStyledFunction(ANSI.bgGreen),
  bgYellow: createStyledFunction(ANSI.bgYellow),
  bgBlue: createStyledFunction(ANSI.bgBlue),
  bgMagenta: createStyledFunction(ANSI.bgMagenta),
  bgCyan: createStyledFunction(ANSI.bgCyan),
  bgWhite: createStyledFunction(ANSI.bgWhite),
};

// Convenient aliases that match chalk API
export const colors = console_style;
