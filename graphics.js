const CTX_TRANSLATION_STACK = [];
const CTX_ROTATION_STACK = [];
const CTX_SCALE_STACK = [];

const CTX_DEFAULT = {
    ctx: null,
    canvas: null,
    strokeStyle: "black",
    fillStyle: "white",
    lineWidth: 1,
    font: "18px Arial",
};


// use as new Vector2D(0,0)
/**
 * A class to be passed as an argument, or produced as result.
 * @callback Vector2D
 */
class Vector2D {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    };
    toString() {
        return "(" + this.x + ", " + this.y + ")";
    };
    equals(a) {
        return ((this.x == a.x) && (this.y == a.y));
    }
    isInArray(arr) {
        return (arr.filter(obj => { return this.equals(obj); }).length != 0);
    }
    clone() {
        return new Vector2D(this.x, this.y);
    }
    
    /**
     * Modifying operations on this object.
     * @returns {Vector2D} - This modified object.
     */
    add(a) {
        this.x = this.x + a.x;
        this.y = this.y + a.y;
        return this;
    };
    subtract(a) {
        this.x = this.x - a.x;
        this.y = this.y - a.y;
        return this;
    };
    scale(s) {
        this.x = s*this.x;
        this.y = s*this.y;
        return this;
    };
    normalize() {
        const s = this.length();
        this.x = this.x/s;
        this.y = this.y/s;
        return this;
    };
    
    /**
     * Adds this and the parameter a vector.
     * @param {Vector2D} a - The vector to add to this vector.
     * @returns {Vector2D} - Result as a new object.
     */
    plus(a) {
        return new Vector2D(this.x + a.x, this.y + a.y);
    };
    minus(a) {
        return new Vector2D(this.x - a.x, this.y - a.y);
    };
    mult(s) {
        return new Vector2D(s*this.x, s*this.y);
    }
    length() {
        return Math.sqrt(this.x*this.x + this.y*this.y);
    };
    norm() {
        return this.mult(1/this.length());
    };
    dot(a) {
        return this.x*a.x + this.y*a.y;
    };
    /**
     * The cross product of two 2D vectors, the result is in the third dimension (right-handed).
     * @returns {Number} - The scalar in the third dimension.
     */
    crossZ(a) {
        return this.x*a.y - this.y*a.x; // z:
    };
    dotAngle(a) {
        return Math.acos(this.dot(a)/(this.length()*a.length()));
    };
};

function initializeCtxDefault(canvas) {
    const ctx = canvas.getContext("2d");
    CTX_DEFAULT.ctx = ctx;
    CTX_DEFAULT.canvas = canvas;
    CTX_DEFAULT.strokeStyle = ctx.strokeStyle;
    CTX_DEFAULT.fillStyle = ctx.fillStyle;
    CTX_DEFAULT.lineWidth = ctx.lineWidth;
    CTX_DEFAULT.font = ctx.font;
}
function resetStyle(ctx) {
    if (ctx == undefined) {
        ctx = CTX_DEFAULT.ctx;
    }
    ctx.strokeStyle = CTX_DEFAULT.strokeStyle;
    ctx.fillStyle = CTX_DEFAULT.fillStyle;
    ctx.lineWidth = CTX_DEFAULT.lineWidth;
    ctx.font = CTX_DEFAULT.font;

    clearShadow(ctx);
}

/**
 * Origin in middle.
 */
function clearCanvas(canvas) {
    if (canvas == undefined) {
        canvas = CTX_DEFAULT.canvas;
    }
    const ctx = canvas.getContext("2d");
    ctx.clearRect(-canvas.width/2, -canvas.height/2, canvas.width, canvas.height);
}
function fillCanvas(canvas) {
    if (canvas == undefined) {
        canvas = CTX_DEFAULT.canvas;
    }
    const ctx = canvas.getContext("2d");
    resetStyle(ctx);
    ctx.fillRect(-canvas.width/2, -canvas.height/2, canvas.width, canvas.height);
}
function dimCanvas(canvas) {
    if (canvas == undefined) {
        canvas = CTX_DEFAULT.canvas;
    }
    const ctx = canvas.getContext("2d");
    resetStyle(ctx);
    ctx.fillStyle = "rgba(255, 255, 255, 1)"; // 0.45
    ctx.fillRect(-canvas.width/2, -canvas.height/2, canvas.width, canvas.height);
    resetStyle(ctx);
}

