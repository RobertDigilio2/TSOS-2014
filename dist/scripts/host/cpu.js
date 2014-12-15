///<reference path="../globals.ts" />
/* ------------
CPU.ts
Requires global.ts.
Routines for the host CPU simulation, NOT for the OS itself.
In this manner, it's A LITTLE BIT like a hypervisor,
in that the Document environment inside a browser is the "bare metal" (so to speak) for which we write code
that hosts our client OS. But that analogy only goes so far, and the lines are blurred, because we are using
TypeScript/JavaScript in both the host and client environments.
This code references page numbers in the text book:
Operating System Concepts 8th edition by Silberschatz, Galvin, and Gagne.  ISBN 978-0-470-12872-5
------------ */
var TSOS;
(function (TSOS) {
    var Cpu = (function () {
        function Cpu(PC, Acc, Xreg, Yreg, Zflag, runningCycleCount, base, limit, isExecuting) {
            if (typeof PC === "undefined") { PC = 0; }
            if (typeof Acc === "undefined") { Acc = 0; }
            if (typeof Xreg === "undefined") { Xreg = 0; }
            if (typeof Yreg === "undefined") { Yreg = 0; }
            if (typeof Zflag === "undefined") { Zflag = 0; }
            if (typeof runningCycleCount === "undefined") { runningCycleCount = 0; }
            if (typeof base === "undefined") { base = 0; }
            if (typeof limit === "undefined") { limit = 0; }
            if (typeof isExecuting === "undefined") { isExecuting = false; }
            this.PC = PC;
            this.Acc = Acc;
            this.Xreg = Xreg;
            this.Yreg = Yreg;
            this.Zflag = Zflag;
            this.runningCycleCount = runningCycleCount;
            this.base = base;
            this.limit = limit;
            this.isExecuting = isExecuting;
        }
        
        Cpu.prototype.init = function () {
            this.PC = 0;
            this.Acc = 0;
            this.Xreg = 0;
            this.Yreg = 0;
            this.Zflag = 0;
            this.isExecuting = false;
        };

        Cpu.prototype.cycle = function () {
            _Kernel.krnTrace('CPU cycle');
            //context swap
            if ((this.runningCycleCount % _quantum) == 0 && _ReadyQueue.getSize() > 0 && this.runningCycleCount > 0) {
                if (_currentProcess == 0) {
                    _Kernel.krnTrace('Completed Program ' + _currentProcess);
                    var process = _ReadyQueue.dequeue();
                    process.loadToCPU();
                    _currentProcess = process.PID;
                    _Kernel.krnTrace('Loading Program ' + _currentProcess);
                    this.runningCycleCount = 0;
                } else {
                    _Kernel.krnTrace('Context Swap from ' + _currentProcess);
                    this.contextSwitch();
                    this.runningCycleCount = 0;
                }
            } else {
                if (_currentProcess == 0 && _ReadyQueue.getSize() == 0) {
                    _Kernel.krnTrace('Completed all execution');
                    this.isExecuting = false;
                } else {
                    _Kernel.krnTrace('CPU cycle');
                    this.handleCommand(_MemoryHandler.read(this.PC));
                    this.runningCycleCount = this.runningCycleCount + 1;
                }
            }
        };
        
       //Updates UI
       Cpu.prototype.updateUI = function () {
            _MemoryElement.value += "\n \n CPU \n";
            _MemoryElement.value += "PC: " + this.PC + "\n";
            _MemoryElement.value += "Acc: " + this.Acc + "\n";
            _MemoryElement.value += "Xreg: " + this.Xreg + "\n";
            _MemoryElement.value += "Yreg: " + this.Yreg + "\n";
            _MemoryElement.value += "Zflag: " + this.Zflag + "\n";
        };

       //Loads CPU with specified values
        Cpu.prototype.load = function (PC, Acc, Xreg, Yreg, Zflag, base, limit) {
            this.PC = PC;
            this.Acc = Acc;
            this.Xreg = Xreg;
            this.Yreg = Yreg;
            this.Zflag = Zflag;
            this.base = base;
            this.limit = limit;
        };

        //Stores current CPU values to PID
        Cpu.prototype.storeInPCB = function (PID) {
            _Processes[PID - 1].storeVals(this.PC, this.Acc, this.Xreg, this.Yreg, this.Zflag);
        };

        Cpu.prototype.contextSwitch = function () {
            this.storeInPCB(_currentProcess);
            _ReadyQueue.enqueue(_Processes[_currentProcess - 1]);
            var nextProcess = _ReadyQueue.dequeue();
            nextProcess.loadToCPU();
            _currentProcess = nextProcess.PID;
        };

        Cpu.prototype.checkbounds = function (memLoc) {
            return memLoc >= this.base && memLoc <= this.limit;
        };

        //Handles disassembly command
        Cpu.prototype.handleCommand = function (command) {
            switch (command) {
                case "AC": {
                    //Load y register from memory
                    var oldPC = this.PC;
                    this.PC = parseInt("0x" + _MemoryHandler.read(this.PC + 2) + _MemoryHandler.read(this.PC + 1));
                    if (this.checkbounds(this.PC)) {
                        this.Yreg = parseInt("0x" + _MemoryHandler.read(this.PC));
                        this.PC = oldPC + 3;
                        _MemoryHandler.updateMem();
                    } else {
                        this.PC = oldPC;
                        _StdOut.putText("Index out of bounds error on process " + _currentProcess);
                        this.storeInPCB(_currentProcess);
                        _currentProcess = 0;
                    }
                    break;
                }
                case "AD": {
                    //Load from memory
                    var oldPC = this.PC;
                    this.PC = parseInt("0x" + _MemoryHandler.read(this.PC + 2) + _MemoryHandler.read(this.PC + 1));
                    if (this.checkbounds(this.PC)) {
                        this.Acc = parseInt("0x" + _MemoryHandler.read(this.PC));
                        this.PC = oldPC + 3;
                        _MemoryHandler.updateMem();
                    } else {
                        this.PC = oldPC;
                        _StdOut.putText("Index out of bounds error on process " + _currentProcess);
                        this.storeInPCB(_currentProcess);
                        _currentProcess = 0;
                    }
                    break;
                }
                case "AE": {
                    //Load x register from memory
                    var oldPC = this.PC;
                    this.PC = parseInt("0x" + _MemoryHandler.read(this.PC + 2) + _MemoryHandler.read(this.PC + 1));
                    if (this.checkbounds(this.PC)) {
                        this.Xreg = parseInt("0x" + _Memory[this.PC]);
                        this.PC = oldPC + 3;
                        _MemoryHandler.updateMem();
                    } else {
                        this.PC = oldPC;
                        _StdOut.putText("Index out of bounds error on process " + _currentProcess);
                        this.storeInPCB(_currentProcess);
                        _currentProcess = 0;
                    }
                    break;
                }
                case "A0": {
                    //Load constant into y register
                    this.Yreg = parseInt("0x" + (_MemoryHandler.read(this.PC + 1)));
                    this.PC = this.PC + 2;
                    _MemoryHandler.updateMem();
                    break;
                }
                case "A2": {
                    //Load constant into x register
                    this.Xreg = parseInt("0x" + (_MemoryHandler.read(this.PC + 1)));
                    this.PC = this.PC + 2;
                    _MemoryHandler.updateMem();
                    break;
                }
                case "A9": {
                    //Load a constant
                    this.Acc = parseInt("0x" + (_MemoryHandler.read(this.PC + 1)));
                    this.PC = this.PC + 2;
                    _MemoryHandler.updateMem();
                    break;
                }
                case "D0": {
                    //BEQ if z flag is not set, branch
                    if (this.Zflag == 0) {
                        var offset = parseInt("0x" + _MemoryHandler.read(this.PC + 1));
                        this.PC = this.PC + offset;
                        if (this.PC >  + ((_currentProcess - 1) * 256)) {
                            this.PC = this.PC - 255;
                            if (!this.checkbounds(this.PC)) {
                                this.PC = this.PC + 255;
                                _StdOut.putText("Index out of bounds error on process " + _currentProcess);
                                this.storeInPCB(_currentProcess);
                                _currentProcess = 0;
                            }
                        } else {
                            this.PC = this.PC + 1;
                            if (!this.checkbounds(this.PC)) {
                                this.PC = this.PC - 1;
                                _StdOut.putText("Index out of bounds error on process " + _currentProcess);
                                this.storeInPCB(_currentProcess);
                                _currentProcess = 0;
                            }
                        }
                        this.PC = this.PC + 1;
                    } else {
                        this.PC = this.PC + 2;
                    }
                    _MemoryHandler.updateMem();
                    break;
                }
                case "EA": {
                    //Nothing op code
                    this.PC = this.PC + 1;
                    break;
                }
                case "EC": {
                    //Equals compare of memory to the Xreg
                    //First get memory variable
                    var oldPC = this.PC;
                    this.PC = parseInt("0x" + _MemoryHandler.read(this.PC + 2) + _MemoryHandler.read(this.PC + 1));
                    if (this.checkbounds(this.PC)) {
                        var temp = parseInt("0x" + _MemoryHandler.read(this.PC));
                    
                        if (temp == this.Xreg) {
                            this.Zflag = 1;
                        } else {
                            this.Zflag = 0;
                        }
                        this.PC = oldPC + 3;
                        _MemoryHandler.updateMem();
                    } else {
                        this.PC = oldPC;
                        _StdOut.putText("Index out of bounds error on process " + _currentProcess);
                        this.storeInPCB(_currentProcess);
                        _currentProcess = 0;
                    }
                    break;
                }
                case "EE": {
                    var oldPC = this.PC;
                    this.PC = parseInt("0x" + _MemoryHandler.read(this.PC + 2) + _MemoryHandler.read(this.PC + 1));
                    if (this.checkbounds(this.PC)) {
                        var temp = parseInt("0x" + _MemoryHandler.read(this.PC));
                        temp = temp + 1;
                        _MemoryHandler.load(temp, this.PC);
                        _MemoryHandler.updateMem();
                        this.PC = oldPC + 3;
                    } else {
                        this.PC = oldPC;
                        _StdOut.putText("Index out of bounds error on process " + _currentProcess);
                        this.storeInPCB(_currentProcess);
                        _currentProcess = 0;
                    }
                    break;
                }
                case "FF": {
                    //System Call, check the Xreg
                    if (this.Xreg == 2) {
                        //Print the yreg to the screen
                        var i = 0;
                        while (_MemoryHandler.read(this.Yreg + i) != "00" && i < 256) {
                            var charCode = (parseInt("0x" + _MemoryHandler.read(this.Yreg + i).toString()));
                            var char = String.fromCharCode(charCode);
                            _StdOut.putText(char);
                            i++;
                        }
                    }
                    if (this.Xreg == 1) {
                        _StdOut.putText("" + this.Yreg);
                    }
                    _MemoryHandler.updateMem();
                    this.PC += 1;
                    break;
                }
                case "00": {
                    //Break
                    _CPU.storeInPCB(_currentProcess);
                    _MemoryHandler.updateMem();
                    document.getElementById("btnStep").disabled = true;
                    _currentProcess = 0;
                    break;
                }
                case "6D": {
                    //Add with carry
                    var oldPC = this.PC;
                    this.PC = parseInt("0x" + _MemoryHandler.read(this.PC + 2) + _MemoryHandler.read(this.PC + 1));
                    this.Acc += parseInt("0x" + _MemoryHandler.read(this.PC));
                    this.PC = oldPC + 3;
                    _MemoryHandler.updateMem();
                    break;
                }
                case "8D": {
                    //Store to memory
                    var memLoc = parseInt("0x" + _MemoryHandler.read(this.PC + 2) +_MemoryHandler.read(this.PC + 1));
                    if (this.checkbounds(memLoc)) {
                        if (this.Acc < 16) {
                            _MemoryHandler.load(("0" + this.Acc), memLoc);
                        } else {
                            _MemoryHandler.load(this.Acc, memLoc);
                        }
                        this.PC += 3;
                        _MemoryHandler.updateMem();
                    } else {
                        _StdOut.putText("Index out of bounds error on process " + _currentProcess);
                        this.storeInPCB(_currentProcess);
                        _currentProcess = 0;
                    }
                    break;
                }
                default: {
                    //Not a valid hexcode
                    _DrawingContext.putText("Not valid");
                    _DrawingContext.advanceLine();
                    this.isExecuting = false;
                    _MemoryHandler.updateMem();
                    break;
                }
            }
        };
        return Cpu;
    })();
    TSOS.Cpu = Cpu;
})(TSOS || (TSOS = {}));
