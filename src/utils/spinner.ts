// Simple progress indicator to replace ora dependency
// Provides basic spinner functionality using native Node.js

export class SimpleSpinner {
  private spinnerText: string;
  private isSpinning: boolean = false;
  private intervalId: ReturnType<typeof setInterval> | null = null;
  private frames: string[] = ['⠋', '⠙', '⠹', '⠸', '⠼', '⠴', '⠦', '⠧', '⠇', '⠏'];
  private currentFrame: number = 0;

  constructor(text: string = '') {
    this.spinnerText = text;
  }

  start(): this {
    if (this.isSpinning) {
      return this;
    }

    this.isSpinning = true;
    this.currentFrame = 0;

    // Hide cursor
    process.stdout.write('\x1B[?25l');

    this.intervalId = setInterval(() => {
      // Clear current line and move to beginning
      process.stdout.write('\r\x1B[2K');

      // Write spinner frame and text
      const frame = this.frames[this.currentFrame];
      process.stdout.write(`${frame} ${this.spinnerText}`);

      // Move to next frame
      this.currentFrame = (this.currentFrame + 1) % this.frames.length;
    }, 80);

    return this;
  }

  succeed(text?: string): this {
    this.stop();

    // Clear current line and move to beginning
    process.stdout.write('\r\x1B[2K');

    // Write success message
    const message = text || this.spinnerText;
    console.log(`✅ ${message}`);

    return this;
  }

  fail(text?: string): this {
    this.stop();

    // Clear current line and move to beginning
    process.stdout.write('\r\x1B[2K');

    // Write error message
    const message = text || this.spinnerText;
    console.error(`❌ ${message}`);

    return this;
  }

  warn(text?: string): this {
    this.stop();

    // Clear current line and move to beginning
    process.stdout.write('\r\x1B[2K');

    // Write warning message
    const message = text || this.spinnerText;
    console.warn(`⚠️  ${message}`);

    return this;
  }

  info(text?: string): this {
    this.stop();

    // Clear current line and move to beginning
    process.stdout.write('\r\x1B[2K');

    // Write info message
    const message = text || this.spinnerText;
    console.log(`ℹ️  ${message}`);

    return this;
  }

  stop(): this {
    if (!this.isSpinning) {
      return this;
    }

    this.isSpinning = false;

    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }

    // Clear current line and show cursor
    process.stdout.write('\r\x1B[2K\x1B[?25h');

    return this;
  }

  // Update spinner text while running
  set text(newText: string) {
    this.spinnerText = newText;
  }

  get text(): string {
    return this.spinnerText;
  }
}

// Factory function that matches ora API
export function spinner(text: string): SimpleSpinner {
  return new SimpleSpinner(text);
}

// Default export for direct replacement
export default spinner;
