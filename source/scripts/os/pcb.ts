module TSOS{
    export class PCB{
        public PC: number = 0;
        public Acc: number = 0;
        public Xreg: number = 0;
        public Yreg: number = 0;
        public Zflag: number = 0;
        public base: number = 0;
        public limit: number = 0;
        public PID: number = 0;

        public PCB( PC: number = 0, Acc: number = 0, Xreg: number = 0, Yreg: number = 0, Zflag: number = 0)
        {
            this.PC = PC;
            this.Acc = Acc;
            this.Xreg = Xreg;
            this.Yreg = Yreg;
            this.Zflag = Zflag;
        }

        //Loads values of PCB to CPU
        public loadToCPU()
        {
            _CPU.load(this.PC, this.Acc, this.Xreg, this.Yreg, this.Zflag, this.base, this.limit);
        }
        
        //Method to store the parameters to this PCB
        public storeVals(PC, Acc, Xreg, Yreg, Zflag)
        {
            this.PC= PC;
            this.Acc = Acc;
            this.Xreg = Xreg;
            this.Yreg = Yreg;
            this.Zflag = Zflag;
        }
        
        public setPID(val)
        {
            this.PID = val;
        }

        public setPCval(val)
        {
            this.PC = val;
        }
        
        public setLimit(val)
        {
            this.limit = val;
        }

        public setBase(val)
        {
            this.base = val;
        }

        public printToScreen()
        {
            _MemoryElement.value += "\n";
            _MemoryElement.value += "PC: " + this.PC + "|";
            _MemoryElement.value += "Acc: " + this.Acc + "|";
            _MemoryElement.value += "Xreg: " + this.Xreg + "|";
            _MemoryElement.value += "Yreg: " + this.Yreg + "|";
            _MemoryElement.value += "Zflag: " + this.Zflag + "|";
            _MemoryElement.value += "Base: " + this.base + "|";
            _MemoryElement.value += "Limit: " + this.limit + "|";
            _MemoryElement.value += "PCBID: " + this.PID;
        }
    }
}
