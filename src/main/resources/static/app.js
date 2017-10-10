var app = (function () {

class Point{
constructor(x, y){
this.x = x;
        this.y = y;
        }
}
var stompClient = null, topic;
        var addPointToCanvas = function (point) {
        var canvas = document.getElementById("canvas"), context = canvas.getContext("2d");
                var ctx = canvas.getContext("2d");
                ctx.beginPath();
                ctx.arc(point.x, point.y, 3, 0, 2 * Math.PI);
                ctx.stroke();
        };
        var getMousePosition = function (evt) {
        canvas = document.getElementById("canvas");
                var rect = canvas.getBoundingClientRect();
                return {
                x: evt.clientX - rect.left,
                        y: evt.clientY - rect.top
                };
        };
        var connectAndSubscribe = function () {
        console.info('Connecting to WS...');
                var socket = new SockJS('/stompendpoint');
                stompClient = Stomp.over(socket);
                //subscribe to /topic/TOPICXX when connections succeed
                stompClient.connect({}, function (frame) {
                console.log('Connected: ' + frame);
                        stompClient.subscribe('/topic/newpolygon.' + topic, function (eventbody) {
                        var coord = JSON.parse(eventbody.body);
                                alert("x: " + coord.x + " y: " + coord.y);
//                                addPointToCanvas(new Point(coord.x,coord.y));
                                var c = document.getElementById("canvas");
                                var ct = c.getContext("2d");
                                ct.clearRect(0, 0, c.width, c.height);
                                ct.beginPath();
                                ct.moveTo(0, 0);
                                for (let i = 0; i < coord.length - 1; i++){
                        ct.moveTo(coord[i].x, coord[i].y);
                                ct.lineTo(coord[i + 1].x, coord[i + 1].y);
                        }
                        ct.moveTo(coord[coord.length - 1].x, coord[coord.length - 1].y);
                                ct.lineTo(coord[0].x, coord[0].y)
                                ct.stroke();
                        });
                });
        };
        var eventHandler = function (evento){
        var coordinates = getMousePosition(evento);
                app.publishPoint(coordinates.x, coordinates.y);
        }
return {

init: function () {
var can = document.getElementById("canvas");
        ctx = can.getContext("2d");
        //websocket connection
//        connectAndSubscribe();
        if (window.PointEvent){
canvas.addEventListener("pointerdown", eventHandler);
//        alert('pointerdown at ' + event.pageX + ',' + event.pageY);
} else{
canvas.addEventListener("mousedown", eventHandler);
//        alert('mousedown at ' + event.clientX + ',' + event.clientY);
//                publishPoint(px, py);
}
},
        publishPoint: function(px, py){
        var pt = new Point(px, py);
                console.info("publishing point at " + pt);
//                addPointToCanvas(pt);
                //publicar el evento
                stompClient.send("/app/newpoint." + topic, {}, JSON.stringify(pt));
        },
        disconnect: function () {
        if (stompClient !== null) {
        stompClient.disconnect();
        }
        setConnected(false);
                console.log("Disconnected");
        },
        suscribirTopic:function (newTopic){
        topic = newTopic;
                var canvas = document.getElementById("canvas");
                var ctx = canvas.getContext("2d");
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                connectAndSubscribe();
        }
};
})();