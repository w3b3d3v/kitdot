import chalk from 'chalk';

/**
 * Creates KIT-DOT ASCII art in the style of the reference BMAD file
 * Using the same box-drawing character technique as BMAD_LARGE
 */
export function createKitDotLarge(): string {
  const lines = [
    '██╗  ██╗██╗████████╗    ██████╗  ██████╗ ████████╗',
    '██║ ██╔╝██║╚══██╔══╝    ██╔══██╗██╔═══██╗╚══██╔══╝',
    '█████╔╝ ██║   ██║       ██║  ██║██║   ██║   ██║   ',
    '██╔═██╗ ██║   ██║       ██║  ██║██║   ██║   ██║   ',
    '██║  ██╗██║   ██║       ██████╔╝╚██████╔╝   ██║   ',
    '╚═╝  ╚═╝╚═╝   ╚═╝       ╚═════╝  ╚═════╝    ╚═╝   '
  ];

  // Apply the requested color #fe5afe (bright magenta/pink)
  return lines.map(line => chalk.hex('#fe5afe')(line)).join('\n');
}

/**
 * Creates a stylized tagline
 */
export function createTagline(): string {
  return chalk.gray('Polkadot Dapp Toolkit');
}

/**
 * Creates decorative elements using chalk
 */
export function createDecorations() {
  const borderChar = '═';
  const width = 54; // Width matching our block text
  const border = borderChar.repeat(width);
  
  return {
    topBorder: chalk.hex('#fe5afe')('╔' + border + '╗'),
    bottomBorder: chalk.hex('#fe5afe')('╚' + border + '╝'),
    sideBorder: chalk.hex('#fe5afe')('║'),
    spacer: ' '.repeat(width)
  };
}

/**
 * Displays the home screen using only chalk and Unicode characters
 */
export function displayHomeScreen(): void {
  console.clear();
  
  const blockText = createKitDotLarge();
  const tagline = createTagline();
  const decorations = createDecorations();
  
  console.log('');
  console.log(decorations.topBorder);
  console.log(decorations.sideBorder + decorations.spacer + decorations.sideBorder);
  
  // Display the block text with proper centering
  const textLines = blockText.split('\n');
  textLines.forEach(line => {
    // Remove ANSI codes for length calculation using escape sequence
    const cleanLine = line.replace(/\x1b\[[0-9;]*m/g, ''); // eslint-disable-line no-control-regex
    const padding = Math.max(0, Math.floor((54 - cleanLine.length) / 2));
    const paddedLine = ' '.repeat(padding) + line + ' '.repeat(54 - cleanLine.length - padding);
    console.log(decorations.sideBorder + paddedLine + decorations.sideBorder);
  });
  
  console.log(decorations.sideBorder + decorations.spacer + decorations.sideBorder);
  
  // Display tagline
  const cleanTagline = tagline.replace(/\x1b\[[0-9;]*m/g, ''); // eslint-disable-line no-control-regex
  const taglinePadding = Math.max(0, Math.floor((54 - cleanTagline.length) / 2));
  const paddedTagline = ' '.repeat(taglinePadding) + tagline + ' '.repeat(54 - cleanTagline.length - taglinePadding);
  console.log(decorations.sideBorder + paddedTagline + decorations.sideBorder);
  
  console.log(decorations.sideBorder + decorations.spacer + decorations.sideBorder);
  console.log(decorations.bottomBorder);
  console.log('');
  
  // Welcome message using chalk styling
  console.log(chalk.blue.bold('🚀 Welcome to the Polkadot development ecosystem!'));
  console.log(chalk.gray('This tool will help you build amazing Dapps on Polkadot Cloud'));
  console.log('');
}

/**
 * Alternative version with block characters (█) for a more solid look
 */
export function createSolidBlockText(): string {
  // Using solid block characters for a style closer to your image
  const lines = [
    '██   ██ ██ ████████    ██████   ██████  ████████',
    '██  ██  ██    ██       ██   ██ ██    ██    ██   ',
    '█████   ██    ██       ██   ██ ██    ██    ██   ',
    '██  ██  ██    ██       ██   ██ ██    ██    ██   ',
    '██   ██ ██    ██       ██████   ██████     ██   '
  ];

  // Apply the cyan color scheme
  return lines.map(line => chalk.cyan(line)).join('\n');
}

/**
 * Test function to compare different text styles
 */
export function displayTextStyleOptions(): void {
  console.log(chalk.yellow('\nStyle 1 - KIT-DOT Large (Reference Style):'));
  console.log(createKitDotLarge());
  
  console.log(chalk.yellow('\nStyle 2 - Solid Block Characters:'));
  console.log(createSolidBlockText());
}