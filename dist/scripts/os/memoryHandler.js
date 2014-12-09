var TSOS;
(function (TSOS) {
    var memory = (function () {
        function memory() {
        }
        memory.prototype.memory = function () {
            var accumulator = 0;
        };

        memory.prototype.load = function (m, index) {
            if (typeof (m) == typeof (123)) {
                var first = 0;
                if (m > 16) {
                    first = Math.floor(m / 16);
                } else {
                    first = 0;
                }
                var second = m % 16;
                var firstChar = this.ConvertToString(first);
                var secondChar = this.ConvertToString(second);

                _Memory[index] = firstChar + secondChar;
                this.updateMem();
            } else {
                _Memory[index] = mem;
                this.updateMem();
            }
        };

        memory.prototype.read = function (index) {
            return _Memory[index];
        };

        memory.prototype.updateMem = function () {
            _MemoryElement.value = "";
            for (var i = 0; i < _Memory.length; i++) {
                _MemoryElement.value = _MemoryElement.value + _Memory[i] + " ";
            }
            _CPU.updateConsole();
        };
        
        memory.prototype.ConvertToString = function (digit) {
            switch (digit) {
                case 10: {
                    return "A";
                    break;
                }
                case 11: {
                    return "B";
                    break;
                }
                case 12: {
                    return "C";
                    break;
                }
                case 13: {
                    return "D";
                    break;
                }
                case 14: {
                    return "E";
                    break;
                }
                case 15: {
                    return "F";
                    break;
                }
                default: {
                    return "" + digit;
                    break;
                }
            }
        };
        return memory;
    })();
    TSOS.memory = memory;
})(TSOS || (TSOS = {}));
