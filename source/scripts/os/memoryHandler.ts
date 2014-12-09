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
        //Read hex from memory
        public read(index)
        {
            return _Memory[index];
        }

        public updateMem()
        {
            _MemoryElement.value = "";
            for(var i = 0; i < _Memory.length; i++)
            {
                _MemoryElement.value = _MemoryElement.value + _Memory[i] + " ";
            }
            _CPU.updateConsole();
        }

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
        }
    }
}