function fillRect(x, y, w, h, ctx) {
    if ((typeof x === 'object') && (x !== null)) {
        ctx = h;
        h = w;
        w = y;
        y = x.y;
        x = x.x;
    }
    if (ctx == undefined) {
        ctx = CTX_DEFAULT.ctx;
    }
    ctx.fillRect(x, y, w, h);
}
function setShadow(color, blur, dx, dy, ctx) {
    if (dy == undefined) {
        ctx = dx;
        dy = -blur/2;
        dx = -blur/2;
    }
    if (ctx == undefined) {
        ctx = CTX_DEFAULT.ctx;
    }
    ctx.shadowColor = color;
    
    ctx.shadowOffsetX = dx;
    ctx.shadowOffsetY = dy;
    ctx.shadowBlur = blur;
}
function clearShadow(ctx) {
    if (ctx == undefined) {
        ctx = CTX_DEFAULT.ctx;
    }
    ctx.shadowColor = "rgba(0,0,0,0)";
    ctx.shadowOffsetX = 0;
    ctx.shadowOffsetY = 0;
    ctx.shadowBlur = 0;
}

/**
 * Translate to a in the current coordinates of ctx.
 * @param {Vector2D} a - The vector.
 * @param {Object} [ctx] - The 2D Context.
 */
function translate(x, y, ctx) {
    if ((typeof x === 'object') && (x !== null)) {
        ctx = y;
        y = x.y;
        x = x.x;
    }
    if (ctx == undefined) {
        ctx = CTX_DEFAULT.ctx;
    }
    ctx.translate(x, y);
    CTX_TRANSLATION_STACK.push({x: x, y: y});
}
function translateBack(ctx) {
    if (ctx == undefined) {
        ctx = CTX_DEFAULT.ctx;
    }
    const t = CTX_TRANSLATION_STACK.pop();
    ctx.translate(-t.x, -t.y);
    return t;
}
function getLastTranslation(ctx) {
    if (ctx == undefined) {
        ctx = CTX_DEFAULT.ctx;
    }
    const t = CTX_TRANSLATION_STACK.pop();
    CTX_TRANSLATION_STACK.push(t);
    return t;
}

function rotate(angle, ctx) {
    if (ctx == undefined) {
        ctx = CTX_DEFAULT.ctx;
    }
    ctx.rotate(angle);
    CTX_ROTATION_STACK.push(angle);
}
function rotateBack(ctx) {
    if (ctx == undefined) {
        ctx = CTX_DEFAULT.ctx;
    }
    const a = CTX_ROTATION_STACK.pop();
    ctx.rotate(-a);
    return a;
}

function scale(x, y, ctx) {
    if ((typeof x === 'object') && (x !== null)) {
        ctx = y;
        y = x.y;
        x = x.x;
    }
    if (ctx == undefined) {
        ctx = CTX_DEFAULT.ctx;
    }
    ctx.scale(x, y);
    CTX_SCALE_STACK.push({x: x, y: y});
}
function scaleBack(ctx) {
    if (ctx == undefined) {
        ctx = CTX_DEFAULT.ctx;
    }
    const s = CTX_SCALE_STACK.pop();
    ctx.scale(1/s.x, 1/s.y);
    return s;
}


function moveTo(a, ctx) {
    if (ctx == undefined) {
        ctx = CTX_DEFAULT.ctx;
    }
    ctx.moveTo(a.x, a.y);
}
function lineTo(a, ctx) {
    if (ctx == undefined) {
        ctx = CTX_DEFAULT.ctx;
    }
    ctx.lineTo(a.x, a.y);
}
/**
 * Draw a line in ctx.
 * @param {float | Vector2D} x1 - The first point x-coordinate, or the first vector.
 * @param {float | Vector2D} y1 - The first point y-coordinate, or the second vector.
 * @param {float | Object} [x2] - The second point x-coordinate, or the ctx context.
 * @param {float} [y2]          - The second point y-coordinate.
 * @param {Object} [ctx]        - The 2D Context.
 */
