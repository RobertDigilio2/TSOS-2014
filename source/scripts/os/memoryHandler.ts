module TSOS {
    export class memory
    {
        public memory()
        {
            var accumulator = 0;
        }

        public load(m, index)
        {
            if(typeof(m) == typeof(123))
            {
                //Hex conversion
                var first = 0;
                if(m > 16) {
                    first = Math.floor(m / 16);
                }
                else
                {
                    first = 0;
                }
                var second = m % 16;
                var firstChar = this.ConvertToString(first);
                var secondChar = this.ConvertToString(second);

                _Memory[index] = firstChar + secondChar;
                this.updateMem();
            }
            else
            {
                _Memory[index] = m;
                this.updateMem();
            }

        }
        
        //Read a value from memory at given index
        public read(index)
        {
            return _Memory[index];
        }

        //Updates visual memory
        public updateMem()
        {
            _MemoryElement.value = "";
            var offset = 256 * (_currentProcess - 1);
            if(offset < 0)
            {
                offset = 0;
            }
            for(var i = 0; i < 256; i++)
            {
                _MemoryElement.value = _MemoryElement.value + _Memory[i + offset] + " ";
            }

                _MemoryElement.value = _MemoryElement.value + "\nStarting Memory Location = " + offset + "\n";

            _CPU.updateUI();
            if(_Processes.length > 0)
            {
                for(var j = 0;  j < _Processes.length; j++)
                {
                    _MemoryElement.value += "\n";
                    _Processes[j].printToScreen();
                }
            }
        }

        //Converts hex digit to string
        public ConvertToString(digit)
        {
            switch(digit)
            {
                case 10:
                {
                    return "A";
                    break;
                }
                case 11:
                {
                    return "B";
                    break;
                }
                case 12:
                {
                    return "C";
                    break;
                }
                case 13:
                {
                    return "D";
                    break;
                }
                case 14:
                {
                    return "E";
                    break;
                }
                case 15:
                {
                    return "F;
                    break;
                }
                default:
                {
                    return "" + digit;
                    break;
                }
            }
            _MemoryElement.value += "\nReady queue: ";
            var resultQueue = new TSOS.Queue;
            while(_ReadyQueue.getSize() > 0)
            {
                var testProcess = _ReadyQueue.dequeue();
               _MemoryElement.value +=  testProcess.PID + " ";
                resultQueue.enqueue(testProcess);
            }
            _ReadyQueue = resultQueue;
        }
    }
}
