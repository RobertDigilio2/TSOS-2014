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
var APP_NAME = "ROBOS";
var APP_VERSION = "2.25";

//The Status
var STATUS = "Type command: status <string> to change your status";

//Status Bar variables
var _BarCanvas = null;
var _BarHandler = null;
var _BarContext = null;

//Memory variables
var _MemoryHandler = null;
var _Memory = Array.apply(null, new Array(768)).map(String.prototype.valueOf, "00");
var _MemoryElement = null;

var _ProgramInput = null;

var CPU_CLOCK_INTERVAL = 100;
var _Processes = new Array();
var _currentProcess = 0;
var _savePID = 1;

var _ReadyQueue = null;

var TIMER_IRQ = 0;
var _SteppingMode = false;

var KEYBOARD_IRQ = 1;

//
// Global Variables
//
var _CPU;

var _OSclock = 0;

var _Mode = 0;

var _Canvas = null;
var _DrawingContext = null;
var _DefaultFontFamily = "sans";
var _DefaultFontSize = 13;
var _FontHeightMargin = 4;

var _Trace = true;

// The OS Kernel and its queues.
var _Kernel;
var _KernelInterruptQueue = null;
var _KernelBuffers = null;
var _KernelInputQueue = null;

// Standard input and output
var _StdIn = null;
var _StdOut = null;

// UI
var _Console;
var _OsShell;

// At least this OS is not trying to kill you. (Yet.)
var _SarcasticMode = false;

// Global Device Driver Objects - page 12
var _krnKeyboardDriver = null;

var _hardwareClockID = null;

// For testing...
var _GLaDOS = null;
var Glados = null;

var onDocumentLoad = function () {
    TSOS.Control.hostInit();
};