function drawLine(x1, y1, x2, y2, ctx) {
    if (((typeof x1 === 'object') && (x1 !== null)) &&
        ((typeof y1 === 'object') && (y2 !== null))) {
        ctx = x2;
        y2 = y1.y;
        x2 = y1.x;
        y1 = x1.y;
        x1 = x1.x;
    }
    if (ctx == undefined) {
        ctx = CTX_DEFAULT.ctx;
    }
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke();
}
function drawRelativeLine(x, y, dx, dy, ctx) {
    if (((typeof x === 'object') && (x !== null)) &&
        ((typeof y === 'object') && (y !== null))) {
        ctx = dx;
        dy = y.y;
        dx = y.x;
        y = x.y;
        x = x.x;
    }
    drawLine(x, y, x + dx, y + dy, ctx);
}
function drawMark(x, y, ctx) {
    if ((typeof x === 'object') && (x !== null)) {
        ctx = y;
        y = x.y;
        x = x.x;
    }
    if (ctx == undefined) {
        ctx = CTX_DEFAULT.ctx;
    }
    const s = 8;

    ctx.beginPath();
    ctx.moveTo(x - s, y);
    ctx.lineTo(x + s, y);
    ctx.moveTo(x, y - s);
    ctx.lineTo(x, y + s);
    ctx.stroke();
}
function drawCircle(x, y, r, ctx) {
    if ((typeof x === 'object') && (x !== null)) {
        ctx = r;
        r = y;
        y = x.y;
        x = x.x;
    }
    if (ctx == undefined) {
        ctx = CTX_DEFAULT.ctx;
    }
    ctx.beginPath();
    ctx.arc(x, y, r, 0, 2*Math.PI);
    ctx.stroke();
}
function fillCircle(x, y, r, ctx) {
    if ((typeof x === 'object') && (x !== null)) {
        ctx = r;
        r = y;
        y = x.y;
        x = x.x;
    }
    if (ctx == undefined) {
        ctx = CTX_DEFAULT.ctx;
    }
    ctx.beginPath();
    ctx.arc(x, y, r, 0, 2*Math.PI);
    ctx.fill();
}

function drawTextCentered(x, y, txt, color, bgColor, ctx) {
    if ((typeof x === 'object') && (x !== null)) {
        ctx = bgColor;
        bgColor = color;
        color = txt;
        txt = y;
        y = x.y;
        x = x.x;
    }
    if (ctx == undefined) {
        ctx = CTX_DEFAULT.ctx;
    }
    const h = getTextHeight(txt, ctx);
    
    ctx.fillStyle = bgColor;
    const width = getTextWidth(txt, ctx)*3; // allow for wider previous text
    ctx.fillRect(x - width/2, y - h, width, h*1.1);

    ctx.fillStyle = color;
    ctx.textAlign = "center";
    ctx.fillText(txt, x, y);

    resetStyle(ctx);
}
function drawText(x, y, txt, color, ctx) {
    if ((typeof x === 'object') && (x !== null)) {
        ctx = color;
        color = txt;
        txt = y;
        y = x.y;
        x = x.x;
    }
    if (ctx == undefined) {
        ctx = CTX_DEFAULT.ctx;
    }

    ctx.fillStyle = color;
    ctx.textAlign = "center";
    ctx.fillText(txt, x, y + getTextHeight(txt, ctx)/2);

    resetStyle(ctx);
}

function drawAxes(wx, wy) {
    // axis ends
    drawMark(-wx, 0);
    drawMark( wx, 0);
    drawMark(0, -wy);
    drawMark(0,  wy);
    
    // axes
    drawLine(-wx, 0, wx, 0);
    drawLine(0, -wy, 0, wy);            
}


/** SUPPORTING FUNCTIONS */

function getTextWidth(txt, ctx) {
    return ctx.measureText(txt).width;
}
function getTextHeight(txt, ctx) {
    const textMetrics = ctx.measureText(txt);
    //return Math.abs(textMetrics.fontBoundingBoxAscent) + Math.abs(textMetrics.fontBoundingBoxDescent);
    return Math.abs(textMetrics.actualBoundingBoxAscent) + Math.abs(textMetrics.actualBoundingBoxDescent);
}
