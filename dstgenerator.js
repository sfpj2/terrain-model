class xdiamondsquare {

    constructor() {
        //constructor
    }

    vpopmap(n) {
        var t = [];
        for (var i = 0; i < n+1; i++) {
            t[i] = 0;
        }
        return t;
    }

    ptwo(size) {
        var pot = 2;
        while (true) {
            if (size <= pot) return pot;
            pot = 2*pot;
        }
    }

    vcomputestep(map, x, y, p, f, mw, mh, r) {
        var c = 0;

        for (var i = 0; i < 4; i++) {
            var cs = p[i][0], ns = p[i][1];
            if (p[i][0] < 0) cs = cs + mw;
            else if (p[i][0] > mw+1) cs = cs - mw;
            else if (p[i][1] < 0) ns = ns + mh;
            else if (p[i][1] > mh+1) ns = ns - mh;
            c += map[cs][ns] / 4;
        }
        c = f(map, x, y, r, c);
        //if (c < 0) c = 0;
        //else if (c > 255) c = 255;
        map[x][y] = c;
        if (x == 0) map[mw][y] = c;
        else if (x == mw) map[0][y] = c;
        else if (y == 0) map[x][mh] = c;
        else if (y == mh) map[x][0] = c;
    }

    vfmap(map, x, y, d, h) {
        return h + (random()-0.5)*d;
    }


    vdiamondsquare(size, f, r, crn, mp) {
        var map = mp ? mp : [];
        var xrange = r;
        var corners = crn;
        for (var c = 0; c < size+1; c++) {
            if (!map[c]) map[c] = this.vpopmap(size);
        }

        var step = size;

        map[0][0] = corners[0];
        map[step][0] = corners[1];
        map[0][step] = corners[2];
        map[step][step] = corners[3];


        while (step > 1) {
            // perform diamond step
            for (var x = 0; x < size; x += step) {
                for (var y = 0; y < size; y += step) {
                    var sx = x + (step >> 1);
                    var sy = y + (step >> 1);

                    var latice = [
                        [x, y],
                        [x+step, y],
                        [x, y+step],
                        [x+step, y+step]
                    ];

                    this.vcomputestep(map, sx, sy, latice, f, size, size, xrange);
                }
            }

            // perform square step
            for (var x = 0; x < size; x += step) {
                for (var y = 0; y < size; y += step) {
                    var hstep = step >> 1;
                    var x1 = x + hstep;
                    var y1 = y;
                    var x2 = x;
                    var y2 = y + hstep;
                    var latice1 = [
                        [x, y],
                        [x + hstep, y - hstep],
                        [x + 2*hstep, y],
                        [x + hstep, y + hstep]
                    ];

                    var latice2 = [
                        [x - hstep, y + hstep],
                        [x, y],
                        [x + hstep, y + hstep],
                        [x, y + 2*hstep]
                    ];

                    this.vcomputestep(map, x1, y1, latice1, f, size, size, xrange);
                    this.vcomputestep(map, x2, y2, latice2, f, size, size, xrange);
                }
            }
            xrange = xrange / 2;
            step = step >> 1;
        }
        return map;
    }

    vcreate(width, height, f, range, corners, mapj) {
        f = f ? f : this.vfmap;
        range = range ? range : 400;
        corners = corners ? corners : [128, 128, 128, 128];
        mapj = Array.isArray(mapj) ? mapj : null;

        var cx = this.ptwo(max(width, height));
        var map = this.vdiamondsquare(cx, f, range, corners, mapj);

        /*
        console.log(map[cx][cx]);
        console.log(map[0][cx]);
        console.log(map[cx][0]);
        console.log(map[0][0]);
        */

        for (var x = 0; x < cx+1; x++) {
            for (var y = height+1; y < cx+1; y++) {
                map[x].splice(y);
            }
        }

        for (var x = width+1; x < cx+1; x++) {
            map.splice(x);
        }

        return map;
    }

    vgetbound(map, width, height) {
        //console.log(width, height);
        var minv = 0, maxv = 0;
        for (var x = 0; x < width; x++) {
            for (var y = 0; y < height; y++) {
                //console.log(x, y);
                if (map[x][y] < minv) minv = map[x][y];
                else if (map[x][y] > maxv) maxv = map[x][y];
            }
        }

        return [minv, maxv];
    }
}