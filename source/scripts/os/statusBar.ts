/*
Status bar control
*/
var onDocumentLoad = function()
{
    _BarCanvas = <HTMLCanvasElement>document.getElementById("statusCanvas");
    _BarContext = _BarCanvas.getContext("2d");
    _BarHandler = new TSOS.barHandler();
 };

module TSOS
{
    //Class for status bar
    export class barHandler {
        public currentDate = new Date();
        public line = "";
        public currentTime = "";
        constructor()
        {
            CanvasTextFunctions.enable(_BarContext);
        }

        //Return date/time as string
        public showDate()
        {
            var day = this.currentDate.getDay();
            var _day = "";
            var month = this.currentDate.getMonth() + 1;
            var numDay = this.currentDate.getDate();
            var year = this.currentDate.getFullYear();
            var hours = this.currentDate.getHours();
            var minutes = this.currentDate.getMinutes().toString();
            var seconds = this.currentDate.getSeconds();
            var amPM = "AM";
            switch (day){
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
                    day = "Not a valid day.";
                    break;
            }
            if(this.currentDate.getMinutes() < 10)
            {
                minutes = "0" + minutes;
            }
            if(hours > 12)
            {
                hours = hours - 12;
                amPM = "PM";

            }
            return "" + _day + " " + month + "/" + numDay + "/" + year + ", " + hours + ":" + minutes + ":" + seconds + " " + amPM;
        }
        //Render date and status
        public renderStatus()
        {
            this.line = this.showDate() + ". Status: " + STATUS;
            _BarContext.drawText( _DefaultFontFamily, _DefaultFontSize, 0, _FontHeightMargin + _DefaultFontSize , this.line);

        }

        //Update date and status
        public updateStatus(newStatus)
        {
            \\Update date/time
            var newDate = new Date();
            var newTime = this.showDate();
            this.currentTime = newTime;
            this.currentDate = newDate;

             //Update status
            if(STATUS != newStatus)
            {
                STATUS = newStatus;

            }

            this.clearStatusBar();
            this.renderStatus();

        }
        public clearStatusBar(){
            _BarContext.clearRect(0,0,1000, 500);
        }
    }
}
