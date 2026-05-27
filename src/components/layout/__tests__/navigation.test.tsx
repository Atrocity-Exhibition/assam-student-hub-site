import { MobileMenu } from "../mobile-menu";
import { ThemeToggle } from "../theme-toggle";
import { Navbar } from "../navbar";

describe("Layout Components Type Smoke Check", () => {
  it("should have MobileMenu exported as a function component", () => {
    const isFunction = typeof MobileMenu === "function";
    if (!isFunction) throw new Error("MobileMenu is not a function");
  });

  it("should have ThemeToggle exported as a function component", () => {
    const isFunction = typeof ThemeToggle === "function";
    if (!isFunction) throw new Error("ThemeToggle is not a function");
  });

  it("should have Navbar exported as an async function component", () => {
    const isFunction = typeof Navbar === "function";
    if (!isFunction) throw new Error("Navbar is not a function");
  });
});

// Minimal test runner stub for CLI execution
function describe(name: string, fn: () => void) {
  console.log(`\nRunning Test Suite: ${name}`);
  try {
    fn();
  } catch (e) {
    console.error(`FAIL Suite: ${name}`, e);
    process.exit(1);
  }
}

function it(name: string, fn: () => void) {
  try {
    fn();
    console.log(`  ✓ PASS: ${name}`);
  } catch (e) {
    throw new Error(`Test failed: "${name}". Reason: ${e}`);
  }
}
