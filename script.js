var App = (function() {
    var dragZone = document.getElementById('drag-zone');
    var addTextButton = document.getElementById('add-drag-text');
    var dragElement = {};
    var clickCount = 0;
    var editingElement = null;

    addTextButton.addEventListener('click', function() {
        var dragText = document.createElement('div');
        dragText.className = 'drag-text';
        dragText.innerHTML = 'New block';
        dragZone.appendChild(dragText);
        dragText.style.top = (dragZone.offsetHeight / 2) - (dragText.offsetHeight / 2) + 'px';
        dragText.style.left = (dragZone.offsetWidth / 2) - (dragText.offsetWidth / 2) + 'px';
    });

var singleClickTimer;
    function onMouseDown(e) {
        if (e.which != 1) return;

        var elem = e.target.closest('.drag-text');
        if (!elem) return;

        clickCount++;
        if (clickCount === 1) {
            singleClickTimer = setTimeout(function() {
                clickCount = 0;
                if (editingElement && elem !== editingElement) {
                    editingElement.contentEditable = false;
                    editingElement = null;
                }
            }, 400);
        } else if (clickCount === 2) {
            clearTimeout(singleClickTimer);
            clickCount = 0;
            editingElement = elem;
            editingElement.contentEditable = true;
            return;
        }

        var coords = getCoords(elem);
        var shiftX = e.pageX - coords.left;
        var shiftY = e.pageY - coords.top;

        moveAt(e);

        function moveAt(e) {
            var left = (document.getElementsByTagName('html')[0].offsetWidth - dragZone.offsetWidth) / 2 + 0.9;
            var top = dragZone.offsetTop + 0.6;
            elem.style.left = e.pageX - shiftX - left + 'px';
            elem.style.top = e.pageY - shiftY - top + 'px';
        }

        document.onmousemove = function(e) {
            moveAt(e);
        };

        elem.onmouseup = function() {
            document.onmousemove = null;
            elem.onmouseup = null;
        };

        return false;
    }

    function getCoords(elem) {
        var box = elem.getBoundingClientRect();

        return {
            top: box.top + pageYOffset,
            left: box.left + pageXOffset
        };
    }

    dragZone.ondragstart = function() {
        return false;
    };
    dragZone.onmousedown = onMouseDown;

})();