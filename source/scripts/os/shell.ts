///<reference path="shellCommand.ts" />
///<reference path="userCommand.ts" />
///<reference path="../utils.ts" />

/* ------------
   Shell.ts

   The OS Shell - The "command line interface" (CLI) for the console.
   ------------ */

// TODO: Write a base class / prototype for system services and let Shell inherit from it.

module TSOS {
    export class Shell {
        // Properties
        public promptStr = ">";
        public commandList = [];
        public curses = "[fuvg],[cvff],[shpx],[phag],[pbpxfhpxre],[zbgureshpxre],[gvgf]";
        public apologies = "[sorry]";

        constructor() {

        }

        public init() {
            var sc = null;
            //
            // Load the command list.

            // ver
            sc = new ShellCommand(this.shellVer,
                                  "ver",
                                  "- Displays the current version data.");
            this.commandList[this.commandList.length] = sc;

            // help
            sc = new ShellCommand(this.shellHelp,
                                  "help",
                                  "- This is the help command. Seek help.");
            this.commandList[this.commandList.length] = sc;

            // shutdown
            sc = new ShellCommand(this.shellShutdown,
                                  "shutdown",
                                  "- Shuts down the virtual OS but leaves the underlying hardware simulation running.");
            this.commandList[this.commandList.length] = sc;

            // cls
            sc = new ShellCommand(this.shellCls,
                                  "cls",
                                  "- Clears the screen and resets the cursor position.");
            this.commandList[this.commandList.length] = sc;

            // man <topic>
            sc = new ShellCommand(this.shellMan,
                                  "man",
                                  "<topic> - Displays the MANual page for <topic>.");
            this.commandList[this.commandList.length] = sc;

            // trace <on | off>
            sc = new ShellCommand(this.shellTrace,
                                  "trace",
                                  "<on | off> - Turns the OS trace on or off.");
            this.commandList[this.commandList.length] = sc;

            // rot13 <string>
            sc = new ShellCommand(this.shellRot13,
                                  "rot13",
                                  "<string> - Does rot13 obfuscation on <string>.");
            this.commandList[this.commandList.length] = sc;

            // prompt <string>
            sc = new ShellCommand(this.shellPrompt,
                                  "prompt",
                                  "<string> - Sets the prompt.");
            this.commandList[this.commandList.length] = sc;
            
            //load
            sc = new ShellCommand(this.shellLoad, "load", "- Command to load program");
            this.commandList[this.commandList.length] = sc;
            
            //run
            sc = new ShellCommand(this.shellRun, "run","<int> - Runs the process with the given pid");
            this.commandList[this.commandList.length] = sc;
            //step
            sc = new ShellCommand(this.shellStep, "step","<int> -Runs the process in single step mode")
            this.commandList[this.commandList.length] = sc;
            
            //flush memory
            sc = new ShellCommand(this.shellClearMem, "flushmem", "-Flushes contents in memory");
            this.commandList[this.commandList.length] = sc;
            
            //bsod
            sc = new ShellCommand(this.shellBSOD, "bsod", "- Causes bsod");
            this.commandList[this.commandList.length] = sc;
            
            //status
            sc = new ShellCommand(this.shellStatusUpdate, "status", "<string> - Sets the status");
            this.commandList[this.commandList.length] = sc;
            
            //Date&Time
           sc = new ShellCommand(this.shellDateTime, "datetime", "- Self-explanatory.");
            this.commandList[this.commandList.length] = sc;

            // processes - list the running processes and their IDs
            // kill <id> - kills the specified process id.

            //
            // Display the initial prompt.
            this.putPrompt();
        }

        public putPrompt() {
            _StdOut.putText(this.promptStr);
        }

        public handleInput(buffer) {
            _Kernel.krnTrace("Shell Command~" + buffer);
            //
            // Parse the input...
            //
            var userCommand = new UserCommand();
            userCommand = this.parseInput(buffer);
            // ... and assign the command and args to local variables.
            var cmd = userCommand.command;
            var args = userCommand.args;
            //
            // Determine the command and execute it.
            //
            // JavaScript may not support associative arrays in all browsers so we have to
            // iterate over the command list in attempt to find a match.  TODO: Is there a better way? Probably.
            var index = 0;
            var found = false;
            var fn = undefined;
            while (!found && index < this.commandList.length) {
                if (this.commandList[index].command === cmd) {
                    found = true;
                    fn = this.commandList[index].func;
                } else {
                    ++index;
                }
            }
            if (found) {
                this.execute(fn, args);
            } else {
                // It's not found, so check for curses and apologies before declaring the command invalid.
                if (this.curses.indexOf("[" + Utils.rot13(cmd) + "]") >= 0) {     // Check for curses. {
                    this.execute(this.shellCurse);
                } else if (this.apologies.indexOf("[" + cmd + "]") >= 0) {    // Check for apologies. {
                    this.execute(this.shellApology);
                } else { // It's just a bad command. {
                    this.execute(this.shellInvalidCommand);
                }
            }
        }

