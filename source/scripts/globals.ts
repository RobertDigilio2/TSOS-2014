/* ------------
   Globals.ts

   Global CONSTANTS and _Variables.
   (Global over both the OS and Hardware Simulation / Host.)

   This code references page numbers in the text book:
   Operating System Concepts 8th edition by Silberschatz, Galvin, and Gagne.  ISBN 978-0-470-12872-5
   ------------ */

//
// Global "CONSTANTS" (There is currently no const or final or readonly type annotation in TypeScript.)
// TODO: Make a global object and use that instead of the "_" naming convention in the global namespace.
//
var APP_NAME: string    = "ROBOS";   // 'cause Bob and I were at a loss for a better name.
var APP_VERSION: string = "2.25";   // What did you expect?

//The Status
var STATUS: string = "Type command: status <string> to change your status";

//Status Bar variables
var _BarCanvas: HTMLCanvasElement = null;
var _BarHandler = null;
var _BarContext = null;

//Memory variables
var _MemoryHandler = null;
var _Memory = Array.apply(null, new Array(768)).map(String.prototype.valueOf,"00");
var _MemoryElement = null;

var _ProgramInput = null;

var CPU_CLOCK_INTERVAL: number = 100;   // This is in ms, or milliseconds, so 1000 = 1 second.
var _Processes = new Array<TSOS.PCB>();
var _currentProcess = 0;
var _savePID = 1;

var _ReadyQueue = null;
var _quantum = 6;

var TIMER_IRQ: number = 0;
var _SteppingMode = false;


var KEYBOARD_IRQ: number = 1;


//
// Global Variables
//
var _CPU: TSOS.Cpu;  // Utilize TypeScript's type annotation system to ensure that _CPU is an instance of the Cpu class.

var _OSclock: number = 0;  // Page 23.

var _Mode: number = 0;     // (currently unused)  0 = Kernel Mode, 1 = User Mode.  See page 21.

var _Canvas: HTMLCanvasElement = null;  // Initialized in hostInit().
var _DrawingContext = null;             // Initialized in hostInit().
var _DefaultFontFamily = "sans";        // Ignored, I think. The was just a place-holder in 2008, but the HTML canvas may have use for it.
var _DefaultFontSize = 13;
var _FontHeightMargin = 4;              // Additional space added to font size when advancing a line.


var _Trace: boolean = true;  // Default the OS trace to be on.

// The OS Kernel and its queues.
var _Kernel: TSOS.Kernel;
var _KernelInterruptQueue = null;
var _KernelBuffers: any[] = null;
var _KernelInputQueue = null;

// Standard input and output
var _StdIn  = null;
var _StdOut = null;

// UI
var _Console: TSOS.Console;
var _OsShell: TSOS.Shell;

// At least this OS is not trying to kill you. (Yet.)
var _SarcasticMode: boolean = false;

// Global Device Driver Objects - page 12
var _krnKeyboardDriver = null;

var _hardwareClockID: number = null;

// For testing...
var _GLaDOS: any = null;
var Glados: any = null;

var onDocumentLoad = function() {
	TSOS.Control.hostInit();
};
