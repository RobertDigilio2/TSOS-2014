///<reference path="deviceDriver.ts" />

/* ----------------------------------
   DeviceDriverKeyboard.ts

   Requires deviceDriver.ts

   The Kernel Keyboard Device Driver.
   ---------------------------------- */

module TSOS {

    // Extends DeviceDriver
    export class DeviceDriverKeyboard extends DeviceDriver {

        constructor() {
            // Override the base method pointers.
            super(this.krnKbdDriverEntry, this.krnKbdDispatchKeyPress);
        }

        public krnKbdDriverEntry() {
            // Initialization routine for this, the kernel-mode Keyboard Device Driver.
            this.status = "loaded";
            // More?
        }

        public krnKbdDispatchKeyPress(params) {
            // Parse the params.    TODO: Check that they are valid and osTrapError if not.
            var keyCode = params[0];
            var isShifted = params[1];
            _Kernel.krnTrace("Key code:" + keyCode + " shifted:" + isShifted);
            var chr = "";
            // Check to see if we even want to deal with the key that was pressed.
            
            //Check for backsace or tab
            if(keyCode == 38)
            {
                _KernelInputQueue.enqueue("up");
            }
            if(keyCode == 40)
            {
                _KernelInputQueue.enqueue("down");
            }
            if(keyCode == 8 || keyCode == 9)
            {
                chr = String.fromCharCode(keyCode);
                _KernelInputQueue.enqueue(chr);
            }
            if (((keyCode >= 65) && (keyCode <= 90)) ||   // A..Z
                ((keyCode >= 97) && (keyCode <= 123))) {  // a..z {
                // Determine the character we want to display.
                // Assume it's lowercase...
                chr = String.fromCharCode(keyCode + 32);
                // ... then check the shift key and re-adjust if necessary.
                if (isShifted) {
                    chr = String.fromCharCode(keyCode);
                }
                // TODO: Check for caps-lock and handle as shifted if so.
                _KernelInputQueue.enqueue(chr);
            } else if (((keyCode >= 48) && (keyCode <= 57)) ||   // digits
                        (keyCode == 32)                     ||   // space
                        (keyCode == 13)) {                       // enter
                  if(isShifted && ((keyCode >= 48) && (keyCode <= 57)))
                  {
                    switch(keyCode)
                    {
                      case 48:
                           //Close Parenthesis
                            keyCode = 41;
                            break;
                      case 49:
                            //Exclamation Point
                            keyCode = 33;
                            break;
                      case 50:
                            //At Symbol
                            keyCode = 64;
                            break;
                      case 51:
                            //Pound Symbol
                            keyCode = 35;
                            break;
                      case 52:
                            //Dollar Symbol
                            keyCode = 36;
                            break;
                      case 53:
                            //Percent
                            keyCode = 37;
                            break;
                      case 54:
                            //Hat
                            keyCode = 94;
                            break;
                      case 55:
                            //Ampersand
                            keyCode = 38;
                            break;
                      case 56:
                            //Star
                            keyCode = 42;
                            break;
                      case 57:
                            //Open Parenthesis
                            keyCode = 40;
                            break;
                      default:
                            keyCode = keyCode;
                            break
                     }
                  }
                chr = String.fromCharCode(keyCode);
                _KernelInputQueue.enqueue(chr);
            }
            else
            {
                //Handles all punctuation
                var foundPunctMark = false;
                //Semicolon
                if(keyCode == 186 && !foundPunctMark) 
                {
                    keyCode = 59;
                    if(isShifted)
                    {
                        keyCode = 58;
                    }
                    foundPunctMark = true;
                    chr = String.fromCharCode(keyCode);
                    _KernelInputQueue.enqueue(chr);
                }
                //Equals Sign
                if(keyCode == 187 && !foundPunctMark) 
                {
                    keyCode = 61;
                    if(isShifted)
                    {
                        keyCode = 43;
                    }
                    foundPunctMark = true;
                    chr = String.fromCharCode(keyCode);
                    _KernelInputQueue.enqueue(chr);
                }
                //Comma
                if(keyCode == 188 && !foundPunctMark) 
                {
                    keyCode = 44;
                    if(isShifted)
                    {
                        keyCode = 60;
                    }
                    foundPunctMark = true;
                    chr = String.fromCharCode(keyCode);
                    _KernelInputQueue.enqueue(chr);
                }
                //Dash
                if(keyCode == 189 && !foundPunctMark) 
                {
                    keyCode = 45;
                    if(isShifted)
                    {
                        keyCode = 95;
                    }
                    foundPunctMark = true;
                    chr = String.fromCharCode(keyCode);
                    _KernelInputQueue.enqueue(chr);
                }
                //Period
                if(keyCode == 190 && !foundPunctMark) 
                {
                    keyCode = 46;
                    if(isShifted)
                    {
                        keyCode = 62;
                    }
                    foundPunctMark = true;
                    chr = String.fromCharCode(keyCode);
                    _KernelInputQueue.enqueue(chr);
                }
                //Forward Slash
                if(keyCode == 191 && !foundPunctMark) 
                {
                    keyCode = 47;
                    if(isShifted)
                    {
                        keyCode = 63;
                    }
                    foundPunctMark = true;
                    chr = String.fromCharCode(keyCode);
                    _KernelInputQueue.enqueue(chr);
                }
                //Tilda
                if(keyCode == 192 && !foundPunctMark)
                {
                    keyCode = 96;
                    if(isShifted)
                    {
                        keyCode = 126;
                    }
                    foundPunctMark = true;
                    chr = String.fromCharCode(keyCode);
                    _KernelInputQueue.enqueue(chr) ;
                }
                //Open Bracket
                if(keyCode == 219 && !foundPunctMark)
                {
                    keyCode = 91;
                    if(isShifted)
                    {
                        keyCode = 123;
                    }
                    foundPunctMark = true;
                    chr = String.fromCharCode(keyCode);
                    _KernelInputQueue.enqueue(chr);
                }
                //Backslash
                if(keyCode == 220 && !foundPunctMark)
                {
                    keyCode = 92;
                    if(isShifted)
                    {
                        keyCode = 124;
                    }
                    foundPunctMark = true;
                    chr = String.fromCharCode(keyCode);
                    _KernelInputQueue.enqueue(chr);
                }
                //Close Bracket
                if(keyCode == 221 && !foundPunctMark) 
                {
                    keyCode = 93;
                    if(isShifted)
                    {
                        keyCode = 125;
                    }
                    foundPunctMark = true;
                    chr = String.fromCharCode(keyCode);
                    _KernelInputQueue.enqueue(chr);
                }
                //Apostrophe
                if(keyCode == 222 && !foundPunctMark) 
                {
                    keyCode = 39;
                    if(isShifted)
                    {
                        keyCode = 34;
                    }
                    foundPunctMark = true;
                    chr = String.fromCharCode(keyCode);
                    _KernelInputQueue.enqueue(chr);
                }
            }
        }
    }
}
