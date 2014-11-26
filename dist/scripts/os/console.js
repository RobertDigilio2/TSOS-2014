///<reference path="../globals.ts" />
/* ------------
Console.ts
Requires globals.ts
The OS Console - stdIn and stdOut by default.
Note: This is not the Shell.  The Shell is the "command line interface" (CLI) or interpreter for this console.
------------ */
var TSOS;
(function (TSOS) {
    var Console = (function () {
        function Console(currentFont, currentFontSize, currentXPosition, currentYPosition, prevEntry, prevEntryIndex, buffer) {
            if (typeof currentFont === "undefined") { currentFont = _DefaultFontFamily; }
            if (typeof currentFontSize === "undefined") { currentFontSize = _DefaultFontSize; }
            if (typeof currentXPosition === "undefined") { currentXPosition = 0; }
            if (typeof currentYPosition === "undefined") { currentYPosition = _DefaultFontSize; }
            if (typeof prevEntry === "undefined") { prevEntry = []; }
            if (typeof prevEntryIndex === "undefined") { prevEntryIndex = prevEntry.length; }
            if (typeof buffer === "undefined") { buffer = ""; }
            this.currentFont = currentFont;
            this.currentFontSize = currentFontSize;
            this.currentXPosition = currentXPosition;
            this.currentYPosition = currentYPosition;
            this.prevEntry = prevEntry;
            this.prevEntryIndex = prevEntryIndex;
            this.buffer = buffer;
        }
        Console.prototype.init = function () {
            this.clearScreen();
            this.resetXY();
        };

        Console.prototype.clearScreen = function () {
            _DrawingContext.clearRect(0, 0, _Canvas.width, _Canvas.height);
        };

        Console.prototype.resetXY = function () {
            this.currentXPosition = 0;
            this.currentYPosition = this.currentFontSize;
        };

        Console.prototype.handleInput = function () {
            while (_KernelInputQueue.getSize() > 0) {
                // Get the next character from the kernel input queue.
                var chr = _KernelInputQueue.dequeue();

                // Check to see if it's "special" (enter or ctrl-c) or "normal" (anything else that the keyboard device driver gave us).
                if (chr === String.fromCharCode(13)) {
                    // The enter key marks the end of a console command, so ...
                    // ... tell the shell ...
                    _OsShell.handleInput(this.buffer);

                    // ... and reset our buffer.
                    this.buffer = "";
                    
                    this.prevEntry[this.prevEntry.length] = this.buffer;
                    this.prevEntryIndex = this.prevEntry.length;
                    
                } else {
                    if (chr === String.fromCharCode(8)) {
                        var clearChar = this.buffer.charAt(this.buffer.length - 1);
                        this.buffer = this.buffer.substring(0, this.buffer.length - 1);
                        this.backSpace(clearChar);

                    } else {
                        //Tab
                        if (chr == String.fromCharCode(9)) {
                            var currentBuffer = this.buffer.toString();
                            var foundMatch = false;
                            var currentCommands = ["ver", "help", "shutdown", "cls", "man", "trace", "rot13", "prompt", "status", "datetime"];
 
                            for (var k = 0; k < currentCommands.length; k++) {
                                if ((this.contains(currentBuffer, currentCommands[k])) && foundMatch == false) {
                                    currentBuffer = currentCommands[k];
                                    foundMatch = true;
                                }
                            }

                            if (foundMatch) {
                                this.replaceBuffer(currentBuffer);
                            }
                        } else {
                            if (chr == "up") {
                                if (this.prevEntryIndex > 0) {
                                    var prevEntryCommand = this.prevEntry[this.prevEntryIndex - 1];
                                    this.replaceBuffer(prevEntryCommand);
                                    this.prevEntryIndex = this.prevEntryIndex - 1;
                                }
                            } else {
                                if (chr == "down") {
                                    if (this.prevEntryIndex < this.prevEntry.length - 1) {
                                        var prevEntryCommand = this.prevEntry[this.prevEntryIndex + 1];
                                        this.replaceBuffer(prevEntryCommand);
                                        this.prevEntryIndex = this.prevEntryIndex + 1;
                                    }
                                } else {
                                    // This is a "normal" character, so ...
                                    // ... draw it on the screen...
                                    //the first wrapping text attempt
                                    // if ((this.buffer.length % 47) == 0 && this.buffer.length != 0) {
                                    //   this.advanceLine();
                                    //}
                                    this.putText(chr);

                                    // ... and add it to our buffer.
                                    this.buffer += chr;
                                }
                            }
                        }
                    }
                }
                // TODO: Write a case for Ctrl-C.
            }
        };

        Console.prototype.putText = function (text) {
            // My first inclination here was to write two functions: putChar() and putString().
            // Then I remembered that JavaScript is (sadly) untyped and it won't differentiate
            // between the two.  So rather than be like PHP and write two (or more) functions that
            // do the same thing, thereby encouraging confusion and decreasing readability, I
            // decided to write one function and use the term "text" to connote string or char.
            // UPDATE: Even though we are now working in TypeScript, char and string remain undistinguished.
            if (text !== "") {
                // Draw the text at the current X and Y coordinates.
                _DrawingContext.drawText(this.currentFont, this.currentFontSize, this.currentXPosition, this.currentYPosition, text);

                // Move the current X position.
                var offset = _DrawingContext.measureText(this.currentFont, this.currentFontSize, text);
                this.currentXPosition = this.currentXPosition + offset;
            }
        };

        Console.prototype.advanceLine = function () {
            this.currentXPosition = 0;

            /*
            * Font size measures from the baseline to the highest point in the font.
            * Font descent measures from the baseline to the lowest point in the font.
            * Font height margin is extra spacing between the lines.
            */
            this.currentYPosition += _DefaultFontSize + _DrawingContext.fontDescent(this.currentFont, this.currentFontSize) + _FontHeightMargin;
            // TODO: Handle scrolling. (Project 1)
            //size of buffer is 29
        };
        Console.prototype.backSpace = function (text) {
            var length = _DrawingContext.measureText(this.currentFont, this.currentFontSize, text);
            var height = _DefaultFontSize + _FontHeightMargin;
            _DrawingContext.clearRect(this.currentXPosition - length, ((this.currentYPosition - height) + 5), length, height);
            if (this.currentXPosition > 0) {
                this.currentXPosition = this.currentXPosition - length;
            }
        };
        //Checks for smaller string in larger string
        Console.prototype.contains = function (smallString, largeString) {
            var stillMatching = true;
            if (smallString.length >= largeString.length) {
                return false;
            } else {
                for (var i = 0; i < smallString.length; i++) {
                    if (smallString.charAt(i) != largeString.charAt(i)) {
                        stillMatching = false;
                    }
                }
            }
            return stillMatching;
        };

        //Replace buffer on screen
        Console.prototype.replaceBuffer = function (text) {
            for (var i = this.buffer.length; i > 0; i--) {
                var clearChar = this.buffer.charAt(this.buffer.length - 1);
                this.buffer = this.buffer.substring(0, this.buffer.length - 1);
                this.backSpace(clearChar);
            }

            //Add new characters in buffer
            this.buffer = text;
            for (var j = 0; j < this.buffer.length; j++) {
                this.putText(this.buffer.charAt(j));
            }
        };
        return Console;
    })();
    TSOS.Console = Console;
})(TSOS || (TSOS = {}));
