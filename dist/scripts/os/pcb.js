var TSOS;
(function (TSOS) {
    var PCB = (function () {

        function PCB() {
            this.PC = 0;
            this.Acc = 0;
            this.Xreg = 0;
            this.Yreg = 0;
            this.Zflag = 0;
        }

        PCB.prototype.PCB = function (PC, Acc, Xreg, Yreg, Zflag) {
            if (typeof PC === "undefined") { PC = 0; }
            if (typeof Acc === "undefined") { Acc = 0; }
            if (typeof Xreg === "undefined") { Xreg = 0; }
            if (typeof Yreg === "undefined") { Yreg = 0; }
            if (typeof Zflag === "undefined") { Zflag = 0; }
            this.PC = PC;
            this.Acc = Acc;
            this.Xreg = Xreg;
            this.Yreg = Yreg;
            this.Zflag = Zflag;
        };
        
        //Loads values of PCB to CPU
        PCB.prototype.loadToCPU = function () {
            _CPU.load(this.PC, this.Acc, this.Xreg, this.Yreg, this.Zflag);
        };

        //Method to store the parameters to this PCB
        PCB.prototype.storeVals = function (PC, Acc, Xreg, Yreg, Zflag) {
            this.PC = PC;
            this.Acc = Acc;
            this.Xreg = Xreg;
            this.Yreg = Yreg;
            this.Zflag = Zflag;
        };

        PCB.prototype.printToScreen = function () {
            _MemoryElement.value += "\n";
            _MemoryElement.value += "PC: " + this.PC + "\n";
            _MemoryElement.value += "Acc: " + this.Acc + "\n";
            _MemoryElement.value += "Xreg: " + this.Xreg + "\n";
            _MemoryElement.value += "Yreg: " + this.Yreg + "\n";
            _MemoryElement.value += "Zflag: " + this.Zflag + "\n";
        };
        return PCB;
    })();
    TSOS.PCB = PCB;
})(TSOS || (TSOS = {}));