        // args is an option parameter, ergo the ? which allows TypeScript to understand that
        public execute(fn, args?) {
            // We just got a command, so advance the line...
            _StdOut.advanceLine();
            // ... call the command function passing in the args...
            fn(args);
            // Check to see if we need to advance the line again
            if (_StdOut.currentXPosition > 0) {
                _StdOut.advanceLine();
            }
            // ... and finally write the prompt again.
            this.putPrompt();
        }

        public parseInput(buffer) {
            var retVal = new UserCommand();

            // 1. Remove leading and trailing spaces.
            buffer = Utils.trim(buffer);

            // 2. Lower-case it.
            buffer = substring(0, buffer.indexOf(" ")).toLowerCase() + buffer.substring(buffer.indexOf(" ");

            // 3. Separate on spaces so we can determine the command and command-line args, if any.
            var tempList = buffer.split(" ");

            // 4. Take the first (zeroth) element and use that as the command.
            var cmd = tempList.shift();  // Yes, you can do that to an array in JavaScript.  See the Queue class.
            // 4.1 Remove any left-over spaces.
            cmd = Utils.trim(cmd);
            // 4.2 Record it in the return value.
            retVal.command = cmd;

            // 5. Now create the args array from what's left.
            for (var i in tempList) {
                var arg = Utils.trim(tempList[i]);
                if (arg != "") {
                    retVal.args[retVal.args.length] = tempList[i];
                }
            }
            return retVal;
        }

        //
        // Shell Command Functions.  Again, not part of Shell() class per se', just called from there.
        //
        public shellInvalidCommand() {
            _StdOut.putText("Invalid Command. ");
            if (_SarcasticMode) {
                _StdOut.putText("Duh. Go back to your Speak & Spell.");
            } else {
                _StdOut.putText("Type 'help' for, well... help.");
            }
        }

        public shellCurse() {
            _StdOut.putText("Oh, so that's how it's going to be, eh? Fine.");
            _StdOut.advanceLine();
            _StdOut.putText("Bitch.");
            _SarcasticMode = true;
        }

        public shellApology() {
           if (_SarcasticMode) {
              _StdOut.putText("Okay. I forgive you. This time.");
              _SarcasticMode = false;
           } else {
              _StdOut.putText("For what?");
           }
        }

        public shellVer(args) {
            _StdOut.putText(APP_NAME + " version " + APP_VERSION);
        }

        public shellHelp(args) {
            _StdOut.putText("Commands:");
            for (var i in _OsShell.commandList) {
                _StdOut.advanceLine();
                _StdOut.putText("  " + _OsShell.commandList[i].command + " " + _OsShell.commandList[i].description);
            }
        }

        public shellShutdown(args) {
             _StdOut.putText("Shutting down...");
             // Call Kernel shutdown routine.
            _Kernel.krnShutdown();
            // TODO: Stop the final prompt from being displayed.  If possible.  Not a high priority.  (Damn OCD!)
        }

        public shellCls(args) {
            _StdOut.clearScreen();
            _StdOut.resetXY();
        }

        public shellMan(args) {
            if (args.length > 0) {
                var topic = args[0];
                switch (topic) {
                    case "help":
                        _StdOut.putText("Help displays a list of (hopefully) valid commands.");
                        break;
                    default:
                        _StdOut.putText("No manual entry for " + args[0] + ".");
                }
            } else {
                _StdOut.putText("Usage: man <topic>  Please supply a topic.");
            }
        }

        public shellTrace(args) {
            if (args.length > 0) {
                var setting = args[0];
                switch (setting) {
                    case "on":
                        if (_Trace && _SarcasticMode) {
                            _StdOut.putText("Trace is already on, dumbass.");
                        } else {
                            _Trace = true;
                            _StdOut.putText("Trace ON");
                        }

                        break;
                    case "off":
                        _Trace = false;
                        _StdOut.putText("Trace OFF");
                        break;
                    default:
                        _StdOut.putText("Invalid arguement.  Usage: trace <on | off>.");
                }
            } else {
                _StdOut.putText("Usage: trace <on | off>");
            }
        }

        public shellRot13(args) {
            if (args.length > 0) {
                // Requires Utils.ts for rot13() function.
                _StdOut.putText(args.join(' ') + " = '" + Utils.rot13(args.join(' ')) +"'");
            } else {
                _StdOut.putText("Usage: rot13 <string>  Please supply a string.");
            }
        }

        public shellPrompt(args) {
            if (args.length > 0) {
                _OsShell.promptStr = args[0];
            } else {
                _StdOut.putText("Usage: prompt <string>  Please supply a string.");
            }
        }
        //Function to load program
        public shellLoad()
        {
            var aProgram = _ProgramInput.value.toString().split(" ");
            var errorFlag = 0;
            var isValid = true;

            for(var j = 0; j < aProgram.length; j++) 
             {
                var text = aProgram[j];
                for (var i = 0; i < text.length; i++) 
                 {
                     var charCode = text.charCodeAt(i);
                     var char = text[i];
                     if ((charCode >= 48 && char <= 57) || ((charCode >= 65 && charCode <= 70) && char == char.toUpperCase()))
                      {
                          isValid = isValid && true;
                      }
                     else 
                      {
                          isValid = false;
                     }
                }
                if(text.length > 2 || text.length == 0)
                {
                    isValid = false;
                }
            }

            if(isValid) 
             {
                //check the ready queue
                var readyFlag = false;
                if(!_ReadyQueue.isEmpty()) {
                    for (var k = 0; k < _ReadyQueue.getSize(); j++) {
                        var targetProcess = _ReadyQueue.dequeue();
                        var targetPID = targetProcess.getPID();
                        if (_savePID == targetPID) {
                            readyFlag = true;
                        }
                        _ReadyQueue.enqueue(targetProcess);
                    }
                 }
                if (_savePID == _currentProcess || readyFlag == true) {
                    errorFlag = 2;
                 }
                else {
                    var test = new PCB();
                    test.setPID(_savePID);
                    test.setPCval(256 * (_savePID - 1))
                    if (_savePID == 3) {
                        _savePID = 1;
                    }
                    else {
                        _savePID = _savePID + 1;
                    }
                    //Handle multiple Processes
                    if (_Processes.length < 3) {

                        _Processes = _Processes.concat(test);
                        _currentProcess = test.PID;
                    }
                    else {
                        _Processes[test.PID] = test;
                        _currentProcess = test.PID;
                    }
                    var offset = 256 * (_Processes.length - 1);
                    for (var h = 0; h < aProgram.length; h++) {
                        _MemoryHandler.load(aProgram[h], h + offset);
                        _MemoryElement.focus();
                        _Canvas.focus();
                    }

                    _StdOut.putText("Program is valid and has loaded successfully. The PID is = " + test.PID);
                    _MemoryHandler.updateMem();
                 }
            }
            else
            {
                errorFlag = 1;

            }
            switch(errorFlag)
            {
                case 0:
                {
                    break;
                }
                case 1:
                {
                    _StdOut.putText("Program is not valid. Use only spaces, 0-9, and A-F.");
                    break;
                }
                case 2:
                    _StdOut.putText("Program not loaded due to target being either on the ready queue or currently in the CPU.");
                    break;
            }
        }
        
        //Function to run a program
        public shellRun(pid)
        {
            if(_Processes.length >= pid)
            {
                _Processes[pid - 1].loadToCPU();
                _currentProcess = pid;
            }
           else
            {
                _StdOut.putText("No Programs loaded.");
            }
        }

        //Function to step through a program
        public shellStep(pid)
        {
            if(_Processes.length >= pid)
            {
                _Processes[pid - 1].loadToCPU;
                _CPU.isExecuting = true;
                _SteppingMode = true;
                document.getElementById("btnStep").disabled = false;
                _currentProcess = pid;
                _CPU.isExecuting = true;
            }
            else
            {
                _StdOut.putText("No Programs loaded.");
            }
        }
        
        //Function to flsuh memory
        public shellClearMem()
        {
            for(var i = 0; i < _Memory.length; i++)
            {
                _MemoryHandler.load("00",i);
            }
            _currentProcess = 0;
            _Processes = new Array<TSOS.PCB>();
            _StdOut.putText("Memory flushed");
        }
        
        //Function to cause bsod
        public shellBSOD() {
            // Call Kernel trap
            _Kernel.krnTrapError("It broke.");
        }
        
        //Function to update status
        public shellStatusUpdate(args){
            if (args.length > 0) {
                var newStatus = args[0];
                _BarHandler.updateStatus(newStatus);
                _StdOut.putText("Status Updated");
            } else {
                _StdOut.putText("Usage: status <string>  Please supply a string.");
            }
        }
        
        //Function to get Date/Time
        public shellDateTime() {
            var d = new Date();
            d.setTime(Date.now());
            var day = d.getDay();
            var _day = "";
            var mins = d.getMinutes();
            var _mins = ""
                switch(day){
                    case 0:
                        _day = "Sun.";
                        break;
                    case 1:
                        _day = "Mon.";
                        break;
                    case 2:
                        _day = "Tues.";
                        break;
                    case 3:
                        _day = "Wed.";
                        break;
                    case 4:
                        _day = "Thurs.";
                        break;
                    case 5:
                        _day = "Fri.";
                        break;
                    case 6:
                        _day = "Sat.";
                        break;
                    default:
                        "Not a valaid day."
                        break;
                }
                
                if(mins < 10)
                {
                    _mins = "0" + mins;
                }
                else
                {
                    _mins = "" + mins;
                }

            _StdOut.putText("Date: " + _day + ", " + (d.getMonth() + 1) + "/" + d.getDate() + "/" + d.getFullYear());
            _StdOut.advanceLine();
            var hours = d.getHours();
            if(hours > 12) {
                hours = hours - 12;
                _StdOut.putText("Time: " + hours + ":" + _mins + ":" + d.getSeconds() + " P.M.");
            }
            else
            {
                _StdOut.putText("Time: " + hours + ":" + d.getMinutes() + ":" + d.getSeconds() + " A.M.");
            }
        }
    }
}
